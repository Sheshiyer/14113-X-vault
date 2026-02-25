import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { chapters, getChapterById, ChapterData } from "@/lib/data/chapters";
import { updateChapterProgressSchema } from "@/lib/validations";
import { calculateBiorhythmCycles } from "@/lib/biorhythm/calculator";

/**
 * GET /api/chapters/[id]
 * 
 * Get detailed information about a specific chapter.
 * Returns chapter details with unlock status and biorhythm-based recommendations.
 * 
 * @param id - Chapter ID (e.g., "chapter-1")
 * @queryParams { birthDate?: string } - Optional birth date for biorhythm context
 * @response { chapter: ChapterWithDetails }
 * 
 * @example
 * Request: GET /api/chapters/chapter-1?birthDate=1990-05-15
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "chapter": { ... },
 *     "unlockStatus": {
 *       "isUnlocked": true,
 *       "requiredCycle": "physical",
 *       "currentCycleValue": 0.82,
 *       "recommendation": "optimal"
 *     },
 *     "nextChapter": { id: "chapter-2", title: "..." }
 *   }
 * }
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // Find chapter
    const chapter = getChapterById(id);

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RES_NOT_FOUND",
            message: `Chapter with ID "${id}" not found`,
          },
        },
        { status: 404 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);

    // Parse query params for biorhythm context
    const { searchParams } = new URL(request.url);
    const birthDateStr = searchParams.get("birthDate");

    let unlockStatus = null;

    // Calculate unlock status with biorhythm context if birth date provided
    if (birthDateStr) {
      const birthDate = new Date(birthDateStr);
      const today = new Date();

      if (!isNaN(birthDate.getTime())) {
        const cycles = calculateBiorhythmCycles(birthDate, today);

        // Determine which cycle is dominant for this chapter
        const chapterCycle = chapter.cycle;
        const cycleValue = cycles[chapterCycle as keyof typeof cycles];

        unlockStatus = {
          isUnlocked: chapter.status !== "locked",
          requiredCycle: chapterCycle,
          currentCycleValue: cycleValue,
          cycleStatus:
            cycleValue > 0.5 ? "high" : cycleValue < -0.5 ? "low" : "neutral",
          recommendation:
            cycleValue > 0.5
              ? "optimal"
              : cycleValue > 0
              ? "favorable"
              : cycleValue > -0.5
              ? "challenging"
              : "growth_opportunity",
        };
      }
    }

    // Get next and previous chapters
    const prevChapter =
      chapter.number > 1
        ? chapters.find((ch) => ch.number === chapter.number - 1)
        : null;
    const nextChapter =
      chapter.number < chapters.length
        ? chapters.find((ch) => ch.number === chapter.number + 1)
        : null;

    // Serialize chapter for response
    const serializedChapter = {
      ...chapter,
      unlockDate: chapter.unlockDate?.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          chapter: serializedChapter,
          unlockStatus,
          navigation: {
            previous: prevChapter
              ? {
                  id: prevChapter.id,
                  number: prevChapter.number,
                  title: prevChapter.title,
                  status: prevChapter.status,
                }
              : null,
            next: nextChapter
              ? {
                  id: nextChapter.id,
                  number: nextChapter.number,
                  title: nextChapter.title,
                  status: nextChapter.status,
                }
              : null,
          },
          user: session?.user
            ? {
                id: session.user.id,
                name: session.user.name,
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chapter get error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while fetching chapter",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chapters/[id]
 * 
 * Update chapter progress (authenticated users only).
 * 
 * @requestBody { progress: number, checkpointId?: string, isCompleted?: boolean }
 * @response { chapter: UpdatedChapter }
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTH_REQUIRED",
            message: "Authentication required to update progress",
          },
        },
        { status: 401 }
      );
    }

    // Find chapter
    const chapter = getChapterById(id);

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RES_NOT_FOUND",
            message: `Chapter with ID "${id}" not found`,
          },
        },
        { status: 404 }
      );
    }

    // Check if chapter is locked
    if (chapter.status === "locked") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CHAPTER_LOCKED",
            message: "Cannot update progress for a locked chapter",
          },
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateChapterProgressSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VAL_INVALID_INPUT",
            message: "Validation failed",
            details: validationResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { progress, checkpointId, isCompleted } = validationResult.data;

    // In a real implementation, this would update the database
    // For now, we'll return the updated chapter structure

    // Update checkpoint if provided
    let updatedCheckpoints = [...chapter.checkpoints];
    if (checkpointId) {
      updatedCheckpoints = updatedCheckpoints.map((cp) =>
        cp.id === checkpointId ? { ...cp, isCompleted: true } : cp
      );
    }

    // Calculate derived status
    let newStatus = chapter.status;
    if (isCompleted || progress === 100) {
      newStatus = "completed";
    } else if (progress > 0) {
      newStatus = "inProgress";
    }

    const updatedChapter: ChapterData = {
      ...chapter,
      progress,
      status: newStatus as ChapterData["status"],
      checkpoints: updatedCheckpoints,
    };

    // Serialize chapter for response
    const serializedChapter = {
      ...updatedChapter,
      unlockDate: updatedChapter.unlockDate?.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          chapter: serializedChapter,
          message: "Progress updated successfully",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chapter update error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while updating chapter",
        },
      },
      { status: 500 }
    );
  }
}

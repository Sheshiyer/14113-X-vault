import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { chapters, ChapterData } from "@/lib/data/chapters";
import { updateProgressSchema } from "@/lib/validations";

/**
 * GET /api/progress
 * 
 * Get all progress for the authenticated user.
 * Returns comprehensive progress data including chapter completion stats.
 * 
 * @response { progress: UserProgress[], stats: ProgressStats }
 * 
 * @example
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "progress": [
 *       {
 *         "chapterId": "chapter-1",
 *         "progress": 100,
 *         "status": "completed",
 *         "completedAt": "2024-01-15T10:30:00Z",
 *         "checkpointsCompleted": 3
 *       }
 *     ],
 *     "stats": {
 *       "totalChapters": 12,
 *       "completed": 2,
 *       "inProgress": 1,
 *       "unlocked": 1,
 *       "locked": 8,
 *       "overallProgress": 25
 *     },
 *     "currentStreak": 5,
 *     "lastActivity": "2024-01-20T08:15:00Z"
 *   }
 * }
 */

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTH_REQUIRED",
            message: "Authentication required to access progress",
          },
        },
        { status: 401 }
      );
    }

    // Build progress data from chapters
    // Calculate checkpoints completed based on progress percentage
    const progress = chapters.map((chapter) => {
      const totalCheckpoints = chapter.checkpoints.length;
      // Estimate checkpoints completed based on progress percentage
      const checkpointsCompleted = Math.round((chapter.progress / 100) * totalCheckpoints);
      
      return {
        chapterId: chapter.id,
        number: chapter.number,
        title: chapter.title,
        progress: chapter.progress,
        status: chapter.status,
        cycle: chapter.cycle,
        checkpointsCompleted,
        totalCheckpoints,
        completedAt: chapter.completedAt?.toISOString() || null,
      };
    });

    // Calculate stats
    const completed = chapters.filter((ch) => ch.status === "completed").length;
    const inProgress = chapters.filter((ch) => ch.status === "inProgress").length;
    const unlocked = chapters.filter((ch) => ch.status === "unlocked").length;
    const locked = chapters.filter((ch) => ch.status === "locked").length;

    // Calculate overall progress (weighted average)
    const totalProgress = chapters.reduce((sum, ch) => sum + ch.progress, 0);
    const overallProgress = Math.round(totalProgress / chapters.length);

    // Get recently active chapters (in-progress or recently completed)
    const recentlyActive = progress
      .filter((p) => p.status === "inProgress" || p.status === "completed")
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, 5);

    // Get next recommended chapter
    const nextChapter = chapters.find(
      (ch) => ch.status === "unlocked" || (ch.status === "locked" && ch.number === 4)
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          progress,
          stats: {
            totalChapters: chapters.length,
            completed,
            inProgress,
            unlocked,
            locked,
            overallProgress,
          },
          recentlyActive,
          nextRecommended: nextChapter
            ? {
                id: nextChapter.id,
                number: nextChapter.number,
                title: nextChapter.title,
                status: nextChapter.status,
                cycle: nextChapter.cycle,
              }
            : null,
          user: {
            id: session.user.id,
            name: session.user.name,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Progress get error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while fetching progress",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress
 * 
 * Update progress for a specific chapter (authenticated users only).
 * 
 * @requestBody { chapterId: string, progress: number, isCompleted?: boolean, checkpointId?: string }
 * @response { updated: boolean, chapter: ChapterProgress }
 * 
 * @example
 * Request:
 * {
 *   "chapterId": "chapter-3",
 *   "progress": 75,
 *   "checkpointId": "c3-3",
 *   "checkpointCompleted": true
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "updated": true,
 *     "chapter": {
 *       "chapterId": "chapter-3",
 *       "progress": 75,
 *       "status": "inProgress",
 *       "checkpointsCompleted": 3,
 *       "totalCheckpoints": 3
 *     },
 *     "milestones": ["checkpoint_completed"],
 *     "nextActions": ["complete_chapter"]
 *   }
 * }
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateProgressSchema.safeParse(body);

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

    const {
      chapterId,
      progress: newProgress,
      isCompleted,
      checkpointId,
      checkpointCompleted,
    } = validationResult.data;

    // Find chapter
    const chapter = chapters.find((ch) => ch.id === chapterId);

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RES_NOT_FOUND",
            message: `Chapter with ID "${chapterId}" not found`,
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

    // In a real implementation, this would update the database
    // For now, we'll calculate the updated state

    const totalCheckpoints = chapter.checkpoints.length;
    
    // Calculate checkpoints completed based on progress percentage
    // In production, this would be tracked in user progress table
    let checkpointsCompleted = Math.round((newProgress / 100) * totalCheckpoints);

    // Adjust checkpoint count if a specific checkpoint is being marked
    if (checkpointId && checkpointCompleted !== undefined) {
      const checkpointIndex = chapter.checkpoints.findIndex((cp) => cp.id === checkpointId);
      if (checkpointIndex !== -1) {
        // If completing a specific checkpoint, ensure count reflects that
        if (checkpointCompleted) {
          checkpointsCompleted = Math.max(checkpointsCompleted, checkpointIndex + 1);
        }
      }
    }

    // Calculate derived status and progress
    let finalProgress = newProgress;
    let finalStatus: ChapterData["status"] = chapter.status;
    const milestones: string[] = [];
    const nextActions: string[] = [];

    // Auto-complete if all checkpoints done
    if (checkpointsCompleted >= totalCheckpoints && finalProgress < 100) {
      finalProgress = 100;
    }

    // Determine status based on progress
    if (isCompleted || finalProgress === 100) {
      finalStatus = "completed";
      milestones.push("chapter_completed");

      // Check if next chapter should be unlocked
      const nextChapter = chapters.find((ch) => ch.number === chapter.number + 1);
      if (nextChapter && nextChapter.status === "locked") {
        nextActions.push("unlock_next_chapter");
      }
    } else if (finalProgress > 0) {
      finalStatus = "inProgress";
      if (finalProgress >= 50 && chapter.progress < 50) {
        milestones.push("halfway_point");
      }
    }

    // Checkpoint milestone
    if (checkpointId && checkpointCompleted) {
      milestones.push("checkpoint_completed");
      if (checkpointsCompleted >= totalCheckpoints) {
        milestones.push("all_checkpoints_completed");
        nextActions.push("complete_chapter");
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          updated: true,
          chapter: {
            chapterId: chapter.id,
            number: chapter.number,
            title: chapter.title,
            progress: finalProgress,
            status: finalStatus,
            cycle: chapter.cycle,
            checkpointsCompleted,
            totalCheckpoints,
          },
          milestones,
          nextActions,
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Progress update error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while updating progress",
        },
      },
      { status: 500 }
    );
  }
}

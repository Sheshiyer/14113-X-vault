import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { chapters, ChapterData } from "@/lib/data/chapters";
import { listChaptersQuerySchema } from "@/lib/validations";

/**
 * GET /api/chapters
 * 
 * List all chapters with optional filtering and sorting.
 * If authenticated, includes user progress for each chapter.
 * 
 * @queryParams { filter?: "all" | "unlocked" | "locked" | "completed" | "inProgress", sort?: "number" | "title" | "cycle", order?: "asc" | "desc" }
 * @response { chapters: ChapterWithProgress[] }
 * 
 * @example
 * Request: GET /api/chapters?filter=unlocked&sort=order&order=asc
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "chapters": [
 *       {
 *         "id": "chapter-1",
 *         "number": 1,
 *         "title": "The Breath of Awakening",
 *         "status": "completed",
 *         "progress": 100,
 *         "cycle": "physical",
 *         ...
 *       }
 *     ],
 *     "total": 12,
 *     "stats": {
 *       "completed": 2,
 *       "inProgress": 1,
 *       "unlocked": 1,
 *       "locked": 8
 *     }
 *   }
 * }
 */

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      filter: searchParams.get("filter") || "all",
      sort: searchParams.get("sort") || "order",
      order: searchParams.get("order") || "asc",
    };

    // Validate query parameters
    const validationResult = listChaptersQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VAL_INVALID_INPUT",
            message: "Invalid query parameters",
            details: validationResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { filter, sort, order } = validationResult.data;

    // Get user session (optional - public endpoint)
    const session = await getServerSession(authOptions);

    // Start with all chapters
    let filteredChapters: ChapterData[] = [...chapters];

    // Apply filter
    switch (filter) {
      case "completed":
        filteredChapters = filteredChapters.filter(
          (ch) => ch.status === "completed"
        );
        break;
      case "inProgress":
        filteredChapters = filteredChapters.filter(
          (ch) => ch.status === "inProgress"
        );
        break;
      case "unlocked":
        filteredChapters = filteredChapters.filter(
          (ch) => ch.status === "unlocked" || ch.status === "completed" || ch.status === "inProgress"
        );
        break;
      case "locked":
        filteredChapters = filteredChapters.filter(
          (ch) => ch.status === "locked"
        );
        break;
      default:
        // "all" - no filter
        break;
    }

    // Apply sorting
    filteredChapters.sort((a, b) => {
      let comparison = 0;

      switch (sort) {
        case "number":
          comparison = a.number - b.number;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "cycle":
          comparison = a.cycle.localeCompare(b.cycle);
          if (comparison === 0) {
            comparison = a.number - b.number;
          }
          break;
        default:
          comparison = a.number - b.number;
          break;
      }

      return order === "desc" ? -comparison : comparison;
    });

    // Calculate stats
    const stats = {
      completed: chapters.filter((ch) => ch.status === "completed").length,
      inProgress: chapters.filter((ch) => ch.status === "inProgress").length,
      unlocked: chapters.filter(
        (ch) => ch.status === "unlocked"
      ).length,
      locked: chapters.filter((ch) => ch.status === "locked").length,
    };

    // Serialize chapters for response (convert Dates to ISO strings)
    const serializedChapters = filteredChapters.map((chapter) => ({
      ...chapter,
      unlockDate: chapter.unlockDate?.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          chapters: serializedChapters,
          total: filteredChapters.length,
          stats,
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
    console.error("Chapters list error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while fetching chapters",
        },
      },
      { status: 500 }
    );
  }
}

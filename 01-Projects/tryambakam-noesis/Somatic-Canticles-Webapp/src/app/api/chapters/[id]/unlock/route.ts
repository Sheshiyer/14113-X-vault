import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getChapterById, chapters, ChapterData } from "@/lib/data/chapters";
import { unlockChapterSchema } from "@/lib/validations";
import { calculateBiorhythmCycles } from "@/lib/biorhythm/calculator";

/**
 * POST /api/chapters/[id]/unlock
 * 
 * Attempt to unlock a chapter based on biorhythm conditions.
 * Checks if the user's biorhythm state meets the unlock requirements.
 * 
 * @requestBody { birthDate: string, currentDate?: string }
 * @response { unlocked: boolean, chapter: Chapter, conditions: UnlockConditions }
 * 
 * @example
 * Request:
 * {
 *   "birthDate": "1990-05-15",
 *   "currentDate": "2024-01-20"
 * }
 * 
 * Response (successful unlock):
 * {
 *   "success": true,
 *   "data": {
 *     "unlocked": true,
 *     "chapter": { ... },
 *     "unlockConditions": {
 *       "requiredCycle": "physical",
 *       "requiredValue": 0.5,
 *       "currentValue": 0.82,
 *       "met": true
 *     },
 *     "message": "Chapter unlocked successfully"
 *   }
 * }
 * 
 * Response (unlock conditions not met):
 * {
 *   "success": true,
 *   "data": {
 *     "unlocked": false,
 *     "chapter": { ... },
 *     "unlockConditions": {
 *       "requiredCycle": "physical",
 *       "requiredValue": 0.5,
 *       "currentValue": -0.23,
 *       "met": false
 *     },
 *     "message": "Unlock conditions not met. Your physical cycle is at -0.23. Required: > 0.5",
 *     "nextOptimalWindow": "2024-01-25"
 *   }
 * }
 */

// Threshold values for unlocking chapters in each cycle
const UNLOCK_THRESHOLDS: Record<string, number> = {
  physical: 0.3,
  emotional: 0.3,
  intellectual: 0.3,
  spiritual: 0.3,
};

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
            message: "Authentication required to unlock chapters",
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

    // Check if chapter is already unlocked
    if (chapter.status !== "locked") {
      return NextResponse.json(
        {
          success: true,
          data: {
            unlocked: true,
            alreadyUnlocked: true,
            chapter: {
              ...chapter,
              unlockDate: chapter.unlockDate?.toISOString(),
            },
            message: "Chapter is already unlocked",
          },
        },
        { status: 200 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = unlockChapterSchema.safeParse(body);

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

    const { birthDate: birthDateStr, currentDate: currentDateStr } =
      validationResult.data;

    // Parse dates
    const birthDate = new Date(birthDateStr);
    const currentDate = currentDateStr ? new Date(currentDateStr) : new Date();

    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VAL_INVALID_DATE",
            message: "Invalid birth date format",
          },
        },
        { status: 400 }
      );
    }

    // Calculate biorhythm for the chapter's cycle
    const cycles = calculateBiorhythmCycles(birthDate, currentDate);
    const chapterCycle = chapter.cycle;
    const cycleValue = cycles[chapterCycle as keyof typeof cycles];
    const threshold = UNLOCK_THRESHOLDS[chapterCycle] || 0.3;

    // Check unlock conditions
    const isUnlocked = cycleValue >= threshold;

    const unlockConditions = {
      requiredCycle: chapterCycle,
      requiredValue: threshold,
      currentValue: cycleValue,
      met: isUnlocked,
    };

    if (!isUnlocked) {
      // Calculate next optimal window (when cycle will be >= threshold)
      const nextOptimalWindow = findNextOptimalWindow(
        birthDate,
        currentDate,
        chapterCycle,
        threshold
      );

      return NextResponse.json(
        {
          success: true,
          data: {
            unlocked: false,
            chapter: {
              id: chapter.id,
              number: chapter.number,
              title: chapter.title,
              cycle: chapter.cycle,
              status: chapter.status,
            },
            unlockConditions,
            message: `Unlock conditions not met. Your ${chapterCycle} cycle is at ${cycleValue.toFixed(
              2
            )}. Required: >= ${threshold}`,
            nextOptimalWindow: nextOptimalWindow.toISOString().split("T")[0],
            recommendation: getRecommendation(chapterCycle, cycleValue),
          },
        },
        { status: 200 }
      );
    }

    // Chapter is unlocked - create unlock record
    // In a real implementation, this would update the database
    const unlockedChapter: ChapterData = {
      ...chapter,
      status: "unlocked",
      unlockDate: currentDate,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          unlocked: true,
          chapter: {
            ...unlockedChapter,
            unlockDate: unlockedChapter.unlockDate?.toISOString(),
          },
          unlockConditions,
          message: `Chapter unlocked successfully! Your ${chapterCycle} cycle is at ${cycleValue.toFixed(
            2
          )}`,
          unlockedAt: currentDate.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chapter unlock error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while attempting to unlock chapter",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Find the next date when the cycle value will meet the threshold
 */
function findNextOptimalWindow(
  birthDate: Date,
  fromDate: Date,
  cycle: string,
  threshold: number
): Date {
  const cyclePeriods: Record<string, number> = {
    physical: 23,
    emotional: 28,
    intellectual: 33,
    spiritual: 21,
  };

  const period = cyclePeriods[cycle] || 23;
  const testDate = new Date(fromDate);

  // Search up to 2 periods ahead
  const maxDays = period * 2;

  for (let i = 1; i <= maxDays; i++) {
    testDate.setDate(fromDate.getDate() + i);
    const cycles = calculateBiorhythmCycles(birthDate, testDate);
    const value = cycles[cycle as keyof typeof cycles];

    if (value >= threshold) {
      return new Date(testDate);
    }
  }

  // Fallback: return halfway through the period
  testDate.setDate(fromDate.getDate() + Math.floor(period / 2));
  return testDate;
}

/**
 * Get a personalized recommendation based on cycle state
 */
function getRecommendation(cycle: string, value: number): string {
  if (value < -0.5) {
    const recommendations: Record<string, string> = {
      physical:
        "Your physical energy is low. This is a good time for rest and recovery. Try again in a few days.",
      emotional:
        "Your emotional cycle is in a valley. Practice self-compassion and allow yourself to feel. Better days ahead.",
      intellectual:
        "Your mental clarity may be lower now. Avoid complex decisions and trust your intuition.",
      spiritual:
        "Your spiritual cycle suggests introspection. This is a time for inner work rather than expansion.",
    };
    return recommendations[cycle] || "Your cycle suggests patience. Try again soon.";
  } else if (value < 0) {
    return `Your ${cycle} cycle is below neutral but rising. Consider trying again tomorrow.`;
  } else {
    return `Your ${cycle} cycle is positive but below the unlock threshold. You're close - check back in a day or two.`;
  }
}

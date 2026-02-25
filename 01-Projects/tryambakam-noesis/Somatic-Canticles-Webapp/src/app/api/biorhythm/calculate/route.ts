import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateBiorhythmCycles,
  isCriticalDay,
  getBiorhythmStatus,
  getDominantCycle,
  checkPeaks,
} from "@/lib/biorhythm/calculator";
import { calculateBiorhythmSchema } from "@/lib/validations";

/**
 * POST /api/biorhythm/calculate
 * 
 * Calculate biorhythm cycles for a given birth date and target date.
 * 
 * @requestBody { birthDate: string, targetDate?: string }
 * @response { cycles: BiorhythmCycles, dominant: string, peaks: BiorhythmPeaks, status: object }
 * 
 * @example
 * Request:
 * {
 *   "birthDate": "1990-05-15",
 *   "targetDate": "2024-01-20"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "cycles": {
 *       "physical": 0.82,
 *       "emotional": -0.43,
 *       "intellectual": 0.15,
 *       "spiritual": 0.67
 *     },
 *     "dominant": "physical",
 *     "peaks": {
 *       "physical": true,
 *       "emotional": false,
 *       "intellectual": false,
 *       "spiritual": false
 *     },
 *     "status": {
 *       "physical": "high",
 *       "emotional": "low",
 *       "intellectual": "critical",
 *       "spiritual": "high"
 *     },
 *     "isCriticalDay": false,
 *     "daysSinceBirth": 12315
 *   }
 * }
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = calculateBiorhythmSchema.safeParse(body);

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

    const { birthDate: birthDateStr, targetDate: targetDateStr } = validationResult.data;

    // Parse dates
    const birthDate = new Date(birthDateStr);
    const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();

    // Validate dates are valid
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

    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VAL_INVALID_DATE",
            message: "Invalid target date format",
          },
        },
        { status: 400 }
      );
    }

    // Calculate biorhythm cycles
    const cycles = calculateBiorhythmCycles(birthDate, targetDate);

    // Determine dominant cycle
    const dominant = getDominantCycle(cycles);

    // Check for peaks
    const peaks = checkPeaks(cycles);

    // Get status for each cycle
    const status = {
      physical: getBiorhythmStatus(cycles.physical),
      emotional: getBiorhythmStatus(cycles.emotional),
      intellectual: getBiorhythmStatus(cycles.intellectual),
      spiritual: getBiorhythmStatus(cycles.spiritual),
    };

    // Check if critical day (any cycle near zero)
    const critical = isCriticalDay(cycles);

    // Calculate days since birth
    const diffTime = targetDate.getTime() - birthDate.getTime();
    const daysSinceBirth = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return NextResponse.json(
      {
        success: true,
        data: {
          cycles,
          dominant,
          peaks,
          status,
          isCriticalDay: critical,
          daysSinceBirth,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Biorhythm calculation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while calculating biorhythm",
        },
      },
      { status: 500 }
    );
  }
}

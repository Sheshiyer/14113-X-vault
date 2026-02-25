import { NextRequest, NextResponse } from "next/server";
import {
  calculateBiorhythmCycles,
  getBiorhythmStatus,
  checkPeaks,
} from "@/lib/biorhythm/calculator";
import { forecastBiorhythmSchema } from "@/lib/validations";

/**
 * POST /api/biorhythm/forecast
 * 
 * Generate a multi-day biorhythm forecast starting from today or a specified date.
 * 
 * @requestBody { birthDate: string, days?: number (default: 30) }
 * @response { forecast: Array<DailyReading> }
 * 
 * @example
 * Request:
 * {
 *   "birthDate": "1990-05-15",
 *   "days": 30
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "forecast": [
 *       {
 *         "date": "2024-01-20",
 *         "cycles": { "physical": 0.82, "emotional": -0.43, "intellectual": 0.15, "spiritual": 0.67 },
 *         "peaks": { "physical": true, "emotional": false, "intellectual": false, "spiritual": false },
 *         "status": { "physical": "high", "emotional": "low", "intellectual": "critical", "spiritual": "high" }
 *       },
 *       ...
 *     ],
 *     "summary": {
 *       "totalDays": 30,
 *       "peakDays": 5,
 *       "lowDays": 8,
 *       "criticalDays": 3
 *     }
 *   }
 * }
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = forecastBiorhythmSchema.safeParse(body);

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

    const { birthDate: birthDateStr, days } = validationResult.data;

    // Parse birth date
    const birthDate = new Date(birthDateStr);

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

    // Generate forecast
    const forecast = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let peakDays = 0;
    let lowDays = 0;
    let criticalDays = 0;

    for (let i = 0; i < days; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      const cycles = calculateBiorhythmCycles(birthDate, targetDate);
      const peaks = checkPeaks(cycles);
      const status = {
        physical: getBiorhythmStatus(cycles.physical),
        emotional: getBiorhythmStatus(cycles.emotional),
        intellectual: getBiorhythmStatus(cycles.intellectual),
        spiritual: getBiorhythmStatus(cycles.spiritual),
      };

      // Count summary stats
      const hasPeak = Object.values(peaks).some((p) => p);
      const hasLow = Object.values(status).some((s) => s === "low");
      const hasCritical = Object.values(status).some((s) => s === "critical");

      if (hasPeak) peakDays++;
      if (hasLow) lowDays++;
      if (hasCritical) criticalDays++;

      forecast.push({
        date: targetDate.toISOString().split("T")[0],
        cycles,
        peaks,
        status,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          forecast,
          summary: {
            totalDays: days,
            peakDays,
            lowDays,
            criticalDays,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Biorhythm forecast error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while generating forecast",
        },
      },
      { status: 500 }
    );
  }
}

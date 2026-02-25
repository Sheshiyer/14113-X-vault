"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { BiorhythmPrediction, BiorhythmState } from "@/lib/biorhythm/types";
import { generatePrediction } from "@/lib/biorhythm/prediction";
import { isHighEnergyDay, countPeakCycles } from "@/lib/biorhythm/peaks";

export interface BiorhythmForecastCardProps {
  /** Birth date for calculation */
  birthDate: Date;
  /** Start date for forecast (defaults to today) */
  startDate?: Date;
  /** Number of days to forecast (default: 30) */
  days?: number;
  /** Custom className */
  className?: string;
  /** Pre-calculated prediction data (optional) */
  prediction?: BiorhythmPrediction;
  /** Callback when a day is selected */
  onDaySelect?: (state: BiorhythmState) => void;
  /** Chapter unlock dates for highlighting opportunities */
  chapterUnlockDates?: Date[];
}

type DayType = "peak" | "high" | "low" | "normal" | "critical" | "unlock";

interface DayData {
  state: BiorhythmState;
  type: DayType;
  peakCount: number;
  isUnlockDay: boolean;
}

const PEAK_THRESHOLD = 0.8;
const LOW_THRESHOLD = -0.8;

/** Check if date is the same day */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/** Get day type based on cycle values */
function getDayType(state: BiorhythmState, isUnlockDay: boolean): DayType {
  if (isUnlockDay) return "unlock";
  
  const { cycles, peaks } = state;
  const peakCount = countPeakCycles(cycles, PEAK_THRESHOLD);
  
  // Check for critical day (all cycles near zero)
  const allNearZero = Object.values(cycles).every(
    (v) => Math.abs(v) < 0.1
  );
  if (allNearZero) return "critical";
  
  // Check for high energy day (3+ peaks or isHighEnergyDay)
  if (peakCount >= 3 || isHighEnergyDay(cycles, PEAK_THRESHOLD)) return "high";
  
  // Check for peak day (at least one peak)
  if (peakCount >= 1) return "peak";
  
  // Check for low day (all cycles below -0.5)
  const allLow = Object.values(cycles).every((v) => v < LOW_THRESHOLD);
  if (allLow) return "low";
  
  return "normal";
}

/** Get day color based on type */
function getDayColor(type: DayType): string {
  switch (type) {
    case "peak":
      return "bg-solar border-solar text-solar-dark";
    case "high":
      return "bg-build border-build text-white";
    case "low":
      return "bg-life/20 border-life text-life";
    case "critical":
      return "bg-void-700 border-void-500 text-text-muted";
    case "unlock":
      return "bg-transform border-transform text-white animate-pulse-8";
    default:
      return "bg-void-800 border-void-700 text-text-muted";
  }
}

/** Format day of week */
function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "narrow" });
}

/** Format day number */
function getDayNumber(date: Date): number {
  return date.getDate();
}

export const BiorhythmForecastCard: React.FC<BiorhythmForecastCardProps> = ({
  birthDate,
  startDate: propStartDate,
  days = 30,
  className,
  prediction: propPrediction,
  onDaySelect,
  chapterUnlockDates = [],
}) => {
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const [expandedDay, setExpandedDay] = React.useState<number | null>(null);

  const startDate = propStartDate || new Date();

  // Generate or use provided prediction
  const prediction = React.useMemo(() => {
    if (propPrediction) return propPrediction;
    return generatePrediction(birthDate, startDate, days);
  }, [propPrediction, birthDate, startDate, days]);

  // Process day data
  const dayData: DayData[] = React.useMemo(() => {
    return prediction.predictions.map((state) => {
      const isUnlockDay = chapterUnlockDates.some((d) => isSameDay(d, state.date));
      const type = getDayType(state, isUnlockDay);
      const peakCount = countPeakCycles(state.cycles, PEAK_THRESHOLD);
      return { state, type, peakCount, isUnlockDay };
    });
  }, [prediction, chapterUnlockDates]);

  // Group days into weeks for calendar-style display
  const weeks = React.useMemo(() => {
    const result: DayData[][] = [];
    for (let i = 0; i < dayData.length; i += 7) {
      result.push(dayData.slice(i, i + 7));
    }
    return result;
  }, [dayData]);

  const handleDayClick = (index: number) => {
    setSelectedDay(index);
    setExpandedDay(expandedDay === index ? null : index);
    if (onDaySelect) {
      onDaySelect(dayData[index].state);
    }
  };

  // Calculate summary stats
  const stats = React.useMemo(() => {
    const peakDays = dayData.filter((d) => d.type === "peak").length;
    const highDays = dayData.filter((d) => d.type === "high").length;
    const lowDays = dayData.filter((d) => d.type === "low").length;
    const unlockDays = dayData.filter((d) => d.isUnlockDay).length;
    return { peakDays, highDays, lowDays, unlockDays };
  }, [dayData]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>30-Day Forecast</span>
          <span className="text-[13px] font-normal text-text-muted">
            {startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-[13px] mb-[21px] text-[13px]">
          <div className="flex items-center gap-[5px]">
            <span className="w-[16px] h-[16px] rounded-[4px] bg-solar border border-solar" />
            <span className="text-text-muted">Peak Day</span>
          </div>
          <div className="flex items-center gap-[5px]">
            <span className="w-[16px] h-[16px] rounded-[4px] bg-build border border-build" />
            <span className="text-text-muted">High Energy</span>
          </div>
          <div className="flex items-center gap-[5px]">
            <span className="w-[16px] h-[16px] rounded-[4px] bg-transform border border-transform" />
            <span className="text-text-muted">Chapter Unlock</span>
          </div>
          <div className="flex items-center gap-[5px]">
            <span className="w-[16px] h-[16px] rounded-[4px] bg-void-800 border border-void-700" />
            <span className="text-text-muted">Normal</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="space-y-[8px]">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-[5px] text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div
                key={i}
                className="text-[11px] font-medium text-text-muted py-[5px]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-[5px]">
              {week.map((day, dayIndex) => {
                const globalIndex = weekIndex * 7 + dayIndex;
                const isSelected = selectedDay === globalIndex;
                const isExpanded = expandedDay === globalIndex;
                const dayColor = getDayColor(day.type);

                return (
                  <React.Fragment key={dayIndex}>
                    <button
                      onClick={() => handleDayClick(globalIndex)}
                      className={cn(
                        "relative aspect-square rounded-[8px] border transition-all duration-8",
                        "flex flex-col items-center justify-center gap-[2px]",
                        "hover:scale-105 hover:shadow-lg",
                        dayColor,
                        isSelected && "ring-2 ring-white ring-offset-2 ring-offset-void-900",
                        day.type === "unlock" && "animate-pulse-8"
                      )}
                    >
                      <span className="text-[9px] opacity-70">
                        {getDayOfWeek(day.state.date)}
                      </span>
                      <span className="text-[14px] font-medium">
                        {getDayNumber(day.state.date)}
                      </span>
                      
                      {/* Peak indicators */}
                      {day.peakCount > 0 && (
                        <div className="absolute -top-1 -right-1 flex">
                          {Array.from({ length: Math.min(day.peakCount, 3) }).map((_, i) => (
                            <span
                              key={i}
                              className="w-[4px] h-[4px] rounded-full bg-white"
                              style={{ marginLeft: i > 0 ? "-2px" : "0" }}
                            />
                          ))}
                        </div>
                      )}
                    </button>

                    {/* Expanded day detail */}
                    {isExpanded && (
                      <div className="col-span-7 mt-[8px] mb-[13px] p-[13px] bg-void-800 rounded-[13px] border border-void-700">
                        <div className="flex items-center justify-between mb-[8px]">
                          <span className="font-medium">
                            {day.state.date.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          {day.isUnlockDay && (
                            <span className="px-[8px] py-[2px] text-[11px] bg-transform text-white rounded-full">
                              Chapter Unlock Available
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-[8px]">
                          {Object.entries(day.state.cycles).map(([key, value]) => {
                            const percentage = Math.round(value * 100);
                            return (
                              <div
                                key={key}
                                className="flex items-center justify-between text-[13px]"
                              >
                                <span className="text-text-muted capitalize">{key}:</span>
                                <span
                                  className={cn(
                                    "tabular-nums font-medium",
                                    value > 0 ? "text-build" : "text-life"
                                  )}
                                >
                                  {percentage > 0 ? "+" : ""}
                                  {percentage}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        {day.peakCount > 0 && (
                          <div className="mt-[8px] pt-[8px] border-t border-void-700">
                            <span className="text-[11px] text-solar">
                              {day.peakCount} cycle{day.peakCount > 1 ? "s" : ""} at peak
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-[8px] mt-[21px] pt-[21px] border-t border-void-700">
          <div className="text-center">
            <div className="text-[21px] font-medium text-solar">{stats.peakDays}</div>
            <div className="text-[11px] text-text-muted">Peak Days</div>
          </div>
          <div className="text-center">
            <div className="text-[21px] font-medium text-build">{stats.highDays}</div>
            <div className="text-[11px] text-text-muted">High Energy</div>
          </div>
          <div className="text-center">
            <div className="text-[21px] font-medium text-life">{stats.lowDays}</div>
            <div className="text-[11px] text-text-muted">Low Days</div>
          </div>
          <div className="text-center">
            <div className="text-[21px] font-medium text-transform">{stats.unlockDays}</div>
            <div className="text-[11px] text-text-muted">Unlocks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

BiorhythmForecastCard.displayName = "BiorhythmForecastCard";

export default BiorhythmForecastCard;

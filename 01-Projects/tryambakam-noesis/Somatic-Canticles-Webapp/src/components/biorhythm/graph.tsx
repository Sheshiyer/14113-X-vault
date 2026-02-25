"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { BiorhythmPrediction, BiorhythmState } from "@/lib/biorhythm/types";
import { generatePrediction } from "@/lib/biorhythm/prediction";

export type GraphViewRange = 15 | 30 | 60;

export interface BiorhythmGraphProps {
  /** Birth date for calculation */
  birthDate: Date;
  /** Start date for graph (defaults to 15 days ago) */
  startDate?: Date;
  /** Number of days to display */
  days?: GraphViewRange;
  /** Custom className */
  className?: string;
  /** Height of the graph in pixels */
  height?: number;
  /** Pre-calculated prediction data (optional) */
  prediction?: BiorhythmPrediction;
  /** Enable hover tooltips */
  enableTooltip?: boolean;
}

interface CycleConfig {
  name: string;
  key: keyof BiorhythmState["cycles"];
  color: string;
  period: number;
}

const CYCLE_CONFIGS: CycleConfig[] = [
  { name: "Physical", key: "physical", color: "#E74C3C", period: 23 },
  { name: "Emotional", key: "emotional", color: "#9B59B6", period: 28 },
  { name: "Intellectual", key: "intellectual", color: "#3498DB", period: 33 },
  { name: "Spiritual", key: "spiritual", color: "#F1C40F", period: 38 },
];

const PEAK_THRESHOLD = 0.8;

/** Format date for display */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Format date for short display */
function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
}

/** Check if date is today */
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/** Generate SVG path for a cycle */
function generatePath(
  data: BiorhythmState[],
  cycleKey: keyof BiorhythmState["cycles"],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): string {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const xStep = chartWidth / (data.length - 1);

  return data
    .map((state, index) => {
      const value = state.cycles[cycleKey];
      const x = padding.left + index * xStep;
      // Map -1 to 1 to chart height (bottom to top)
      const y = padding.top + chartHeight - ((value + 1) / 2) * chartHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

/** Generate area path for a cycle (for fill) */
function generateAreaPath(
  data: BiorhythmState[],
  cycleKey: keyof BiorhythmState["cycles"],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): string {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const xStep = chartWidth / (data.length - 1);
  const zeroY = padding.top + chartHeight / 2;

  let path = "";
  data.forEach((state, index) => {
    const value = state.cycles[cycleKey];
    const x = padding.left + index * xStep;
    const y = padding.top + chartHeight - ((value + 1) / 2) * chartHeight;
    path += `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });

  // Close the path at zero line
  path += ` L ${padding.left + chartWidth} ${zeroY} L ${padding.left} ${zeroY} Z`;
  return path;
}

/** Find peaks in the data */
function findPeaks(
  data: BiorhythmState[],
  cycleKey: keyof BiorhythmState["cycles"]
): Array<{ index: number; date: Date; value: number }> {
  return data
    .map((state, index) => ({ index, date: state.date, value: state.cycles[cycleKey] }))
    .filter((item) => item.value >= PEAK_THRESHOLD);
}

export const BiorhythmGraph: React.FC<BiorhythmGraphProps> = ({
  birthDate,
  startDate: propStartDate,
  days = 30,
  className,
  height = 264,
  prediction: propPrediction,
  enableTooltip = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Calculate start date (center around today by default)
  const startDate = React.useMemo(() => {
    if (propStartDate) return propStartDate;
    const today = new Date();
    const pastDays = Math.floor(days / 2);
    const result = new Date(today);
    result.setDate(today.getDate() - pastDays);
    return result;
  }, [propStartDate, days]);

  // Generate or use provided prediction data
  const prediction = React.useMemo(() => {
    if (propPrediction) return propPrediction;
    return generatePrediction(birthDate, startDate, days);
  }, [propPrediction, birthDate, startDate, days]);

  const width = 600;
  const padding = { top: 21, right: 13, bottom: 44, left: 44 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Y-axis grid lines
  const gridLines = [
    { value: 1, label: "+100%", y: padding.top },
    { value: 0.5, label: "+50%", y: padding.top + chartHeight * 0.25 },
    { value: 0, label: "0%", y: padding.top + chartHeight * 0.5 },
    { value: -0.5, label: "-50%", y: padding.top + chartHeight * 0.75 },
    { value: -1, label: "-100%", y: padding.top + chartHeight },
  ];

  // X-axis labels (every 5 days)
  const xLabels = prediction.predictions
    .filter((_, index) => index % 5 === 0 || isToday(_.date))
    .map((state) => ({
      date: state.date,
      label: formatShortDate(state.date),
      isToday: isToday(state.date),
      index: prediction.predictions.findIndex((p) => p.date === state.date),
    }));

  // Handle mouse move for tooltip
  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!enableTooltip || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const chartX = (x / rect.width) * width - padding.left;
      const index = Math.round((chartX / chartWidth) * (prediction.predictions.length - 1));
      const clampedIndex = Math.max(0, Math.min(prediction.predictions.length - 1, index));
      setHoveredIndex(clampedIndex);
    },
    [enableTooltip, width, padding.left, chartWidth, prediction.predictions.length]
  );

  const handleMouseLeave = React.useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const hoveredData = hoveredIndex !== null ? prediction.predictions[hoveredIndex] : null;

  return (
    <div className={cn("w-full", className)}>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-[21px] mb-[13px]">
        {CYCLE_CONFIGS.map((config) => (
          <div key={config.key} className="flex items-center gap-[8px] text-[13px]">
            <span
              className="w-[19px] h-[3px] rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-text-muted">{config.name}</span>
          </div>
        ))}
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="img"
          aria-label={`Biorhythm graph showing ${days} day history and forecast`}
        >
          {/* Background */}
          <rect
            x={padding.left}
            y={padding.top}
            width={chartWidth}
            height={chartHeight}
            fill="#0A0A0F"
            rx={8}
          />

          {/* Grid lines */}
          {gridLines.map((line) => (
            <g key={line.value}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={line.y}
                y2={line.y}
                stroke={line.value === 0 ? "#495057" : "#343A40"}
                strokeWidth={line.value === 0 ? 2 : 1}
                strokeDasharray={line.value === 0 ? undefined : "4 4"}
              />
              <text
                x={padding.left - 8}
                y={line.y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#868E96"
                fontSize="11"
                className="tabular-nums"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Area fills (below zero line) */}
          {CYCLE_CONFIGS.map((config) => (
            <path
              key={`area-${config.key}`}
              d={generateAreaPath(prediction.predictions, config.key, width, height, padding)}
              fill={config.color}
              opacity={0.08}
            />
          ))}

          {/* Cycle lines */}
          {CYCLE_CONFIGS.map((config) => (
            <path
              key={`line-${config.key}`}
              d={generatePath(prediction.predictions, config.key, width, height, padding)}
              fill="none"
              stroke={config.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Peak annotations */}
          {CYCLE_CONFIGS.map((config) => {
            const peaks = findPeaks(prediction.predictions, config.key);
            return peaks.map((peak, peakIndex) => {
              const xStep = chartWidth / (prediction.predictions.length - 1);
              const x = padding.left + peak.index * xStep;
              const y =
                padding.top +
                chartHeight -
                ((peak.value + 1) / 2) * chartHeight;

              return (
                <g key={`peak-${config.key}-${peakIndex}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill={config.color}
                    className="animate-pulse-8"
                  />
                </g>
              );
            });
          })}

          {/* Today indicator */}
          {prediction.predictions.some((p) => isToday(p.date)) && (
            <g>
              {(() => {
                const todayIndex = prediction.predictions.findIndex((p) =>
                  isToday(p.date)
                );
                const xStep = chartWidth / (prediction.predictions.length - 1);
                const x = padding.left + todayIndex * xStep;
                return (
                  <line
                    x1={x}
                    x2={x}
                    y1={padding.top}
                    y2={height - padding.bottom}
                    stroke="#f5f5f7"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    opacity={0.5}
                  />
                );
              })()}
            </g>
          )}

          {/* Hover indicator */}
          {hoveredIndex !== null && (
            <g>
              {(() => {
                const xStep = chartWidth / (prediction.predictions.length - 1);
                const x = padding.left + hoveredIndex * xStep;
                return (
                  <line
                    x1={x}
                    x2={x}
                    y1={padding.top}
                    y2={height - padding.bottom}
                    stroke="#868E96"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                );
              })()}
            </g>
          )}

          {/* X-axis labels */}
          {xLabels.map((label) => {
            const xStep = chartWidth / (prediction.predictions.length - 1);
            const x = padding.left + label.index * xStep;
            return (
              <text
                key={`xlabel-${label.index}`}
                x={x}
                y={height - padding.bottom + 19}
                textAnchor="middle"
                fill={label.isToday ? "#f5f5f7" : "#868E96"}
                fontSize="11"
                fontWeight={label.isToday ? 500 : 400}
              >
                {label.isToday ? "Today" : label.label}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredData && (
          <div
            className="absolute bg-void-800 text-white text-[13px] rounded-[8px] px-[13px] py-[8px] pointer-events-none z-10 shadow-lg"
            style={{
              left:
                hoveredIndex !== null
                  ? `${(hoveredIndex / (prediction.predictions.length - 1)) * 100}%`
                  : "50%",
              top: "10px",
              transform: "translateX(-50%)",
            }}
          >
            <div className="font-medium mb-[5px] text-text-muted">
              {formatDate(hoveredData.date)}
            </div>
            <div className="space-y-[3px]">
              {CYCLE_CONFIGS.map((config) => {
                const value = hoveredData!.cycles[config.key];
                const percentage = Math.round(value * 100);
                return (
                  <div key={`tooltip-${config.key}`} className="flex items-center gap-[8px]">
                    <span
                      className="w-[8px] h-[8px] rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-text-muted">{config.name}:</span>
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
          </div>
        )}
      </div>
    </div>
  );
};

BiorhythmGraph.displayName = "BiorhythmGraph";

export default BiorhythmGraph;

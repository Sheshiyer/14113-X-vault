"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "underlined" | "cards";
  size?: "sm" | "md" | "lg";
  className?: string;
  contentClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = "default",
  size = "md",
  className,
  contentClassName,
}) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(
    defaultTab || tabs[0]?.id
  );

  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  const variants = {
    default: {
      container: "border-b border-slate-200",
      tab: "border-b-2 border-transparent -mb-[2px]",
      active: "border-octave text-octave",
      inactive: "text-slate-500 hover:text-slate-700 hover:border-slate-300",
    },
    pills: {
      container: "bg-slate-100 p-[5px] rounded-[13px]",
      tab: "rounded-[8px]",
      active: "bg-white text-slate-900 shadow-sm",
      inactive: "text-slate-500 hover:text-slate-700",
    },
    underlined: {
      container: "",
      tab: "border-b-2 border-transparent",
      active: "border-transform text-transform",
      inactive: "text-slate-500 hover:text-slate-700 hover:border-slate-200",
    },
    cards: {
      container: "gap-[8px]",
      tab: "border-2 rounded-[8px]",
      active: "border-octave bg-octave/5 text-octave-dark",
      inactive: "border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100",
    },
  };

  const sizes = {
    sm: "px-[13px] py-[5px] text-[13px] gap-[5px]",
    md: "px-[21px] py-[8px] text-[16px] gap-[8px]",
    lg: "px-[21px] py-[13px] text-[19px] gap-[13px]",
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Tab list */}
      <div
        className={cn(
          "flex",
          variants[variant].container,
          variant === "cards" && "flex-wrap"
        )}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative flex items-center justify-center font-medium transition-all duration-8",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-transform focus-visible:ring-offset-2",
              sizes[size],
              variants[variant].tab,
              activeTab === tab.id
                ? variants[variant].active
                : variants[variant].inactive,
              tab.disabled && "opacity-50 cursor-not-allowed",
              variant === "cards" && "flex-1 min-w-[100px]"
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                className={cn(
                  "flex items-center justify-center min-w-[21px] h-[21px] px-[5px] rounded-full text-[13px] font-semibold",
                  activeTab === tab.id
                    ? "bg-octave text-white"
                    : "bg-slate-200 text-slate-600"
                )}
              >
                {tab.badge > 99 ? "99+" : tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={cn("mt-[21px]", contentClassName)}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className={cn(
              "animate-[tabContent_800ms_ease-out]",
              activeTab !== tab.id && "hidden"
            )}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes tabContent {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Chapter tabs with cycle indicators
export interface ChapterTabsProps
  extends Omit<TabsProps, "tabs" | "variant"> {
  chapters: {
    id: string;
    number: number;
    title: string;
    cycle: "physical" | "emotional" | "intellectual" | "spiritual";
    isUnlocked: boolean;
    isCompleted: boolean;
    content: React.ReactNode;
  }[];
}

export const ChapterTabs: React.FC<ChapterTabsProps> = ({
  chapters,
  ...props
}) => {
  const cycleColors = {
    physical: "#FF6B6B", // octave
    emotional: "#9B59B6", // transform
    intellectual: "#3498DB", // architect
    spiritual: "#1ABC9C", // unity
  };

  const cycleIcons = {
    physical: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" x2="2" y1="8" y2="22" />
        <line x1="17.5" x2="9" y1="15" y2="15" />
      </svg>
    ),
    emotional: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    intellectual: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
    spiritual: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  };

  const tabs: Tab[] = chapters.map((chapter) => ({
    id: chapter.id,
    label: `${chapter.number}. ${chapter.title}`,
    icon: (
      <span
        style={{ color: cycleColors[chapter.cycle] }}
        className={cn(!chapter.isUnlocked && "opacity-50")}
      >
        {cycleIcons[chapter.cycle]}
      </span>
    ),
    disabled: !chapter.isUnlocked,
    content: chapter.content,
  }));

  return <Tabs tabs={tabs} variant="cards" {...props} />;
};

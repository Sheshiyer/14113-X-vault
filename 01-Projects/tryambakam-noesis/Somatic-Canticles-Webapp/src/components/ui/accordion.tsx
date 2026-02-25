"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "filled";
  size?: "sm" | "md" | "lg";
  className?: string;
  onChange?: (openItems: string[]) => void;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpen = [],
  allowMultiple = false,
  variant = "default",
  size = "md",
  className,
  onChange,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    let newOpenItems: string[];

    if (openItems.includes(itemId)) {
      newOpenItems = openItems.filter((id) => id !== itemId);
    } else {
      newOpenItems = allowMultiple ? [...openItems, itemId] : [itemId];
    }

    setOpenItems(newOpenItems);
    onChange?.(newOpenItems);
  };

  const variants = {
    default: {
      container: "divide-y divide-slate-200",
      item: "",
      header: "hover:bg-slate-50",
      content: "",
    },
    bordered: {
      container: "border border-slate-200 rounded-[8px] divide-y divide-slate-200",
      item: "",
      header: "hover:bg-slate-50",
      content: "",
    },
    filled: {
      container: "space-y-[8px]",
      item: "rounded-[8px] bg-slate-50 overflow-hidden",
      header: "hover:bg-slate-100",
      content: "bg-white",
    },
  };

  const sizes = {
    sm: {
      header: "px-[13px] py-[8px] text-[14px]",
      content: "px-[13px] pb-[13px]",
      icon: 16,
    },
    md: {
      header: "px-[21px] py-[13px] text-[16px]",
      content: "px-[21px] pb-[21px]",
      icon: 21,
    },
    lg: {
      header: "px-[21px] py-[16px] text-[19px]",
      content: "px-[21px] pb-[21px]",
      icon: 24,
    },
  };

  return (
    <div className={cn(variants[variant].container, className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div
            key={item.id}
            className={cn(variants[variant].item)}
          >
            <button
              type="button"
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-header-${item.id}`}
              className={cn(
                "w-full flex items-center justify-between text-left font-medium transition-colors duration-8",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-transform focus-visible:ring-inset",
                sizes[size].header,
                variants[variant].header,
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-[13px]">
                {item.icon && (
                  <span className="flex-shrink-0 text-slate-500">
                    {item.icon}
                  </span>
                )}
                <span className={cn("text-slate-900", isOpen && "text-transform")}>
                  {item.title}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={sizes[size].icon}
                height={sizes[size].icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "flex-shrink-0 text-slate-500 transition-transform duration-[800ms]",
                  isOpen && "rotate-180 text-transform"
                )}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              id={`accordion-content-${item.id}`}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
              className={cn(
                "grid transition-all duration-[800ms] ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    sizes[size].content,
                    variants[variant].content,
                    "text-slate-600 leading-relaxed"
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// FAQ Accordion with question/answer styling
export interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category?: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  groupByCategory?: boolean;
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  groupByCategory = false,
  className,
}) => {
  if (groupByCategory) {
    const categories = Array.from(
      new Set(items.map((item) => item.category || "General"))
    );

    return (
      <div className={cn("space-y-[21px]", className)}>
        {categories.map((category) => {
          const categoryItems = items
            .filter((item) => (item.category || "General") === category)
            .map((item) => ({
              id: item.question,
              title: item.question,
              content: item.answer,
            }));

          return (
            <div key={category}>
              <h3 className="text-[19px] font-semibold text-slate-900 mb-[13px]">
                {category}
              </h3>
              <Accordion items={categoryItems} variant="bordered" />
            </div>
          );
        })}
      </div>
    );
  }

  const accordionItems = items.map((item) => ({
    id: item.question,
    title: item.question,
    content: item.answer,
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  }));

  return (
    <Accordion items={accordionItems} variant="filled" className={className} />
  );
};

// Chapter details accordion
export interface ChapterDetailsProps {
  chapter: {
    number: number;
    title: string;
    cycle: string;
    description: string;
    unlockCriteria: string;
    canticle: string;
    practices: string[];
  };
  className?: string;
}

export const ChapterDetailsAccordion: React.FC<ChapterDetailsProps> = ({
  chapter,
  className,
}) => {
  const items: AccordionItem[] = [
    {
      id: "overview",
      title: "Chapter Overview",
      content: (
        <div className="space-y-[13px]">
          <p>{chapter.description}</p>
          <div className="flex items-center gap-[8px] text-[14px]">
            <span className="text-slate-500">Cycle:</span>
            <span className="capitalize font-medium">{chapter.cycle}</span>
          </div>
        </div>
      ),
      icon: (
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
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      id: "unlock",
      title: "Unlock Criteria",
      content: <p>{chapter.unlockCriteria}</p>,
      icon: (
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
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </svg>
      ),
    },
    {
      id: "canticle",
      title: `Canticle: ${chapter.canticle}`,
      content: (
        <p>
          The {chapter.canticle} is the accompanying audio practice for this
          chapter. It activates the {chapter.cycle} cycle through sound and
          somatic resonance.
        </p>
      ),
      icon: (
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
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
    },
    {
      id: "practices",
      title: "Daily Practices",
      content: (
        <ul className="space-y-[5px] list-disc list-inside">
          {chapter.practices.map((practice, index) => (
            <li key={index}>{practice}</li>
          ))}
        </ul>
      ),
      icon: (
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
          <path d="M8 6h10" />
          <path d="M6 12h9" />
          <path d="M11 18h7" />
        </svg>
      ),
    },
  ];

  return (
    <Accordion
      items={items}
      variant="default"
      defaultOpen={["overview"]}
      className={className}
    />
  );
};

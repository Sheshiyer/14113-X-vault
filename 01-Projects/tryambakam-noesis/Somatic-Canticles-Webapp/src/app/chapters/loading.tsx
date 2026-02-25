"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

export default function ChaptersLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-[21px]">
        {/* Header Skeleton */}
        <div className="text-center space-y-[13px] pb-[21px] border-b border-surface-elevated/30">
          <div className="flex items-center justify-center gap-[13px]">
            <BookOpen className="w-[28px] h-[28px] text-octave/30" />
            <Skeleton className="h-[44px] w-[250px]" />
          </div>
          <Skeleton className="h-[19px] w-[400px] mx-auto" />
        </div>

        {/* Progress Stats Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[13px]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-elevated/30 rounded-[13px] p-[21px] border border-surface-elevated/30"
            >
              <Skeleton className="h-[16px] w-[60px] mb-[8px]" />
              <Skeleton className="h-[28px] w-[40px]" />
            </div>
          ))}
        </div>

        {/* Progress Bar Skeleton */}
        <div className="bg-surface-elevated/30 rounded-[13px] p-[21px] border border-surface-elevated/30">
          <div className="flex items-center justify-between mb-[13px]">
            <Skeleton className="h-[14px] w-[120px]" />
            <Skeleton className="h-[14px] w-[80px]" />
          </div>
          <Skeleton className="h-[8px] w-full rounded-full" />
        </div>

        {/* Controls Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[13px] py-[13px]">
          <div className="flex items-center gap-[8px]">
            <Skeleton className="h-[34px] w-[80px] rounded-[8px]" />
            <Skeleton className="h-[34px] w-[100px] rounded-[8px]" />
          </div>
          <div className="flex items-center gap-[8px]">
            <Skeleton className="h-[34px] w-[120px] rounded-[8px]" />
            <Skeleton className="h-[34px] w-[120px] rounded-[8px]" />
          </div>
        </div>

        {/* Chapter Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[21px] pt-[21px]">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 21 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-elevated/30 rounded-[13px] border border-surface-elevated/30 overflow-hidden"
            >
              {/* Thumbnail Skeleton */}
              <Skeleton className="h-[125px] w-full" />
              
              {/* Content Skeleton */}
              <div className="p-[21px] space-y-[13px]">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-[13px] w-[80px]" />
                  <Skeleton className="h-[34px] w-[34px] rounded-full" />
                </div>
                <Skeleton className="h-[19px] w-full" />
                <Skeleton className="h-[14px] w-[80%]" />
                <div className="pt-[8px] border-t border-surface-elevated/30 flex items-center justify-between">
                  <Skeleton className="h-[24px] w-[80px] rounded-full" />
                  <Skeleton className="h-[13px] w-[50px]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

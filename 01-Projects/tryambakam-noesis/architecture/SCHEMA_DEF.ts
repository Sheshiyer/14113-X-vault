import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * SCHEMA_DEF.ts (The Annamaya Blueprint)
 * Convex Schema for The Antahkarana Console v1.0
 */

export default defineSchema({
  // Pranamaya Layer: System Activity and Vital Flow
  telemetry: defineTable({
    type: v.union(
      v.literal("tool_call"),
      v.literal("agent_spawn"),
      v.literal("system_alert"),
      v.literal("khaloree_update"),
      v.literal("thought_process")
    ),
    payload: v.any(), // Raw tool args, agent status, or metabolic data
    agentId: v.string(), // ID of the originating session or sub-agent
    timestamp: v.number(), // High-precision Unix timestamp
    koshaLayer: v.optional(v.string()), // Annamaya, Pranamaya, etc.
    gunaState: v.optional(v.string()), // Sattva, Rajas, Tamas
  }).index("by_timestamp", ["timestamp"]),

  // Chitta Layer: PARA Vault Context Anchors
  context_anchors: defineTable({
    projectId: v.string(), // PARA project slug
    path: v.string(), // Absolute path to CONTEXT.md
    content: v.string(), // Parsed markdown content
    metadata: v.object({
      status: v.string(),
      energy: v.number(),
      lastDistilled: v.number(),
    }),
    updatedAt: v.number(),
  }).index("by_project", ["projectId"]),

  // Anandamaya Layer: Inhabited Rituals (Cron Jobs)
  rituals: defineTable({
    jobId: v.string(), // OpenClaw Cron Job ID
    name: v.string(),
    schedule: v.string(),
    lastRun: v.optional(v.number()),
    status: v.union(v.literal("pending"), v.literal("success"), v.literal("failed")),
    vayu: v.optional(v.string()), // Prana, Apana, Samana, etc.
  }).index("by_jobId", ["jobId"]),

  // Vijnanamaya Layer: 13 Engines and Cube State
  engine_states: defineTable({
    engineNumber: v.number(), // 1 through 13
    name: v.string(),
    isActive: v.boolean(),
    currentLoad: v.number(), // 0 to 100
    lastActive: v.number(),
  }).index("by_number", ["engineNumber"]),

  // Identity & Alignment
  session_metrics: defineTable({
    sessionKey: v.string(),
    khaloreeIndex: v.number(), // 0 to 100
    polarity: v.object({
      aletheios: v.number(), // percentage
      pichet: v.number(), // percentage
    }),
    cliffordHour: v.number(), // 0 to 7
    updatedAt: v.number(),
  }).index("by_session", ["sessionKey"]),
});

import { z } from "zod";

/**
 * Structural schema for ReactiveSkill JSON.
 *
 * The structure below is inferred from the skills shipped in ../skills and
 * enforces everything the Android runtime provably relies on, while staying
 * forward-compatible:
 *
 *  - Every object is "loose" (unknown fields are preserved, not rejected).
 *  - Trigger/action/target/condition `type` values are NOT enumerated: the
 *    authoritative list lives in the Android runtime (pending confirmation).
 *    Unknown types pass as long as `type` is a non-empty string.
 *  - For types observed in shipped skills, the fields they always carry are
 *    required via superRefine. These conditional rules are runtime-only —
 *    JSON Schema cannot express them, so schema.json documents the typed
 *    fields instead.
 */

const nonEmptyString = z.string().min(1);
/** Millisecond durations/counts: integers, never negative. */
const nonNegativeMs = z.number().int().nonnegative();
/** Screen-relative coordinates ("Pct" suffix) are fractions in [0, 1]. */
const pct = z.number().min(0).max(1);

type LooseRecord = Record<string, unknown>;

function requireField(obj: LooseRecord, ctx: z.RefinementCtx, field: string): void {
  if (obj[field] === undefined) {
    ctx.addIssue({
      code: "custom",
      path: [field],
      message: `type "${obj.type}" requires "${field}"`,
    });
  }
}

function requireNonEmptyArray(obj: LooseRecord, ctx: z.RefinementCtx, field: string): void {
  const value = obj[field];
  if (!Array.isArray(value) || value.length === 0) {
    ctx.addIssue({
      code: "custom",
      path: [field],
      message: `type "${obj.type}" requires a non-empty "${field}" array`,
    });
  }
}

const TargetSchema = z.looseObject({
  type: nonEmptyString,
  text: z.string().optional(),
  desc: z.string().optional(),
  viewId: z.string().optional(),
  exact: z.boolean().optional(),
  textExact: z.boolean().optional(),
  index: z.number().int().optional(),
  description: z.string().optional(),
  hintText: z.string().optional(),
  hintDesc: z.string().optional(),
}).superRefine((target, ctx) => {
  switch (target.type) {
    case "text":
      requireField(target, ctx, "text");
      break;
    case "desc":
      requireField(target, ctx, "desc");
      break;
    case "id":
      requireField(target, ctx, "viewId");
      break;
    case "composite":
      requireField(target, ctx, "text");
      requireField(target, ctx, "textExact");
      requireField(target, ctx, "index");
      break;
    case "semantic":
      requireField(target, ctx, "description");
      break;
  }
});

const TriggerSchema = z.looseObject({
  type: nonEmptyString,
  target: TargetSchema.optional(),
  packageName: z.string().optional(),
  goalId: z.string().optional(),
  get triggers() {
    return z.array(TriggerSchema).optional();
  },
}).superRefine((trigger, ctx) => {
  switch (trigger.type) {
    case "elementVisible":
      requireField(trigger, ctx, "target");
      break;
    case "appInForeground":
      requireField(trigger, ctx, "packageName");
      break;
    case "afterGoal":
      requireField(trigger, ctx, "goalId");
      break;
    case "allOf":
      requireNonEmptyArray(trigger, ctx, "triggers");
      break;
  }
});

const ConditionSchema = z.looseObject({
  type: nonEmptyString,
  target: TargetSchema.optional(),
  get conditions() {
    return z.array(ConditionSchema).optional();
  },
}).superRefine((condition, ctx) => {
  switch (condition.type) {
    case "elementVisible":
      requireField(condition, ctx, "target");
      break;
    case "anyOf":
      requireNonEmptyArray(condition, ctx, "conditions");
      break;
  }
});

const SwipePathSchema = z.looseObject({
  startXPct: pct,
  startYPct: pct,
  endXPct: pct,
  endYPct: pct,
  durationMs: nonNegativeMs.optional(),
});

const ScrollRegionSchema = z.looseObject({
  leftPct: pct,
  topPct: pct,
  rightPct: pct,
  bottomPct: pct,
});

const ActionSchema = z.looseObject({
  type: nonEmptyString,
  target: TargetSchema.optional(),
  message: z.string().optional(),
  speakVoice: z.boolean().optional(),
  showText: z.boolean().optional(),
  packageName: z.string().optional(),
  appName: z.string().optional(),
  delayMs: nonNegativeMs.optional(),
  timeoutMs: nonNegativeMs.optional(),
  durationMs: nonNegativeMs.optional(),
  pressDurationMs: nonNegativeMs.optional(),
  text: z.string().optional(),
  clearFirst: z.boolean().optional(),
  mode: z.string().optional(),
  systemType: z.string().optional(),
  direction: z.string().optional(),
  maxScrolls: z.number().int().positive().optional(),
  scrollDurationMs: nonNegativeMs.optional(),
  settleDelayMs: nonNegativeMs.optional(),
  tapWhenFound: z.boolean().optional(),
  scrollRegion: ScrollRegionSchema.optional(),
  scrollPath: SwipePathSchema.optional(),
  variableName: z.string().optional(),
  question: z.string().optional(), // For askAgent
  startXPct: pct.optional(),
  startYPct: pct.optional(),
  endXPct: pct.optional(),
  endYPct: pct.optional(),
  condition: ConditionSchema.optional(),
  get onTrue() {
    return z.array(ActionSchema).optional();
  },
  get onFalse() {
    return z.array(ActionSchema).optional();
  },
}).superRefine((action, ctx) => {
  switch (action.type) {
    case "tap":
    case "longTap":
      requireField(action, ctx, "target");
      break;
    case "notify":
      requireField(action, ctx, "message");
      break;
    case "launchApp":
      requireField(action, ctx, "packageName");
      break;
    case "delay":
      requireField(action, ctx, "durationMs");
      break;
    case "typeText":
      requireField(action, ctx, "target");
      requireField(action, ctx, "text");
      break;
    case "setClipboard":
      requireField(action, ctx, "text");
      break;
    case "systemAction":
      requireField(action, ctx, "systemType");
      break;
    case "swipe":
      if (action.target === undefined) {
        requireField(action, ctx, "startXPct");
        requireField(action, ctx, "startYPct");
        requireField(action, ctx, "endXPct");
        requireField(action, ctx, "endYPct");
      }
      break;
    case "scrollTo":
      requireField(action, ctx, "target");
      requireField(action, ctx, "direction");
      break;
    case "readText":
      requireField(action, ctx, "target");
      requireField(action, ctx, "variableName");
      break;
    case "waitFor":
      requireField(action, ctx, "condition");
      requireField(action, ctx, "timeoutMs");
      break;
    case "conditionBranch":
      requireField(action, ctx, "condition");
      requireField(action, ctx, "onTrue");
      requireField(action, ctx, "onFalse");
      break;
    case "askAgent":
      requireField(action, ctx, "question");
      break;
  }
});

const ConstraintsSchema = z.looseObject({
  // 0 means "unlimited" (used together with executionMode "REPEAT").
  maxExecutions: z.number().int().nonnegative(),
  cooldownMs: nonNegativeMs,
  continueOnFailure: z.boolean(),
  enabled: z.boolean(),
  executionMode: z.string().optional(),
});

const GoalSchema = z.looseObject({
  id: nonEmptyString,
  name: nonEmptyString,
  priority: z.number().int().optional(),
  trigger: TriggerSchema,
  action: ActionSchema.optional(),
  actions: z.array(ActionSchema).optional(),
  constraints: ConstraintsSchema.optional(),
});

const InterruptSchema = z.looseObject({
  name: nonEmptyString,
  when: TargetSchema,
  dismiss: TargetSchema,
  enabled: z.boolean().optional(),
});

const TerminationSchema = z.looseObject({
  type: nonEmptyString,
  maxDurationMs: nonNegativeMs.optional(),
}).superRefine((termination, ctx) => {
  if (termination.type === "timeout") {
    requireField(termination, ctx, "maxDurationMs");
  }
});

const ScanConfigSchema = z.looseObject({
  idleIntervalMs: nonNegativeMs.optional(),
  activeIntervalMs: nonNegativeMs.optional(),
  fallbackToImageMatch: z.boolean().optional(),
});

export const ReactiveSkillSchema = z.looseObject({
  id: nonEmptyString,
  name: nonEmptyString,
  description: nonEmptyString,
  executionMode: z.string().optional(),
  agentId: z.string().optional(),
  termination: TerminationSchema,
  interrupts: z.array(InterruptSchema).optional(),
  goals: z.array(GoalSchema).min(1),
  pacingPreset: z.string().optional(),
  scanConfig: ScanConfigSchema.optional(),
  returnToApp: z.boolean().optional(),
});

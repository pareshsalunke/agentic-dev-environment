import {
  CHECKS,
  CONTEXT_SOURCES,
  DIFF_FILES,
  PLAN_STEP2_EDITED_TAIL,
  PLAN_STEPS,
} from '../data/scenario'

/* ------------------------------------------------------------------ */
/* §B7 — every animation is a fixed timeline. Each step is a list of   */
/* event delays (ms); the UI derives entirely from (stepIdx, progress).*/
/* No randomness, no Date.now()-dependent rendering, no network.       */
/* ------------------------------------------------------------------ */

export const STEP = {
  IDLE: 0,
  CONTEXT: 1, // Beat 1
  PLAN: 2, // Beat 2 — proposal
  CHOICE: 3, // Beat 2 — step-4 decision (a)
  EDIT: 4, // Beat 2 — scripted inline edit of step 2
  LOCK: 5, // Beat 2 — approve → "Plan locked · v2 · 1 human edit"
  EXECUTE: 6, // Beat 3
  REVIEW: 7, // Beat 4 — intent-grouped review
  PR: 8, // Beat 4 — PR card
  TOAST: 9, // Beat 5
} as const

export const LAST_STEP = STEP.TOAST

/* --- scripted edit pacing --- */
export const EDIT_CHARS_PER_TICK = 2
const editTypeTicks = Math.ceil(PLAN_STEP2_EDITED_TAIL.length / EDIT_CHARS_PER_TICK)

/* --- execute layout: card / line / check events mapped to progress --- */
interface ExecLayout {
  delays: number[]
  /** card f visible when progress >= cardAt[f] */
  cardAt: number[]
  /** lines of file f shown = clamp(progress - lineStart[f], 0, lineCount[f]) */
  lineStart: number[]
  lineCount: number[]
  testsStart: number
  policyStart: number
  riskAt: number
  total: number
}

function buildExecLayout(): ExecLayout {
  const delays: number[] = []
  const cardAt: number[] = []
  const lineStart: number[] = []
  const lineCount: number[] = []
  let p = 0
  DIFF_FILES.forEach((file) => {
    delays.push(650) // file card appears
    p += 1
    cardAt.push(p)
    lineStart.push(p)
    const lines = file.hunks.flatMap((h) => h.lines)
    const isYaml = file.path.endsWith('.yaml')
    lines.forEach((l) => {
      delays.push(l.k === 'ctx' ? 36 : isYaml ? 50 : 68)
      p += 1
    })
    lineCount.push(lines.length)
  })
  const testsStart = p
  for (let i = 0; i < CHECKS.tests.total; i++) {
    delays.push(95)
    p += 1
  }
  const policyStart = p
  CHECKS.policy.forEach(() => {
    delays.push(340)
    p += 1
  })
  delays.push(550) // risk badge
  p += 1
  return { delays, cardAt, lineStart, lineCount, testsStart, policyStart, riskAt: p, total: p }
}

export const EXEC = buildExecLayout()

export interface StepDef {
  /** delays in ms between successive progress ticks */
  events: number[]
  /** autoplay pause once the step's events are exhausted */
  pauseAfter: number
}

const contextEvents: number[] = []
CONTEXT_SOURCES.forEach((_, i) => {
  contextEvents.push(i === 0 ? 400 : 500) // skeleton appears
  contextEvents.push(560) // chip resolves
})
contextEvents.push(550) // footer line

/* pauseAfter values are tuned so ▶ Run demo lands in ~75–90s (§B7) */
export const STEPS: StepDef[] = [
  /* IDLE    */ { events: [], pauseAfter: 1200 },
  /* CONTEXT */ { events: contextEvents, pauseAfter: 4200 },
  /* PLAN    */ { events: [550, 480, 480, 480, 480, 480], pauseAfter: 8000 },
  /* CHOICE  */ { events: [700], pauseAfter: 3000 },
  /* EDIT    */ {
    events: [600, 520, ...Array<number>(editTypeTicks).fill(26), 480],
    pauseAfter: 3600,
  },
  /* LOCK    */ { events: [600], pauseAfter: 4800 },
  /* EXECUTE */ { events: EXEC.delays, pauseAfter: 5200 },
  /* REVIEW  */ { events: [450], pauseAfter: 8500 },
  /* PR      */ { events: [600], pauseAfter: 4500 },
  /* TOAST   */ { events: [900], pauseAfter: 0 },
]

export const EDIT_EVENT_COUNT = STEPS[STEP.EDIT].events.length

/* ------------------------------------------------------------------ */
/* Derivation helpers (pure functions of demo state)                   */
/* ------------------------------------------------------------------ */

export interface Pointer {
  stepIdx: number
  progress: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function at(ptr: Pointer, step: number): 'before' | 'during' | 'after' {
  if (ptr.stepIdx < step) return 'before'
  if (ptr.stepIdx > step) return 'after'
  return 'during'
}

export type ChipState = 'hidden' | 'skeleton' | 'resolved'

export function chipState(ptr: Pointer, i: number): ChipState {
  const pos = at(ptr, STEP.CONTEXT)
  if (pos === 'before') return 'hidden'
  if (pos === 'after') return 'resolved'
  if (ptr.progress >= 2 * i + 2) return 'resolved'
  if (ptr.progress >= 2 * i + 1) return 'skeleton'
  return 'hidden'
}

export function contextStarted(ptr: Pointer): boolean {
  return ptr.stepIdx >= STEP.CONTEXT
}

export function contextFooterVisible(ptr: Pointer): boolean {
  const pos = at(ptr, STEP.CONTEXT)
  return pos === 'after' || (pos === 'during' && ptr.progress >= contextEvents.length)
}

export function planHeaderVisible(ptr: Pointer): boolean {
  const pos = at(ptr, STEP.PLAN)
  return pos === 'after' || (pos === 'during' && ptr.progress >= 1)
}

export function planStepsShown(ptr: Pointer): number {
  const pos = at(ptr, STEP.PLAN)
  if (pos === 'before') return 0
  if (pos === 'after') return PLAN_STEPS.length
  return clamp(ptr.progress - 1, 0, PLAN_STEPS.length)
}

/** Scripted inline edit of step 2: textarea contents derived from progress. */
export function scriptedEdit(
  ptr: Pointer,
  originalText: string,
  prefix: string,
): { active: boolean; draft: string; typing: boolean } {
  if (ptr.stepIdx !== STEP.EDIT || ptr.progress === 0 || ptr.progress >= EDIT_EVENT_COUNT) {
    return { active: false, draft: '', typing: false }
  }
  if (ptr.progress === 1) return { active: true, draft: originalText, typing: false }
  const typed = PLAN_STEP2_EDITED_TAIL.slice(0, (ptr.progress - 2) * EDIT_CHARS_PER_TICK)
  return { active: true, draft: prefix + typed, typing: true }
}

export function executeStarted(ptr: Pointer): boolean {
  return ptr.stepIdx >= STEP.EXECUTE
}

export function fileCardVisible(ptr: Pointer, f: number): boolean {
  const pos = at(ptr, STEP.EXECUTE)
  if (pos === 'before') return false
  if (pos === 'after') return true
  return ptr.progress >= EXEC.cardAt[f]
}

export function fileLinesShown(ptr: Pointer, f: number): number {
  const pos = at(ptr, STEP.EXECUTE)
  if (pos === 'before') return 0
  if (pos === 'after') return EXEC.lineCount[f]
  return clamp(ptr.progress - EXEC.lineStart[f], 0, EXEC.lineCount[f])
}

/** index of the file currently streaming, or null */
export function activeFile(ptr: Pointer): number | null {
  if (ptr.stepIdx !== STEP.EXECUTE) return null
  for (let f = 0; f < DIFF_FILES.length; f++) {
    if (ptr.progress >= EXEC.cardAt[f] && fileLinesShown(ptr, f) < EXEC.lineCount[f]) return f
  }
  return null
}

export function testsShown(ptr: Pointer): number {
  const pos = at(ptr, STEP.EXECUTE)
  if (pos === 'before') return 0
  if (pos === 'after') return CHECKS.tests.total
  return clamp(ptr.progress - EXEC.testsStart, 0, CHECKS.tests.total)
}

export function policyShown(ptr: Pointer): number {
  const pos = at(ptr, STEP.EXECUTE)
  if (pos === 'before') return 0
  if (pos === 'after') return CHECKS.policy.length
  return clamp(ptr.progress - EXEC.policyStart, 0, CHECKS.policy.length)
}

export function riskShown(ptr: Pointer): boolean {
  const pos = at(ptr, STEP.EXECUTE)
  return pos === 'after' || (pos === 'during' && ptr.progress >= EXEC.riskAt)
}

export type CenterMode = 'editor' | 'diff' | 'review' | 'pr'

export function centerMode(ptr: Pointer, prOpened: boolean): CenterMode {
  if (prOpened) return 'pr'
  if (ptr.stepIdx > STEP.REVIEW || (ptr.stepIdx === STEP.REVIEW && ptr.progress >= 1)) {
    return 'review'
  }
  if (ptr.stepIdx >= STEP.EXECUTE) return 'diff'
  return 'editor'
}

/* --- demo controls labels --- */

export function beatOf(ptr: Pointer): { n: number; label: string } {
  const s = ptr.stepIdx
  if (s === STEP.IDLE) return { n: 0, label: 'Ready' }
  if (s === STEP.CONTEXT) return { n: 1, label: 'Context' }
  if (s <= STEP.LOCK) return { n: 2, label: 'Plan Gate' }
  if (s === STEP.EXECUTE) return { n: 3, label: 'Execution' }
  if (s <= STEP.PR) return { n: 4, label: 'Review & PR' }
  return { n: 5, label: 'Impact' }
}

const NEXT_LABELS: Record<number, string> = {
  [STEP.IDLE]: 'Plan with Sous',
  [STEP.CONTEXT]: 'Propose plan',
  [STEP.PLAN]: 'Select option (a)',
  [STEP.CHOICE]: 'Edit step 2',
  [STEP.EDIT]: 'Approve plan',
  [STEP.LOCK]: 'Execute plan',
  [STEP.EXECUTE]: 'Open review',
  [STEP.REVIEW]: 'Approve & open PR',
  [STEP.PR]: 'Log unit of work',
  [STEP.TOAST]: 'Done',
}

export function nextActionLabel(ptr: Pointer): string {
  const def = STEPS[ptr.stepIdx]
  if (ptr.progress < def.events.length) return 'Fast-forward'
  return NEXT_LABELS[ptr.stepIdx]
}

export function demoFinished(ptr: Pointer): boolean {
  return ptr.stepIdx === LAST_STEP && ptr.progress >= STEPS[LAST_STEP].events.length
}

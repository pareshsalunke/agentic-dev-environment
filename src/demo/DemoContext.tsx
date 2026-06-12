import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react'
import type { Brand, TabId } from '../types'
import {
  PLAN_STEP2_EDITED_TAIL,
  PLAN_STEP2_ORIGINAL_TAIL,
  PLAN_STEP2_PREFIX,
} from '../data/scenario'
import { LAST_STEP, STEP, STEPS } from './timeline'

export const STEP2_ORIGINAL = PLAN_STEP2_PREFIX + PLAN_STEP2_ORIGINAL_TAIL
export const STEP2_EDITED = PLAN_STEP2_PREFIX + PLAN_STEP2_EDITED_TAIL

export interface DemoState {
  tab: TabId
  brand: Brand
  stepIdx: number
  progress: number
  autoplay: boolean
  cacheChoice: 'a' | 'b' | null
  step2Text: string
  editCount: number
  manualEditing: boolean
  manualDraft: string
  planLocked: boolean
  planVersion: number
  prOpened: boolean
  toastVisible: boolean
  expandedSource: number | null
}

export type DemoAction =
  | { type: 'TICK' }
  | { type: 'ADVANCE'; keepAutoplay?: boolean }
  | { type: 'PLAY' }
  | { type: 'RESET' }
  | { type: 'SET_TAB'; tab: TabId }
  | { type: 'SET_BRAND'; brand: Brand }
  | { type: 'START_PLAN' }
  | { type: 'SELECT_CHOICE'; key: 'a' | 'b' }
  | { type: 'OPEN_EDIT' }
  | { type: 'SET_DRAFT'; draft: string }
  | { type: 'CANCEL_EDIT' }
  | { type: 'SAVE_EDIT' }
  | { type: 'APPROVE_PLAN' }
  | { type: 'APPROVE_PR' }
  | { type: 'TOGGLE_SOURCE'; id: number }
  | { type: 'DISMISS_TOAST' }
  | { type: 'VIEW_IMPACT' }

const initialState: DemoState = {
  tab: 'workbench',
  brand: 'efood',
  stepIdx: STEP.IDLE,
  progress: 0,
  autoplay: false,
  cacheChoice: null,
  step2Text: STEP2_ORIGINAL,
  editCount: 0,
  manualEditing: false,
  manualDraft: '',
  planLocked: false,
  planVersion: 1,
  prOpened: false,
  toastVisible: false,
  expandedSource: null,
}

/** side effects that must hold once a step is complete */
function applyCompletion(s: DemoState, stepIdx: number): DemoState {
  switch (stepIdx) {
    case STEP.CHOICE:
      return s.cacheChoice === null ? { ...s, cacheChoice: 'a' } : s
    case STEP.EDIT:
      return s.editCount === 0
        ? { ...s, step2Text: STEP2_EDITED, editCount: 1, manualEditing: false }
        : s
    case STEP.LOCK:
      return s.planLocked
        ? s
        : { ...s, planLocked: true, planVersion: s.editCount > 0 ? 2 : 1 }
    case STEP.PR:
      return { ...s, prOpened: true }
    case STEP.TOAST:
      return { ...s, toastVisible: true, autoplay: false }
    default:
      return s
  }
}

function completeCurrent(s: DemoState): DemoState {
  const len = STEPS[s.stepIdx].events.length
  if (s.progress >= len) return s
  return applyCompletion({ ...s, progress: len }, s.stepIdx)
}

/** move pointer forward to at least (stepIdx, progress) */
function jumpForward(s: DemoState, stepIdx: number, progress: number): DemoState {
  if (s.stepIdx > stepIdx || (s.stepIdx === stepIdx && s.progress >= progress)) return s
  let next = { ...s }
  // complete every skipped step so its side effects hold
  for (let i = next.stepIdx; i < stepIdx; i++) next = applyCompletion(next, i)
  return { ...next, stepIdx, progress }
}

function advance(s: DemoState, keepAutoplay: boolean): DemoState {
  const base = keepAutoplay ? s : { ...s, autoplay: false }
  const len = STEPS[base.stepIdx].events.length
  if (base.progress < len) return completeCurrent(base)
  if (base.stepIdx >= LAST_STEP) return base
  let next = { ...base, stepIdx: base.stepIdx + 1, progress: 0 }
  // skip steps the user already performed manually
  if (next.stepIdx === STEP.CHOICE && next.cacheChoice !== null) {
    next = { ...next, progress: STEPS[STEP.CHOICE].events.length }
  } else if (next.stepIdx === STEP.EDIT && next.editCount > 0) {
    next = { ...next, progress: STEPS[STEP.EDIT].events.length }
  } else if (next.stepIdx === STEP.LOCK && next.planLocked) {
    next = { ...next, progress: STEPS[STEP.LOCK].events.length }
  }
  return next
}

function reducer(s: DemoState, a: DemoAction): DemoState {
  switch (a.type) {
    case 'TICK': {
      const len = STEPS[s.stepIdx].events.length
      if (s.progress >= len) return s
      const next = { ...s, progress: s.progress + 1 }
      return next.progress === len ? applyCompletion(next, next.stepIdx) : next
    }
    case 'ADVANCE':
      return advance(s, a.keepAutoplay === true)
    case 'PLAY': {
      if (s.autoplay) return { ...s, autoplay: false }
      if (s.stepIdx === LAST_STEP) {
        return { ...initialState, brand: s.brand, autoplay: true }
      }
      return { ...s, autoplay: true, tab: 'workbench' }
    }
    case 'RESET':
      return { ...initialState, brand: s.brand }
    case 'SET_TAB':
      return { ...s, tab: a.tab }
    case 'SET_BRAND':
      return { ...s, brand: a.brand }
    case 'START_PLAN':
      return s.stepIdx === STEP.IDLE ? { ...s, stepIdx: STEP.CONTEXT, progress: 0 } : s
    case 'SELECT_CHOICE': {
      if (s.planLocked) return s
      const next = { ...s, cacheChoice: a.key }
      return jumpForward(next, STEP.CHOICE, STEPS[STEP.CHOICE].events.length)
    }
    case 'OPEN_EDIT':
      return s.planLocked ? s : { ...s, manualEditing: true, manualDraft: s.step2Text }
    case 'SET_DRAFT':
      return { ...s, manualDraft: a.draft }
    case 'CANCEL_EDIT':
      return { ...s, manualEditing: false }
    case 'SAVE_EDIT': {
      const changed = s.manualDraft.trim() !== s.step2Text.trim()
      const next = {
        ...s,
        manualEditing: false,
        step2Text: changed ? s.manualDraft.trim() : s.step2Text,
        editCount: changed ? s.editCount + 1 : s.editCount,
      }
      return changed ? jumpForward(next, STEP.EDIT, STEPS[STEP.EDIT].events.length) : next
    }
    case 'APPROVE_PLAN': {
      if (s.planLocked || s.cacheChoice === null) return s
      const next = { ...s, planLocked: true, planVersion: s.editCount > 0 ? 2 : 1 }
      return jumpForward(next, STEP.LOCK, STEPS[STEP.LOCK].events.length)
    }
    case 'APPROVE_PR': {
      const next = { ...s, prOpened: true }
      return jumpForward(next, STEP.PR, STEPS[STEP.PR].events.length)
    }
    case 'TOGGLE_SOURCE':
      return { ...s, expandedSource: s.expandedSource === a.id ? null : a.id }
    case 'DISMISS_TOAST':
      return { ...s, toastVisible: false }
    case 'VIEW_IMPACT':
      return { ...s, tab: 'impact', toastVisible: false }
  }
}

interface DemoContextValue {
  state: DemoState
  dispatch: Dispatch<DemoAction>
  reducedMotion: boolean
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const stateRef = useRef(state)
  stateRef.current = state

  /* §B7 — the scheduler: fixed delays only */
  useEffect(() => {
    const def = STEPS[state.stepIdx]
    if (state.progress < def.events.length) {
      if (reducedMotion) {
        // jump to end state instead of animating
        dispatch({ type: 'ADVANCE', keepAutoplay: true })
        return
      }
      const t = window.setTimeout(() => dispatch({ type: 'TICK' }), def.events[state.progress])
      return () => window.clearTimeout(t)
    }
    if (state.autoplay && state.stepIdx < LAST_STEP) {
      const t = window.setTimeout(
        () => dispatch({ type: 'ADVANCE', keepAutoplay: true }),
        def.pauseAfter,
      )
      return () => window.clearTimeout(t)
    }
  }, [state.stepIdx, state.progress, state.autoplay, reducedMotion])

  /* §B2 — keyboard: → / Space advance one beat, R resets */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        dispatch({ type: 'RESET' })
      } else if (e.key === ' ' || e.key === 'ArrowRight') {
        if (stateRef.current.tab !== 'workbench') return
        e.preventDefault()
        if (stateRef.current.stepIdx === STEP.IDLE) dispatch({ type: 'START_PLAN' })
        else dispatch({ type: 'ADVANCE' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* brand retint (§B2): swap the accent variable on <html> */
  useEffect(() => {
    document.documentElement.dataset.brand = state.brand
  }, [state.brand])

  const value = useMemo(
    () => ({ state, dispatch, reducedMotion }),
    [state, reducedMotion],
  )
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo outside DemoProvider')
  return ctx
}

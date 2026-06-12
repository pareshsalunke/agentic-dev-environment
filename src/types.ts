export type Brand = 'efood' | 'glovo' | 'talabat'
export type TabId = 'workbench' | 'playbooks' | 'impact'

export interface ContextSource {
  id: number
  icon: string
  /** short form used on citation chips */
  chip: string
  label: string
  sourceLine: string
  excerpt: string
}

export interface PlanDecisionOption {
  key: 'a' | 'b'
  label: string
  note?: string
  recommended?: boolean
}

export interface PlanStep {
  n: number
  text: string
  cites: number[]
  files: string[]
  decision?: PlanDecisionOption[]
  playbook?: string
}

export type DiffLineKind = 'ctx' | 'add' | 'del'

export interface DiffLine {
  k: DiffLineKind
  s: string
}

export interface ProvenanceTag {
  icon: string
  label: string
}

export interface DiffHunk {
  header: string
  chip: ProvenanceTag
  lines: DiffLine[]
}

export interface DiffFile {
  path: string
  shortPath: string
  planStep: number
  hunks: DiffHunk[]
}

export interface TreeNode {
  name: string
  /** matches DiffFile.shortPath when the file is touched by the change */
  key?: string
  children?: TreeNode[]
}

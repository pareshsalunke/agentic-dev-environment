import type { ContextSource, DiffFile, PlanStep, TreeNode } from '../types'

/* ------------------------------------------------------------------ */
/* Shell microcopy (§B2)                                               */
/* ------------------------------------------------------------------ */

export const SHELL = {
  wordmark: 'Sous',
  subtitle: 'DH Agentic Development Environment',
  pill: 'Runs on your IDE & CLI · Cursor / Claude Code / Copilot + the DH layer',
  demoData: 'demo data',
  avatar: 'PS',
  tabs: [
    { id: 'workbench', label: 'Workbench' },
    { id: 'playbooks', label: 'Playbooks' },
    { id: 'impact', label: 'Adoption & Impact' },
  ] as const,
  brands: [
    { id: 'efood', label: 'eFood', dot: '#E5484D' },
    { id: 'glovo', label: 'Glovo', dot: '#FFC244' },
    { id: 'talabat', label: 'Talabat', dot: '#FF5A00' },
  ] as const,
}

/* ------------------------------------------------------------------ */
/* The ticket (§B3)                                                    */
/* ------------------------------------------------------------------ */

export const TICKET = {
  id: 'DHX-4127',
  title: 'Expose allergen information on menu item details API',
  tags: 'eFood · Menu Platform',
  body: 'EU Reg 1169/2011 requires allergen disclosure for prepared food. Surface allergen data on `GET /menu-items/{id}` for consumer apps. Coordinate with nutrition-svc.',
  cta: 'Plan with Sous',
}

/* ------------------------------------------------------------------ */
/* Beat 1 — context assembly ("mise en place")                         */
/* ------------------------------------------------------------------ */

export const CONTEXT_HEADER = 'Context assembly · "mise en place"'

export const CONTEXT_SOURCES: ContextSource[] = [
  {
    id: 1,
    icon: '🗂',
    chip: 'API Catalog',
    label: 'API Catalog',
    sourceLine: 'menu-items v1 · MenuItemDetailsDto',
    excerpt:
      'GET /v1/menu-items/{id} → name, price, description, dietaryFlags[]. Owner: Menu Platform (eFood).',
  },
  {
    id: 2,
    icon: '📜',
    chip: 'Manifesto §3.2',
    label: 'Engineering Manifesto §3.2',
    sourceLine: 'eng-manifesto › api-evolution · §3.2',
    excerpt:
      'Public API changes must be additive. Breaking changes require a major version and a 90-day deprecation window.',
  },
  {
    id: 3,
    icon: '📐',
    chip: 'ADR-118',
    label: 'ADR-118 · Nutritional & dietary data model',
    sourceLine: 'adr/ADR-118 · accepted',
    excerpt:
      'Allergens modeled as a closed enum of the 14 EU 1169/2011 codes. Source of truth: nutrition-svc.',
  },
  {
    id: 4,
    icon: '💬',
    chip: 'Slack · 12 May',
    label: 'Slack #menu-platform · 12 May',
    sourceLine: '#menu-platform · pinned decision',
    excerpt:
      'Decision (J. Park): allergen data comes from nutrition-svc, not vendor feeds — vendor coverage is 61% and unreliable.',
  },
  {
    id: 5,
    icon: '🚨',
    chip: 'PM-2291',
    label: 'Postmortem PM-2291',
    sourceLine: 'postmortems/PM-2291 · sev-2',
    excerpt:
      'Menu cache served stale dietary flags for 40 min. Open action: invalidate cache on dietary-data changes.',
  },
  {
    id: 6,
    icon: '👤',
    chip: 'CODEOWNERS',
    label: 'CODEOWNERS',
    sourceLine: 'menu-service/CODEOWNERS',
    excerpt: '`menu-service` → @maria.k, @menu-platform-core.',
  },
]

export const CONTEXT_FOOTER =
  '6 sources · permission-scoped to you · freshness checked 11 Jun'

/* ------------------------------------------------------------------ */
/* Beat 2 — plan proposal and the human edit (the Plan Gate)           */
/* ------------------------------------------------------------------ */

export const PLAN = {
  proposedHeader: 'Proposed plan · 5 steps',
  lockedHeader: (version: number, edits: number) =>
    `Plan locked · v${version} · ${edits} human edit${edits === 1 ? '' : 's'}`,
  approve: 'Approve plan',
  approveHint: 'Resolve the step-4 decision first',
}

export const PLAN_STEP2_PREFIX =
  'Populate from nutrition-svc client per platform decision; '
export const PLAN_STEP2_ORIGINAL_TAIL =
  'if nutrition data unavailable → return empty list'
export const PLAN_STEP2_EDITED_TAIL =
  "if nutrition data unavailable → set `allergenInfoAvailable=false`; never return an empty list that implies 'no allergens'."

export const PLAN_STEPS: PlanStep[] = [
  {
    n: 1,
    text: 'Extend `MenuItemDetailsDto` with `allergens: List<AllergenCode>` (additive — Manifesto §3.2)',
    cites: [1, 2],
    files: ['dto/MenuItemDetailsDto.kt'],
  },
  {
    n: 2,
    text: PLAN_STEP2_PREFIX + '**' + PLAN_STEP2_ORIGINAL_TAIL + '**',
    cites: [3, 4],
    files: ['service/MenuItemService.kt'],
  },
  {
    n: 3,
    text: 'Expose on `GET /v2/menu-items/{id}` (additive minor bump); update OpenAPI spec',
    cites: [1, 2],
    files: ['api/MenuItemController.kt', 'openapi/menu-items.yaml'],
  },
  {
    n: 4,
    text: '⚠ **Needs your decision** — cache invalidation:',
    cites: [5],
    files: ['cache/MenuCacheInvalidator.kt'],
    decision: [
      {
        key: 'a',
        label: 'event-driven bust on `DietaryDataChanged`',
        note: 'recommended; closes PM-2291 action',
        recommended: true,
      },
      { key: 'b', label: '5-min TTL' },
    ],
  },
  {
    n: 5,
    text: 'Tests: contract test for v2 schema, mapper unit tests, cache-invalidation test',
    cites: [],
    files: ['test/MenuItemServiceTest.kt'],
    playbook: 'Add API field v1.3',
  },
]

/* ------------------------------------------------------------------ */
/* Beat 3 — execution: verified diffs with provenance                  */
/* ------------------------------------------------------------------ */

export const DIFF_FILES: DiffFile[] = [
  {
    path: 'src/main/kotlin/dto/MenuItemDetailsDto.kt',
    shortPath: 'dto/MenuItemDetailsDto.kt',
    planStep: 1,
    hunks: [
      {
        header: '@@ -1,13 +1,23 @@',
        chip: { icon: '📐', label: 'per ADR-118 + your plan edit' },
        lines: [
          { k: 'ctx', s: 'package com.deliveryhero.efood.menu.dto' },
          { k: 'ctx', s: '' },
          { k: 'add', s: 'import com.deliveryhero.efood.nutrition.contract.AllergenCode' },
          { k: 'add', s: '' },
          { k: 'ctx', s: '/**' },
          { k: 'ctx', s: ' * Public payload for GET /menu-items/{id}.' },
          { k: 'del', s: ' * v1 — additive changes only (Manifesto §3.2).' },
          { k: 'add', s: ' * v2 — additive changes only (Manifesto §3.2).' },
          { k: 'add', s: ' * Allergens follow ADR-118: the closed enum of the 14 EU' },
          { k: 'add', s: ' * 1169/2011 codes. Source of truth: nutrition-svc.' },
          { k: 'ctx', s: ' */' },
          { k: 'ctx', s: 'data class MenuItemDetailsDto(' },
          { k: 'ctx', s: '    val id: String,' },
          { k: 'ctx', s: '    val name: String,' },
          { k: 'ctx', s: '    val description: String?,' },
          { k: 'ctx', s: '    val price: MoneyDto,' },
          { k: 'ctx', s: '    val dietaryFlags: List<String> = emptyList(),' },
          { k: 'add', s: '    // Only meaningful when allergenInfoAvailable = true. Missing' },
          { k: 'add', s: '    // nutrition data must read as "unknown", never "no allergens"' },
          { k: 'add', s: '    // (plan v2 · human edit).' },
          { k: 'add', s: '    val allergens: List<AllergenCode> = emptyList(),' },
          { k: 'add', s: '    val allergenInfoAvailable: Boolean = false,' },
          { k: 'ctx', s: ')' },
        ],
      },
    ],
  },
  {
    path: 'src/main/kotlin/service/MenuItemService.kt',
    shortPath: 'service/MenuItemService.kt',
    planStep: 2,
    hunks: [
      {
        header: '@@ -24,12 +24,31 @@',
        chip: { icon: '💬', label: 'per Slack decision 12 May' },
        lines: [
          { k: 'ctx', s: '@Service' },
          { k: 'ctx', s: 'class MenuItemService(' },
          { k: 'ctx', s: '    private val menuItemRepository: MenuItemRepository,' },
          { k: 'add', s: '    private val nutritionClient: NutritionServiceClient,' },
          { k: 'ctx', s: '    private val menuItemMapper: MenuItemMapper,' },
          { k: 'ctx', s: ') {' },
          { k: 'ctx', s: '' },
          { k: 'del', s: '    fun getMenuItemDetails(id: MenuItemId): MenuItemDetailsDto {' },
          { k: 'del', s: '        val item = menuItemRepository.findById(id)' },
          { k: 'del', s: '            ?: throw MenuItemNotFoundException(id)' },
          { k: 'del', s: '        return menuItemMapper.toDetailsDto(item)' },
          { k: 'del', s: '    }' },
          { k: 'add', s: '    fun getMenuItemDetails(id: MenuItemId): MenuItemDetailsDto {' },
          { k: 'add', s: '        val item = menuItemRepository.findById(id)' },
          { k: 'add', s: '            ?: throw MenuItemNotFoundException(id)' },
          { k: 'add', s: '        val allergenData = fetchAllergenData(item)' },
          { k: 'add', s: '        return menuItemMapper.toDetailsDto(item, allergenData)' },
          { k: 'add', s: '    }' },
          { k: 'add', s: '' },
          { k: 'add', s: '    // Allergen source of truth is nutrition-svc, not vendor feeds' },
          { k: 'add', s: '    // (#menu-platform decision, 12 May — vendor coverage is 61%).' },
          { k: 'add', s: '    private fun fetchAllergenData(item: MenuItem): AllergenData =' },
          { k: 'add', s: '        try {' },
          { k: 'add', s: '            val response = nutritionClient.getAllergens(item.skuId)' },
          { k: 'add', s: '            AllergenData(' },
          { k: 'add', s: '                allergens = response.allergenCodes,' },
          { k: 'add', s: '                available = true,' },
          { k: 'add', s: '            )' },
          { k: 'add', s: '        } catch (ex: NutritionServiceException) {' },
          { k: 'add', s: '            log.warn("nutrition-svc unavailable for sku={}", item.skuId, ex)' },
          { k: 'add', s: '            // Plan v2 (human edit): missing data is "unknown" — never' },
          { k: 'add', s: '            // an empty list that implies "no allergens".' },
          { k: 'add', s: '            AllergenData(allergens = emptyList(), available = false)' },
          { k: 'add', s: '        }' },
          { k: 'ctx', s: '}' },
        ],
      },
    ],
  },
  {
    path: 'src/main/kotlin/api/MenuItemController.kt',
    shortPath: 'api/MenuItemController.kt',
    planStep: 3,
    hunks: [
      {
        header: '@@ -18,9 +18,17 @@',
        chip: { icon: '📜', label: 'per Manifesto §3.2' },
        lines: [
          { k: 'ctx', s: '@RestController' },
          { k: 'ctx', s: 'class MenuItemController(' },
          { k: 'ctx', s: '    private val menuItemService: MenuItemService,' },
          { k: 'ctx', s: ') {' },
          { k: 'ctx', s: '' },
          { k: 'ctx', s: '    @GetMapping("/v1/menu-items/{id}")' },
          { k: 'ctx', s: '    fun getMenuItemV1(@PathVariable id: String): MenuItemDto =' },
          { k: 'ctx', s: '        menuItemService.getMenuItem(MenuItemId(id))' },
          { k: 'add', s: '' },
          { k: 'add', s: '    /**' },
          { k: 'add', s: '     * v2 — additive minor bump per Manifesto §3.2: adds allergens' },
          { k: 'add', s: '     * and allergenInfoAvailable. v1 stays untouched, no deprecation.' },
          { k: 'add', s: '     */' },
          { k: 'add', s: '    @GetMapping("/v2/menu-items/{id}")' },
          { k: 'add', s: '    fun getMenuItemDetailsV2(@PathVariable id: String): MenuItemDetailsDto =' },
          { k: 'add', s: '        menuItemService.getMenuItemDetails(MenuItemId(id))' },
          { k: 'ctx', s: '}' },
        ],
      },
    ],
  },
  {
    path: 'openapi/menu-items.yaml',
    shortPath: 'openapi/menu-items.yaml',
    planStep: 3,
    hunks: [
      {
        header: '@@ -41,6 +41,19 @@',
        chip: { icon: '📜', label: 'per Manifesto §3.2' },
        lines: [
          { k: 'ctx', s: 'paths:' },
          { k: 'ctx', s: '  /v1/menu-items/{id}:' },
          { k: 'ctx', s: '    get:' },
          { k: 'ctx', s: '      operationId: getMenuItemV1' },
          { k: 'ctx', s: '      responses:' },
          { k: 'ctx', s: "        '200': { $ref: '#/components/responses/MenuItemV1' }" },
          { k: 'add', s: '  /v2/menu-items/{id}:' },
          { k: 'add', s: '    get:' },
          { k: 'add', s: '      summary: Menu item details incl. allergen disclosure (EU 1169/2011)' },
          { k: 'add', s: '      operationId: getMenuItemDetailsV2' },
          { k: 'add', s: '      parameters:' },
          { k: 'add', s: "        - $ref: '#/components/parameters/MenuItemId'" },
          { k: 'add', s: '      responses:' },
          { k: 'add', s: "        '200':" },
          { k: 'add', s: '          description: Menu item details (v2, additive on v1)' },
          { k: 'add', s: '          content:' },
          { k: 'add', s: '            application/json:' },
          { k: 'add', s: '              schema:' },
          { k: 'add', s: "                $ref: '#/components/schemas/MenuItemDetailsV2'" },
        ],
      },
      {
        header: '@@ -74,3 +87,20 @@',
        chip: { icon: '📜', label: 'per Manifesto §3.2' },
        lines: [
          { k: 'ctx', s: 'components:' },
          { k: 'ctx', s: '  schemas:' },
          { k: 'ctx', s: '    MenuItemDetails:' },
          { k: 'add', s: '    AllergenCode:' },
          { k: 'add', s: '      type: string' },
          { k: 'add', s: '      description: Closed enum of the 14 EU 1169/2011 codes (ADR-118)' },
          { k: 'add', s: '      enum: [GLUTEN, CRUSTACEANS, EGGS, FISH, PEANUTS, SOYBEANS, MILK,' },
          { k: 'add', s: '             NUTS, CELERY, MUSTARD, SESAME, SULPHITES, LUPIN, MOLLUSCS]' },
          { k: 'add', s: '    MenuItemDetailsV2:' },
          { k: 'add', s: '      allOf:' },
          { k: 'add', s: "        - $ref: '#/components/schemas/MenuItemDetails'" },
          { k: 'add', s: '        - type: object' },
          { k: 'add', s: '          required: [allergens, allergenInfoAvailable]' },
          { k: 'add', s: '          properties:' },
          { k: 'add', s: '            allergens:' },
          { k: 'add', s: '              type: array' },
          { k: 'add', s: "              items: { $ref: '#/components/schemas/AllergenCode' }" },
          { k: 'add', s: '            allergenInfoAvailable:' },
          { k: 'add', s: '              type: boolean' },
          { k: 'add', s: '              description: false ⇒ allergen data unknown — not "no allergens"' },
        ],
      },
    ],
  },
  {
    path: 'src/main/kotlin/cache/MenuCacheInvalidator.kt',
    shortPath: 'cache/MenuCacheInvalidator.kt',
    planStep: 4,
    hunks: [
      {
        header: '@@ -7,9 +7,22 @@',
        chip: { icon: '🚨', label: 'closes PM-2291 action' },
        lines: [
          { k: 'ctx', s: '@Component' },
          { k: 'ctx', s: 'class MenuCacheInvalidator(' },
          { k: 'ctx', s: '    private val menuCache: MenuCache,' },
          { k: 'add', s: '    private val meterRegistry: MeterRegistry,' },
          { k: 'ctx', s: ') {' },
          { k: 'ctx', s: '' },
          { k: 'ctx', s: '    fun invalidate(menuItemId: MenuItemId) {' },
          { k: 'ctx', s: '        menuCache.evict(menuItemId)' },
          { k: 'ctx', s: '    }' },
          { k: 'add', s: '' },
          { k: 'add', s: '    /**' },
          { k: 'add', s: '     * Event-driven invalidation on dietary-data changes — plan step 4,' },
          { k: 'add', s: '     * option (a). Closes the open action from PM-2291 (menu cache' },
          { k: 'add', s: '     * served stale dietary flags for 40 min).' },
          { k: 'add', s: '     */' },
          { k: 'add', s: '    @KafkaListener(topics = ["nutrition.dietary-data-changed"])' },
          { k: 'add', s: '    fun onDietaryDataChanged(event: DietaryDataChanged) {' },
          { k: 'add', s: '        val evicted = menuCache.evictBySku(event.skuId)' },
          { k: 'add', s: '        meterRegistry.counter("menu_cache.dietary_invalidations").increment()' },
          { k: 'add', s: '        log.info("Evicted {} menu items after dietary change, sku={}", evicted, event.skuId)' },
          { k: 'add', s: '    }' },
          { k: 'ctx', s: '}' },
        ],
      },
    ],
  },
  {
    path: 'src/test/kotlin/MenuItemServiceTest.kt',
    shortPath: 'test/MenuItemServiceTest.kt',
    planStep: 5,
    hunks: [
      {
        header: '@@ -38,3 +38,29 @@',
        chip: { icon: '📘', label: 'playbook: Add API field v1.3' },
        lines: [
          { k: 'ctx', s: 'class MenuItemServiceTest {' },
          { k: 'ctx', s: '' },
          { k: 'add', s: '    @Test' },
          { k: 'add', s: '    fun `returns allergens when nutrition data present`() {' },
          { k: 'add', s: '        nutritionStub.returns(sku = SKU, codes = listOf(GLUTEN, MILK))' },
          { k: 'add', s: '        val dto = service.getMenuItemDetails(ITEM_ID)' },
          { k: 'add', s: '        assertThat(dto.allergens).containsExactly(GLUTEN, MILK)' },
          { k: 'add', s: '        assertThat(dto.allergenInfoAvailable).isTrue()' },
          { k: 'add', s: '    }' },
          { k: 'add', s: '' },
          { k: 'add', s: '    @Test' },
          { k: 'add', s: '    fun `availability=false when nutrition-svc down`() {' },
          { k: 'add', s: '        nutritionStub.failsWith(NutritionServiceException("503"))' },
          { k: 'add', s: '        val dto = service.getMenuItemDetails(ITEM_ID)' },
          { k: 'add', s: '        // Human plan edit: unknown must never read as "no allergens".' },
          { k: 'add', s: '        assertThat(dto.allergens).isEmpty()' },
          { k: 'add', s: '        assertThat(dto.allergenInfoAvailable).isFalse()' },
          { k: 'add', s: '    }' },
          { k: 'add', s: '' },
          { k: 'add', s: '    @Test' },
          { k: 'add', s: '    fun `cache busts on DietaryDataChanged`() {' },
          { k: 'add', s: '        events.publish(DietaryDataChanged(sku = SKU))' },
          { k: 'add', s: '        verify(menuCache).evictBySku(SKU)' },
          { k: 'add', s: '    }' },
          { k: 'add', s: '' },
          { k: 'add', s: '    @Test' },
          { k: 'add', s: '    fun `v2 contract matches OpenAPI schema`() {' },
          { k: 'add', s: '        contractValidator.assertConforms("/v2/menu-items/{id}")' },
          { k: 'add', s: '    }' },
          { k: 'ctx', s: '}' },
        ],
      },
    ],
  },
]

export function diffCounts(file: DiffFile): { adds: number; dels: number } {
  let adds = 0
  let dels = 0
  for (const h of file.hunks) {
    for (const l of h.lines) {
      if (l.k === 'add') adds++
      if (l.k === 'del') dels++
    }
  }
  return { adds, dels }
}

/** The pre-change DTO file shown in the editor before Beat 3. */
export const EDITOR_FILE = {
  name: 'MenuItemDetailsDto.kt',
  lines: DIFF_FILES[0].hunks[0].lines
    .filter((l) => l.k !== 'add')
    .map((l) => l.s),
}

/* ------------------------------------------------------------------ */
/* Beat 3 — checks (right rail)                                        */
/* ------------------------------------------------------------------ */

export const CHECKS = {
  header: 'Verification',
  tests: {
    label: 'Tests',
    total: 14,
    samples: [
      'returns allergens when nutrition data present',
      'availability=false when nutrition-svc down',
      'cache busts on DietaryDataChanged',
    ],
  },
  policy: [
    'Manifesto §3.2 additive',
    'Secrets',
    'PII: none (product data)',
    'OSS license',
    'Coverage 78.4% → 80.1%',
  ],
  risk: {
    label: 'Risk',
    level: 'MEDIUM',
    tooltip:
      'touches cache path from PM-2291; mitigated by event-driven invalidation + contract test',
  },
}

/* ------------------------------------------------------------------ */
/* Beat 4 — review and PR                                              */
/* ------------------------------------------------------------------ */

export const REVIEW = {
  caption: 'Grouped by intent (plan step) — not by file',
  requestChanges: 'Request changes',
  approvePr: 'Approve & open PR',
}

export const PR = {
  title: 'feat(menu): expose allergen info on menu item details (v2, additive)',
  number: '#8841',
  base: 'main',
  reviewersLabel: 'Reviewers (from CODEOWNERS):',
  reviewers: ['@maria.k', '@menu-platform-core'],
  provenanceLabel: '🤖 AI provenance:',
  provenance:
    'Planned by Sous v0.9 · plan human-edited (1 change: missing-data semantics) · 182 LoC agent-authored across 5 files · all checks passed · approved by P. Salunke',
}

/* ------------------------------------------------------------------ */
/* Beat 5 — impact tick (P1)                                           */
/* ------------------------------------------------------------------ */

export const TOAST = {
  text: 'AI-guided unit of work logged · DHX-4127 · est. 2.6h saved vs. baseline',
  link: 'View in Adoption & Impact',
}

/* ------------------------------------------------------------------ */
/* Left rail — repo file tree (menu-service, Kotlin/Spring)            */
/* ------------------------------------------------------------------ */

export const FILE_TREE: TreeNode = {
  name: 'menu-service',
  children: [
    {
      name: 'src/main/kotlin',
      children: [
        { name: 'api', children: [{ name: 'MenuItemController.kt', key: 'api/MenuItemController.kt' }] },
        { name: 'cache', children: [{ name: 'MenuCacheInvalidator.kt', key: 'cache/MenuCacheInvalidator.kt' }] },
        { name: 'client', children: [{ name: 'NutritionServiceClient.kt' }] },
        {
          name: 'dto',
          children: [
            { name: 'MenuItemDetailsDto.kt', key: 'dto/MenuItemDetailsDto.kt' },
            { name: 'MenuItemDto.kt' },
            { name: 'MoneyDto.kt' },
          ],
        },
        {
          name: 'service',
          children: [
            { name: 'MenuItemMapper.kt' },
            { name: 'MenuItemService.kt', key: 'service/MenuItemService.kt' },
          ],
        },
      ],
    },
    {
      name: 'src/test/kotlin',
      children: [{ name: 'MenuItemServiceTest.kt', key: 'test/MenuItemServiceTest.kt' }],
    },
    { name: 'openapi', children: [{ name: 'menu-items.yaml', key: 'openapi/menu-items.yaml' }] },
    { name: 'build.gradle.kts' },
    { name: 'CODEOWNERS' },
  ],
}

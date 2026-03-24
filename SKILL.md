---
name: screenshot-analysis
description: "Structured analysis of UI screenshots: spatial decomposition, element inventory, design tokens, layout architecture, and interaction mapping. Trigger on any image of a digital interface (website, app, dashboard, mockup, wireframe) whether user-uploaded or Claude-captured during computer use. Also trigger on 'analyse this screenshot,' 'rebuild this,' 'match this design,' 'what's wrong with this layout,' 'clone this,' or when a user drops an image with no instructions. Skip for non-UI images (photos, memes, charts) unless the user explicitly wants to build a UI from them."
---

# Screenshot analysis

When an LLM looks at a screenshot and tries to go directly from pixels to code (or feedback or a description), it loses spatial relationships, misreads component hierarchy, and hallucinates design details. The research behind Microsoft OmniParser, DCGen, and Replit's visual verification loop all converge on the same fix: build a structured intermediate representation between "seeing the image" and "responding about it." That intermediate layer is what this skill provides.

The skill has three layers of intelligence: knowing when NOT to run, choosing HOW to run (analytical vs qualitative vs blended), and choosing HOW MUCH to run (which steps, at what depth).

## Gate check

Not every image needs this skill. Running a full UI analysis on a photo of someone's dog wastes context and confuses the response.

**Ask two questions before doing anything:**

1. Is this image a digital interface? (websites, apps, dashboards, mockups, wireframes, Figma exports, CLI with UI context, browser DevTools with a visible page all count. Photos, memes, standalone charts, presentation slides, documents, handwritten notes do not.)

2. Is the conversation about building, debugging, designing, or evaluating UI?

**Four outcomes:**

- Both no: exit the skill entirely. Respond normally. Don't mention this framework.
- Image is not a UI, but the conversation IS about building UI (e.g. "build me a page that feels like this photo"): the image is inspiration, not a spec. Use qualitative mode only.
- Image IS a UI, but the conversation is not about building (e.g. "what app is this?"): do a quick spatial read (step 1 only), then answer their actual question.
- Both yes: proceed with the pipeline. Choose mode and depth based on context.

The gate check exists because a skill that runs when it shouldn't is worse than a skill that occasionally misses. False positives erode trust faster than false negatives.

## Mode selection

There are two lenses for looking at a screenshot. The skill should choose one, or blend both, based on what the conversation needs. Getting this right matters because the same screenshot described in the wrong mode produces useless output. An engineer trying to clone a layout doesn't need to hear about "visual tension." A founder asking "does this feel premium?" doesn't need hex values for every border.

### Analytical mode (engineer lens)

Precise, measurable, implementation-ready. Hex values, pixel estimates, component types, layout patterns, spacing systems.

Use when: rebuilding/cloning UI, debugging layout, comparing expected vs actual output, extracting design tokens, Claude verifying its own code via screenshot.

### Qualitative mode (designer lens)

Perceptual, emotional, holistic. How the design feels, what it communicates, where visual tension or harmony lives.

Use when: design critique ("does this look good?"), non-UI image used as inspiration, exploring aesthetics or brand alignment, the question is about quality rather than accuracy.

Qualitative mode covers: visual weight distribution (where the eye goes), emotional tone (premium, playful, corporate, clinical, chaotic, calm), hierarchy clarity (is the reading order obvious?), breathing room (spacious and confident or cramped and anxious?), consistency (intentional system or patchwork?), brand signal (what kind of product does this suggest?), friction points (where would a user hesitate?), delight moments (what feels polished or surprising?).

### Blended mode

For "rebuild this but better" or "match this vibe" requests, lead with qualitative (what's working, what it communicates, where it falls short), then ground each observation in analytical specifics (the exact spacing, color, or type choices causing those perceptions). This order matters because it mirrors how a senior designer thinks: feel first, then investigate why.

## Dynamic step execution

Running all five analysis steps on every screenshot is like running a full test suite for a typo fix. The skill should scale its effort to match the moment.

**Why this matters:** in a fast iteration loop where the user is sending screenshots every 30 seconds, a full five-step analysis kills momentum. During a detailed clone request, skipping steps produces sloppy output. The skill needs to read the room.

### The five steps

1. **Spatial decomposition**: divide the screen into a 3x3 grid, identify what section lives in each region, note dimensions and relationships between sections. This is the cheapest step and almost always worth running. It anchors everything else.

2. **Element inventory**: for every visible element, capture type, label, position, state, size, colors, border, shadow, icons. Group by section. This is the most expensive step. Skip or compress it when the user only needs high-level feedback, or when Claude is doing a quick self-verification.

3. **Design system extraction**: infer the color palette, typography scale, spacing pattern, border radius pattern, and overall density. Worth running for any implementation or critique task. Skip for quick verifications.

4. **Layout architecture**: identify CSS layout patterns (flex, grid, columns), container constraints, responsive breakpoint, scroll behavior, z-index layers. Only needed for implementation tasks.

5. **Interaction map**: identify primary CTA, navigation pattern, form grouping, data display patterns, visible states. Useful for implementation and UX critique. Skip for pure visual feedback.

### Step routing

| Context | Run these | Skip/compress these |
|---------|-----------|-------------------|
| Rebuild/clone this UI | All 5, full depth, analytical | None |
| What's wrong with this? | 1, 3, 5 + qualitative lead | 2 (only flag problem elements), 4 |
| Claude verifying its own output | 1, 5 (internal, concise) | 2, 3, 4 unless something looks off |
| Design critique / "does this look good?" | 1, 3 + qualitative primary | 2, 4, 5 |
| Non-UI inspiration image | Qualitative only | All analytical steps |
| Extract color palette / tokens | 3 only, full depth | Everything else |
| Compare two screenshots | 1, 2, 3 on both, then diff | 4, 5 unless relevant |
| Quick mid-build check ("does this look right?") | 1 quick scan | Everything else unless something is off |
| What component library is this? | 2, 3 | 1, 4, 5 |

When ambiguous, err toward running more steps rather than fewer. But if the user is in a rapid back-and-forth, compress to the minimum that keeps the conversation moving.

## Step details

### Step 1: spatial decomposition

Divide the screenshot into a 3x3 grid. For each occupied region: what section lives there (nav, hero, sidebar, content, footer, modal, drawer), its approximate size relative to viewport ("full-width, ~60px tall"), and how it relates to neighbors ("sidebar pushes content right"). Output as a layout map.

### Step 2: element inventory

For each visible element, capture: type (button, input, card, image, icon, text, link, toggle, dropdown, tab, badge, avatar, table, chart, etc.), label/content (exact visible text), position (grid region + relative placement), state (default, hover, active, disabled, selected, error, loading, focused), size (sm/md/lg or pixel estimate), background color (hex), text color (hex), border (visible/none + radius: none/sm 2-4px/md 6-8px/lg 12px/pill), shadow (none/sm/md/lg), icon if present. Group by section from step 1.

When compressing: only inventory elements relevant to the user's question or elements that look problematic.

### Step 3: design system extraction

**Colors:** page bg, card/surface bg, primary action, secondary, text primary, text secondary/muted, border/divider, accent, destructive (if visible), success (if visible). Use hex values in analytical mode. In qualitative mode, describe the color's character with the hex in parentheses.

**Typography:** heading style (size in px, weight, case), body text (size, weight, line-height feel), caption/small text, font family if identifiable (name or category).

**Spacing and shape:** spacing pattern (tight 4-8px / comfortable 12-16px / spacious 24-32px+), border radius pattern (sharp 0-2px / subtle 4-6px / rounded 8-12px / pill), overall density (compact / comfortable / spacious).

### Step 4: layout architecture

Page layout (single column, sidebar+content, dashboard grid, centered container, full-bleed), content layout per section (flex row, flex column, css grid with column count, stack, masonry), container width (max-width constrained vs full-width), responsive context (mobile <640px / tablet 640-1024px / desktop >1024px), scroll clues (content cut off, sticky header, fixed bottom bar), z-index layers (overlays, modals, dropdowns, toasts).

### Step 5: interaction map

Primary CTA (the single most important action), secondary actions, navigation pattern (top nav, side nav, tabs, breadcrumbs, bottom bar), form elements and grouping, data display patterns (tables, card grids, lists), visible states (loading, empty, error, success).

## Output formatting

Match the output structure to the context. Don't force headers and sections when a paragraph will do.

**Full analysis** (rebuild/clone): use all five section headers (layout map, element inventory, design tokens, layout architecture, interaction map) plus implementation notes.

**Design critique** (qualitative-led): overall impression, what's working, what needs attention. Ground each observation analytically.

**Quick verification** (mid-build): a brief paragraph. What matches expectations, what doesn't. No headers needed.

**Comparison** (two screenshots): differences, what improved, what regressed, what needs to change.

## Core principles

**Be specific in whatever mode you're in.** "A dashboard with some cards" is never acceptable. In analytical mode: "3-column grid, ~280px cards, #F9FAFB bg, 8px radius, subtle shadow." In qualitative mode: "the cards feel weightless, almost floating, which works for monitoring but would feel insubstantial for a financial product." Both are specific. Both are useful. Vague is never useful.

**Hex over color names, pixels over vague sizes.** Say #3B82F6 not "blue." Say ~16px not "some." If uncertain, give your best estimate and note it.

**Group by section, not by element type.** The nav's elements belong together. Don't lump all buttons across the page into one list.

**Call out the non-obvious.** Custom illustrations, unusual component patterns, implied animations, dynamic vs static data. These are the things that break implementations.

**Match the user's pace.** Rapid iteration loop = concise. Exploring design direction = expansive. Debugging = diagnostic. The framework is the thinking tool, not the mandatory output format.

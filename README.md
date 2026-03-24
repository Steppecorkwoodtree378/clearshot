# Screenshot Analysis Skill for Claude Code

**The problem:** When you give an AI a screenshot, it doesn't *really* see it. It gives you a surface-level description — "a dashboard with some cards" — and agrees with whatever you say. It won't notice the misaligned button, the inconsistent spacing, or the wrong border radius until you explicitly point it out. The AI is looking, but it's not *analyzing*.

**The fix:** A structured intermediate representation between "seeing the image" and "responding about it." This is what every production screenshot-to-code system does — Lovable, Replit, Microsoft OmniParser, Google ScreenAI — and what's missing from the default LLM experience.

This repo packages that fix as an installable Claude Code skill.

## Quick Install

```bash
# From your project directory
claude skill install udayanwalvekar/screenshot-analysis
```

Or manually: copy `SKILL.md` into your `.claude/skills/screenshot-analysis/` directory.

## What It Does

When you drop a screenshot into Claude Code, instead of a vague description, the skill forces a structured analysis pipeline:

1. **Gate check** — Is this even a UI screenshot? Is the conversation about building UI? Exit early if not.
2. **Mode selection** — Analytical (engineer lens: hex codes, pixel measurements, component types) vs Qualitative (designer lens: visual weight, emotional tone, hierarchy clarity) vs Blended.
3. **Dynamic step execution** — Not every screenshot needs all 5 steps. Quick mid-build checks get step 1 only. Full clone requests get everything.

### The Five Steps

| Step | What | When to run |
|------|------|-------------|
| 1. Spatial decomposition | 3x3 grid mapping of page sections | Almost always |
| 2. Element inventory | Every element: type, label, position, state, colors, borders, shadows | Clone/rebuild tasks |
| 3. Design system extraction | Color palette, typography scale, spacing patterns | Implementation + critique |
| 4. Layout architecture | CSS layout patterns, container constraints, responsive context | Implementation only |
| 5. Interaction map | CTAs, navigation, forms, data patterns, visible states | Implementation + UX critique |

The skill routes automatically based on context:

- **"Rebuild this"** → all 5 steps, full depth, analytical mode
- **"Does this look good?"** → steps 1, 3 + qualitative mode
- **"What's wrong?"** → steps 1, 3, 5 + flag only problem elements
- **Quick mid-build check** → step 1 scan only
- **Non-UI inspiration image** → qualitative only, skip all analytical steps

## Research: How Production Tools Actually Handle Screenshots

### The Core Insight

Every production screenshot-to-code tool converges on the same principle: **don't go from pixels to code in one step.** Insert a structured intermediate layer between the image and the response.

### Microsoft OmniParser

The closest to what you'd imagine as "X/Y coordinate mapping with pixel analysis":

1. **YOLOv8 detection model** (fine-tuned on 67K UI screenshots with bounding boxes from actual DOM trees) scans and identifies every interactable element
2. **Set-of-Marks** overlays numbered bounding boxes on detected elements for precise action mapping
3. **OCR** extracts all text content, merging overlapping text/icon bounding boxes
4. **Captioning model** (fine-tuned BLIP-2/Florence) generates functional descriptions — not "circle with three dots" but "more-options menu button"
5. Final output: annotated screenshot (numbered boxes visible) + structured text mapping each box ID to coordinates, type, and semantic description

**Result:** OmniParser improved GPT-4V accuracy from 70.5% to 93.8%. That's the delta between "just look at this" and "here's structured spatial + semantic annotations."

- [OmniParser paper](https://arxiv.org/html/2408.00203v1)
- [GitHub](https://github.com/microsoft/OmniParser)

### DCGen (Academic State-of-the-Art)

Divide-and-conquer approach:

1. Takes a full screenshot and recursively subdivides using separation line detection
2. Alternates between horizontal and vertical cuts, creating a hierarchical tree
3. Each leaf node gets a red bounding box specifying the region to focus on
4. Vision model describes each bounded region independently
5. Parent segments aggregate children's descriptions
6. Final generation model produces complete UI code from combined hierarchy

**Key insight:** The LLM never processes the entire complex page at once. Small, bounded regions with explicit spatial context → merged descriptions.

- [DCGen paper](https://arxiv.org/html/2406.16386v1)

### Replit

Different approach — operates in a feedback loop with a live browser:

1. Agent periodically screenshots the running app using a headless browser
2. Generates a structured report comparing actual vs intended state
3. Fixes issues iteratively in a loop
4. Multi-agent architecture includes a **verifier agent** that interacts with the app, takes screenshots, runs static checks, validates progress
5. For design: sends screenshot to Gemini for analysis, returns breakdown of typography, color palette, layout, and visual hierarchy

### Lovable

Uses vision models with structured prompting for component-level analysis, focusing on design token extraction and component hierarchy mapping before code generation.

### Google ScreenAI

Trained specifically for UI and visually-situated language understanding. Combines layout understanding with visual question answering on screen content.

- [ScreenAI blog](https://research.google/blog/screenai-a-visual-language-model-for-ui-and-visually-situated-language-understanding/)

### ui-screenshot-to-prompt (Open Source)

Accessible pipeline that does:

1. Computer vision-based component detection
2. OCR text extraction
3. Grid-based image analysis for spatial relationships
4. Each detected region sent to vision model independently
5. Second LLM pass synthesizes regional descriptions into implementation brief

- [GitHub](https://github.com/nicepkg/ui-screenshot-to-prompt)

## The Principle

The fundamental principle across every tool: **don't ask the model to go from pixels to code in one step.** Insert a structured intermediate representation — spatial coordinates, semantic labels, hierarchical layout — between the image and the code generation. That intermediate layer is what separates "basic description" from "pixel-accurate implementation."

## What You Can Do Right Now (Without This Skill)

Five techniques that work even without the skill installed:

1. **Grid-slice the screenshot.** Crop into regions before sending. Tell the AI: "This is the top-left section. Describe every UI element: position, type, content, approximate size."

2. **Give a schema up front.** Instead of "look at this," try: "Produce a JSON with: page_layout, sections (array of {position, type, children}), color_palette (hex), typography, spacing_pattern, interactive_elements."

3. **Chain two passes.** First: "Describe every visual element with spatial position, size, color, text. Be exhaustive." Second: "Using this description, generate the implementation."

4. **Annotate before sending.** Draw numbered boxes around key components in Figma before sending. This is the Set-of-Marks technique that boosted OmniParser's results by 23 percentage points.

5. **Divide and conquer.** For complex pages, crop each section, send individually with positional context ("this is the hero section, full-width, top of page"), collect descriptions, then synthesize.

## Skill Design Principles

This skill follows Anthropic's recommended skill architecture:

- **Progressive disclosure**: ~80 word description (always in context) → SKILL.md body loaded on trigger (137 lines, under 500 limit)
- **WHY-driven writing**: explains reasoning, not just directives — Claude follows reasoning better than checklists
- **Smart triggering**: aggressive on UI screenshots, explicit exit for non-UI content
- **Dynamic execution**: scales effort to match the moment, not a rigid pipeline

## License

MIT

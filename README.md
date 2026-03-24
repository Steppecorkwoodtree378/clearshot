# 📸 Clearshot

**Structured screenshot intelligence for AI coding tools.**

Your AI looks at a screenshot and sees "a dashboard with some cards." Clearshot makes it see the 14px/16px type mismatch, the 6px padding where 8px should be, the border-radius inconsistency on the third card, and the broken visual hierarchy in the nav.

<!-- TODO: demo gif here -->

---

## The Problem

Every AI coding tool has the same blind spot. Paste a screenshot, ask it to rebuild or critique, and it produces a surface-level description. It agrees with whatever you say. It won't catch spatial problems, design system violations, or layout bugs until you explicitly point them out.

This isn't a model intelligence problem. It's a pipeline problem. The AI goes from raw pixels to code in one cognitive leap and drops details every time. The result: 3-5 extra correction rounds per screenshot interaction.

## How Clearshot Fixes It

Clearshot inserts a structured analysis layer between the screenshot and the AI's response. Instead of "look at this image and figure it out," the AI gets spatial coordinates, component inventories, design tokens, and layout architecture before generating anything.

This is the same approach used internally by Replit, Lovable, and Microsoft's OmniParser (which improved GPT-4V accuracy from 70.5% to 93.8%). Clearshot makes that intelligence available to everyone as an installable skill.

## Install

```bash
# clone into your claude code skills directory
git clone https://github.com/udayanwalvekar/clearshot ~/.claude/skills/clearshot && cd ~/.claude/skills/clearshot && ./setup
```

Once installed, Clearshot activates automatically when you share a UI screenshot. No configuration needed.

## What It Does

Clearshot runs a five-step analysis pipeline, but only the steps you need:

| Step | What it extracts | When it runs |
|------|-----------------|-------------|
| Spatial decomposition | 3x3 grid mapping of page sections | Almost always |
| Element inventory | Every element: type, position, state, colors, borders | Full rebuilds |
| Design system extraction | Color palette, type scale, spacing patterns | Rebuilds + critique |
| Layout architecture | CSS patterns, container constraints, responsive context | Rebuilds only |
| Interaction map | CTAs, navigation, forms, visible states | Rebuilds + UX critique |

"Clone this exact UI" runs all 5 steps. "Does this look right?" runs step 1 only. "What's wrong here?" runs steps 1, 3, 5 and flags problems. The AI picks the right depth automatically.

## Analysis Modes

Clearshot reads the conversation and selects the right lens:

**Analytical (engineer lens):** Hex values, pixel measurements, component types, layout patterns, spacing systems. For rebuilding, cloning, debugging.

**Qualitative (designer lens):** Visual weight, hierarchy clarity, breathing room, brand signal, friction points. For "does this feel right?" conversations.

**Blended:** Qualitative lead, analytically grounded. For "rebuild this but make it feel more premium."

## What It's Not

- **Not a screenshot-to-code generator.** It's the analysis layer that makes any code generation better.
- **Not a Figma plugin.** Works on raw screenshots, no design file needed.
- **Not a hosted service.** Runs locally inside your AI tool. No screenshots leave your machine.

## Self-Improvement

After every analysis, Clearshot rates its own output across five criteria: spatial accuracy, specificity, mode match, step selection, actionability. Scores below 8/10 trigger a structured field report.

Telemetry is opt-in with three tiers:

| Tier | What's shared | What stays local |
|------|--------------|-----------------|
| Community | Hashed device ID + usage events | Screenshots, code, analysis content |
| Anonymous | Usage events only | Everything else |
| Off | Nothing | Everything |

The self-improvement loop works at every tier. Field reports work even with telemetry off.

## Research

The approach is based on production systems and academic research:

- **Microsoft OmniParser** — YOLOv8 detection + OCR + icon captioning. Improved GPT-4V from 70.5% to 93.8%. [Paper](https://arxiv.org/html/2408.00203v1) · [GitHub](https://github.com/microsoft/OmniParser)
- **DCGen** — Recursive divide-and-conquer screenshot decomposition. [Paper](https://arxiv.org/html/2406.16386v1)
- **Replit** — Multi-agent verification loop with structured screenshot comparison
- **Google ScreenAI** — UI-specific vision-language model. [Blog](https://research.google/blog/screenai-a-visual-language-model-for-ui-and-visually-situated-language-understanding/)

## Built By

[Udayan Walvekar](https://github.com/udayanwalvekar)

## License

MIT

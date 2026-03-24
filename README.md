# clearshot

structured screenshot intelligence for AI coding tools.

## install

```
npx clearshot
```

or

```
npx skills add udayanwalvekar/clearshot
```

or

```
curl -fsSL https://raw.githubusercontent.com/udayanwalvekar/clearshot/main/install.sh | bash
```

activates automatically when you share a UI screenshot. first time it runs, it asks two questions (update preference + telemetry) and you're done.

## what it does

AI sucks at seeing screenshots. paste one into claude code and ask it to rebuild something — it says "i see a dashboard with some cards and a sidebar." meanwhile you're staring at a broken button, inconsistent border radius, and 6px padding where 8px should be.

clearshot fixes this by running structured analysis *before* the AI responds. not "blue color" but `#3B82F6`. not "some spacing" but `8px gap`. not "a button" but `sm/rounded-md/border-gray-200/shadow-sm`.

five-step pipeline, runs only what's needed:

| step | what it extracts | when it runs |
|------|-----------------|--------------|
| spatial decomposition | 3×3 grid mapping of page sections | almost always |
| element inventory | every element: type, position, state, colors, borders | full rebuilds |
| design system extraction | color palette, type scale, spacing patterns | rebuilds + critique |
| layout architecture | CSS patterns, container constraints, responsive context | rebuilds only |
| interaction map | CTAs, navigation, forms, visible states | rebuilds + UX critique |

"clone this" → all 5 steps. "does this look right?" → step 1 only. it reads the room.

## two modes

**analytical** (engineer lens): hex values, pixel measurements, component types, layout patterns. for rebuilding, cloning, debugging.

**qualitative** (designer lens): visual weight, hierarchy clarity, breathing room, brand signal. for "does this feel right?" conversations.

picks the right one automatically, or blends both.

## it knows when to shut up

screenshot of a meme? stays quiet. architecture diagram? stays quiet. photo of your lunch? definitely stays quiet. only activates on UI screenshots when you're building or critiquing frontend.

## privacy

everything runs locally. no screenshots or code ever leave your machine.

telemetry is opt-in — you choose during first run:

| mode | what's sent |
|------|------------|
| anonymous | usage events + hashed device ID (no PII) |
| off | nothing |

no network calls happen until you explicitly opt in.

## research

builds on production systems and academic research:

- **microsoft omniparser** — improved GPT-4V from 70.5% to 93.8% with structured analysis. [paper](https://arxiv.org/abs/2408.00203)
- **dcgen** — recursive divide-and-conquer screenshot decomposition. [paper](https://arxiv.org/abs/2405.16569)
- **replit** — multi-agent verification loop with structured screenshot comparison
- **google screenai** — UI-specific vision-language model. [blog](https://research.google/blog/screenai-a-visual-language-model-for-ui-and-infographics-understanding/)

## built by

[udayan walvekar](https://x.com/udayan_w) · [growthx](https://growthx.club)

## license

MIT

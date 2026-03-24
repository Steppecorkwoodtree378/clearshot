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

three analysis levels — facts and taste together, every time:

| level | what it does | when it runs |
|-------|-------------|--------------|
| map | 5×5 spatial grid, full element inventory with colors/borders/states | always |
| system | color palette, type scale, spacing patterns, design cohesion | always |
| blueprint | layout architecture, CSS patterns, interaction map, responsive context | when building |

levels 1+2 always run. level 3 escalates when you're implementing from the screenshot.

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

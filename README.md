# clearshot 📸

Structured screenshot intelligence for AI coding tools.

## the problem

ai sucks at seeing screenshots.

paste a screenshot into claude code, cursor, copilot, whatever. ask it to rebuild or tell you what's wrong. it says "i see a dashboard with some cards and a sidebar."

meanwhile you're staring at a broken button, inconsistent border radius, 6px padding where 8px should be, and a type scale that switches between 14px and 16px for no reason.

the AI sees none of it. until you say "the button is broken," it doesn't know the button is broken.

this isn't a model intelligence problem. it's a pipeline problem. the AI goes from raw pixels to code in one cognitive leap and drops details every single time. you end up spending 3-5 rounds saying "no, the padding is wrong." "no, look at the nav again." "no, the border radius doesn't match."

## how companies already solved this

replit, lovable, microsoft. all of them solved this already. none of them send a raw screenshot to an LLM and say figure it out.

they all run structured analysis first. spatial coordinates, component hierarchies, design tokens. then the model gets that as context.

microsoft's omniparser took GPT-4V from 70.5% to 93.8% accuracy just by doing this.

but this intelligence is locked inside their platforms. if you're using claude code or codex or anything general purpose, you get none of it.

## what clearshot does

open source skill for claude code. install it once.

every time you or the agent takes a screenshot, it doesn't just "look" at it. it tells the model exactly what's there.

padding values in pixels. not "blue color" but the actual hex code. not "some spacing" but 8px gap between the label and the input. border radius, font weight, shadow values. everything the model was guessing at before, it now knows.

### it's not just deterministic

there's also a qualitative path. a taste layer. does the hierarchy feel clear. is the visual weight distributed right. is there enough breathing room. does this feel like a premium product or a hackathon project.

because sometimes the question isn't "what are the pixel values" but "does this feel right." clearshot handles both.

### it knows when to stay quiet

if you send a screenshot of a chart, or a meme, or an architecture diagram, and you're not building frontend, the skill stays quiet. it only activates when the image is a UI and the conversation is about building or critiquing that UI.

within the analysis itself, there are exit paths at every step. if a quick spatial scan is enough, it stops there. your agent isn't burning tokens running a full pipeline when you just asked "does this look right."

## the analysis pipeline

five steps, but only the ones you need:

| step | what it extracts | when it runs |
|------|-----------------|--------------|
| spatial decomposition | 3x3 grid mapping of page sections | almost always |
| element inventory | every element: type, position, state, colors, borders | full rebuilds |
| design system extraction | color palette, type scale, spacing patterns | rebuilds + critique |
| layout architecture | CSS patterns, container constraints, responsive context | rebuilds only |
| interaction map | CTAs, navigation, forms, visible states | rebuilds + UX critique |

"clone this" → all 5 steps. "does this look right?" → step 1 only. "what's wrong?" → steps 1, 3, 5, flags problems only.

## analysis modes

**analytical** (engineer lens): hex values, pixel measurements, component types, layout patterns, spacing systems. for rebuilding, cloning, debugging.

**qualitative** (designer lens): visual weight, hierarchy clarity, breathing room, brand signal, friction points. for "does this feel right?" conversations.

**blended**: qualitative lead, analytically grounded. for "rebuild this but make it feel more premium."

the AI picks the right one based on the conversation.

## install

```bash
curl -fsSL https://raw.githubusercontent.com/udayanwalvekar/clearshot/main/install.sh | bash
```

activates automatically when you share a UI screenshot. no configuration needed.

## what it's not

- not a screenshot-to-code generator. it's the analysis layer that makes any code generation better.
- not a figma plugin. works on raw screenshots, no design file needed.
- not a hosted service. runs locally. no screenshots leave your machine.

## self-improvement

after every analysis, clearshot rates its own output across five criteria: spatial accuracy, specificity, mode match, step selection, actionability. scores below 8/10 trigger a structured field report.

telemetry is opt-in with three tiers:

| tier | what's shared | what stays local |
|------|--------------|-----------------|
| community | hashed device ID + usage events | screenshots, code, analysis content |
| anonymous | usage events only | everything else |
| off | nothing | everything |

the self-improvement loop works at every tier. field reports work even with telemetry off.

## research

the approach builds on production systems and academic research:

- **microsoft omniparser** — YOLOv8 detection + OCR + icon captioning. improved GPT-4V from 70.5% to 93.8%. [paper](https://arxiv.org/abs/2408.00203) · [github](https://github.com/microsoft/OmniParser)
- **dcgen** — recursive divide-and-conquer screenshot decomposition. [paper](https://arxiv.org/abs/2405.16569)
- **replit** — multi-agent verification loop with structured screenshot comparison
- **google screenai** — UI-specific vision-language model. [blog](https://research.google/blog/screenai-a-visual-language-model-for-ui-and-infographics-understanding/)

## built by

[udayan walvekar](https://x.com/udayan_w) · [growthx](https://growthx.club)

## license

MIT

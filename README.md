# DepEnv — Depositional Environment Interpreter

**Live demo:** [depenv.netlify.app](https://depenv.netlify.app)

A browser-based tool that interprets likely depositional environment from core/hand-sample sediment properties. Enter grain size, sorting, roundness, porosity type, and estimated porosity percentage — the tool reasons through depositional energy, transport distance, and reservoir quality to suggest a likely depositional setting.

Built at the intersection of petroleum geoscience and frontend engineering, as a teaching aid for people learning sedimentary interpretation
Note: Not a replacement for hands-on petrographic analysis.

## Why

Manual petrographic analysis involves working through a chain of reasoning by hand: texture tells you energy, energy tells you transport distance, transport distance and porosity tell you likely setting. This tool encodes that reasoning chain into an interactive interface, so the logic is transparent and repeatable rather than locked away in a notebook.

## How it works

1. **Input sediment properties**
   - Grain size
   - Sorting
   - Roundness
   - Porosity type
   - Estimated porosity (%)

2. **Interpretation engine** walks through:
   - Depositional energy (from texture)
   - Transport distance (from roundness/sorting)
   - Reservoir quality (from porosity characteristics)
   - Likely depositional setting (synthesized from the above)

3. **Output** — a plain-language interpretation showing how each input contributed to the conclusion.

## Tech stack

- **React** — loaded via CDN, no build step
- **In-browser Babel** — JSX compiled at runtime
- **Vanilla CSS** — no framework
- **Netlify** — static hosting/deployment

Deliberately built with zero tooling: open the file, edit, refresh. No `npm install`, no bundler, no build pipeline.

## Use cases

- Students learning sedimentology / depositional interpretation
- Demonstrating the link between texture and reservoir quality in a classroom or field setting



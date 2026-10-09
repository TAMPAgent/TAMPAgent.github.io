# TAMPAgent project page

A static page with no build step. Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000   # then visit http://localhost:8000

## Videos

Every video tile shows real footage; tiles without a video were removed. To add one, put the clip in `videos/`, make a poster frame and add a `<figure>` to the grid (copy an existing tile):

    ffmpeg -ss 1 -i videos/NAME.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 3 videos/NAME.jpg

| File | Where it appears |
|---|---|
| `teaser.mp4` | Overview: the real run told as a conversation |
| `sim-t1.mp4` (G1), `sim-t4.mp4` (RB-Y1), `sim-t4-g1.mp4` (G1), `sim-t5.mp4` (RB-Y1) | Results: simulated tasks |
| `real-mustard.mp4`, `g1-toy-dog.mp4` | Gallery |
| `rby1-penguin.mp4` | Not used by the current page |

For the web, H.264 MP4 without audio keeps files small and plays everywhere:

    ffmpeg -i input.mov -vf scale=1280:-2 -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart -an videos/NAME.mp4

## Figures

`figures/` holds PNG and JPEG exports of the paper figures. Re-export after a figure changes, for example:

    pdftocairo -png -r 200 -singlefile ../paper/figures/NAME.pdf figures/NAME

| File | Paper source | On the page |
|---|---|---|
| `teaser_tampagent.png` | `teaser_tagent.pdf` | Overview |
| `rby1_success.png`, `rby1_tokens.png` | same name, `.pdf` | Results (2000 px wide) |
| `rby1_failures.png` | `rby1_failures.pdf` | Results, narrow figure (1120 px wide) |
| `factor_graph.png`, `execution_loop.jpg`, `variable_ladder.jpg`, `sim_tasks.jpg` | `factor_graph.pdf`, `tagent_execution_loop_new.pdf`, `variable_ladder_new.pdf`, `sim_tasks.pdf` | not used yet |

## Placeholders still to fill

- Authors and affiliations (currently "Anonymous Authors" and an anonymous BibTeX entry).
- Paper, arXiv, and Code links (currently marked "soon").

## Figures exported from the figure deck

Several figures come from `../tagent_figures/TAgent_figures.pptx`. After editing the deck, re-export them:

    cd ../tagent_figures && python3 export_for_web.py

This renders the deck through PowerPoint, shows any still-empty media slot as "Media coming soon", crops away each slide's title, and writes PNGs to `figures/deck/`:

| Slide | File | Intended section |
|---|---|---|
| 6 | `rolling_strip.png` | Rolling example |
| 7 to 12 | `storyboard_1.png` to `storyboard_6.png` | Rolling example stepper |
| 13, 14 | `recovery_box.png`, `recovery_cup.png` | Replanning |
| 15, 16 | `real_pink_object.png`, `real_penguin_mustard.png` | Real robot |
| 17 | `three_artifacts.png` | Method |
| 18 | `status_ladder.png` | Beliefs |
| 19 | `ownership.png` | FAQ |

The current `index.html` does not use any of these yet.

The RB-Y1 results charts (`figures/rby1_*.png`) come from `../rby1_figures/make_figures_v2.py`, the same PDFs the paper uses, exported with `pdftocairo -png -scale-to-x 2000 -scale-to-y -1 -singlefile` (1120 for `rby1_failures`).

## Sandbox viewer

The Sandbox section is generated from the real agent sandbox. After the handbook changes, rebuild:

    cd ../tagent_figures && pipx run --spec markdown python build_sandbox_viewer.py /path/to/codex-sandbox-real

This writes `sandbox/docs.js` (every document, pre-rendered) and `sandbox/img/`. Only the handbook,
one example work folder and the planner records in `../tagent_figures/sandbox_examples/` are
published; the build refuses to write output containing names, home paths, private addresses or
the lab location. `sandbox.js` renders the tree and viewer; `#sandbox:<path>` deep-links a document.

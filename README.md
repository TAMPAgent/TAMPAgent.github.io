# TAMPAgent project page

A static page with no build step. Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000   # then visit http://localhost:8000

## Replacing the placeholder videos

Every video on the page is a placeholder. To use a real clip, overwrite the file in `videos/` with the same name, and regenerate its poster frame:

    ffmpeg -ss 0.5 -i videos/NAME.mp4 -frames:v 1 -q:v 4 videos/NAME.jpg

Then remove `data-placeholder` from that video's `<div class="frame">` in `index.html` to hide the "Placeholder video" badge.

| File | Where it appears |
|---|---|
| `method.mp4` | Hero: the method video |
| `rby1-penguin.mp4` | Real RB-Y1 task card (real footage, the rolling example run) |
| `real-y1.mp4` | RB-Y1 simulation task card |
| `sim-t1.mp4` to `sim-t6.mp4` | Six simulated tasks |
| `recovery-box.mp4`, `recovery-cup.mp4` | Replanning section |

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

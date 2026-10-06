# TAgent project page

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

## Placeholders still to fill

- Authors and affiliations (currently "Anonymous Authors" and an anonymous BibTeX entry).
- Paper, arXiv, and Code links (currently marked "soon").

## Figures exported from the figure deck

Several figures come from `../tagent_figures/TAgent_figures.pptx`. After editing the deck, re-export them:

    cd ../tagent_figures && python3 export_for_web.py

This renders the deck through PowerPoint, shows any still-empty media slot as "Media coming soon", crops away each slide's title, and writes PNGs to `figures/deck/`:

| Slide | File | Website section |
|---|---|---|
| 4 | `rolling_strip.png` | Rolling example |
| 5 to 10 | `storyboard_1.png` to `storyboard_6.png` | Rolling example stepper |
| 11, 12 | `recovery_box.png`, `recovery_cup.png` | Replanning |
| 13 | `three_artifacts.png` | Method |
| 14 | `status_ladder.png` | Beliefs |
| 15 | `ownership.png` | FAQ |

The RB-Y1 results charts (`figures/rby1_*.png`) are exported from `../rby1_figures/*.pdf` with `pdftocairo -png -r 200 -singlefile`.

# Gobble Run — The Great Turkey Escape

A complete, original, offline browser game. Escape the farmyard, hide in the old barn, and survive the Thanksgiving kitchen to reach the woods. The painted scenes and characters are bundled locally. Character movement, hazards, and effects are animated in canvas, while music and effects are synthesized locally.

## Play

Use Node.js 22.18 or newer.

```sh
node serve.ts --port 8088
```

Open http://127.0.0.1:8088 in a desktop browser. The game needs no installation or internet connection once served. Use the stage practice buttons to learn individual sections. A campaign lasts approximately 70–90 seconds, depending on dash use.

| Input | Action |
| --- | --- |
| Space, Up, W, or click | Jump, then press again for a double jump |
| Down or S | Duck under high knives and hide inside marked hay cover |
| Shift or X | Dash through hazards and gain distance from the farmer |
| P or Escape | Pause or resume |
| M | Toggle sound |
| Enter or click on the result screen | Restart |

The farmer warns before lunging and searches when you hide. Corn streaks increase the score multiplier. Wishbones restore a heart. Dash recharges, so timing it matters. Campaign records persist when browser storage is available. Practice runs have separate scoring and do not change the record.

## Competition output

The root `main.ts` uses the unchanged official `vendor/makefun-game.ts`. It copies the static game and four genuine browser screenshots and creates the official dossier. The screenshots show kitchen gameplay, the title, the barn, and a caught screen with restart.

In PowerShell, choose an output folder and run the entry.

```powershell
$env:MAKEFUN_OUTPUT_DIR = 'out'
node main.ts
```

In a POSIX shell use `MAKEFUN_OUTPUT_DIR=out node main.ts`.

The competition runs this program twice with no network. Repeated runs write identical files. The game uses local ES modules, CSS, and bundled artwork, with no external services.

## Source

`main.js` owns simulation and collisions. `pursuit.js` controls the farmer. `art.js` draws the environments. `entities.js` draws characters, hazards, and collectibles. `renderer.js` draws the HUD. `screens.js` draws menus and results. `input.js`, `audio.js`, `particles.js`, and `progress.js` handle input, synthesized sound, effects, and personal records.

## Verification

The upgrade was checked with a full campaign simulation reaching victory, a passive run reaching caught, restarting, pause/resume, duck collision bounds, and hay cover triggering farmer search. Browser checks covered title, kitchen, barn, caught/restart, and pause. Four browser captures were cropped to the game area and saved as JPEGs within the stated image limits. Output reproducibility was checked by hashing two complete output trees.

Submitting to make.fun additionally requires the authentic recorded build sessions, the earlier sessions that authored the existing code where applicable, and the platform's account/signature steps. Those are separate from the playable game and output builder.

Licensed under the MIT license in `LICENSE`.

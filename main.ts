// Gobble Run 2.0 ships the three-stage offline escape campaign and genuine browser screenshots.
// The unchanged official dossier builder supplies the competition's required output format.

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const destination = resolve(out);
const sourceRoot = resolve(here);
if (destination === sourceRoot || ['game', 'screenshots'].some(name => {
  const source = join(sourceRoot, name);
  return destination === source || destination.startsWith(source + sep);
})) throw new Error('Choose an output directory outside the source game and screenshots.');

mkdirSync(out, { recursive: true });
// Replace generated trees so rerunning into the same output directory stays reproducible.
rmSync(join(out, 'game'), { recursive: true, force: true });
rmSync(join(out, 'screenshots'), { recursive: true, force: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

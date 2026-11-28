// Gobble Run 2.0 ships the three-stage offline escape campaign and genuine browser screenshots.
// The unchanged official dossier builder supplies the competition's required output format.

import { cpSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const source = realpathSync(fileURLToPath(new URL('.', import.meta.url)));
const outputPath = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputPath, { recursive: true });
const out = realpathSync(outputPath);
const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};
function contains(parent: string, child: string) {
  const path = relative(parent, child);
  return path !== '..' && !path.startsWith('..' + sep) && !isAbsolute(path);
}
const trees = ['game', 'screenshots'];
if (contains(out, source) || trees.some(name => contains(join(source, name), out))) {
  throw new Error('Use a dedicated output directory outside the source game and screenshots.');
}

const products = [...trees, 'dossier.json'];
const staging = join(out, '.gobble-build');
mkdirSync(staging); // Exclusive: another build must not publish to this output concurrently.
let keepBackup = false;
try {
  const existing = products.filter(name => lstatSync(join(out, name), { throwIfNoEntry: false }));
  if (existing.length) {
    const dossier = join(out, 'dossier.json');
    if (existing.length !== products.length || !lstatSync(dossier).isFile() ||
        !readFileSync(dossier).equals(buildDossier(out, caps)) ||
        readdirSync(join(out, 'screenshots'), { withFileTypes: true }).some(entry => !entry.isFile() || entry.name.startsWith('.'))) {
      throw new Error('The destination contains other game files. Choose an empty output directory.');
    }
  }
  for (const name of trees) cpSync(join(source, name), join(staging, name), { recursive: true });
  writeFileSync(join(staging, 'dossier.json'), buildDossier(staging, caps));

  // An invalid source or copy failure above leaves the previous working build intact.
  const backup = join(staging, 'previous');
  mkdirSync(backup);
  const moved: string[] = [];
  const published: string[] = [];
  try {
    for (const name of existing) {
      renameSync(join(out, name), join(backup, name));
      moved.push(name);
    }
    for (const name of products) {
      renameSync(join(staging, name), join(out, name));
      published.push(name);
    }
  } catch (error) {
    keepBackup = true;
    for (const name of published) renameSync(join(out, name), join(staging, name));
    for (const name of moved) renameSync(join(backup, name), join(out, name));
    keepBackup = false;
    throw error;
  }
} finally {
  if (!keepBackup) rmSync(staging, { recursive: true, force: true });
}

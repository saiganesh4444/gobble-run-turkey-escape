/** Title and result screens use the same live artwork as the game. */
import { drawAutumnScene, panel, text, palette } from './art.js';
import { createTurkey, createFarmer, drawTurkey, drawFarmer, drawObstacle } from './entities.js';

function hero(ctx, frame, x, y, scale) {
  const turkey = createTurkey();
  turkey.bobTimer = frame; turkey.legTimer = frame; turkey.wingAngle = frame * 0.1;
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  turkey.x = 0; turkey.y = 0; drawTurkey(ctx, turkey, frame); ctx.restore();
}

export function drawTitleScreen(ctx, frame, best = 0) {
  drawAutumnScene(ctx, 0, frame * 0.25, frame);
  const shade = ctx.createLinearGradient(0, 0, 850, 0);
  shade.addColorStop(0, '#241e2bf5'); shade.addColorStop(1, '#241e2b00');
  ctx.fillStyle = shade; ctx.fillRect(0, 0, 960, 540);
  text(ctx, 'THE GREAT THANKSGIVING BREAKOUT', 48, 54, 13, palette.gold);
  text(ctx, 'Gobble', 43, 137, 92, palette.cream, 'left', 'Georgia');
  text(ctx, 'Run.', 43, 224, 92, palette.gold, 'left', 'Georgia');
  text(ctx, 'One bird. Three stages. Zero dinner plans.', 48, 299, 17);
  text(ctx, 'Outrun the farmer. Hide in hay. Survive the kitchen.', 48, 329, 14, '#cebbae');
  panel(ctx, 48, 366, 252, 51, palette.gold);
  text(ctx, 'START ESCAPE   →', 174, 392, 19, palette.ink, 'center');
  text(ctx, 'SPACE / ENTER / CLICK TO START', 49, 437, 11, '#d8bc9f');
  hero(ctx, frame, 630, 272, 2.6);
  const farmer = createFarmer(0); farmer.legTimer = frame;
  ctx.save(); ctx.translate(820, 301); ctx.scale(1.35, 1.35); farmer.x = 0; farmer.y = 0; drawFarmer(ctx, farmer, frame); ctx.restore();
  text(ctx, '“I am absolutely a salad person.”', 775, 166, 14, palette.cream, 'center', 'Georgia');
  panel(ctx, 30, 478, 900, 42, '#241e2be8');
  text(ctx, 'SPACE  jump ×2     ↓ / S  duck & hide     SHIFT / X  dash     P  pause     M  sound', 480, 499, 13, palette.cream, 'center');
  if (best) text(ctx, `PERSONAL BEST  ${best}`, 908, 40, 12, palette.gold, 'right');
}

export function drawGameOverScreen(ctx, score, distance, frame, stats = {}) {
  drawResult(ctx, false, score, distance, frame, stats);
}

export function drawVictoryScreen(ctx, score, frame, stats = {}) {
  drawAutumnScene(ctx, 3, 1400, frame, false);
  drawResult(ctx, true, score, 550, frame, stats);
}

function drawResult(ctx, escaped, score, distance, frame, stats) {
  ctx.fillStyle = '#241e2bbd'; ctx.fillRect(0, 0, 960, 540);
  panel(ctx, 80, 62, 800, 412, '#241e2bf5', 22);
  text(ctx, escaped ? 'OFF THE MENU' : 'A CLOSE CALL', 120, 101, 13, palette.gold);
  text(ctx, escaped ? 'Wild & free.' : 'Caught!', 120, 168, 61, palette.cream, 'left', 'Georgia');
  text(ctx, escaped ? 'Thanksgiving is better with all your feathers.' : (stats.cause || 'The farmer caught up. Try a different escape.'), 120, 226, 16, '#d9bcaa');
  text(ctx, `${Math.floor(score).toLocaleString()} POINTS`, 120, 285, 29, palette.gold);
  text(ctx, `${Math.floor(distance)} / 550 m    •    ${stats.corn || 0} corn    •    ${stats.dodges || 0} clean dodges`, 120, 324, 16);
  text(ctx, `BEST ${stats.best || 0}    •    ${escaped ? (stats.hits === 0 ? 'RANK S — UNTOUCHABLE' : 'RANK A — FREE RANGE') : 'Every run is another chance.'}`, 120, 355, 13, palette.teal);
  panel(ctx, 120, 391, 271, 47, palette.gold);
  text(ctx, 'RUN AGAIN   →', 255, 415, 17, palette.ink, 'center');
  text(ctx, 'SPACE / ENTER / CLICK', 426, 415, 12, '#d9bcaa');
  hero(ctx, frame, 685, 284, 2.2);
  if (!escaped) drawObstacle(ctx, { type: 'oven', x: 684, y: 360, width: 90, height: 65 }, frame);
}

export function drawPauseScreen(ctx) {
  ctx.fillStyle = '#241e2bcc'; ctx.fillRect(0, 0, 960, 540);
  panel(ctx, 255, 159, 450, 222);
  text(ctx, 'Catching your breath.', 480, 214, 36, palette.cream, 'center', 'Georgia');
  text(ctx, 'P / ESC / CLICK  to resume', 480, 280, 18, palette.gold, 'center');
  text(ctx, 'SPACE jump  •  ↓ hide  •  SHIFT dash  •  M sound', 480, 330, 14, palette.cream, 'center');
}

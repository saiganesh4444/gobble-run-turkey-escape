/** Readable gameplay HUD, hazard cues, and stage transitions. */
import { CONFIG, STAGES } from './config.js';
import { drawAutumnScene, panel, text, palette } from './art.js';
export const drawBackground = drawAutumnScene;

export function drawHUD(ctx, turkey, stageIndex, farmer, stats, hidden, tick) {
  panel(ctx, 18, 15, 924, 65);
  text(ctx, 'GOBBLE RUN', 34, 36, 19, palette.gold, 'left', 'Georgia');
  text(ctx, `${stageIndex + 1} / 3   ${STAGES[stageIndex].name.toUpperCase()}`, 34, 61, 11);
  text(ctx, `${Math.floor(turkey.score).toString().padStart(5, '0')}`, 246, 37, 22);
  text(ctx, `SCORE    ${stats.combo > 1 ? `×${stats.combo} CORN STREAK` : 'COLLECT CORN'}`, 246, 62, 10, palette.gold);
  panel(ctx, 455, 34, 290, 7, '#ffffff22', 3);
  panel(ctx, 455, 34, Math.max(3, 290 * turkey.distance / CONFIG.ESCAPE_DISTANCE), 7, palette.teal, 3);
  for (const point of [150, 330]) { ctx.fillStyle = palette.cream; ctx.fillRect(455 + 290 * point / 550, 30, 2, 15); }
  text(ctx, `${Math.floor(turkey.distance)} / 550 m TO FREEDOM`, 455, 61, 11);
  text(ctx, '♥'.repeat(turkey.lives) + '♡'.repeat(3 - turkey.lives), 920, 36, 24, palette.red, 'right');
  text(ctx, turkey.dashCooldown > 0 ? 'DASH RECHARGING' : 'SHIFT  DASH READY', 920, 63, 10, turkey.dashCooldown > 0 ? '#b49d95' : palette.teal, 'right');
  const danger = farmer.mode.includes('SPOTTED') || farmer.mode.includes('LUNGING');
  panel(ctx, 24, 103, 217, 29, danger ? '#9a3c3c' : '#241e2bd9', 6);
  text(ctx, hidden ? 'HIDDEN — LOSING THE FARMER' : farmer.mode, 132, 118, 11, palette.cream, 'center');
  if (stats.noticeTimer > 0) {
    panel(ctx, 320, 110, 340, 38);
    text(ctx, stats.notice, 490, 130, 15, palette.gold, 'center');
  }
  panel(ctx, 24, 474, 912, 41);
  text(ctx, turkey.distance < 65 ? 'SPACE / CLICK  jump twice   •   ↓ / S  duck & hide in hay   •   SHIFT / X  dash through danger' : 'FARMYARD  →  OLD BARN  →  KITCHEN  →  FREEDOM', 480, 495, 13, palette.cream, 'center');
}

export function drawStageTransition(ctx, stageName, progress) {
  ctx.fillStyle = '#241e2ba8'; ctx.fillRect(0, 0, 960, 540);
  text(ctx, 'THE ESCAPE CONTINUES', 480, 215, 14, palette.gold, 'center');
  text(ctx, stageName, 480, 272, 52, palette.cream, 'center', 'Georgia');
  text(ctx, stageName.includes('Kitchen') ? 'Hot ovens. Low knives. One last dash.' : 'Duck into golden hay to break the chase.', 480, 327, 18, palette.teal, 'center');
}

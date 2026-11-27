/** Title screen, game over screen, and victory screen */

import { CONFIG } from './config.js';

/** Draw the title screen */
export function drawTitleScreen(ctx, frame) {
  const w = CONFIG.WIDTH;
  const h = CONFIG.HEIGHT;

  // Autumn sky background
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#FF7E47');
  skyGrad.addColorStop(0.5, '#FFD580');
  skyGrad.addColorStop(1, '#5D8233');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Sun
  const sunPulse = Math.sin(frame * 0.03) * 5;
  ctx.fillStyle = '#FFD700';
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(w * 0.8, 100, 70 + sunPulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(w * 0.8, 100, 50 + sunPulse * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(w * 0.8, 100, 35, 0, Math.PI * 2);
  ctx.fill();

  // Ground
  ctx.fillStyle = '#5D8233';
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
  ctx.fillStyle = '#4A6B28';
  ctx.fillRect(0, h * 0.75, w, h * 0.25);

  // Falling leaves
  ctx.globalAlpha = 0.6;
  const leafColors = ['#B22222', '#D2691E', '#DAA520', '#8B4513', '#FF8C00'];
  for (let i = 0; i < 15; i++) {
    const lx = (i * 73 + frame * 0.5) % w;
    const ly = (i * 47 + frame * 0.8) % h;
    ctx.fillStyle = leafColors[i % leafColors.length];
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(frame * 0.02 + i);
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Animated Turkey mascot (large, centered)
  drawTitleTurkey(ctx, w / 2 - 80, h * 0.35, frame);

  // Title text with shadow
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.font = 'bold 56px monospace';
  ctx.fillText('GOBBLE RUN', w / 2 + 3, 83);

  // Main title
  const titleHue = (frame * 2) % 360;
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 56px monospace';
  ctx.fillText('GOBBLE RUN', w / 2, 80);

  // Subtitle
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('The Great Turkey Escape', w / 2, 120);

  // Thanksgiving banner
  ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
  ctx.fillRect(w / 2 - 200, 145, 400, 30);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('🦃 A Thanksgiving Adventure 🍂', w / 2, 162);

  // Controls
  const controlsY = h * 0.72;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(w / 2 - 220, controlsY - 15, 440, 110);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('— CONTROLS —', w / 2, controlsY);

  ctx.fillStyle = '#fff';
  ctx.font = '13px monospace';
  ctx.fillText('SPACE / ↑ / W / Click — Jump (press again to double jump!)', w / 2, controlsY + 24);
  ctx.fillText('↓ / S — Duck under flying knives', w / 2, controlsY + 44);
  ctx.fillText('SHIFT / X — Dash through danger', w / 2, controlsY + 64);
  ctx.fillText('Collect 🌽 corn for points, ✨ wishbones for extra lives!', w / 2, controlsY + 84);

  // Blinking "Press SPACE to start"
  if (Math.floor(frame / 30) % 2 === 0) {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('>>> Press SPACE to Start <<<', w / 2, h - 30);
  }
}

function drawTitleTurkey(ctx, x, y, frame) {
  ctx.save();
  ctx.translate(x, y);
  const scale = 2.5;
  ctx.scale(scale, scale);

  const bob = Math.sin(frame * 0.08) * 3;

  // Tail feathers (big fan)
  const tailColors = ['#8B0000', '#B22222', '#CD853F', '#DAA520', '#FF8C00', '#DC143C', '#D2691E'];
  for (let i = 0; i < 7; i++) {
    ctx.save();
    ctx.translate(-10, -5);
    const angle = -0.9 + i * 0.3 + Math.sin(frame * 0.04 + i * 0.5) * 0.08;
    ctx.rotate(angle);
    ctx.fillStyle = tailColors[i];
    ctx.beginPath();
    ctx.ellipse(0, -25, 7, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Feather tip
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, -50, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Body
  ctx.fillStyle = '#8B6914';
  ctx.beginPath();
  ctx.ellipse(0, bob, 18, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Breast
  ctx.fillStyle = '#D4A574';
  ctx.beginPath();
  ctx.ellipse(5, bob + 2, 12, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wings (flapping)
  const wingFlap = Math.sin(frame * 0.12) * 0.3;
  ctx.save();
  ctx.translate(-12, bob - 2);
  ctx.rotate(wingFlap - 0.4);
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(-6, 0, 10, 8, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(12, bob - 2);
  ctx.rotate(-wingFlap + 0.4);
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(6, 0, 10, 8, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Head
  ctx.fillStyle = '#8B6914';
  ctx.beginPath();
  ctx.arc(10, bob - 16, 10, 0, Math.PI * 2);
  ctx.fill();

  // Snood
  ctx.fillStyle = '#DC143C';
  ctx.beginPath();
  ctx.ellipse(16, bob - 10, 3, 8 + Math.sin(frame * 0.1) * 1.5, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(18, bob - 18);
  ctx.lineTo(28, bob - 15);
  ctx.lineTo(18, bob - 13);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(14, bob - 19, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(15, bob - 19, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(16, bob - 20, 1, 0, Math.PI * 2);
  ctx.fill();

  // Comb
  ctx.fillStyle = '#DC143C';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(7 + i * 4, bob - 26, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Legs
  ctx.strokeStyle = '#D4760A';
  ctx.lineWidth = 2;
  const legAnim = Math.sin(frame * 0.1) * 3;
  ctx.beginPath();
  ctx.moveTo(-4, 14 + bob);
  ctx.lineTo(-6 + legAnim, 22 + bob);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4, 14 + bob);
  ctx.lineTo(6 - legAnim, 22 + bob);
  ctx.stroke();

  ctx.restore();
}

/** Draw the game over screen (caught) */
export function drawGameOverScreen(ctx, score, distance, frame) {
  const w = CONFIG.WIDTH;
  const h = CONFIG.HEIGHT;

  // Dark overlay
  ctx.fillStyle = 'rgba(30, 10, 5, 0.85)';
  ctx.fillRect(0, 0, w, h);

  // Red vignette
  const vignette = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, 400);
  vignette.addColorStop(0, 'rgba(139, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(139, 0, 0, 0.5)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Shake effect
  const shake = Math.sin(frame * 0.3) * (frame < 30 ? 3 : 0);
  ctx.save();
  ctx.translate(shake, 0);

  // "CAUGHT!" title
  ctx.fillStyle = '#FF4444';
  ctx.font = 'bold 60px monospace';
  ctx.fillText('CAUGHT!', w / 2, h * 0.22);

  // Subtitle
  ctx.fillStyle = '#FFD700';
  ctx.font = '20px monospace';
  ctx.fillText('The farmer got you... gobble gobble! 🍗', w / 2, h * 0.32);

  // Oven illustration
  ctx.fillStyle = '#333';
  ctx.fillRect(w / 2 - 50, h * 0.38, 100, 70);
  ctx.fillStyle = '#FF4500';
  const ovenGlow = Math.sin(frame * 0.1) * 0.3 + 0.7;
  ctx.globalAlpha = ovenGlow;
  ctx.fillRect(w / 2 - 40, h * 0.4, 80, 40);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#888';
  ctx.fillRect(w / 2 - 40, h * 0.38 + 55, 80, 4);

  // Stats box
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(w / 2 - 150, h * 0.6, 300, 90);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.strokeRect(w / 2 - 150, h * 0.6, 300, 90);

  ctx.fillStyle = '#fff';
  ctx.font = '18px monospace';
  ctx.fillText(`Final Score: ${Math.floor(score)}`, w / 2, h * 0.64);
  ctx.fillText(`Distance: ${Math.floor(distance)}m`, w / 2, h * 0.68);
  ctx.fillStyle = '#aaa';
  ctx.font = '14px monospace';
  ctx.fillText(`Needed: ${CONFIG.ESCAPE_DISTANCE}m to escape`, w / 2, h * 0.72);

  // Restart prompt
  if (Math.floor(frame / 25) % 2 === 0) {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('Press SPACE to try again!', w / 2, h * 0.85);
  }

  ctx.restore();
}

/** Draw the victory screen (escaped!) */
export function drawVictoryScreen(ctx, score, frame) {
  const w = CONFIG.WIDTH;
  const h = CONFIG.HEIGHT;

  // Bright celebration background
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 500);
  bgGrad.addColorStop(0, '#FFD700');
  bgGrad.addColorStop(0.5, '#FF8C00');
  bgGrad.addColorStop(1, '#228B22');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Confetti
  const confettiColors = ['#FF4444', '#44FF44', '#4444FF', '#FFD700', '#FF69B4', '#00CED1'];
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = confettiColors[i % confettiColors.length];
    ctx.save();
    const cx = (i * 29 + frame * 1.5) % w;
    const cy = (i * 17 + frame * 2) % h;
    ctx.translate(cx, cy);
    ctx.rotate(frame * 0.05 + i);
    ctx.fillRect(-3, -6, 6, 12);
    ctx.restore();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // "ESCAPED!" title
  const titleBounce = Math.sin(frame * 0.08) * 5;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.font = 'bold 64px monospace';
  ctx.fillText('ESCAPED!', w / 2 + 3, h * 0.18 + titleBounce + 3);
  ctx.fillStyle = '#fff';
  ctx.fillText('ESCAPED!', w / 2, h * 0.18 + titleBounce);

  // Celebration subtitle
  ctx.fillStyle = '#1a0e08';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('🦃 Freedom! No Thanksgiving dinner today! 🎉', w / 2, h * 0.28);

  // Happy turkey
  drawHappyTurkey(ctx, w / 2, h * 0.48, frame);

  // Score box
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(w / 2 - 160, h * 0.66, 320, 70);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.strokeRect(w / 2 - 160, h * 0.66, 320, 70);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(`SCORE: ${Math.floor(score)}`, w / 2, h * 0.71);
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText('🌟 Turkey Hero! You outsmarted the farmer! 🌟', w / 2, h * 0.75);

  // Restart
  if (Math.floor(frame / 25) % 2 === 0) {
    ctx.fillStyle = '#1a0e08';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('Press SPACE to play again!', w / 2, h * 0.88);
  }
}

function drawHappyTurkey(ctx, x, y, frame) {
  ctx.save();
  ctx.translate(x, y);
  const scale = 2;
  ctx.scale(scale, scale);

  const bob = Math.sin(frame * 0.12) * 4;
  const jump = Math.abs(Math.sin(frame * 0.06)) * 8;

  ctx.translate(0, -jump);

  // Tail feathers (celebratory spread)
  const tailColors = ['#FF4444', '#FFD700', '#32CD32', '#4169E1', '#FF69B4', '#FF8C00', '#9370DB'];
  for (let i = 0; i < 7; i++) {
    ctx.save();
    ctx.translate(-8, -5);
    const angle = -0.9 + i * 0.3 + Math.sin(frame * 0.06 + i * 0.3) * 0.12;
    ctx.rotate(angle);
    ctx.fillStyle = tailColors[i];
    ctx.beginPath();
    ctx.ellipse(0, -22, 6, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Body
  ctx.fillStyle = '#8B6914';
  ctx.beginPath();
  ctx.ellipse(0, bob, 16, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wings (up in celebration!)
  ctx.save();
  ctx.translate(-14, bob - 4);
  ctx.rotate(-0.8 + Math.sin(frame * 0.15) * 0.3);
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(-4, -4, 9, 7, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(14, bob - 4);
  ctx.rotate(0.8 - Math.sin(frame * 0.15) * 0.3);
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(4, -4, 9, 7, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Head
  ctx.fillStyle = '#8B6914';
  ctx.beginPath();
  ctx.arc(8, bob - 15, 9, 0, Math.PI * 2);
  ctx.fill();

  // Happy eyes (^_^)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(5, bob - 18, 3, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(11, bob - 18, 3, Math.PI, 0);
  ctx.stroke();

  // Big smile beak
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(15, bob - 17);
  ctx.lineTo(24, bob - 14);
  ctx.lineTo(15, bob - 12);
  ctx.closePath();
  ctx.fill();

  // Party hat!
  ctx.fillStyle = '#FF4444';
  ctx.beginPath();
  ctx.moveTo(3, bob - 24);
  ctx.lineTo(8, bob - 38);
  ctx.lineTo(13, bob - 24);
  ctx.closePath();
  ctx.fill();
  // Hat pom-pom
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(8, bob - 38, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

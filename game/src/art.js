/** Original canvas artwork and the shared autumn palette. No external assets. */
export const palette = { ink: '#241e2b', cream: '#fff0cc', gold: '#ffc56c', red: '#e76f51', teal: '#8fcbc1' };

export function panel(ctx, x, y, width, height, fill = '#241e2be8', radius = 14) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

export function text(ctx, value, x, y, size = 16, color = palette.cream, align = 'left', family = 'sans-serif') {
  ctx.font = `bold ${size}px ${family}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function tree(ctx, x, y, scale, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#533741';
  ctx.fillRect(-7, -170, 14, 170);
  for (let i = 0; i < 6; i++) {
    const angle = i * 2.4;
    ellipse(ctx, Math.sin(angle) * 34, -150 + Math.cos(angle) * 30, 42, 45, color);
  }
  ctx.strokeStyle = '#53374166';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -20); ctx.lineTo(0, -163);
  ctx.moveTo(0, -100); ctx.lineTo(-35, -142);
  ctx.moveTo(0, -70); ctx.lineTo(35, -137);
  ctx.stroke();
  ctx.restore();
}

export function drawAutumnScene(ctx, stage, offset, frame) {
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#53405e'); sky.addColorStop(0.5, '#d77c6a'); sky.addColorStop(1, '#f9cc8a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 960, 540);
  ellipse(ctx, 724, 164, 66, 66, '#ffdc9e');
  ellipse(ctx, 724, 164, 85, 85, '#ffdc9e18');
  for (let layer = 0; layer < 3; layer++) {
    ctx.fillStyle = ['#8e6675', '#9b786e', '#626364'][layer];
    ctx.beginPath(); ctx.moveTo(0, 420);
    for (let x = 0; x <= 960; x += 12) {
      ctx.lineTo(x, 310 + layer * 28 + Math.sin((x + offset * (0.08 + layer * 0.04)) / 160 + layer) * 38);
    }
    ctx.lineTo(960, 420); ctx.fill();
  }
  for (let i = 0; i < 8; i++) {
    const x = ((i * 173 - offset * 0.22) % 1384 + 1384) % 1384 - 160;
    tree(ctx, x, 415, 0.8 + (i % 3) * 0.18, ['#be654d', '#d89653', '#dfb15f'][i % 3]);
  }
  // Weathered red barn and its lit loft, moving on a separate parallax plane.
  const bx = ((730 - offset * 0.13) % 1300 + 1300) % 1300 - 120;
  ctx.fillStyle = '#713e49'; ctx.fillRect(bx, 270, 174, 150);
  ctx.fillStyle = '#3e3548'; ctx.beginPath(); ctx.moveTo(bx - 18, 273); ctx.lineTo(bx + 87, 198); ctx.lineTo(bx + 192, 273); ctx.fill();
  for (let i = 0; i < 12; i++) { ctx.fillStyle = '#d9836244'; ctx.fillRect(bx + i * 15, 279, 2, 140); }
  panel(ctx, bx + 63, 299, 50, 121, '#382c3b', 2);
  panel(ctx, bx + 75, 245, 26, 31, '#fbc88b', 2);
  ctx.strokeStyle = '#b68c73'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(bx + 65, 305); ctx.lineTo(bx + 110, 418); ctx.moveTo(bx + 110, 305); ctx.lineTo(bx + 65, 418); ctx.stroke();
  if (stage === 1) drawBarnInterior(ctx, offset, frame);
  if (stage === 2) drawKitchenInterior(ctx, offset, frame);
  const floor = ctx.createLinearGradient(0, 420, 0, 540);
  floor.addColorStop(0, stage === 2 ? '#b88466' : '#a17a54'); floor.addColorStop(1, '#372c39');
  ctx.fillStyle = floor; ctx.fillRect(0, 420, 960, 120);
  ctx.fillStyle = '#e5b67b'; ctx.fillRect(0, 420, 960, 5);
  for (let i = 0; i < 40; i++) {
    const x = ((i * 47 - offset) % 1000 + 1000) % 1000;
    ctx.fillStyle = i % 2 ? '#e4a25b55' : '#31283744';
    ctx.fillRect(x, 435 + (i * 31 % 85), 12 + i % 15, 2);
  }
  if (stage === 0) {
    ctx.fillStyle = '#5c4142';
    for (let x = -(offset * 0.5 % 95); x < 960; x += 95) ctx.fillRect(x, 363, 7, 57);
    ctx.fillRect(0, 375, 960, 6); ctx.fillRect(0, 399, 960, 5);
  }
  // Small drifting leaves make the world feel alive without obscuring hazards.
  for (let i = 0; i < 13; i++) {
    const x = ((i * 83 - frame * 0.5) % 1000 + 1000) % 1000;
    const y = (i * 79 + frame * 0.35) % 410;
    ctx.save(); ctx.translate(x, y); ctx.rotate(frame * 0.015 + i);
    ellipse(ctx, 0, 0, 3, 6, ['#f8c178', '#c66b52', '#f1a661'][i % 3]); ctx.restore();
  }
  const vignette = ctx.createRadialGradient(480, 280, 220, 480, 280, 580);
  vignette.addColorStop(0, '#241e2b00'); vignette.addColorStop(1, '#241e2b66');
  ctx.fillStyle = vignette; ctx.fillRect(0, 0, 960, 540);
}

function drawBarnInterior(ctx, offset, frame) {
  ctx.fillStyle = '#422e39dd'; ctx.fillRect(0, 0, 960, 420);
  for (let x = -(offset * 0.4 % 160); x < 960; x += 160) {
    ctx.fillStyle = '#6c4550'; ctx.fillRect(x, 0, 12, 420);
    ctx.fillStyle = '#ffd69918'; ctx.beginPath(); ctx.moveTo(x + 20, 0); ctx.lineTo(x + 145, 420); ctx.lineTo(x + 60, 420); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.fillStyle = '#edbb7e55'; ctx.fillRect(x + 28 + i * 23, 80 + (frame * 0.3 + i * 93) % 320, 2, 2); }
  }
  ctx.fillStyle = '#93694c'; ctx.fillRect(0, 82, 960, 17);
  text(ctx, 'CIDER MILL  •  KEEP THE DOOR CLOSED', 480, 143, 17, '#cb9a70', 'center', 'Georgia');
  for (let i = 0; i < 8; i++) {
    const x = ((i * 152 - offset * 0.6) % 1216 + 1216) % 1216;
    panel(ctx, x, 351, 112, 69, '#9b7046', 8);
    ctx.strokeStyle = '#d8a45b'; ctx.lineWidth = 2;
    for (let y = 363; y < 418; y += 9) { ctx.beginPath(); ctx.moveTo(x + 5, y); ctx.lineTo(x + 106, y - 3); ctx.stroke(); }
  }
}

function drawKitchenInterior(ctx, offset, frame) {
  ctx.fillStyle = '#344c50'; ctx.fillRect(0, 0, 960, 420);
  ctx.strokeStyle = '#6b858333'; ctx.lineWidth = 2;
  for (let x = -(offset * 0.3 % 70); x < 960; x += 70) ctx.strokeRect(x, 0, 70, 420);
  for (let y = 100; y < 420; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(960, y); ctx.stroke(); }
  for (let i = 0; i < 5; i++) {
    const x = ((i * 220 - offset * 0.2) % 1100 + 1100) % 1100 - 60;
    panel(ctx, x, 150, 138, 110, '#24363d', 9);
    ctx.fillStyle = '#edb174'; ctx.fillRect(x + 9, 159, 120, 91);
    ctx.fillStyle = '#344c50'; ctx.fillRect(x + 63, 159, 6, 91); ctx.fillRect(x + 9, 199, 120, 6);
    ellipse(ctx, x + 80, 90, 27, 25, '#b9875d');
    ctx.fillStyle = '#b9875d'; ctx.fillRect(x + 77, 0, 6, 70);
  }
  ctx.fillStyle = '#263139'; ctx.fillRect(0, 333, 960, 87);
  ctx.fillStyle = '#c6ac88'; ctx.fillRect(0, 326, 960, 10);
  for (let x = -(offset * 0.5 % 100); x < 960; x += 100) {
    ctx.strokeStyle = '#657875'; ctx.strokeRect(x, 343, 94, 72);
    ctx.fillStyle = '#bca583'; ctx.fillRect(x + 39, 352, 18, 3);
  }
  text(ctx, 'THANKSGIVING SPECIAL', 480, 121, 18, '#ffdc9e', 'center', 'Georgia');
}

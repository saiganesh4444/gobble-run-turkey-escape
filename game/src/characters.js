/** Draw the painted characters relative to the ground line. */
import { CONFIG } from './config.js';

const TAU = 2 * Math.PI;

function stride(phase, reach, lift) {
  const progress = (phase / TAU + 1) % 1;
  if (progress < 0.5) return [reach * (1 - 4 * progress), 0];
  const swing = 2 * progress - 1;
  return [reach * (2 * swing - 1), -lift * Math.sin(Math.PI * swing) ** 2];
}

function shadow(ctx, x, width, opacity) {
  ctx.fillStyle = `rgba(32, 20, 29, ${opacity})`;
  ctx.beginPath();
  ctx.ellipse(x, 0, width, 3, 0, 0, TAU);
  ctx.fill();
}

function turkeyLeg(ctx, hipX, hipY, toeX, soleY, rear) {
  const ankleY = soleY - 3;
  const hockX = hipX + (toeX - hipX) * 0.34 - 4;
  const hockY = hipY + (ankleY - hipY) * 0.45;
  const outline = '#583018';
  const gold = rear ? '#ad662e' : '#e2a553';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.quadraticCurveTo(hipX - 2, hockY - 3, hockX, hockY);
  ctx.lineTo(toeX, ankleY);
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4.5;
  ctx.stroke();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2.4;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toeX - 3.5, soleY - 1.7);
  ctx.lineTo(toeX, ankleY);
  ctx.quadraticCurveTo(toeX + 3.5, ankleY - 0.5, toeX + 8, soleY - 1.4);
  ctx.moveTo(toeX + 1, ankleY);
  ctx.lineTo(toeX + 5, soleY - 0.9);
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.15;
  ctx.stroke();
}

export function drawPaintedTurkey(ctx, art, turkey) {
  const phase = (turkey.legTimer * 0.3) % TAU;
  const crouched = turkey.ducking;
  const grounded = turkey.grounded;
  const bob = grounded ? -Math.abs(Math.sin(phase)) * (crouched ? 0.9 : 2) : -1;
  const bodyBottom = (crouched ? -4 : grounded ? -15 : -17) + bob;
  const bodyHeight = crouched ? 45 : 79;
  const bodyWidth = crouched ? 96 : 83;
  const bodyX = crouched ? -69 : -59;
  const heightOffGround = grounded ? 0 : Math.max(0, CONFIG.GROUND_Y - turkey.y - turkey.height);

  ctx.save();
  ctx.translate(turkey.x + turkey.width / 2, turkey.y + turkey.height);
  ctx.save();
  ctx.translate(0, heightOffGround);
  shadow(ctx, -11, 21, 0.32 / (1 + heightOffGround / 40));
  ctx.restore();

  if (turkey.dashing) {
    ctx.save();
    ctx.globalAlpha *= 0.26;
    ctx.drawImage(art, bodyX - 17, bodyBottom - bodyHeight + 3, bodyWidth, bodyHeight);
    ctx.restore();
  }
  for (const rear of [true, false]) {
    const hipX = bodyX + (rear ? 0.46 : 0.64) * bodyWidth;
    const hipY = bodyBottom - (rear ? 7 : 10);
    const [swing, rise] = grounded
      ? stride(phase + (rear ? Math.PI : 0), crouched ? 5 : 12, crouched ? 2 : 7)
      : [rear ? -6 : turkey.vy < 0 ? 4 : 8, rear ? -10 : -6];
    turkeyLeg(ctx, hipX, hipY, hipX + swing + 2, rise, rear);
  }
  ctx.drawImage(art, bodyX, bodyBottom - bodyHeight, bodyWidth, bodyHeight);
  ctx.restore();
}

export function drawPaintedFarmer(ctx, art, farmer) {
  const columns = 4;
  const rows = 2;
  const frame = Math.floor(farmer.legTimer * 0.17) % (columns * rows);
  const cellWidth = art.naturalWidth / columns;
  const cellHeight = art.naturalHeight / rows;
  const height = 108;
  const width = height * cellWidth / cellHeight;
  // The atlas frames share the same ground line, seven pixels above the cell edge.
  const ground = height * (cellHeight - 7) / cellHeight;

  ctx.save();
  ctx.translate(farmer.x + farmer.width / 2, farmer.y + farmer.height);
  shadow(ctx, -4, 26, 0.38);
  ctx.drawImage(art,
    (frame % columns) * cellWidth, Math.floor(frame / columns) * cellHeight,
    cellWidth, cellHeight, -width / 2 + 4, -ground, width, height);
  ctx.restore();
}

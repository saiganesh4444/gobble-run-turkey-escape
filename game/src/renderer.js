/** Background renderer with parallax scrolling per stage */

import { CONFIG, STAGES } from './config.js';

/** Draw the full background for the current stage */
export function drawBackground(ctx, stageIndex, scrollOffset, frame) {
  const stage = STAGES[stageIndex] || STAGES[0];
  const w = CONFIG.WIDTH;
  const h = CONFIG.HEIGHT;

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, CONFIG.GROUND_Y);
  skyGrad.addColorStop(0, stage.skyTop);
  skyGrad.addColorStop(1, stage.skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, CONFIG.GROUND_Y);

  // Clouds (slow parallax)
  drawClouds(ctx, scrollOffset * 0.15, frame);

  // Background elements by stage
  if (stage.bgElements === 'farm') {
    drawFarmBg(ctx, scrollOffset, frame);
  } else if (stage.bgElements === 'barn') {
    drawBarnBg(ctx, scrollOffset, frame);
  } else if (stage.bgElements === 'kitchen') {
    drawKitchenBg(ctx, scrollOffset, frame);
  }

  // Ground
  const groundGrad = ctx.createLinearGradient(0, CONFIG.GROUND_Y, 0, h);
  groundGrad.addColorStop(0, stage.groundColor);
  groundGrad.addColorStop(1, stage.groundAccent);
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, CONFIG.GROUND_Y, w, h - CONFIG.GROUND_Y);

  // Ground details
  drawGroundDetails(ctx, scrollOffset, stageIndex);
}

function drawClouds(ctx, offset, frame) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  const clouds = [
    { x: 100, y: 50, w: 80, h: 30 },
    { x: 350, y: 30, w: 100, h: 35 },
    { x: 600, y: 60, w: 70, h: 25 },
    { x: 850, y: 40, w: 90, h: 32 },
    { x: 1100, y: 55, w: 75, h: 28 },
  ];
  for (const c of clouds) {
    const cx = ((c.x - offset) % (CONFIG.WIDTH + 200)) - 100;
    const adjustedCx = cx < -100 ? cx + CONFIG.WIDTH + 200 : cx;
    ctx.beginPath();
    ctx.ellipse(adjustedCx, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(adjustedCx - c.w * 0.25, c.y + 5, c.w * 0.3, c.h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(adjustedCx + c.w * 0.25, c.y + 3, c.w * 0.3, c.h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFarmBg(ctx, offset, frame) {
  // Distant hills
  ctx.fillStyle = '#6B8E23';
  for (let i = 0; i < 4; i++) {
    const hx = ((i * 350 - offset * 0.3) % (CONFIG.WIDTH + 400)) - 200;
    const adjustedHx = hx < -200 ? hx + CONFIG.WIDTH + 400 : hx;
    ctx.beginPath();
    ctx.ellipse(adjustedHx, CONFIG.GROUND_Y, 200, 80, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  // Fence posts (medium parallax)
  ctx.strokeStyle = '#5C4033';
  ctx.lineWidth = 4;
  const fenceOffset = offset * 0.6;
  for (let i = 0; i < 15; i++) {
    const fx = ((i * 80 - fenceOffset) % (CONFIG.WIDTH + 160)) - 80;
    const adjustedFx = fx < -80 ? fx + CONFIG.WIDTH + 160 : fx;
    // Post
    ctx.beginPath();
    ctx.moveTo(adjustedFx, CONFIG.GROUND_Y);
    ctx.lineTo(adjustedFx, CONFIG.GROUND_Y - 50);
    ctx.stroke();
  }
  // Fence rails
  ctx.lineWidth = 2;
  for (let rail = 0; rail < 2; rail++) {
    const ry = CONFIG.GROUND_Y - 20 - rail * 18;
    ctx.beginPath();
    ctx.moveTo(0, ry);
    ctx.lineTo(CONFIG.WIDTH, ry);
    ctx.stroke();
  }

  // Scarecrow (slow parallax)
  const scareX = ((500 - offset * 0.4) % (CONFIG.WIDTH + 300)) - 100;
  const adjustedScareX = scareX < -100 ? scareX + CONFIG.WIDTH + 300 : scareX;
  drawScarecrow(ctx, adjustedScareX, CONFIG.GROUND_Y - 90, frame);

  // Trees
  drawTrees(ctx, offset * 0.5, '#228B22', '#1B5E20');
}

function drawBarnBg(ctx, offset, frame) {
  // Distant mountains
  ctx.fillStyle = '#5D4E37';
  for (let i = 0; i < 3; i++) {
    const mx = ((i * 400 + 100 - offset * 0.2) % (CONFIG.WIDTH + 500)) - 200;
    const adjustedMx = mx < -200 ? mx + CONFIG.WIDTH + 500 : mx;
    ctx.beginPath();
    ctx.moveTo(adjustedMx - 180, CONFIG.GROUND_Y);
    ctx.lineTo(adjustedMx, CONFIG.GROUND_Y - 160);
    ctx.lineTo(adjustedMx + 180, CONFIG.GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }

  // Barn silhouette
  const barnX = ((600 - offset * 0.3) % (CONFIG.WIDTH + 400)) - 100;
  const adjustedBarnX = barnX < -100 ? barnX + CONFIG.WIDTH + 400 : barnX;
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(adjustedBarnX, CONFIG.GROUND_Y - 120, 140, 120);
  // Barn roof
  ctx.fillStyle = '#5C4033';
  ctx.beginPath();
  ctx.moveTo(adjustedBarnX - 10, CONFIG.GROUND_Y - 120);
  ctx.lineTo(adjustedBarnX + 70, CONFIG.GROUND_Y - 170);
  ctx.lineTo(adjustedBarnX + 150, CONFIG.GROUND_Y - 120);
  ctx.closePath();
  ctx.fill();
  // Barn door
  ctx.fillStyle = '#3D2B1F';
  ctx.fillRect(adjustedBarnX + 45, CONFIG.GROUND_Y - 80, 50, 80);
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.arc(adjustedBarnX + 85, CONFIG.GROUND_Y - 40, 3, 0, Math.PI * 2);
  ctx.fill();
  // X on door
  ctx.strokeStyle = '#5C4033';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(adjustedBarnX + 50, CONFIG.GROUND_Y - 75);
  ctx.lineTo(adjustedBarnX + 90, CONFIG.GROUND_Y - 5);
  ctx.moveTo(adjustedBarnX + 90, CONFIG.GROUND_Y - 75);
  ctx.lineTo(adjustedBarnX + 50, CONFIG.GROUND_Y - 5);
  ctx.stroke();

  // Windmill
  const wmX = ((200 - offset * 0.35) % (CONFIG.WIDTH + 350)) - 50;
  const adjustedWmX = wmX < -50 ? wmX + CONFIG.WIDTH + 350 : wmX;
  drawWindmill(ctx, adjustedWmX, CONFIG.GROUND_Y, frame);
}

function drawKitchenBg(ctx, offset, frame) {
  // Kitchen wall (tile pattern)
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.GROUND_Y);

  // Tile pattern
  ctx.strokeStyle = '#DDD5C0';
  ctx.lineWidth = 1;
  const tileSize = 40;
  for (let tx = -offset * 0.5 % tileSize; tx < CONFIG.WIDTH; tx += tileSize) {
    ctx.beginPath();
    ctx.moveTo(tx, 0);
    ctx.lineTo(tx, CONFIG.GROUND_Y);
    ctx.stroke();
  }
  for (let ty = 0; ty < CONFIG.GROUND_Y; ty += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, ty);
    ctx.lineTo(CONFIG.WIDTH, ty);
    ctx.stroke();
  }

  // Kitchen counter at back
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(0, CONFIG.GROUND_Y - 160, CONFIG.WIDTH, 30);
  // Counter top
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, CONFIG.GROUND_Y - 165, CONFIG.WIDTH, 10);

  // Hanging pots and pans
  ctx.fillStyle = '#808080';
  for (let i = 0; i < 6; i++) {
    const px = ((i * 160 + 50 - offset * 0.4) % (CONFIG.WIDTH + 200)) - 50;
    const adjustedPx = px < -50 ? px + CONFIG.WIDTH + 200 : px;
    // Hook
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(adjustedPx, 0);
    ctx.lineTo(adjustedPx, 30 + i * 5);
    ctx.stroke();
    // Pan/pot
    if (i % 2 === 0) {
      ctx.fillStyle = '#696969';
      ctx.beginPath();
      ctx.arc(adjustedPx, 40 + i * 5, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(adjustedPx + 12, 35 + i * 5, 15, 4);
    } else {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(adjustedPx - 12, 30 + i * 5, 24, 20);
      ctx.fillRect(adjustedPx - 14, 28 + i * 5, 28, 4);
    }
  }

  // Thanksgiving turkey poster on wall
  const posterX = ((400 - offset * 0.3) % (CONFIG.WIDTH + 300)) - 50;
  const adjustedPosterX = posterX < -50 ? posterX + CONFIG.WIDTH + 300 : posterX;
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(adjustedPosterX, CONFIG.GROUND_Y - 280, 80, 100);
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 3;
  ctx.strokeRect(adjustedPosterX, CONFIG.GROUND_Y - 280, 80, 100);
  // "DINNER" text
  ctx.fillStyle = '#8B0000';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DINNER', adjustedPosterX + 40, CONFIG.GROUND_Y - 258);
  ctx.fillText('TIME!', adjustedPosterX + 40, CONFIG.GROUND_Y - 245);
  // Simple turkey drawing on poster
  ctx.fillStyle = '#8B6914';
  ctx.beginPath();
  ctx.arc(adjustedPosterX + 40, CONFIG.GROUND_Y - 220, 12, 0, Math.PI * 2);
  ctx.fill();
}

function drawScarecrow(ctx, x, y, frame) {
  // Post
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(x - 3, y, 6, 90);
  // Cross beam
  ctx.fillRect(x - 25, y + 15, 50, 5);
  // Head
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fill();
  // Hat
  ctx.fillStyle = '#3D2B1F';
  ctx.fillRect(x - 15, y - 20, 30, 5);
  ctx.fillRect(x - 10, y - 30, 20, 12);
  // Eyes
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 4);
  ctx.lineTo(x - 2, y);
  ctx.lineTo(x - 5, y + 1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 5, y - 4);
  ctx.lineTo(x + 2, y);
  ctx.lineTo(x + 5, y + 1);
  ctx.stroke();
  // Straw bits (swaying)
  ctx.strokeStyle = '#DAA520';
  ctx.lineWidth = 1;
  const sway = Math.sin(frame * 0.03) * 3;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * 8, y + 20);
    ctx.lineTo(x + i * 12 + sway, y + 50);
    ctx.stroke();
  }
}

function drawWindmill(ctx, x, groundY, frame) {
  // Tower
  ctx.fillStyle = '#8B7355';
  ctx.beginPath();
  ctx.moveTo(x - 12, groundY);
  ctx.lineTo(x - 8, groundY - 100);
  ctx.lineTo(x + 8, groundY - 100);
  ctx.lineTo(x + 12, groundY);
  ctx.closePath();
  ctx.fill();
  // Blades
  ctx.strokeStyle = '#5C4033';
  ctx.lineWidth = 3;
  const rot = frame * 0.02;
  for (let i = 0; i < 4; i++) {
    const angle = rot + (Math.PI / 2) * i;
    ctx.beginPath();
    ctx.moveTo(x, groundY - 100);
    ctx.lineTo(x + Math.cos(angle) * 40, groundY - 100 + Math.sin(angle) * 40);
    ctx.stroke();
  }
}

function drawTrees(ctx, offset, color1, color2) {
  const treePositions = [150, 400, 700, 950, 1200];
  for (const tp of treePositions) {
    const tx = ((tp - offset) % (CONFIG.WIDTH + 300)) - 100;
    const adjustedTx = tx < -100 ? tx + CONFIG.WIDTH + 300 : tx;
    // Trunk
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(adjustedTx - 6, CONFIG.GROUND_Y - 60, 12, 60);
    // Autumn foliage
    const colors = ['#B22222', '#DAA520', '#D2691E', '#FF8C00', color1];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(adjustedTx + (i - 1) * 15, CONFIG.GROUND_Y - 70 - i * 8, 20 + i * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawGroundDetails(ctx, offset, stageIndex) {
  const detailOffset = offset * 0.9;
  
  if (stageIndex <= 1) {
    // Grass tufts
    ctx.strokeStyle = '#3D6B1E';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      const gx = ((i * 55 - detailOffset) % (CONFIG.WIDTH + 100)) - 50;
      const adjustedGx = gx < -50 ? gx + CONFIG.WIDTH + 100 : gx;
      for (let j = -1; j <= 1; j++) {
        ctx.beginPath();
        ctx.moveTo(adjustedGx + j * 4, CONFIG.GROUND_Y);
        ctx.lineTo(adjustedGx + j * 6, CONFIG.GROUND_Y - 8 - Math.random() * 4);
        ctx.stroke();
      }
    }
  } else {
    // Kitchen floor tiles
    ctx.strokeStyle = '#5A3A1A';
    ctx.lineWidth = 1;
    const floorTile = 50;
    for (let fx = -detailOffset % floorTile; fx < CONFIG.WIDTH; fx += floorTile) {
      ctx.beginPath();
      ctx.moveTo(fx, CONFIG.GROUND_Y);
      ctx.lineTo(fx, CONFIG.HEIGHT);
      ctx.stroke();
    }
  }
}

/** Draw the HUD */
export function drawHUD(ctx, turkey, stageIndex, scrollSpeed) {
  const stage = STAGES[stageIndex] || STAGES[0];

  // Semi-transparent HUD bar
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, CONFIG.WIDTH, 44);

  // Stage name
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Stage: ${stage.name}`, 12, 16);

  // Score
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`Score: ${Math.floor(turkey.score)}`, 12, 36);

  // Distance bar
  const distPct = Math.min(1, turkey.distance / CONFIG.ESCAPE_DISTANCE);
  const barX = 250;
  const barW = 300;
  const barH = 14;
  const barY = 15;
  
  // Bar background
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(barX, barY, barW, barH);
  
  // Bar fill with gradient
  const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  barGrad.addColorStop(0, '#32CD32');
  barGrad.addColorStop(0.5, '#FFD700');
  barGrad.addColorStop(1, '#FF4500');
  ctx.fillStyle = barGrad;
  ctx.fillRect(barX, barY, barW * distPct, barH);
  
  // Bar border
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);
  
  // Distance label
  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.floor(turkey.distance)}m / ${CONFIG.ESCAPE_DISTANCE}m`, barX + barW / 2, barY + 11);
  
  // Turkey icon on distance bar
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(barX + barW * distPct, barY + barH / 2, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8B6914';
  ctx.beginPath();
  ctx.arc(barX + barW * distPct, barY + barH / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  // Stage markers on bar
  const stages = [0, CONFIG.STAGE_2_DISTANCE, CONFIG.STAGE_3_DISTANCE];
  const stageLabels = ['🏡', '🏚️', '🔪'];
  for (let i = 0; i < stages.length; i++) {
    const sx = barX + (stages[i] / CONFIG.ESCAPE_DISTANCE) * barW;
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(stageLabels[i], sx, barY - 2);
  }

  // Lives (turkey hearts)
  ctx.textAlign = 'right';
  ctx.font = '14px monospace';
  ctx.fillStyle = '#FF4444';
  let livesStr = '';
  for (let i = 0; i < turkey.lives; i++) livesStr += '❤️ ';
  for (let i = turkey.lives; i < CONFIG.TURKEY_MAX_LIVES; i++) livesStr += '🖤 ';
  ctx.fillText(livesStr, CONFIG.WIDTH - 12, 20);

  // Dash cooldown indicator
  if (turkey.dashCooldown > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px monospace';
    ctx.fillText('DASH ⏳', CONFIG.WIDTH - 12, 38);
  } else {
    ctx.fillStyle = '#00FF00';
    ctx.font = '11px monospace';
    ctx.fillText('DASH ✓', CONFIG.WIDTH - 12, 38);
  }

  // Speed indicator
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD700';
  ctx.font = '10px monospace';
  ctx.fillText(`Speed: ${scrollSpeed.toFixed(1)}`, barX + barW / 2, barY + barH + 14);
}

/** Draw stage transition overlay */
export function drawStageTransition(ctx, stageName, progress) {
  ctx.fillStyle = `rgba(0, 0, 0, ${0.6 * (1 - Math.abs(progress - 0.5) * 2)})`;
  ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

  if (progress > 0.2 && progress < 0.8) {
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stageName, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 20);
    ctx.fillStyle = '#fff';
    ctx.font = '18px monospace';
    ctx.fillText('Get ready!', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 25);
  }
}

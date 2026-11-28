/** Game entities: Turkey, Farmer, Obstacles, Collectibles */

import { CONFIG } from './config.js';
const turkeyArt = document.getElementById('turkeyArt');
const farmerArt = document.getElementById('farmerArt');

// ---- TURKEY ----

export function createTurkey() {
  return {
    x: CONFIG.TURKEY_X,
    y: CONFIG.GROUND_Y - CONFIG.TURKEY_HEIGHT,
    width: CONFIG.TURKEY_WIDTH,
    height: CONFIG.TURKEY_HEIGHT,
    vy: 0,
    grounded: true,
    jumps: 0,
    maxJumps: 2,
    ducking: false,
    dashing: false,
    dashTimer: 0,
    dashCooldown: 0,
    lives: CONFIG.TURKEY_MAX_LIVES,
    invincible: 0,
    score: 0,
    distance: 0,
    wingAngle: 0,
    legTimer: 0,
    bobTimer: 0,
  };
}

export function drawTurkey(ctx, turkey, frame) {
  if (turkeyArt.complete && turkeyArt.naturalWidth) {
    if (turkey.invincible > 0 && Math.floor(turkey.invincible / 4) % 2 === 0) return;
    const feet = turkey.y + turkey.height;
    const stride = Math.sin(turkey.legTimer * 0.3) * 12;
    ctx.save();
    ctx.translate(turkey.x + turkey.width / 2, feet);
    if (turkey.dashing) {
      ctx.globalAlpha = 0.28;
      ctx.drawImage(turkeyArt, -86, -80, 90, 72);
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = '#a95a1c';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      const swing = stride * side;
      ctx.beginPath();
      ctx.moveTo(side * 7, -17);
      ctx.lineTo(side * 8 + swing * 0.4, -7);
      ctx.lineTo(side * 10 + swing, -1);
      ctx.lineTo(side * 10 + swing + 9, -1);
      ctx.stroke();
    }
    const crouch = turkey.ducking ? 15 : 0;
    const bob = turkey.grounded ? Math.sin(turkey.bobTimer * 0.3) * 2 : -3;
    ctx.drawImage(turkeyArt, -64, -86 + crouch + bob, 92, 88 - crouch);
    ctx.restore();
    return;
  }
  const { x, y, width, height, ducking, dashing, invincible, wingAngle, legTimer } = turkey;
  
  // Flash when invincible
  if (invincible > 0 && Math.floor(invincible / 4) % 2 === 0) return;

  ctx.save();
  ctx.translate(x + width / 2, y + height);

  const bob = Math.sin(turkey.bobTimer * 0.15) * 2;

  // Dash afterimage
  if (dashing) {
    ctx.globalAlpha = 0.3;
    ctx.translate(-8, 0);
    drawTurkeyBody(ctx, width, height, ducking, bob, frame, wingAngle, legTimer);
    ctx.translate(8, 0);
    ctx.globalAlpha = 1;
  }

  drawTurkeyBody(ctx, width, height, ducking, bob, frame, wingAngle, legTimer);
  ctx.restore();
}

function drawTurkeyBody(ctx, w, h, ducking, bob, frame, wingAngle, legTimer) {
  const bodyH = ducking ? h * 0.55 : h;
  const bodyY = ducking ? -bodyH + 4 : -bodyH;

  // Legs
  ctx.strokeStyle = '#D4760A';
  ctx.lineWidth = 3;
  const legSwing = Math.sin(legTimer * 0.3) * 6;
  ctx.beginPath();
  ctx.moveTo(-6, -4);
  ctx.lineTo(-8 + legSwing, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(6, -4);
  ctx.lineTo(8 - legSwing, 0);
  ctx.stroke();

  // Feet
  ctx.fillStyle = '#D4760A';
  ctx.fillRect(-12 + legSwing, -2, 8, 3);
  ctx.fillRect(4 - legSwing, -2, 8, 3);

  // Tail feathers (fan shape)
  const tailColors = ['#823d46', '#a94d45', '#ca7049', '#e2a253', '#f0bf70', '#d58b51', '#a45946'];
  for (let i = 0; i < 7; i++) {
    ctx.save();
    ctx.translate(-w * 0.3, bodyY + bodyH * 0.25);
    const angle = -1.15 + i * 0.32 + Math.sin(frame * 0.03 + i) * 0.04;
    ctx.rotate(angle);
    ctx.fillStyle = tailColors[i];
    ctx.beginPath();
    ctx.ellipse(0, -18, 5, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#422e39'; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.fillStyle = '#ffe0a3';
    ctx.beginPath(); ctx.ellipse(0, -32, 3.8, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#62394177'; ctx.beginPath(); ctx.moveTo(0, -29); ctx.lineTo(0, -2); ctx.stroke();
    ctx.restore();
  }

  // Body
  const bodyGradient = ctx.createLinearGradient(-20, bodyY, 20, 0);
  bodyGradient.addColorStop(0, '#593c43'); bodyGradient.addColorStop(0.5, '#99634a'); bodyGradient.addColorStop(1, '#c9905b');
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.ellipse(0, bodyY + bodyH * 0.55 + bob, w * 0.4, bodyH * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Breast
  ctx.fillStyle = '#D4A574';
  ctx.beginPath();
  ctx.ellipse(4, bodyY + bodyH * 0.6 + bob, w * 0.25, bodyH * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  ctx.save();
  ctx.translate(-4, bodyY + bodyH * 0.5 + bob);
  ctx.rotate(Math.sin(wingAngle) * 0.2 - 0.1);
  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(-8, 0, 10, bodyH * 0.25, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Head
  const headY = bodyY + bodyH * 0.15 + bob;
  ctx.fillStyle = '#8B6914';
  ctx.beginPath();
  ctx.arc(8, headY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Snood (red wattle)
  ctx.fillStyle = '#DC143C';
  ctx.beginPath();
  ctx.ellipse(14, headY + 6, 3, 7 + Math.sin(frame * 0.1) * 1, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(16, headY - 2);
  ctx.lineTo(24, headY + 1);
  ctx.lineTo(16, headY + 3);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(12, headY - 3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(13, headY - 3, 2, 0, Math.PI * 2);
  ctx.fill();
  // Eye highlight
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(14, headY - 4, 1, 0, Math.PI * 2);
  ctx.fill();

  // Comb on top
  ctx.fillStyle = '#DC143C';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(6 + i * 4, headY - 11, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---- FARMER ----

export function createFarmer(x) {
  return {
    x,
    y: CONFIG.GROUND_Y - CONFIG.FARMER_HEIGHT,
    width: CONFIG.FARMER_WIDTH,
    height: CONFIG.FARMER_HEIGHT,
    speed: CONFIG.FARMER_BASE_SPEED,
    legTimer: 0,
    armAngle: 0,
    angry: false,
    mode: 'ON YOUR TAIL',
    sprintTimer: 0,
  };
}

export function drawFarmer(ctx, farmer, frame) {
  if (farmerArt.complete && farmerArt.naturalWidth) {
    const stride = Math.sin(farmer.legTimer * 0.25) * 13;
    ctx.save();
    ctx.translate(farmer.x + farmer.width / 2, farmer.y + farmer.height);
    ctx.strokeStyle = '#263b4c';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * 13, -19);
      ctx.lineTo(side * 13 + stride * side, -3);
      ctx.stroke();
      ctx.fillStyle = '#382a25';
      ctx.fillRect(side * 13 + stride * side - 7, -3, 19, 7);
    }
    ctx.drawImage(farmerArt, -52, -86 + Math.sin(frame * 0.3) * 2, 105, 77);
    ctx.restore();
    return;
  }
  const { x, y, width, height, legTimer, armAngle } = farmer;

  ctx.save();
  ctx.translate(x + width / 2, y + height);

  // Legs (overalls)
  ctx.fillStyle = '#1E3A5F';
  const legSwing = Math.sin(legTimer * 0.25) * 8;
  ctx.fillRect(-10 + legSwing, -16, 8, 16);
  ctx.fillRect(2 - legSwing, -16, 8, 16);

  // Boots
  ctx.fillStyle = '#3D2B1F';
  ctx.fillRect(-12 + legSwing, -4, 12, 5);
  ctx.fillRect(0 - legSwing, -4, 12, 5);

  // Body (plaid shirt)
  ctx.fillStyle = '#CC3333';
  ctx.fillRect(-14, -44, 28, 30);
  // Plaid pattern
  ctx.strokeStyle = '#992222';
  ctx.lineWidth = 2;
  for (let i = -44; i < -14; i += 6) {
    ctx.beginPath();
    ctx.moveTo(-14, i);
    ctx.lineTo(14, i);
    ctx.stroke();
  }
  for (let i = -14; i < 14; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, -44);
    ctx.lineTo(i, -14);
    ctx.stroke();
  }

  // Overalls bib
  ctx.fillStyle = '#1E3A5F';
  ctx.fillRect(-10, -38, 20, 14);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1;
  ctx.strokeRect(-10, -38, 20, 14);

  // Arms
  ctx.fillStyle = '#CC3333';
  ctx.save();
  ctx.translate(14, -38);
  ctx.rotate(Math.sin(armAngle) * 0.4 + 0.3);
  ctx.fillRect(0, 0, 8, 22);
  // Hand holding knife
  ctx.fillStyle = '#FDBCB4';
  ctx.fillRect(0, 20, 8, 6);
  // Carving knife in hand
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(2, 24, 3, 14);
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(1, 20, 5, 6);
  ctx.restore();

  // Other arm
  ctx.fillStyle = '#CC3333';
  ctx.save();
  ctx.translate(-14, -38);
  ctx.rotate(-Math.sin(armAngle) * 0.3 - 0.2);
  ctx.fillRect(-8, 0, 8, 20);
  ctx.fillStyle = '#FDBCB4';
  ctx.fillRect(-8, 18, 8, 6);
  ctx.restore();

  // Head
  ctx.fillStyle = '#FDBCB4';
  ctx.beginPath();
  ctx.arc(0, -52, 12, 0, Math.PI * 2);
  ctx.fill();

  // Hat (straw hat)
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(-16, -66, 32, 6);
  ctx.fillRect(-10, -72, 20, 8);
  // Hat band
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-16, -66, 32, 3);

  // Face
  // Eyes (angry)
  ctx.fillStyle = '#000';
  ctx.fillRect(-6, -55, 4, 3);
  ctx.fillRect(3, -55, 4, 3);
  // Angry eyebrows
  ctx.strokeStyle = '#3D2B1F';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -58);
  ctx.lineTo(-2, -56);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(9, -58);
  ctx.lineTo(3, -56);
  ctx.stroke();
  // Mouth (grimace)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-4, -47);
  ctx.quadraticCurveTo(0, -44, 4, -47);
  ctx.stroke();

  // Mustache
  ctx.fillStyle = '#3D2B1F';
  ctx.beginPath();
  ctx.moveTo(-6, -49);
  ctx.quadraticCurveTo(0, -46, 6, -49);
  ctx.quadraticCurveTo(0, -48, -6, -49);
  ctx.fill();

  ctx.restore();
}

// ---- OBSTACLES ----

export function createObstacle(type, x) {
  switch (type) {
    case 'knife':
      return {
        type: 'knife',
        x,
        y: CONFIG.GROUND_Y - CONFIG.KNIFE_HEIGHT - Math.random() * 60,
        width: CONFIG.KNIFE_WIDTH,
        height: CONFIG.KNIFE_HEIGHT,
        rotation: 0,
        rotSpeed: 0.12 + Math.random() * 0.08,
        flying: true,
      };
    case 'oven':
      return {
        type: 'oven',
        x,
        y: CONFIG.GROUND_Y - CONFIG.OVEN_HEIGHT,
        width: CONFIG.OVEN_WIDTH,
        height: CONFIG.OVEN_HEIGHT,
        glowTimer: 0,
      };
    case 'haybale':
      return {
        type: 'haybale',
        x,
        y: CONFIG.GROUND_Y - CONFIG.HAYBALE_HEIGHT,
        width: CONFIG.HAYBALE_WIDTH,
        height: CONFIG.HAYBALE_HEIGHT,
      };
    case 'pumpkin':
      return {
        type: 'pumpkin',
        x,
        y: CONFIG.GROUND_Y - CONFIG.PUMPKIN_HEIGHT,
        width: CONFIG.PUMPKIN_WIDTH,
        height: CONFIG.PUMPKIN_HEIGHT,
        bounce: 0,
      };
    default:
      return null;
  }
}

export function drawObstacle(ctx, obs, frame) {
  ctx.save();
  ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);

  switch (obs.type) {
    case 'knife':
      ctx.fillStyle = '#e2e9dd';
      ctx.beginPath();
      ctx.moveTo(-obs.width / 2, -7);
      ctx.lineTo(obs.width / 2 - 14, -7);
      ctx.lineTo(obs.width / 2 - 14, 7);
      ctx.quadraticCurveTo(-obs.width / 2, 8, -obs.width / 2, -7);
      ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-obs.width / 2 + 3, -6, obs.width - 20, 2);
      ctx.fillStyle = '#744137'; ctx.fillRect(obs.width / 2 - 14, -6, 14, 12);
      ctx.fillStyle = '#e9bc7a'; ctx.fillRect(obs.width / 2 - 10, -2, 2, 2); ctx.fillRect(obs.width / 2 - 4, -2, 2, 2);
      break;

    case 'oven':
      // Oven body
      ctx.fillStyle = '#333';
      const ovenW = obs.width;
      const ovenH = obs.height;
      ctx.fillRect(-ovenW / 2, -ovenH / 2, ovenW, ovenH);
      // Oven door
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-ovenW / 2 + 5, -ovenH / 2 + 5, ovenW - 10, ovenH * 0.6);
      // Window
      ctx.fillStyle = '#FF4500';
      const glow = Math.sin(frame * 0.1) * 0.3 + 0.7;
      ctx.globalAlpha = glow;
      ctx.fillRect(-ovenW / 2 + 10, -ovenH / 2 + 8, ovenW - 20, ovenH * 0.4);
      ctx.globalAlpha = 1;
      // Fire glow inside
      ctx.fillStyle = '#FF6600';
      ctx.globalAlpha = glow * 0.5;
      for (let i = 0; i < 3; i++) {
        const fx = -8 + i * 10 + Math.sin(frame * 0.15 + i) * 3;
        const fh = 8 + Math.sin(frame * 0.12 + i * 2) * 4;
        ctx.beginPath();
        ctx.ellipse(fx, -ovenH / 2 + 20, 4, fh, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Handle
      ctx.fillStyle = '#888';
      ctx.fillRect(-ovenW / 2 + 8, -ovenH / 2 + ovenH * 0.55, ovenW - 16, 4);
      // Knobs
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(-12 + i * 12, ovenH / 2 - 8, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Top burner glow
      ctx.fillStyle = '#FF4500';
      ctx.globalAlpha = glow * 0.3;
      ctx.beginPath();
      ctx.ellipse(0, -ovenH / 2 - 3, ovenW * 0.35, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;

    case 'haybale':
      // Hay bale (cylindrical look)
      ctx.fillStyle = '#DAA520';
      ctx.beginPath();
      ctx.ellipse(0, 0, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Straw lines
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-obs.width / 2 + 3, i * 5);
        ctx.lineTo(obs.width / 2 - 3, i * 5);
        ctx.stroke();
      }
      // Spiral center
      ctx.strokeStyle = '#8B6914';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 4, Math.PI, Math.PI * 2.5);
      ctx.stroke();
      break;

    case 'pumpkin':
      const bounceY = Math.sin(frame * 0.08) * 2;
      ctx.translate(0, bounceY);
      // Pumpkin body
      ctx.fillStyle = '#FF6B1A';
      // Main segments
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.ellipse(i * 6, 2, obs.width / 3.5, obs.height / 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Ridges
      ctx.strokeStyle = '#E05E10';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-3, -obs.height / 2 + 4);
      ctx.lineTo(-3, obs.height / 2 - 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4, -obs.height / 2 + 4);
      ctx.lineTo(4, obs.height / 2 - 2);
      ctx.stroke();
      // Stem
      ctx.fillStyle = '#228B22';
      ctx.fillRect(-2, -obs.height / 2 - 4, 4, 8);
      // Leaf
      ctx.fillStyle = '#2E8B57';
      ctx.beginPath();
      ctx.ellipse(4, -obs.height / 2 - 2, 5, 3, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Face (spooky pumpkin!)
      ctx.fillStyle = '#1a0a00';
      // Eyes
      ctx.beginPath();
      ctx.moveTo(-7, -3);
      ctx.lineTo(-3, -7);
      ctx.lineTo(1, -3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(3, -3);
      ctx.lineTo(7, -7);
      ctx.lineTo(11, -3);
      ctx.closePath();
      ctx.fill();
      // Mouth
      ctx.beginPath();
      ctx.moveTo(-6, 4);
      ctx.lineTo(-3, 2);
      ctx.lineTo(0, 5);
      ctx.lineTo(3, 2);
      ctx.lineTo(6, 4);
      ctx.lineTo(6, 7);
      ctx.lineTo(-6, 7);
      ctx.closePath();
      ctx.fill();
      break;
  }
  ctx.restore();
}

// ---- COLLECTIBLES ----

export function createCollectible(type, x) {
  const baseY = CONFIG.GROUND_Y - 40 - Math.random() * 80;
  if (type === 'corn') {
    return {
      type: 'corn',
      x,
      y: baseY,
      width: CONFIG.CORN_WIDTH,
      height: CONFIG.CORN_HEIGHT,
      bobTimer: Math.random() * 100,
    };
  }
  return {
    type: 'wishbone',
    x,
    y: baseY - 20,
    width: CONFIG.WISHBONE_WIDTH,
    height: CONFIG.WISHBONE_HEIGHT,
    bobTimer: Math.random() * 100,
    glow: 0,
  };
}

export function drawCollectible(ctx, col, frame) {
  const bob = Math.sin(col.bobTimer * 0.06) * 4;
  ctx.save();
  ctx.translate(col.x + col.width / 2, col.y + col.height / 2 + bob);

  if (col.type === 'corn') {
    // Corn cob
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, col.width / 3, col.height / 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Kernels
    ctx.fillStyle = '#FFA500';
    for (let r = -2; r <= 2; r++) {
      for (let c = -1; c <= 1; c++) {
        ctx.beginPath();
        ctx.arc(c * 4, r * 4, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Husk
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.moveTo(-3, col.height / 2.2);
    ctx.quadraticCurveTo(-8, col.height / 2.2 + 6, -4, col.height / 2.2 + 10);
    ctx.quadraticCurveTo(0, col.height / 2.2 + 4, 0, col.height / 2.2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3, col.height / 2.2);
    ctx.quadraticCurveTo(8, col.height / 2.2 + 6, 4, col.height / 2.2 + 10);
    ctx.quadraticCurveTo(0, col.height / 2.2 + 4, 0, col.height / 2.2);
    ctx.fill();
    // Sparkle
    const sparkle = Math.sin(frame * 0.15) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${sparkle * 0.6})`;
    ctx.beginPath();
    ctx.arc(-3, -4, 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Wishbone - glowing golden
    const glow = Math.sin(frame * 0.1) * 0.3 + 0.7;
    // Glow effect
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10 * glow;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    // Wishbone shape
    ctx.beginPath();
    ctx.moveTo(0, -col.height / 2);
    ctx.quadraticCurveTo(-8, 0, -10, col.height / 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -col.height / 2);
    ctx.quadraticCurveTo(8, 0, 10, col.height / 3);
    ctx.stroke();
    // Center joint
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, -col.height / 2 + 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Star sparkle
    ctx.fillStyle = `rgba(255, 255, 255, ${glow * 0.8})`;
    drawStar(ctx, 0, -col.height / 2 + 2, 5, 3);
  }
  ctx.restore();
}

function drawStar(ctx, cx, cy, r, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    if (i === 0) ctx.moveTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    else ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
}

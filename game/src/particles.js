/** Particle system for feathers, leaves, sparks, and dust */

import { CONFIG } from './config.js';

const particles = [];

/** Spawn a burst of feather particles */
export function spawnFeathers(x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 5 - 2,
      life: 40 + Math.random() * 30,
      maxLife: 40 + Math.random() * 30,
      size: 4 + Math.random() * 4,
      color: CONFIG.FEATHER_COLORS[Math.floor(Math.random() * CONFIG.FEATHER_COLORS.length)],
      type: 'feather',
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
    });
  }
  trimParticles();
}

/** Spawn falling leaves in background */
export function spawnLeaf(canvasWidth) {
  particles.push({
    x: Math.random() * canvasWidth,
    y: -10,
    vx: -0.5 + Math.random() * -1.5,
    vy: 0.8 + Math.random() * 1.2,
    life: 200 + Math.random() * 100,
    maxLife: 200 + Math.random() * 100,
    size: 5 + Math.random() * 5,
    color: CONFIG.LEAF_COLORS[Math.floor(Math.random() * CONFIG.LEAF_COLORS.length)],
    type: 'leaf',
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.08,
    sway: Math.random() * Math.PI * 2,
  });
  trimParticles();
}

/** Spawn dust puff when landing */
export function spawnDust(x, y, count = 5) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 20,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2,
      life: 15 + Math.random() * 10,
      maxLife: 15 + Math.random() * 10,
      size: 3 + Math.random() * 4,
      color: '#C4A882',
      type: 'dust',
      rotation: 0,
      rotSpeed: 0,
    });
  }
  trimParticles();
}

/** Spawn sparks from hitting oven */
export function spawnSparks(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 6 - 1,
      life: 20 + Math.random() * 15,
      maxLife: 20 + Math.random() * 15,
      size: 2 + Math.random() * 3,
      color: Math.random() > 0.5 ? '#FF4500' : '#FFD700',
      type: 'spark',
      rotation: 0,
      rotSpeed: 0,
    });
  }
  trimParticles();
}

/** Spawn a celebration burst */
export function spawnCelebration(x, y) {
  const colors = ['#FFD700', '#FF6347', '#32CD32', '#4169E1', '#FF69B4', '#FFA500'];
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * (3 + Math.random() * 4),
      vy: Math.sin(angle) * (3 + Math.random() * 4),
      life: 50 + Math.random() * 30,
      maxLife: 50 + Math.random() * 30,
      size: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: 'spark',
      rotation: 0,
      rotSpeed: 0,
    });
  }
  trimParticles();
}

function trimParticles() {
  while (particles.length > CONFIG.MAX_PARTICLES) {
    particles.shift();
  }
}

/** Update all particles */
export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;

    if (p.type === 'feather') {
      p.vy += 0.12;
      p.vx *= 0.97;
    } else if (p.type === 'leaf') {
      p.sway += 0.05;
      p.vx += Math.sin(p.sway) * 0.05;
    } else if (p.type === 'dust') {
      p.vy -= 0.05;
      p.size *= 0.97;
    } else if (p.type === 'spark') {
      p.vy += 0.15;
      p.size *= 0.96;
    }
  }
}

/** Draw all particles */
export function drawParticles(ctx2d) {
  for (const p of particles) {
    const alpha = Math.min(1, p.life / (p.maxLife * 0.3));
    ctx2d.save();
    ctx2d.globalAlpha = alpha;
    ctx2d.translate(p.x, p.y);
    ctx2d.rotate(p.rotation);

    if (p.type === 'feather') {
      ctx2d.fillStyle = p.color;
      ctx2d.beginPath();
      ctx2d.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      ctx2d.fill();
      // Feather spine
      ctx2d.strokeStyle = '#5C4033';
      ctx2d.lineWidth = 0.5;
      ctx2d.beginPath();
      ctx2d.moveTo(0, -p.size);
      ctx2d.lineTo(0, p.size);
      ctx2d.stroke();
    } else if (p.type === 'leaf') {
      ctx2d.fillStyle = p.color;
      ctx2d.beginPath();
      ctx2d.ellipse(0, 0, p.size * 0.5, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx2d.fill();
    } else {
      ctx2d.fillStyle = p.color;
      ctx2d.beginPath();
      ctx2d.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx2d.fill();
    }

    ctx2d.restore();
  }
}

/** Clear all particles */
export function clearParticles() {
  particles.length = 0;
}

/** Fixed-step escape loop, with fair hazards and a complete restartable campaign. */
import { CONFIG, STAGES } from './config.js';
import { initInput, jumpPressed, duckHeld, dashPressed, anyKeyPressed, clearFrame, wasPressed } from './input.js';
import * as audio from './audio.js';
import { createTurkey, drawTurkey, createFarmer, drawFarmer, createObstacle, drawObstacle, createCollectible, drawCollectible } from './entities.js';
import { drawBackground, drawHUD, drawStageTransition } from './renderer.js';
import { drawTitleScreen, drawGameOverScreen, drawVictoryScreen, drawPauseScreen } from './screens.js';
import { spawnFeathers, spawnDust, spawnCelebration, updateParticles, drawParticles, clearParticles } from './particles.js';
import { panel, text, palette } from './art.js';
import { updatePursuit } from './pursuit.js';
import { readBest, saveBest } from './progress.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.WIDTH; canvas.height = CONFIG.HEIGHT;
let state = 'title';
let frame = 0;
let tick = 0;
let turkey, farmer;
let obstacles = [], collectibles = [], covers = [];
let stage = 0, offset = 0, speed = 4, obstacleTimer = 90, coverTimer = 200, cornTimer = 60;
let transition = 0, paused = false, hidden = false, shake = 0;
let best = readBest();
let stats = {};
let hazardCount = 0;
initInput();

function notify(message) { stats.notice = message; stats.noticeTimer = 100; }
function startRun(practiceStage = null) {
  audio.initAudio(); audio.resumeAudio(); audio.playGobble(); audio.startMusic('farm');
  turkey = createTurkey(); farmer = createFarmer(35);
  obstacles = []; collectibles = []; covers = []; clearParticles(); hazardCount = 0;
  stage = 0; offset = 0; speed = 4; tick = 0;
  obstacleTimer = 100; cornTimer = 50; coverTimer = 180; transition = 0; shake = 0; hidden = false;
  stats = { corn: 0, streak: 0, dodges: 0, hits: 0, combo: 1, notice: '', noticeTimer: 0, best };
  stats.practice = practiceStage !== null;
  if (practiceStage !== null) {
    stage = practiceStage;
    turkey.distance = [0, 150, 330][stage];
    audio.stopMusic(); audio.startMusic(STAGES[stage].music);
    notify('PRACTICE RUN — Personal records disabled');
  }
  paused = false; state = 'playing'; frame = 0;
  document.getElementById('pauseButton').textContent = 'Pause · P';
}
function finishRun(escaped, cause = '') {
  state = escaped ? 'victory' : 'gameOver'; frame = 0;
  if (!stats.practice) best = saveBest(turkey.score);
  stats.best = best; stats.cause = cause;
  audio.stopMusic();
  if (escaped) { audio.playEscaped(); spawnCelebration(480, 250); }
  else audio.playCaught();
}
function togglePause() {
  if (state !== 'playing') return;
  paused = !paused; clearFrame();
  document.getElementById('pauseButton').textContent = paused ? 'Resume · P' : 'Pause · P';
  if (paused) audio.stopMusic(); else { audio.resumeAudio(); audio.startMusic(STAGES[stage].music); }
}
function toggleSound() {
  const muted = audio.toggleMute();
  const button = document.getElementById('soundButton');
  button.textContent = muted ? 'Sound off · M' : 'Sound on · M';
  button.setAttribute('aria-pressed', String(muted));
}
document.getElementById('pauseButton').onclick = togglePause;
document.getElementById('soundButton').onclick = toggleSound;
for (const button of document.querySelectorAll('[data-practice]')) {
  button.onclick = () => { startRun(Number(button.dataset.practice)); clearFrame(); };
}
window.addEventListener('blur', () => { if (!paused && state === 'playing') togglePause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && !paused && state === 'playing') togglePause(); });

function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
function hitbox() {
  return { x: turkey.x + 7, y: turkey.y + 6, width: turkey.width - 14, height: turkey.height - 10 };
}
function updateTurkey() {
  // Keep the feet anchored when changing the duck collider.
  const height = duckHeld() && turkey.grounded ? CONFIG.TURKEY_DUCK_HEIGHT : CONFIG.TURKEY_HEIGHT;
  turkey.y += turkey.height - height; turkey.height = height; turkey.ducking = height === CONFIG.TURKEY_DUCK_HEIGHT;
  if (jumpPressed() && turkey.jumps < 2) {
    turkey.y += turkey.height - CONFIG.TURKEY_HEIGHT; turkey.height = CONFIG.TURKEY_HEIGHT; turkey.ducking = false;
    turkey.vy = turkey.jumps === 0 ? -13 : -11; turkey.jumps++; turkey.grounded = false;
    audio.playJump(); spawnFeathers(turkey.x, turkey.y + 20, 3);
  }
  turkey.vy += CONFIG.GRAVITY; turkey.y += turkey.vy;
  if (turkey.y + turkey.height >= CONFIG.GROUND_Y) {
    if (!turkey.grounded) spawnDust(turkey.x, 420, 4);
    turkey.y = CONFIG.GROUND_Y - turkey.height; turkey.vy = 0; turkey.grounded = true; turkey.jumps = 0;
  }
  if (dashPressed() && turkey.dashCooldown <= 0) {
    turkey.dashTimer = 22; turkey.dashCooldown = 115; audio.playDash(); spawnFeathers(turkey.x, turkey.y + 20, 5);
  }
  turkey.dashing = turkey.dashTimer > 0;
  turkey.dashTimer = Math.max(0, turkey.dashTimer - 1);
  turkey.dashCooldown = Math.max(0, turkey.dashCooldown - 1);
  turkey.invincible = Math.max(0, turkey.invincible - 1);
  turkey.bobTimer++; turkey.wingAngle += 0.15; turkey.legTimer += turkey.grounded ? speed * 0.5 : 0;
  turkey.distance += speed * 0.025 * (turkey.dashing ? 1.8 : 1);
  turkey.score += speed * 0.05;
}
function spawnHazard() {
  // Predictable height classes preserve a visible, learnable dodge window.
  const types = STAGES[stage].obstacles;
  const intro = stage === 2 ? ['oven', 'knife'] : ['haybale', 'knife'];
  const type = intro[hazardCount] || types[Math.floor(Math.random() * types.length)];
  hazardCount++;
  const obstacle = createObstacle(type, 1000);
  if (obstacle.type === 'knife') {
    obstacle.y = Math.random() < 0.5 ? 366 : 390;
    obstacle.width = 44; obstacle.height = 16;
    obstacle.rotation = 0; obstacle.flying = false;
  }
  obstacles.push(obstacle);
}
function hurt(obstacle) {
  turkey.lives--; turkey.invincible = 110; farmer.x = Math.min(60, farmer.x + 18);
  stats.hits++; stats.combo = 1; stats.streak = 0; shake = 12;
  audio.playHit(); spawnFeathers(turkey.x, turkey.y + 20, 12);
  notify(obstacle.type === 'oven' ? 'TOO HOT! Jump or dash through ovens.' : 'FEATHERS RUFFLED! Dash to recover.');
  if (turkey.lives <= 0) finishRun(false, obstacle.type === 'oven' ? 'The kitchen got too hot. Jump the next oven.' : 'Three feathers down. There is always another route.');
}
function updateWorld() {
  const travel = speed * (turkey.dashing ? 1.8 : 1);
  offset += travel;
  for (const obstacle of obstacles) {
    obstacle.x -= travel;
    if (!obstacle.passed && !obstacle.hit && obstacle.x + obstacle.width < turkey.x) {
      obstacle.passed = true; stats.dodges++; turkey.score += 15;
      if (stats.dodges % 5 === 0) notify(`${stats.dodges} CLEAN DODGES  +75`);
    }
    if (!obstacle.hit && !turkey.dashing && turkey.invincible <= 0 && overlaps(hitbox(), obstacle)) {
      obstacle.hit = true; hurt(obstacle);
      if (state !== 'playing') return;
    }
  }
  obstacles = obstacles.filter(item => item.x > -100);
  for (const cover of covers) cover.x -= travel;
  covers = covers.filter(item => item.x > -180);
  hidden = turkey.ducking && covers.some(cover => turkey.x + 24 > cover.x && turkey.x + 24 < cover.x + cover.width);
  for (const item of collectibles) {
    item.x -= travel; item.bobTimer++;
    if (!item.collected && overlaps(hitbox(), item)) {
      item.collected = true;
      if (item.type === 'corn') {
        stats.corn++; stats.streak++; stats.combo = Math.min(5, 1 + Math.floor(stats.streak / 4));
        turkey.score += 50 * stats.combo; audio.playCorn();
      } else {
        turkey.lives = Math.min(3, turkey.lives + 1); turkey.score += 200;
        audio.playWishbone(); notify('A LITTLE LUCK  +1 HEART');
      }
    }
  }
  collectibles = collectibles.filter(item => item.x > -40 && !item.collected);
  if (--obstacleTimer <= 0) {
    spawnHazard(); obstacleTimer = 100 - stage * 13 + Math.random() * 28;
  }
  if (--cornTimer <= 0) {
    const lucky = stats.corn > 0 && stats.corn % 8 === 0;
    collectibles.push(createCollectible(lucky ? 'wishbone' : 'corn', 1020));
    cornTimer = 57;
  }
  if (--coverTimer <= 0 && stage < 2) {
    covers.push({ x: 1000, y: 360, width: 140, height: 60 }); coverTimer = 390;
  }
  if (updatePursuit(farmer, turkey, stage, tick, hidden)) finishRun(false, 'The farmer cornered you. Use SHIFT to gain ground.');
}
function update() {
  if (wasPressed('KeyM')) toggleSound();
  if (wasPressed('KeyP') || wasPressed('Escape')) togglePause();
  if (paused) { if (anyKeyPressed()) togglePause(); return; }
  frame++;
  if (state === 'title' || state === 'gameOver' || state === 'victory') {
    if ((state === 'title' || frame > 45) && anyKeyPressed()) startRun();
    updateParticles(); return;
  }
  if (transition > 0) { transition--; return; }
  tick++;
  if (stats.noticeTimer > 0) stats.noticeTimer--;
  speed = Math.min(6.8, 4 + turkey.distance * 0.005);
  updateTurkey(); updateWorld(); updateParticles();
  if (shake > 0) shake--;
  if (state !== 'playing') return;
  if (turkey.distance >= CONFIG.ESCAPE_DISTANCE) { turkey.score += 1000 + turkey.lives * 200; finishRun(true); return; }
  const next = turkey.distance >= 330 ? 2 : turkey.distance >= 150 ? 1 : 0;
  if (next !== stage) {
    stage = next; transition = 100; obstacles = []; covers = []; collectibles = []; hazardCount = 0;
    farmer.x = 35; obstacleTimer = 110; turkey.invincible = 110;
    audio.stopMusic(); audio.playStageTransition(); audio.startMusic(STAGES[stage].music);
  }
}
function drawCover(cover) {
  panel(ctx, cover.x, cover.y, cover.width, cover.height, '#b8894d', 12);
  ctx.strokeStyle = '#e6b85e'; ctx.lineWidth = 2;
  for (let y = cover.y + 8; y < 420; y += 8) { ctx.beginPath(); ctx.moveTo(cover.x + 5, y); ctx.lineTo(cover.x + cover.width - 5, y - 3); ctx.stroke(); }
  text(ctx, '↓ HIDE', cover.x + cover.width / 2, cover.y - 15, 12, palette.gold, 'center');
}
function draw() {
  ctx.save();
  if (state === 'title') drawTitleScreen(ctx, frame, best);
  else if (state === 'victory') drawVictoryScreen(ctx, turkey.score, frame, stats);
  else {
    if (shake > 0) ctx.translate(Math.sin(frame * 5) * 3, Math.cos(frame * 4) * 2);
    drawBackground(ctx, stage, offset, frame);
    for (const cover of covers) drawCover(cover);
    for (const item of collectibles) drawCollectible(ctx, item, frame);
    for (const obstacle of obstacles) {
      drawObstacle(ctx, obstacle, frame);
      text(ctx, obstacle.type === 'knife' ? (obstacle.y < 380 ? '↓ DUCK' : '↑ JUMP') : obstacle.type === 'oven' ? 'HOT! ↑ / SHIFT' : '↑ JUMP', obstacle.x + obstacle.width / 2, obstacle.y - 18, 11, '#fff0cc', 'center');
    }
    drawFarmer(ctx, farmer, frame);
    ctx.save(); if (hidden) ctx.globalAlpha = 0.35;
    // The sprite uses its standing dimensions while the collider changes for ducking.
    drawTurkey(ctx, { ...turkey, y: 420 - CONFIG.TURKEY_HEIGHT + (turkey.y + turkey.height - 420), height: CONFIG.TURKEY_HEIGHT }, frame);
    ctx.restore();
    drawParticles(ctx);
    drawHUD(ctx, turkey, stage, farmer, stats, hidden, tick);
    if (transition > 0) drawStageTransition(ctx, STAGES[stage].name, 1 - transition / 100);
    if (state === 'gameOver') drawGameOverScreen(ctx, turkey.score, turkey.distance, frame, stats);
  }
  if (paused) drawPauseScreen(ctx);
  ctx.restore();
  canvas.dataset.state = paused ? 'paused' : state;
  canvas.dataset.stage = String(stage);
  canvas.dataset.distance = String(Math.floor(turkey?.distance || 0));
  document.getElementById('practiceMenu').hidden = state === 'playing';
}
let previous = 0, accumulator = 0;
function loop(now) {
  accumulator += Math.min(100, now - (previous || now)); previous = now;
  while (accumulator >= 1000 / 60) { update(); clearFrame(); accumulator -= 1000 / 60; }
  draw(); requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/** Gobble Run: The Great Turkey Escape – Main game loop */

import { CONFIG, STAGES } from './config.js';
import { initInput, jumpPressed, duckHeld, dashPressed, anyKeyPressed, clearFrame } from './input.js';
import {
  initAudio, resumeAudio, playGobble, playJump, playDoubleJump, playDash, playDuck,
  playCorn, playWishbone, playHit, playCaught, playEscaped, playStageTransition,
  playSelect, playFootstep, startMusic, stopMusic,
} from './audio.js';
import {
  createTurkey, drawTurkey,
  createFarmer, drawFarmer,
  createObstacle, drawObstacle,
  createCollectible, drawCollectible,
} from './entities.js';
import {
  drawBackground, drawHUD, drawStageTransition,
} from './renderer.js';
import {
  drawTitleScreen, drawGameOverScreen, drawVictoryScreen,
} from './screens.js';
import {
  spawnFeathers, spawnLeaf, spawnDust, spawnSparks, spawnCelebration,
  updateParticles, drawParticles, clearParticles,
} from './particles.js';

// ---- Canvas setup ----
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.WIDTH;
canvas.height = CONFIG.HEIGHT;

// ---- Game state ----
let state = 'title'; // 'title' | 'playing' | 'stageTransition' | 'gameOver' | 'victory'
let frame = 0;
let turkey = null;
let farmer = null;
let obstacles = [];
let collectibles = [];
let scrollSpeed = CONFIG.BASE_SCROLL_SPEED;
let scrollOffset = 0;
let currentStage = 0;
let obstacleTimer = 0;
let collectibleTimer = 0;
let stageTransitionTimer = 0;
let stageTransitionName = '';
let footstepTimer = 0;
let leafTimer = 0;
let screenShakeTimer = 0;
let screenShakeIntensity = 0;

// ---- Initialization ----
initInput();

function resetGame() {
  turkey = createTurkey();
  farmer = createFarmer(-60);
  obstacles = [];
  collectibles = [];
  scrollSpeed = CONFIG.BASE_SCROLL_SPEED;
  scrollOffset = 0;
  currentStage = 0;
  obstacleTimer = 60;
  collectibleTimer = 100;
  stageTransitionTimer = 0;
  footstepTimer = 0;
  leafTimer = 0;
  screenShakeTimer = 0;
  clearParticles();
}

// ---- Collision detection ----
function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function getTurkeyHitbox() {
  const margin = 6;
  return {
    x: turkey.x + margin,
    y: turkey.y + (turkey.ducking ? CONFIG.TURKEY_HEIGHT - CONFIG.TURKEY_DUCK_HEIGHT : 0) + margin,
    width: turkey.width - margin * 2,
    height: (turkey.ducking ? CONFIG.TURKEY_DUCK_HEIGHT : turkey.height) - margin * 2,
  };
}

// ---- Stage management ----
function getStageForDistance(d) {
  if (d >= CONFIG.STAGE_3_DISTANCE) return 2;
  if (d >= CONFIG.STAGE_2_DISTANCE) return 1;
  return 0;
}

// ---- Obstacle spawning ----
function spawnObstacle() {
  const stage = STAGES[currentStage];
  const types = stage.obstacles;
  const type = types[Math.floor(Math.random() * types.length)];
  const obs = createObstacle(type, CONFIG.WIDTH + 20 + Math.random() * 60);
  if (obs) {
    // Vary knife height more
    if (obs.type === 'knife') {
      const variant = Math.random();
      if (variant < 0.3) {
        // Low flying knife
        obs.y = CONFIG.GROUND_Y - 30;
        obs.flying = false;
      } else if (variant < 0.6) {
        // Mid height
        obs.y = CONFIG.GROUND_Y - 60 - Math.random() * 20;
      } else {
        // High - must duck
        obs.y = CONFIG.GROUND_Y - 90 - Math.random() * 30;
      }
    }
    obstacles.push(obs);
  }
}

function spawnCollectibleItem() {
  const type = Math.random() < 0.85 ? 'corn' : 'wishbone';
  collectibles.push(createCollectible(type, CONFIG.WIDTH + 20));
}

// ---- Update functions ----

function updateTurkey() {
  // Gravity
  turkey.vy += CONFIG.GRAVITY;
  turkey.y += turkey.vy;

  // Ground check
  const groundLevel = CONFIG.GROUND_Y - (turkey.ducking ? CONFIG.TURKEY_DUCK_HEIGHT : CONFIG.TURKEY_HEIGHT);
  if (turkey.y >= groundLevel) {
    if (!turkey.grounded) {
      spawnDust(turkey.x + turkey.width / 2, CONFIG.GROUND_Y, 4);
    }
    turkey.y = groundLevel;
    turkey.vy = 0;
    turkey.grounded = true;
    turkey.jumps = 0;
  } else {
    turkey.grounded = false;
  }

  // Jump
  if (jumpPressed()) {
    if (turkey.grounded || turkey.jumps === 0) {
      turkey.vy = CONFIG.TURKEY_JUMP_FORCE;
      turkey.grounded = false;
      turkey.jumps = 1;
      turkey.ducking = false;
      playJump();
    } else if (turkey.jumps === 1) {
      turkey.vy = CONFIG.TURKEY_DOUBLE_JUMP_FORCE;
      turkey.jumps = 2;
      playDoubleJump();
      spawnFeathers(turkey.x + turkey.width / 2, turkey.y + turkey.height / 2, 4);
    }
  }

  // Duck
  if (duckHeld() && turkey.grounded) {
    if (!turkey.ducking) {
      playDuck();
    }
    turkey.ducking = true;
  } else {
    turkey.ducking = false;
  }

  // Dash
  if (dashPressed() && turkey.dashCooldown <= 0 && !turkey.dashing) {
    turkey.dashing = true;
    turkey.dashTimer = CONFIG.TURKEY_DASH_DURATION;
    turkey.dashCooldown = CONFIG.TURKEY_DASH_COOLDOWN;
    playDash();
  }
  if (turkey.dashing) {
    turkey.dashTimer--;
    if (turkey.dashTimer <= 0) turkey.dashing = false;
  }
  if (turkey.dashCooldown > 0) turkey.dashCooldown--;

  // Invincibility
  if (turkey.invincible > 0) turkey.invincible--;

  // Animation
  turkey.wingAngle += 0.15;
  turkey.bobTimer++;
  if (turkey.grounded && !turkey.ducking) {
    turkey.legTimer += scrollSpeed * 0.5;
  }

  // Distance and score
  const speedMul = turkey.dashing ? 1.8 : 1;
  turkey.distance += scrollSpeed * 0.1 * speedMul;
  turkey.score += CONFIG.DISTANCE_SCORE_RATE * scrollSpeed * 0.05;

  // Footsteps
  if (turkey.grounded && !turkey.ducking) {
    footstepTimer += scrollSpeed;
    if (footstepTimer > 30) {
      playFootstep();
      footstepTimer = 0;
    }
  }
}

function updateFarmer() {
  farmer.legTimer += farmer.speed * 0.3;
  farmer.armAngle += 0.08;

  // Farmer slowly catches up based on stage
  const targetX = turkey.x - 100 - currentStage * 10;
  const farmerSpeed = CONFIG.FARMER_BASE_SPEED + currentStage * 0.5;

  if (farmer.x < targetX) {
    farmer.x += farmerSpeed * 0.3;
  } else if (farmer.x > targetX + 20) {
    farmer.x -= farmerSpeed * 0.1;
  }

  // Sprint occasionally in later stages
  if (currentStage >= 1 && Math.random() < 0.002) {
    farmer.sprintTimer = 60 + Math.random() * 60;
  }
  if (farmer.sprintTimer > 0) {
    farmer.x += 1.5;
    farmer.sprintTimer--;
  }

  // Keep farmer on screen
  farmer.x = Math.max(-40, Math.min(turkey.x - 30, farmer.x));
  farmer.y = CONFIG.GROUND_Y - CONFIG.FARMER_HEIGHT;
}

function updateObstacles() {
  const effectiveSpeed = scrollSpeed * (turkey.dashing ? 1.8 : 1);

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= effectiveSpeed;

    // Animate
    if (obs.type === 'knife' && obs.flying !== false) {
      obs.rotation += obs.rotSpeed;
      obs.y += Math.sin(frame * 0.05 + obs.x * 0.01) * 0.5;
    }
    if (obs.type === 'oven') {
      obs.glowTimer++;
    }
    if (obs.type === 'pumpkin') {
      obs.bounce++;
    }

    // Remove off-screen
    if (obs.x + obs.width < -50) {
      obstacles.splice(i, 1);
      continue;
    }

    // Collision
    if (turkey.invincible <= 0 && !turkey.dashing) {
      const hitbox = getTurkeyHitbox();
      if (rectsOverlap(hitbox, obs)) {
        turkey.lives--;
        turkey.invincible = CONFIG.TURKEY_INVINCIBLE_TIME;
        playHit();
        spawnFeathers(turkey.x + turkey.width / 2, turkey.y + turkey.height / 2, 10);
        screenShakeTimer = 15;
        screenShakeIntensity = 4;

        if (obs.type === 'oven') {
          spawnSparks(obs.x + obs.width / 2, obs.y + obs.height / 2, 12);
        }

        obstacles.splice(i, 1);

        if (turkey.lives <= 0) {
          state = 'gameOver';
          stopMusic();
          playCaught();
          frame = 0;
          return;
        }
      }
    }
  }

  // Spawn new obstacles
  obstacleTimer--;
  if (obstacleTimer <= 0) {
    spawnObstacle();
    const minI = Math.max(30, CONFIG.OBSTACLE_MIN_INTERVAL - currentStage * 10);
    const maxI = Math.max(60, CONFIG.OBSTACLE_MAX_INTERVAL - currentStage * 20);
    obstacleTimer = minI + Math.random() * (maxI - minI);
  }
}

function updateCollectibles() {
  const effectiveSpeed = scrollSpeed * (turkey.dashing ? 1.8 : 1);

  for (let i = collectibles.length - 1; i >= 0; i--) {
    const col = collectibles[i];
    col.x -= effectiveSpeed;
    col.bobTimer++;

    // Remove off-screen
    if (col.x + col.width < -20) {
      collectibles.splice(i, 1);
      continue;
    }

    // Collection
    const hitbox = getTurkeyHitbox();
    if (rectsOverlap(hitbox, col)) {
      if (col.type === 'corn') {
        turkey.score += CONFIG.CORN_SCORE;
        playCorn();
      } else {
        turkey.score += CONFIG.WISHBONE_SCORE;
        turkey.lives = Math.min(turkey.lives + 1, CONFIG.TURKEY_MAX_LIVES);
        playWishbone();
        spawnCelebration(col.x + col.width / 2, col.y + col.height / 2);
      }
      collectibles.splice(i, 1);
    }
  }

  // Spawn collectibles
  collectibleTimer--;
  if (collectibleTimer <= 0) {
    spawnCollectibleItem();
    collectibleTimer = CONFIG.COLLECTIBLE_MIN_INTERVAL + Math.random() * (CONFIG.COLLECTIBLE_MAX_INTERVAL - CONFIG.COLLECTIBLE_MIN_INTERVAL);
  }
}

// ---- Main game loop ----

function update() {
  frame++;

  if (state === 'title') {
    if (anyKeyPressed()) {
      initAudio();
      resumeAudio();
      playSelect();
      playGobble();
      resetGame();
      state = 'playing';
      startMusic('farm');
    }
    return;
  }

  if (state === 'gameOver' || state === 'victory') {
    if (frame > 60 && anyKeyPressed()) {
      resumeAudio();
      playSelect();
      resetGame();
      state = 'playing';
      startMusic('farm');
      frame = 0;
    }
    return;
  }

  if (state === 'stageTransition') {
    stageTransitionTimer--;
    if (stageTransitionTimer <= 0) {
      state = 'playing';
      startMusic(STAGES[currentStage].music);
    }
    return;
  }

  // ---- Playing state ----

  // Update scroll speed
  scrollSpeed = Math.min(CONFIG.MAX_SCROLL_SPEED, CONFIG.BASE_SCROLL_SPEED + turkey.distance * CONFIG.SPEED_INCREASE_RATE);
  scrollOffset += scrollSpeed;

  // Update entities
  updateTurkey();
  if (state !== 'playing') return; // Might have changed to gameOver
  updateFarmer();
  updateObstacles();
  if (state !== 'playing') return;
  updateCollectibles();

  // Check victory
  if (turkey.distance >= CONFIG.ESCAPE_DISTANCE) {
    state = 'victory';
    stopMusic();
    playEscaped();
    spawnCelebration(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
    frame = 0;
    return;
  }

  // Check stage transitions
  const newStage = getStageForDistance(turkey.distance);
  if (newStage !== currentStage) {
    currentStage = newStage;
    stageTransitionName = STAGES[currentStage].name;
    stageTransitionTimer = 90;
    state = 'stageTransition';
    stopMusic();
    playStageTransition();
  }

  // Spawn leaves
  leafTimer++;
  if (leafTimer > 40) {
    spawnLeaf(CONFIG.WIDTH);
    leafTimer = 0;
  }

  // Screen shake
  if (screenShakeTimer > 0) screenShakeTimer--;

  // Particles
  updateParticles();

  clearFrame();
}

function draw() {
  ctx.save();

  // Screen shake
  if (screenShakeTimer > 0) {
    const shakeX = (Math.random() - 0.5) * screenShakeIntensity;
    const shakeY = (Math.random() - 0.5) * screenShakeIntensity;
    ctx.translate(shakeX, shakeY);
  }

  if (state === 'title') {
    drawTitleScreen(ctx, frame);
    ctx.restore();
    return;
  }

  if (state === 'gameOver') {
    // Show frozen game behind overlay
    drawBackground(ctx, currentStage, scrollOffset, frame);
    drawParticles(ctx);
    for (const col of collectibles) drawCollectible(ctx, col, frame);
    for (const obs of obstacles) drawObstacle(ctx, obs, frame);
    drawTurkey(ctx, turkey, frame);
    drawFarmer(ctx, farmer, frame);
    drawGameOverScreen(ctx, turkey.score, turkey.distance, frame);
    ctx.restore();
    return;
  }

  if (state === 'victory') {
    drawVictoryScreen(ctx, turkey.score, frame);
    drawParticles(ctx);
    ctx.restore();
    return;
  }

  // ---- Draw playing / stageTransition ----
  drawBackground(ctx, currentStage, scrollOffset, frame);

  // Particles behind entities
  drawParticles(ctx);

  // Collectibles
  for (const col of collectibles) {
    drawCollectible(ctx, col, frame);
  }

  // Obstacles
  for (const obs of obstacles) {
    drawObstacle(ctx, obs, frame);
  }

  // Farmer (behind turkey if far left)
  drawFarmer(ctx, farmer, frame);

  // Turkey
  drawTurkey(ctx, turkey, frame);

  // HUD
  drawHUD(ctx, turkey, currentStage, scrollSpeed);

  // Stage transition overlay
  if (state === 'stageTransition') {
    const progress = 1 - stageTransitionTimer / 90;
    drawStageTransition(ctx, stageTransitionName, progress);
  }

  ctx.restore();
}

// ---- Animation loop ----
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

/** Game configuration constants */
export const CONFIG = {
  // Canvas
  WIDTH: 960,
  HEIGHT: 540,

  // Physics
  GRAVITY: 0.65,
  GROUND_Y: 420,
  
  // Turkey
  TURKEY_X: 140,
  TURKEY_WIDTH: 48,
  TURKEY_HEIGHT: 52,
  TURKEY_JUMP_FORCE: -13,
  TURKEY_DOUBLE_JUMP_FORCE: -11,
  TURKEY_DUCK_HEIGHT: 28,
  TURKEY_DASH_SPEED: 12,
  TURKEY_DASH_DURATION: 15,
  TURKEY_DASH_COOLDOWN: 60,
  TURKEY_MAX_LIVES: 3,
  TURKEY_INVINCIBLE_TIME: 90,

  // Farmer
  FARMER_WIDTH: 50,
  FARMER_HEIGHT: 64,
  FARMER_BASE_SPEED: 2.8,
  FARMER_SPRINT_SPEED: 4.5,

  // Obstacles
  KNIFE_WIDTH: 20,
  KNIFE_HEIGHT: 40,
  OVEN_WIDTH: 70,
  OVEN_HEIGHT: 60,
  HAYBALE_WIDTH: 50,
  HAYBALE_HEIGHT: 40,
  PUMPKIN_WIDTH: 36,
  PUMPKIN_HEIGHT: 34,

  // Collectibles
  CORN_WIDTH: 20,
  CORN_HEIGHT: 28,
  WISHBONE_WIDTH: 24,
  WISHBONE_HEIGHT: 28,

  // Game speed
  BASE_SCROLL_SPEED: 4,
  MAX_SCROLL_SPEED: 9,
  SPEED_INCREASE_RATE: 0.0008,

  // Stages
  STAGE_1_DISTANCE: 0,       // Farmyard
  STAGE_2_DISTANCE: 1500,    // Barn
  STAGE_3_DISTANCE: 3500,    // Kitchen
  ESCAPE_DISTANCE: 5500,     // Freedom!

  // Spawn rates (frames between spawns)
  OBSTACLE_MIN_INTERVAL: 55,
  OBSTACLE_MAX_INTERVAL: 120,
  COLLECTIBLE_MIN_INTERVAL: 80,
  COLLECTIBLE_MAX_INTERVAL: 180,

  // Scoring
  DISTANCE_SCORE_RATE: 1,
  CORN_SCORE: 50,
  WISHBONE_SCORE: 200,

  // Particles
  MAX_PARTICLES: 60,
  FEATHER_COLORS: ['#D4A574', '#8B6914', '#CD853F', '#F4A460', '#FFDEAD'],
  LEAF_COLORS: ['#B22222', '#D2691E', '#DAA520', '#8B4513', '#CD853F'],
};

/** Stage definitions */
export const STAGES = [
  {
    name: 'The Farmyard',
    skyTop: '#FF7E47',
    skyBottom: '#FFD580',
    groundColor: '#5D8233',
    groundAccent: '#4A6B28',
    bgElements: 'farm',
    obstacles: ['haybale', 'pumpkin', 'knife'],
    music: 'farm',
  },
  {
    name: 'The Old Barn',
    skyTop: '#CC5500',
    skyBottom: '#FFB347',
    groundColor: '#8B6914',
    groundAccent: '#6B4F12',
    bgElements: 'barn',
    obstacles: ['haybale', 'knife', 'oven'],
    music: 'barn',
  },
  {
    name: 'The Kitchen',
    skyTop: '#8B0000',
    skyBottom: '#FF6347',
    groundColor: '#6B4226',
    groundAccent: '#4A2E1A',
    bgElements: 'kitchen',
    obstacles: ['knife', 'oven', 'knife'],
    music: 'kitchen',
  },
];

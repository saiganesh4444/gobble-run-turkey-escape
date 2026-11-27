/** Input handler – keyboard and mouse */

const keys = {};
const justPressed = {};

export function initInput() {
  window.addEventListener('keydown', (e) => {
    if (!keys[e.code]) {
      justPressed[e.code] = true;
    }
    keys[e.code] = true;
    // Prevent scrolling with game keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });
  window.addEventListener('blur', () => {
    for (const key in keys) keys[key] = false;
    clearFrame();
  });

  // Mouse/touch support for jump
  const canvas = document.getElementById('gameCanvas');
  canvas.addEventListener('mousedown', (e) => {
    justPressed['Mouse'] = true;
    keys['Mouse'] = true;
  });
  canvas.addEventListener('mouseup', () => {
    keys['Mouse'] = false;
  });
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    justPressed['Mouse'] = true;
    keys['Mouse'] = true;
  });
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys['Mouse'] = false;
  });
}

/** Check if a key is currently held */
export function isDown(code) {
  return !!keys[code];
}

/** Check if a key was just pressed this frame (consumes the press) */
export function wasPressed(code) {
  if (justPressed[code]) {
    justPressed[code] = false;
    return true;
  }
  return false;
}

/** Check if any action key was just pressed */
export function jumpPressed() {
  return wasPressed('Space') || wasPressed('ArrowUp') || wasPressed('KeyW') || wasPressed('Mouse');
}

export function duckHeld() {
  return isDown('ArrowDown') || isDown('KeyS');
}

export function dashPressed() {
  return wasPressed('ShiftLeft') || wasPressed('ShiftRight') || wasPressed('KeyX');
}

export function anyKeyPressed() {
  return wasPressed('Space') || wasPressed('Enter') || wasPressed('Mouse');
}

/** Clear all just-pressed states at end of frame */
export function clearFrame() {
  for (const key in justPressed) {
    justPressed[key] = false;
  }
}

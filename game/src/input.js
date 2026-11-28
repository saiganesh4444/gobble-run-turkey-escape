/** Input handler – keyboard and mouse */

const keys = {};
const justPressed = {};

export function initInput() {
  window.addEventListener('keydown', (e) => {
    // Native menu buttons activate once with Space/Enter without also jumping.
    if (e.target?.tagName === 'BUTTON' && (e.code === 'Space' || e.code === 'Enter')) return;
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

  // Pointer capture keeps held controls consistent even when released outside the canvas.
  const canvas = document.getElementById('gameCanvas');
  const mouseActions = ['Mouse', 'MouseDash', 'MouseDuck'];
  canvas.addEventListener('pointerdown', (e) => {
    const action = mouseActions[e.button];
    if (!action) return;
    e.preventDefault();
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(e.pointerId);
    justPressed[action] = true;
    keys[action] = true;
  });
  const releaseMouse = () => { for (const action of mouseActions) keys[action] = false; };
  canvas.addEventListener('pointerup', releaseMouse);
  canvas.addEventListener('pointercancel', releaseMouse);
  canvas.addEventListener('lostpointercapture', releaseMouse);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
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
  return isDown('ArrowDown') || isDown('KeyS') || isDown('MouseDuck');
}

export function dashPressed() {
  return wasPressed('ShiftLeft') || wasPressed('ShiftRight') || wasPressed('KeyX') || wasPressed('MouseDash');
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

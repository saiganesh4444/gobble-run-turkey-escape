/** Shared drawing primitives and the four local storybook settings. */
export const palette = { ink: '#2a1b20', cream: '#fff2cf', gold: '#ffce73', red: '#ff886c', teal: '#a6ddc6' };
const atlas = document.getElementById('sceneAtlas');

export function panel(ctx, x, y, width, height, fill = '#281c20ed', radius = 12) {
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

function drawTrack(ctx, stage, offset) {
  const floor = ctx.createLinearGradient(0, 419, 0, 540);
  const tones = [['#c69a55', '#785237', '#3f2c2c'], ['#aa7140', '#72442d', '#392429'], ['#caa281', '#94684e', '#52332f']][stage];
  tones.forEach((color, i) => floor.addColorStop(i * 0.5, color));
  ctx.fillStyle = floor;
  ctx.fillRect(0, 420, 960, 120);
  ctx.fillStyle = '#f4d299';
  ctx.fillRect(0, 420, 960, 2);
  if (stage === 0) {
    for (let i = 0; i < 48; i++) {
      const x = (i * 113 - offset % 1048 + 1048) % 1048 - 30;
      const y = 426 + i * 23 % 94;
      ctx.fillStyle = i % 3 ? '#55351b55' : '#f7d18b77';
      ctx.beginPath(); ctx.ellipse(x, y, 3 + i % 8, 1.2, -0.12, 0, Math.PI * 2); ctx.fill();
    }
    return;
  }
  ctx.strokeStyle = '#41272070'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let row = 0; row < 4; row++) {
    const y = 424 + row * 28;
    ctx.moveTo(0, y); ctx.lineTo(960, y);
    const span = stage === 2 ? 120 : 230;
    for (let x = (row % 2) * 62 - offset % span - span; x < 960; x += span) {
      ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 28);
    }
  }
  ctx.stroke();
}

export function drawAutumnScene(ctx, stage, offset, frame, track = true) {
  if (atlas.complete && atlas.naturalWidth) {
    const w = atlas.naturalWidth / 2;
    const h = atlas.naturalHeight / 2;
    const drift = (1 + Math.sin(offset / 780)) * 8;
    ctx.drawImage(atlas, (stage % 2) * w + drift + 1, Math.floor(stage / 2) * h + 1,
      w - 18, h - 2, 0, 0, 960, track ? 438 : 540);
  } else {
    ctx.fillStyle = ['#966642', '#75482e', '#71432e', '#52654c'][stage];
    ctx.fillRect(0, 0, 960, 540);
  }
  if (track && stage < 3) drawTrack(ctx, stage, offset);
  for (let i = 0; i < 12; i++) {
    const x = ((i * 103 + frame * (stage === 0 ? -0.35 : 0.12)) % 980 + 980) % 980 - 10;
    const y = (i * 71 + frame * (stage === 0 ? 0.25 : -0.18) + 6000) % 390;
    ctx.fillStyle = stage === 0 ? '#edaa59b0' : '#ffe1a18c';
    ctx.beginPath();
    ctx.ellipse(x, y, stage === 0 ? 3 : 1.8, 1.2, frame / 65 + i, 0, Math.PI * 2);
    ctx.fill();
  }
}

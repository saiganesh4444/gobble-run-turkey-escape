/** The farmer telegraphs lunges, searches hay cover, and catches careless runners. */
export function updatePursuit(farmer, turkey, stage, tick, hidden) {
  const cycle = tick % 420;
  farmer.mode = hidden ? 'SEARCHING' : cycle > 300 && cycle < 360 ? 'SPOTTED — DASH!' : cycle >= 360 ? 'LUNGING!' : 'ON YOUR TAIL';
  let advance = 0.025 + stage * 0.012;
  if (cycle >= 360) advance += 0.6 + stage * 0.06;
  if (hidden) advance = -1.2;
  if (turkey.dashing) advance = -3;
  farmer.x = Math.max(-35, Math.min(turkey.x, farmer.x + advance));
  farmer.y = 420 - farmer.height;
  farmer.legTimer += hidden ? 0.4 : 1.3;
  farmer.armAngle += 0.1;
  return farmer.x + farmer.width > turkey.x + 10 && !turkey.dashing && !hidden && turkey.invincible <= 0;
}

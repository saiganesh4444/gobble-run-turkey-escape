/** Personal records are optional so private browsing and file URLs still play. */
export function readBest() {
  try {
    const stored = Number(localStorage.getItem('gobble-run-best'));
    return Number.isFinite(stored) ? Math.max(0, Math.floor(stored)) : 0;
  }
  catch { return 0; }
}
export function saveBest(score) {
  const best = Math.max(readBest(), Math.floor(score));
  try { localStorage.setItem('gobble-run-best', String(best)); } catch { /* Storage is optional. */ }
  return best;
}

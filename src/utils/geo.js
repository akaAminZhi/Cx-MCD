// src/utils/geo.js
export function segIntersect(p1, p2, p3, p4) {
  const [x1, y1] = p1,
    [x2, y2] = p2,
    [x3, y3] = p3,
    [x4, y4] = p4;
  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(den) < 1e-9) return { hit: false };
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return { hit: false };
  const px = x1 + t * (x2 - x1),
    py = y1 + t * (y2 - y1);
  return { hit: true, pt: [px, py], t1: t, t2: u };
}
const unit = ([x, y]) => {
  const L = Math.hypot(x, y) || 1;
  return [x / L, y / L];
};
export function polylineIntersectionsWithTangents(ptsA, ptsB) {
  if (
    !Array.isArray(ptsA) ||
    ptsA.length < 2 ||
    !Array.isArray(ptsB) ||
    ptsB.length < 2
  )
    return [];
  const out = [];
  for (let i = 0; i < ptsA.length - 1; i++) {
    for (let j = 0; j < ptsB.length - 1; j++) {
      const hit = segIntersect(ptsA[i], ptsA[i + 1], ptsB[j], ptsB[j + 1]);
      if (hit.hit) {
        const tA = unit([
          ptsA[i + 1][0] - ptsA[i][0],
          ptsA[i + 1][1] - ptsA[i][1],
        ]);
        const tB = unit([
          ptsB[j + 1][0] - ptsB[j][0],
          ptsB[j + 1][1] - ptsB[j][1],
        ]);
        out.push({ pt: hit.pt, i, j, tA, tB });
      }
    }
  }
  return out;
}

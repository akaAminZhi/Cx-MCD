// src/ui/CableBridgesArc.jsx
import PropTypes from "prop-types";
import { polylineIntersectionsWithTangents } from "../utils/geo";

// cables: [{id, points, color, width, z}]
export default function CableBridgesArc({
  cables,
  bgColor = "#fff",
  radius = 8, // 拱半径
  gap = 10, // 下层缺口长度
}) {
  const list = (Array.isArray(cables) ? cables : [])
    .filter((c) => Array.isArray(c.points) && c.points.length >= 2)
    .sort((a, b) => (a.z ?? 0) - (b.z ?? 0)); // z 小在下

  const holes = []; // 下层缺口
  const arcs = []; // 上层弧

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const under = list[i],
        over = list[j];
      const xs = polylineIntersectionsWithTangents(under.points, over.points);
      xs.forEach(({ pt, tA, tB }) => {
        // 下层缺口：沿 under 切线方向
        const ux = tA[0],
          uy = tA[1];
        const gx = (gap / 2) * ux,
          gy = (gap / 2) * uy;
        holes.push({
          a: [pt[0] - gx, pt[1] - gy],
          b: [pt[0] + gx, pt[1] + gy],
          width: Math.max((under.width ?? 2) + 2, under.width ?? 2), // 稍粗一点盖住
        });

        // 上层桥拱：以交点为中心，沿 over 切线 ±radius 当作端点
        const ox = tB[0],
          oy = tB[1];
        const p0 = [pt[0] - radius * ox, pt[1] - radius * oy];
        const p1 = [pt[0] + radius * ox, pt[1] + radius * oy];
        // 选择 sweep=1，large-arc-flag=0；半径=radius
        arcs.push({
          p0,
          p1,
          r: radius,
          color: over.color ?? "#000",
          width: over.width ?? 2,
        });
      });
    }
  }

  return (
    <g pointerEvents="none">
      {/* 先画下层缺口（背景色直线，圆帽） */}
      {holes.map((h, idx) => (
        <line
          key={"h" + idx}
          x1={h.a[0]}
          y1={h.a[1]}
          x2={h.b[0]}
          y2={h.b[1]}
          stroke={bgColor}
          strokeWidth={h.width}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* 再画上层桥拱（半圆弧） */}
      {arcs.map((k, idx) => (
        <path
          key={"a" + idx}
          d={`M ${k.p0[0]} ${k.p0[1]} A ${k.r} ${k.r} 0 0 1 ${k.p1[0]} ${k.p1[1]}`}
          fill="none"
          stroke={k.color}
          strokeWidth={k.width}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}
CableBridgesArc.propTypes = {
  cables: PropTypes.array.isRequired,
  bgColor: PropTypes.string,
  radius: PropTypes.number,
  gap: PropTypes.number,
};

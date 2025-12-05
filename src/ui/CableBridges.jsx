// ui/CableBridges.jsx
import PropTypes from "prop-types";
import { polylineIntersections } from "../utils/geo";

/**
 * cables: [{id, points:[ [x,y], ... ], color, width, z?: number}, ...]
 * z 越大越靠上（不传则用索引顺序）
 * bgColor: 背景色（打孔用），一般是白色 "#fff" 或图底色
 */
export default function CableBridges({ cables, bgColor = "#fff" }) {
  // 先按 z/顺序排，后面的算“上方”
  const list = [...cables].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
  const holes = []; // {pt:[x,y], underWidth:number}
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const under = list[i]; // 先画的在下
      const over = list[j]; // 后画的在上
      const xs = polylineIntersections(under.points, over.points);
      xs.forEach(({ pt }) => {
        holes.push({ pt, underWidth: Math.max(under.width ?? 2, 2) });
      });
    }
  }

  // 用小圆“打孔”：画一个背景色的圆，盖在下层线上
  // 半径略大于线宽的一半，让缺口干净
  return (
    <g pointerEvents="none">
      {holes.map((h, idx) => (
        <circle
          key={idx}
          cx={h.pt[0]}
          cy={h.pt[1]}
          r={h.underWidth / 2 + 2.5} // 调这个2.5让孔更干净
          fill={bgColor}
        />
      ))}
    </g>
  );
}
CableBridges.propTypes = {
  cables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
      color: PropTypes.string,
      width: PropTypes.number,
      z: PropTypes.number,
    })
  ).isRequired,
  bgColor: PropTypes.string,
};

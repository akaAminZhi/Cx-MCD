// src/ui/PolylineCable.jsx
import PropTypes from "prop-types";
import { COLOR_MAP } from "../utils/constans";

export default function PolylineCable({
  id,
  points = [], // [[x,y], [x,y], ...] —— 已是像素坐标
  color = "#111", // 默认线颜色
  width = 2, // 可调线宽
  dashed = false,
  energized = false,
  energizedToday = false,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}) {
  const pointsStr = points.map((p) => p.join(",")).join(" ");
  const getFillColor = () => {
    if (energizedToday) return COLOR_MAP.orange500;
    if (energized) return COLOR_MAP.red500;
    return "#111";
  };
  return (
    <g data-id={id}>
      {/* 可见线条 */}
      <polyline
        points={pointsStr}
        fill="none"
        stroke={getFillColor()}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={dashed ? "6 6" : undefined}
      />
      {/* 交互命中层（更粗、更透明，方便 hover/click） */}
      <polyline
        points={pointsStr}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.max(width + 12, 16)}
        vectorEffect="non-scaling-stroke"
        pointerEvents="stroke"
        style={{ cursor: "pointer" }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
    </g>
  );
}

PolylineCable.propTypes = {
  id: PropTypes.string,
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  color: PropTypes.string,
  width: PropTypes.number,
  dashed: PropTypes.bool,
  energized: PropTypes.bool,
  energizedToday: PropTypes.bool,

  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

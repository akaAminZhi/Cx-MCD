// src/ui/BusLine.jsx
import React from "react";
import PropTypes from "prop-types";
import { COLOR_MAP } from "../utils/constans";

function rectToSegment(rect) {
  const [x1, y1, x2, y2] = rect;
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);
  if (w >= h) {
    // 水平：取中线
    const y = (y1 + y2) / 2;
    return { a: [x1, y], b: [x2, y] };
  } else {
    // 垂直
    const x = (x1 + x2) / 2;
    return { a: [x, y1], b: [x, y2] };
  }
}

function BusLine({
  id,
  rect_px,
  color = "#111",
  width = 6,
  dashed = false,
  energized = false,
  energizedToday = false,
  onClick,

  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}) {
  const { a, b } = rectToSegment(rect_px);
  const getFillColor = () => {
    if (energizedToday) return COLOR_MAP.orange500;
    if (energized) return COLOR_MAP.red500;
    return "#111";
  };
  return (
    <g data-id={id}>
      {/* 可见总线 */}
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={getFillColor()}
        strokeWidth={width}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={dashed ? "8 8" : undefined}
      />
      {/* 交互命中层 */}
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke="transparent"
        strokeWidth={Math.max(width + 14, 18)}
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

BusLine.propTypes = {
  id: PropTypes.string,
  rect_px: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string,
  width: PropTypes.number,
  dashed: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

function isEqual(prev, next) {
  return (
    prev.id === next.id &&
    prev.width === next.width &&
    prev.dashed === next.dashed &&
    prev.energized === next.energized &&
    prev.energizedToday === next.energizedToday &&
    prev.rect_px?.length === next.rect_px?.length &&
    prev.rect_px?.every((value, idx) => value === next.rect_px?.[idx])
  );
}

export default React.memo(BusLine, isEqual);

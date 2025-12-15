// src/ui/PolylineCable.jsx
import React from "react";
import PropTypes from "prop-types";
import { COLOR_MAP } from "../utils/constans";

function PolylineCable({
  id,
  points = [], // [[x,y], [x,y], ...]
  color = "#111",
  width = 2,
  dashed = false,
  energized = false,
  energizedToday = false,
  highlight = false,

  // 箭头 & 文本
  arrowType, // "head" | "tail"
  label,
  showLabel = true,

  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}) {
  if (!points || points.length < 2) return null;

  const pointsStr = points.map((p) => p.join(",")).join(" ");

  const strokeColor = (() => {
    if (energizedToday) return COLOR_MAP.orange500;
    if (energized) return COLOR_MAP.red500;
    if (highlight) return COLOR_MAP.green500;
    return color || "#111";
  })();

  const strokeWidth = width;

  const start = points[0];
  const end = points[points.length - 1];

  let labelPos = null;
  let labelText = "";

  if (arrowType === "head") {
    labelPos = end;
    labelText = label ? `to ${label}` : "";
  } else if (arrowType === "tail") {
    labelPos = start;
    labelText = label ? `from ${label}` : "";
  }

  const safeId = String(id || "cable").replace(/[^a-zA-Z0-9_-]/g, "_");
  const markerEndId = `arrow-end-${safeId}`;
  const markerStartId = `arrow-start-${safeId}`;

  // ⭐ 箭头命中区域半径（可以根据喜好调大一点）
  const hitRadius = Math.max(strokeWidth + 10, 14);

  const cursor = onClick ? "pointer" : "default";

  return (
    <g data-id={id}>
      <defs>
        <marker
          id={markerEndId}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={strokeColor} />
        </marker>

        <marker
          id={markerStartId}
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path d="M10,0 L0,5 L10,10 z" fill={strokeColor} />
        </marker>
      </defs>

      {/* 可见线条 */}
      <polyline
        points={pointsStr}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={dashed ? "6 6" : undefined}
        markerEnd={arrowType === "head" ? `url(#${markerEndId})` : undefined}
        markerStart={
          arrowType === "tail" ? `url(#${markerStartId})` : undefined
        }
        style={{ cursor }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />

      {/* 文本：to / from XXX */}
      {showLabel && labelPos && labelText && (
        <text
          x={labelPos[0] + 6}
          y={labelPos[1] - 6}
          fontSize={12}
          fill={strokeColor}
          pointerEvents="none"
        >
          {labelText}
        </text>
      )}

      {/* 交互命中层：粗透明 polyline + 箭头区域的透明 circle */}
      <g pointerEvents="stroke">
        {/* 线条命中层 */}
        <polyline
          points={pointsStr}
          fill="none"
          stroke="transparent"
          strokeWidth={Math.max(strokeWidth + 12, 16)}
          vectorEffect="non-scaling-stroke"
          pointerEvents="stroke"
          style={{ cursor }}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        />

        {/* ⭐ 箭头命中 circle：head */}
        {arrowType === "head" && end && (
          <circle
            cx={end[0]}
            cy={end[1]}
            r={hitRadius}
            fill="transparent"
            stroke="transparent"
            pointerEvents="all"
            style={{ cursor }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          />
        )}

        {/* ⭐ 箭头命中 circle：tail */}
        {arrowType === "tail" && start && (
          <circle
            cx={start[0]}
            cy={start[1]}
            r={hitRadius}
            fill="transparent"
            stroke="transparent"
            pointerEvents="all"
            style={{ cursor }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          />
        )}
      </g>
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
  highlight: PropTypes.bool,

  arrowType: PropTypes.oneOf(["head", "tail"]),
  label: PropTypes.string,
  showLabel: PropTypes.bool,

  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

function arePointsEqual(prevPoints = [], nextPoints = []) {
  if (prevPoints.length !== nextPoints.length) return false;
  for (let i = 0; i < prevPoints.length; i++) {
    const [px, py] = prevPoints[i] || [];
    const [nx, ny] = nextPoints[i] || [];
    if (px !== nx || py !== ny) return false;
  }
  return true;
}

function isEqual(prev, next) {
  return (
    prev.id === next.id &&
    prev.width === next.width &&
    prev.dashed === next.dashed &&
    prev.energized === next.energized &&
    prev.energizedToday === next.energizedToday &&
    prev.highlight === next.highlight &&
    prev.arrowType === next.arrowType &&
    prev.label === next.label &&
    prev.showLabel === next.showLabel &&
    prev.color === next.color &&
    arePointsEqual(prev.points, next.points)
  );
}

export default React.memo(PolylineCable, isEqual);

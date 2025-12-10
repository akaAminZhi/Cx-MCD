import React from "react";
import FlashIcon from "./FlashIcon";
import PropTypes from "prop-types";
import { COLOR_MAP } from "../utils/constans";
function Panelboard({
  x1,
  y1,
  x2,
  y2,
  name,
  energized,
  energizedToday,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}) {
  const strokeColor = "#000000";
  // const colorMap = {
  //   gray50: "#f9fafb",
  //   yellow300: "#fde047",
  //   red500: "#ef4444",
  //   orange500: "#f97316",
  // };

  const width = x2 - x1;
  const height = y2 - y1;
  const getFillColor = () => {
    if (energizedToday) return COLOR_MAP.orange500;
    if (energized) return COLOR_MAP.red500;
    return COLOR_MAP.gray50;
  };
  return (
    <>
      {/* ✅ 透明命中层（外层坐标系，无变换），接收所有事件 */}
      <rect
        x={x1}
        y={y1}
        width={width}
        height={height}
        fill="white"
        fillOpacity="0" // 透明但可命中
        pointerEvents="all"
        style={{ cursor: "pointer" }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />

      {/* ✅ 可视层（不接事件），只负责显示 */}
      <g transform={`translate(${x1}, ${y1})`} pointerEvents="none">
        {energized && <FlashIcon x={width / 2} y={-20} />}

        {/* 主体矩形（保持可见，不要 fillOpacity=0） */}
        <rect
          width={width}
          height={height}
          fill={getFillColor()}
          stroke={strokeColor}
          strokeWidth={2}
          rx={Math.min(width, height) * 0.1}
        />

        <text
          x={width / 2}
          y={-10}
          textAnchor="middle"
          fontSize="10"
          fill="#333"
        >
          {name}
        </text>

        <circle
          cx={width / 2}
          cy={height * 0.15}
          r={Math.min(width, height) * 0.05}
          fill={energized ? "red" : "gray"}
          stroke="black"
          strokeWidth={1}
        />

        <rect
          x={width / 2 - width * 0.05}
          y={height / 2 - height * 0.15}
          width={width * 0.1}
          height={height * 0.3}
          fill="#333"
          rx={2}
        />
      </g>
    </>
  );
}

Panelboard.propTypes = {
  name: PropTypes.string,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  energized: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

function isEqual(prev, next) {
  return (
    prev.x1 === next.x1 &&
    prev.y1 === next.y1 &&
    prev.x2 === next.x2 &&
    prev.y2 === next.y2 &&
    prev.name === next.name &&
    prev.energized === next.energized &&
    prev.energizedToday === next.energizedToday
  );
}

export default React.memo(Panelboard, isEqual);

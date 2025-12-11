// src/ui/Breaker.jsx
import React from "react";
import PropTypes from "prop-types";
import { COLOR_MAP } from "../utils/constans";

/**
 * 断路器符号：
 * - 外面是一个小矩形框
 * - 中间一条“拨杆”表示开/关方向
 * - 底部显示 CLOSE / OPEN 文本
 * - CLOSE: 红色；OPEN: 绿色
 */
function Breaker({
  x1,
  y1,
  x2,
  y2,
  state = "OPEN", // "CLOSE" | "OPEN"
  name,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}) {
  const width = x2 - x1;
  const height = y2 - y1;

  const isClosed = state === "CLOSE";

  const strokeColor = "#000000";
  const stateColor = isClosed ? COLOR_MAP.red500 : COLOR_MAP.green500;

  return (
    <>
      {/* 命中层：透明矩形，负责事件 */}
      <rect
        x={x1}
        y={y1}
        width={width}
        height={height}
        fill="white"
        fillOpacity="0"
        pointerEvents="all"
        style={{ cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />

      {/* 可视层：平移到左上角，pointerEvents 关闭 */}
      <g transform={`translate(${x1}, ${y1})`} pointerEvents="none">
        {/* 可选名字，显示在上方 */}
        {name && (
          <text
            x={width / 2}
            y={-6}
            textAnchor="middle"
            fontSize={10}
            fill="#333"
          >
            {name}
          </text>
        )}

        {/* 外框 */}
        <rect
          x={width * 0.15}
          y={height * 0.1}
          width={width * 0.7}
          height={height * 0.5}
          rx={2}
          fill="#fff"
          stroke={stateColor}
          strokeWidth={1.5}
        />

        {/* 拨杆：用线段表示开合方向 */}
        {isClosed ? (
          // CLOSE：拨杆竖直 / 接通
          <line
            x1={width / 2}
            y1={height * 0.15}
            x2={width / 2}
            y2={height * 0.55}
            stroke={stateColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ) : (
          // OPEN：拨杆倾斜 / 断开
          <line
            x1={width * 0.35}
            y1={height * 0.2}
            x2={width * 0.65}
            y2={height * 0.5}
            stroke={stateColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}

        {/* 上下两个触点圆点 */}
        <circle
          cx={width / 2}
          cy={height * 0.15}
          r={height * 0.03}
          fill={stateColor}
        />
        <circle
          cx={width / 2}
          cy={height * 0.55}
          r={height * 0.03}
          fill={stateColor}
        />

        {/* 状态文字：CLOSE / OPEN */}
        <text
          x={width / 2}
          y={height * 0.85}
          textAnchor="middle"
          fontSize={10}
          fill={stateColor}
        >
          {state}
        </text>
      </g>
    </>
  );
}

Breaker.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  state: PropTypes.oneOf(["CLOSE", "OPEN"]),
  name: PropTypes.string,
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
    prev.state === next.state
  );
}

export default React.memo(Breaker, isEqual);

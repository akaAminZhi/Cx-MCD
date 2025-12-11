// src/ui/BusBreakerSwitch.jsx
import React from "react";
import PropTypes from "prop-types";
import { COLOR_MAP } from "../utils/constans";

/**
 * 嵌入母线槽的开关（中间是典型 -- o / o -- 符号）
 *
 * - state="CLOSE"：拨杆水平连到右圆点，闭合
 * - state="OPEN" ：拨杆斜向上，和右圆点断开
 * - 壳体 + 外部把手，OPEN=绿色，CLOSE=红色
 */
function BusBreakerSwitch({
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
  const stateColor = isClosed ? COLOR_MAP.red500 : COLOR_MAP.green500;
  const shellStroke = stateColor; // 壳体跟状态同色，像你截图那样
  const symbolStroke = "#444"; // 固定线条用灰色

  // 壳体在本地坐标中的位置
  const shellX = width * 0.1;
  const shellY = height * 0.2;
  const shellW = width * 0.6;
  const shellH = height * 0.6;

  // 开关符号中心线高度
  const midY = shellY + shellH / 2;

  // 左右圆点（触点）位置
  const leftCircleX = shellX + shellW * 0.25;
  const rightCircleX = shellX + shellW * 0.75;
  const circleR = shellH * 0.06;

  // 两侧固定水平线长度
  const leftLineStartX = shellX + shellW * 0.05;
  const rightLineEndX = shellX + shellW * 0.95;

  // 拨杆起点：左圆点中心
  const handlePivotX = leftCircleX;
  const handlePivotY = midY;

  // 拨杆终点：根据 state 决定
  const handleEndX = isClosed
    ? rightCircleX // 闭合：连到右圆点
    : (leftCircleX + rightCircleX) / 2; // 断开：停在中间偏左一点

  const handleEndY = isClosed
    ? midY // 闭合：水平
    : midY - shellH * 0.25; // 断开：往上抬

  // 外部把手：从壳体右侧伸出
  const handleBaseX = shellX + shellW;
  const handleBaseY = midY;
  const handleLen = Math.min(width, height) * 0.4;

  const extHandleEndX = handleBaseX + handleLen * 0.8;
  const extHandleEndY = isClosed
    ? handleBaseY + handleLen * 0.4 // CLOSE：把手略向下
    : handleBaseY - handleLen * 0.4; // OPEN：把手略向上

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

      {/* 可视层 */}
      <g transform={`translate(${x1}, ${y1})`} pointerEvents="none">
        {/* 名字 */}
        {name && (
          <text
            x={width / 2}
            y={shellY - 6}
            textAnchor="middle"
            fontSize={10}
            fill="#111"
          >
            {name}
          </text>
        )}

        {/* 壳体矩形 */}
        <rect
          x={shellX}
          y={shellY}
          width={shellW}
          height={shellH}
          rx={3}
          fill="#fff"
          stroke={shellStroke}
          strokeWidth={2}
        />

        {/* 左右固定水平线 */}
        <line
          x1={leftLineStartX}
          y1={midY}
          x2={leftCircleX}
          y2={midY}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={rightCircleX}
          y1={midY}
          x2={rightLineEndX}
          y2={midY}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* 左右圆点（触点） */}
        <circle
          cx={leftCircleX}
          cy={midY}
          r={circleR}
          fill="#fff"
          stroke={stateColor}
          strokeWidth={1.5}
        />
        <circle
          cx={rightCircleX}
          cy={midY}
          r={circleR}
          fill="#fff"
          stroke={stateColor}
          strokeWidth={1.5}
        />

        {/* 中间拨杆：颜色用 stateColor */}
        <line
          x1={handlePivotX}
          y1={handlePivotY}
          x2={handleEndX}
          y2={handleEndY}
          stroke={stateColor}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* 外部把手：从壳体右侧伸出去 */}
        <line
          x1={handleBaseX}
          y1={handleBaseY}
          x2={extHandleEndX}
          y2={extHandleEndY}
          stroke={stateColor}
          strokeWidth={3}
          strokeLinecap="round"
        />

        <rect
          x={extHandleEndX - shellH * 0.12}
          y={extHandleEndY - shellH * 0.12}
          width={shellH * 0.24}
          height={shellH * 0.24}
          rx={2}
          fill={stateColor}
          stroke={stateColor}
          strokeWidth={1}
        />

        {/* 状态文字 */}
        <text
          x={width / 2}
          y={height + 2}
          textAnchor="middle"
          fontSize={5}
          fill={stateColor}
        >
          {state}
        </text>
      </g>
    </>
  );
}

BusBreakerSwitch.propTypes = {
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

export default React.memo(BusBreakerSwitch, isEqual);

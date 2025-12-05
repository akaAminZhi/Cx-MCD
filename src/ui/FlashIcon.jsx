// FlashIcon.jsx
import React from "react";

export default function FlashIcon({
  x = 0,
  y = 0,
  size = 50,
  color = "orange",
  glow = true,
  animate = true,  // 新增：是否动画
}) {
  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={size}
        fill={color}
        filter={glow ? "url(#flash-glow)" : undefined}
        className={animate ? "flash-icon" : undefined}
      >
        ⚡
      </text>
    </g>
  );
}

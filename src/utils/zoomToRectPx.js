// src/features/diagrams/pan/zoomToRectPx.js
/**
 * 计算将 rect_px 适配到视口（带 padding）的 scale 与 translate。
 * 视口坐标系与图纸坐标系一致（未旋转）。
 */
export function computeTransformToFitRect({
  rect, // [x1,y1,x2,y2]
  viewportWidth, // 容器宽
  viewportHeight, // 容器高
  padding = 40, // 额外留白像素
  maxScale = 4, // 最大放大倍数可按需调整
}) {
  const [x1, y1, x2, y2] = rect;
  const w = Math.max(1, x2 - x1);
  const h = Math.max(1, y2 - y1);

  const targetW = w + padding * 2;
  const targetH = h + padding * 2;

  const sx = viewportWidth / targetW;
  const sy = viewportHeight / targetH;
  const scale = Math.min(sx, sy, maxScale);

  // 把矩形中心移动到视口中心
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const viewCx = viewportWidth / 2;
  const viewCy = viewportHeight / 2;

  // 若 PanZoom 的变换是：屏幕像素 = scale * (world) + translate
  const translate = {
    x: viewCx - scale * cx,
    y: viewCy - scale * cy,
  };

  return { scale, translate };
}

/**
 * 应用变换到你的 PanZoomSVG。
 * 容错实现：优先用 ref 方法，其次直接改 stateRef，最后尝试强制刷新。
 */
export function applyTransform({
  panZoomRef,
  stateRef,
  transform,
  forceRender,
}) {
  if (panZoomRef?.current?.setTransform) {
    panZoomRef.current.setTransform(transform); // 例如你的组件若提供这个方法
    return;
  }
  if (stateRef?.current) {
    stateRef.current.scale = transform.scale;
    stateRef.current.translate = transform.translate;
  }
  // 如果没有自动刷新机制，允许父组件传一个 setState 强制触发渲染
  forceRender?.((n) => n + 1);
}

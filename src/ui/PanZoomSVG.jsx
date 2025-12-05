import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useLayoutEffect,
} from "react";
import PropTypes from "prop-types";

const PanZoomSVG = forwardRef(function PanZoomSVG(
  {
    width = "100%",
    height = "100%",
    minScale = 0.1,
    maxScale = 3,
    children,
    stateRef,
    ...props
  },
  ref
) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.3);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // 挂载时，如果提供了 stateRef.current，就用它初始化
  useLayoutEffect(() => {
    if (stateRef?.current) {
      if (typeof stateRef.current.scale === "number")
        setScale(stateRef.current.scale);
      if (stateRef.current.translate) setTranslate(stateRef.current.translate);
    }
    // 只在首次挂载读取一次
  }, []);

  // 对外暴露命令式 API
  useImperativeHandle(ref, () => ({
    // 1) 直接设定缩放和平移
    setTransform({ scale: s, translate: t }) {
      const sClamped = Math.min(maxScale, Math.max(minScale, s));
      setScale(sClamped);
      setTranslate(t);
    },

    // 2) 缩放到指定点（你原来的实现）
    zoomToPoint(x, y) {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      setTranslate({
        x: cx - x * scale,
        y: cy - y * scale,
      });
    },

    // 3) 缩放到矩形（rect=[x1,y1,x2,y2]），自动留白&限制最大缩放
    zoomToRect(rect, { padding = 40, maxScale: maxS = maxScale } = {}) {
      const [x1, y1, x2, y2] = rect;
      const w = Math.max(1, x2 - x1);
      const h = Math.max(1, y2 - y1);
      const container = containerRef.current;
      if (!container) return;

      const { clientWidth: vw, clientHeight: vh } = container;
      const targetW = w + padding * 2;
      const targetH = h + padding * 2;

      const sx = vw / targetW;
      const sy = vh / targetH;
      const s = Math.min(sx, sy, maxS);
      const sClamped = Math.min(maxScale, Math.max(minScale, s));

      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const viewCx = vw / 2;
      const viewCy = vh / 2;

      const t = {
        x: viewCx - sClamped * cx,
        y: viewCy - sClamped * cy,
      };

      setScale(sClamped);
      setTranslate(t);
    },
  }));

  // 鼠标滚轮缩放（围绕鼠标点缩放）
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const zoomFactor = 0.1;
      const direction = e.deltaY < 0 ? 1 : -1;
      const nextScale = Math.min(
        maxScale,
        Math.max(minScale, scale * (1 + zoomFactor * direction))
      );
      if (nextScale === scale) return;

      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const svgX = (offsetX - translate.x) / scale;
      const svgY = (offsetY - translate.y) / scale;

      setTranslate({
        x: offsetX - svgX * nextScale,
        y: offsetY - svgY * nextScale,
      });
      setScale(nextScale);
    },
    [scale, translate, minScale, maxScale]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // 把内部状态回写到 stateRef，供外部读取（可选）
  useEffect(() => {
    if (stateRef?.current) {
      stateRef.current.scale = scale;
      stateRef.current.translate = translate;
    }
  }, [scale, translate, stateRef]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        overflow: "hidden",
        position: "relative",
        border: "1px solid #ccc",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      {...props}
      onMouseDown={(e) => {
        setIsDragging(true);
        setLastPos({ x: e.clientX, y: e.clientY });
      }}
      onMouseMove={(e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastPos({ x: e.clientX, y: e.clientY });
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <svg width="100%" height="100%">
        <g
          transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}
        >
          {children}
        </g>
      </svg>
    </div>
  );
});

PanZoomSVG.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  minScale: PropTypes.number,
  maxScale: PropTypes.number,
  children: PropTypes.node,
  stateRef: PropTypes.object,
};

export default PanZoomSVG;

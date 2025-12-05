// 放在顶层（例如 App.tsx 的 <svg> 前后都行，只要在文档中出现一次）
export default function FlashGlobals() {
    return (
      <>
        <style>
          {`
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.5); }
          }
          .flash-icon {
            animation: pulse-glow 1.2s infinite ease-in-out;
            transform-origin: center;
            transform-box: fill-box;
          }
          @media (prefers-reduced-motion: reduce) {
            .flash-icon { animation: none !important; }
          }
          `}
        </style>
  
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            {/* 统一复用一个滤镜；可调小 stdDeviation 降负担 */}
            <filter id="flash-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 性能更好的可选：用 feDropShadow 代替 GaussianBlur */}
            {/* <filter id="flash-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="orange" flood-opacity="0.8"/>
            </filter> */}
          </defs>
        </svg>
      </>
    );
  }
  
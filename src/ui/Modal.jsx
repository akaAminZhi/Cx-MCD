import { HiXMark } from "react-icons/hi2";
import Button from "./Button";
import { createPortal } from "react-dom";
import {
  cloneElement,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import useClickOutside from "../hooks/useClickOutside";
import PropTypes from "prop-types";

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  // 打开时锁定页面滚动
  useEffect(() => {
    if (openName) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [openName]);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: modalWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(modalWindowName) });
}

/**
 * props:
 * - name: 唯一标识
 * - size: "md" | "lg" | "xl" （默认 lg）
 * - className: 额外样式（可覆盖）
 */
function Window({ children, name, size = "lg" }) {
  const { close, openName } = useContext(ModalContext);
  const ref = useClickOutside(close);

  // Esc 关闭
  useEffect(() => {
    if (openName !== name) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openName, name, close]);

  const sizeClass = useMemo(() => {
    switch (size) {
      case "md":
        // 适中：不滚动
        return "w-[min(88vw,56rem)] max-h-[86vh]";
      case "xl":
        // 更大：接近全屏，不滚动
        return "w-[min(96vw,90rem)] max-h-[90vh]";
      case "lg":
      default:
        // 默认比你原来大很多：不滚动
        return "w-[min(92vw,72rem)] max-h-[88vh]";
    }
  }, [size]);

  const styleModal = `fixed z-[1001] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
     rounded-xl shadow-2xl bg-white
     ${sizeClass} overflow-hidden
     p-6 transition-all duration-300 `;

  const overlay =
    "fixed z-[1000] inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity";

  if (openName !== name) return null;

  const injectClose =
    typeof children === "function"
      ? children({ closeModal: close })
      : cloneElement(children, { closeModal: close });

  return createPortal(
    <div className={overlay} role="presentation">
      <div className={styleModal} ref={ref} role="dialog" aria-modal="true">
        {/* 右上角关闭按钮（悬浮不占布局） */}
        <Button onClick={close}>
          <HiXMark />
        </Button>

        {/* 内容区域 */}
        <div className="h-full w-full pt-6">{injectClose}</div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Modal.Dismiss：包一层就能让内部任意元素点击后关闭弹窗
 * 会合并原本的 onClick（先执行原 onClick，再 close）
 */
function Dismiss({ children }) {
  const { close } = useContext(ModalContext);
  const originalOnClick = children.props?.onClick;

  const handleClick = (e) => {
    if (typeof originalOnClick === "function") originalOnClick(e);
    close();
  };

  return cloneElement(children, { onClick: handleClick });
}

Modal.Window = Window;
Modal.Open = Open;
Modal.Dismiss = Dismiss;

Modal.propTypes = { children: PropTypes.node };
Open.propTypes = { children: PropTypes.node, opens: PropTypes.string };
Window.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string,
  size: PropTypes.oneOf(["md", "lg", "xl"]),
  className: PropTypes.string,
};
Dismiss.propTypes = { children: PropTypes.node };

export default Modal;
export const useModal = () => useContext(ModalContext);

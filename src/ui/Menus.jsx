import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { HiEllipsisVertical } from "react-icons/hi2";
import useClickOutside from "../hooks/useClickOutside";

const menusContext = createContext();
function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const close = () => setOpenId("");
  const open = setOpenId;
  const [position, setPosition] = useState(null);

  return (
    <menusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </menusContext.Provider>
  );
}

function Menu({ children }) {
  return <div className="flex justify-end items-center">{children}</div>;
}
function Toggle({ id }) {
  const { open, close, openId, setPosition } = useContext(menusContext);

  function hanldeClick(e) {
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x + 25,
      y: rect.y + rect.height - 40,
    });

    if (id !== openId || id === "") {
      open(id);
    } else {
      close();
    }
  }
  return (
    <button
      onClick={hanldeClick}
      className="border-0 p-3 rounded-sm  duration-200 hover:bg-gray-300 stroke-gray-700"
    >
      <HiEllipsisVertical className="w-10 h-10"></HiEllipsisVertical>
    </button>
  );
}
function List({ id, children }) {
  const { openId, position, close } = useContext(menusContext);
  const ref = useClickOutside(close);
  if (id !== openId) {
    return null;
  }

  const right = `${position.x}px`;
  const top = `${position.y}px`;

  return createPortal(
    <ul
      ref={ref}
      style={{ right: right, top: top }}
      className={`fixed bg-gray-100 shadow-xl rounded-md `}
    >
      {children}
    </ul>,
    document.body
  );
}
function Button({ icon, children, onClick, isDisabled = false }) {
  const { close } = useContext(menusContext);
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <button
        disabled={isDisabled}
        onClick={handleClick}
        className="disabled:cursor-not-allowed w-full text-left border-0 py-2 px-2 flex items-center gap-3 rounded-sm translate-x-1 duration-200 hover:bg-indigo-200 stroke-gray-400 stroke-2"
      >
        {icon}
        <span>{children}</span>
      </button>
    </li>
  );
}

Menus.propTypes = { children: PropTypes.node };
Menu.propTypes = { children: PropTypes.node };
Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.any,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.any,
};
List.propTypes = {
  children: PropTypes.node,
  id: PropTypes.any,
};
Toggle.propTypes = {
  id: PropTypes.any,
};
Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
export default Menus;

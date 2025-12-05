import React from "react";
import PropTypes from "prop-types";

const Row = ({ type = "vertical", className = "", children, ...props }) => {
  let classes = "flex p-2 ";

  if (type === "horizontal") {
    classes += "justify-between items-center ";
  } else if (type === "vertical") {
    classes += "flex-col gap-[1.6rem] ";
  }

  return (
    <div className={`${classes} ${className}`} {...props}>
      {children}
    </div>
  );
};

Row.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Row;

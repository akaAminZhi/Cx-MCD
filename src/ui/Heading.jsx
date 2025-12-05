import PropTypes from "prop-types";
function Heading({ Tag = "h1", children, className = "", ...props }) {
  let classes = "leading-[1.4] ";

  if (Tag === "h1") {
    classes += "text-[3rem] font-semibold ";
  } else if (Tag === "h2") {
    classes += "text-[2rem] font-semibold ";
  } else if (Tag === "h3") {
    classes += "text-[2rem] font-medium ";
  }
  return (
    <Tag className={`${classes} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

Heading.propTypes = {
  Tag: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
export default Heading;

import PropTypes from "prop-types";

function FormRow({ label, error, children }) {
  return (
    <div
      className={`grid items-center grid-cols-[1fr_1fr${
        error ? "_1.2fr" : ""
      }] gap-5 py-5`}
    >
      {label && <label className="font-medium">{label}</label>}
      {children}
      {error && <span className="text-xl text-red-700">{error}</span>}
    </div>
  );
}
FormRow.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};
export default FormRow;

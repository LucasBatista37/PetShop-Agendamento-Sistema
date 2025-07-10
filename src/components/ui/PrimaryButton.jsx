import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

export default function PrimaryButton({
  children,
  onClick,
  color = "indigo",
  fullWidth = true,
  icon: Icon,
  type = "button",
  className = "",
  ...props
}) {
  const baseStyles =
    "rounded-md text-white hover:brightness-110 transition flex items-center justify-center px-4 sm:px-6 py-2 text-base sm:text-lg";

  const colorStyles = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    gray: "bg-gray-600 hover:bg-gray-700",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={clsx(
        baseStyles,
        colorStyles[color],
        fullWidth ? "w-full sm:w-auto" : "w-fit",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="mr-2" />}
      {children}
    </button>
  );
}

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.oneOf(["indigo", "green", "red", "gray"]),
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
  type: PropTypes.string,
  className: PropTypes.string,
};

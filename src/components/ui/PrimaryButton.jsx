import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

export default function PrimaryButton({
  children,
  onClick,
  color = "indigo-600",
  fullWidth = true,
  icon: Icon,
  type = "button",
  className = "",
  ...props
}) {
  const baseStyles =
    "rounded-md text-white hover:brightness-110 transition flex items-center justify-center px-4 sm:px-6 py-2 text-base sm:text-lg";

  const getHoverColor = (color) => {
    const match = color.match(/-(\d{3})$/);
    if (!match) return `hover:${color}`;
    const num = parseInt(match[1]);
    const hoverNum = Math.min(num + 100, 900); 
    return `hover:bg-${color.split("-")[0]}-${hoverNum}`;
  };

  const colorClass = `bg-${color}`;
  const hoverClass = getHoverColor(color);

  return (
    <button
      onClick={onClick}
      type={type}
      className={clsx(
        baseStyles,
        colorClass,
        hoverClass,
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
  color: PropTypes.string, 
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
  type: PropTypes.string,
  className: PropTypes.string,
};

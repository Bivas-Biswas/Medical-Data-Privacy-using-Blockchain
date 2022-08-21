import React from "react";
import cx from "classnames";

const ButtonStyle = {
  primary: "bg-green-500",
  secondary: "bg-red-500",
};

function Button({
  className = "",
  disabled = false,
  onClick = () => {},
  children,
  type = "primary",
}) {
  return (
    <button
      disabled={disabled}
      className={cx(
        ButtonStyle[type],
        "flex flex-row text-gray-100 items-center justify-center rounded px-2 py-1.5 transition-all duration-150 ease-in-out hover:scale-[1.02]",
        className
      )}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </button>
  );
}

export default Button;

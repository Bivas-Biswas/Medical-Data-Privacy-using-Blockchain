import React from "react";
import cx from "classnames";

export const inputStyle = {
  base: `block w-full px-2 py-1 focus:outline-none text-gray-100 placeholder-gray-400 bg-gray-900 disabled:opacity-80`,
  variants: {
    state: {
      default: "border-gray-900 focus:border-indigo-500 focus:ring-indigo-500",
      success: "border-green-400 focus:border-green-500 focus:ring-green-500",
      error: "border-red-400 focus:border-red-500 focus:ring-red-500",
    },
    textSize: {
      small: "text-xs",
      regular: "text-sm",
      large: "text-base",
    },
    roundness: {
      default: "rounded-md",
      none: "rounded-none",
      full: "rounded-full",
    },
  },
  defaults: {
    textSize: "regular",
    roundness: "default",
    state: "default",
  },
};

export const Input = React.forwardRef((props, ref) => {
  const {
    id,
    label,
    info,
    icon,
    c = "default",
    hideLabel,
    showStatusIcon = true,
    message,
    type = "text",
    textSize = "regular",
    roundness = "default",
    state = "default",
    wrapperClassName,
    className,
    labelClassName,
    onChangeValue,
    onChange,
    ...rest
  } = props;

  const messageState = props.messageState || message;

  return (
    <div className={wrapperClassName}>
      <div className="flex justify-between mx-1">
        <label
          htmlFor={id}
          className={cx(
            hideLabel ? "sr-only" : "block text-sm font-medium text-gray-100",
            labelClassName
          )}
        >
          {label}
        </label>

        {info && <span className="text-sm text-gray-400">{info}</span>}
      </div>

      <div className="mt-1 relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon({})}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          id={id}
          name={id}
          className={cx(
            inputStyle.base,
            inputStyle.variants.textSize[textSize],
            inputStyle.variants.state[state],
            inputStyle.variants.roundness[roundness],
            className
          )}
          onChange={(e) => {
            if (onChange) onChange(e);
            if (onChangeValue) onChangeValue(e.target.value);
          }}
          {...rest}
        />
      </div>

      {message && (
        <p
          className={`mt-2 text-sm ${
            messageState === "error"
              ? "text-red-500"
              : messageState === "success"
              ? "text-green-500"
              : "text-white"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;

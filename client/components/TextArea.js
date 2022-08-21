import React from "react";
import cx from "classnames";

const TextArea = ({ onValueChange, id, label, className, ...props }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1"
      >
        {label}
      </label>
      <textarea
        {...props}
        className={cx(
          "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block border-gray-900 rounded-md p-2",
          className
        )}
        onChange={(e) => onValueChange(e.target.value)}
      ></textarea>
    </div>
  );
};

export default TextArea;

import React from "react";
import cx from "classnames";

const Loading = ({ centerParent, className }) => {
  return (
    <div
      className={cx(
        "flex justify-center items-center align-middle",
        centerParent && "w-full h-full m-auto",
        className
      )}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800" />
    </div>
  );
};

export default Loading;

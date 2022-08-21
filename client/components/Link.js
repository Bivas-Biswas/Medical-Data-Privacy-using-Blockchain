import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Link = ({
  href,
  children,
  className = "",
  activeClassName = "",
  ...props
}) => {
  const router = useRouter();

  const isActive = router.route === href;
  const finalClassName = className + (isActive ? `${activeClassName}` : "");

  return (
    <NextLink href={href || ""}>
      <a href={href || ""} {...props} className={finalClassName}>
        {children}
      </a>
    </NextLink>
  );
};

export default Link;

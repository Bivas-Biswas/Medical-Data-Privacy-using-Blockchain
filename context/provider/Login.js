import React, { createContext, useState } from "react";

export const LoginContext = createContext(null);

export const initialUser = {
  address: "",
  type: "",
};

const LoginContextProvider = (props) => {
  const [user, setUser] = useState(initialUser);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  return (
    <LoginContext.Provider
      value={{
        user,
        isUserLoggedIn,
        setIsUserLoggedIn,
        setUser,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;

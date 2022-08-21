import React from "react";
import AppContextProvider from "./App";
import LoginContextProvider from "./Login";

function WrapperContexProvider(props) {
  return (
    <AppContextProvider>
      <LoginContextProvider>{props.children}</LoginContextProvider>
    </AppContextProvider>
  );
}

export default WrapperContexProvider;

import { useContext } from "react";
import { AppContext } from "./provider/App";
import { LoginContext } from "./provider/Login";


export function useAppContext() {
  return useContext(AppContext);
}

export function useLoginContext() {
  return useContext(LoginContext)
}
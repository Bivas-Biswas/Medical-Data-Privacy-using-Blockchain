import React, { createContext, useContext, useState } from 'react'

export const AppContext = createContext(null)

const AppContextProvider = (props) => {
  const [pomodoro, setPomodoro] = useState(0)
  const [executing, setExcuting] = useState({})
  const [startAnimate, setstartAnimate] = useState(false)
  const [currentAccount, setCurrentAccount] = useState("");

  // start animation fn
  function startTimer() {
    setstartAnimate(true)
  }

  return (
    <AppContext.Provider
      value={{
        pomodoro,
        executing,
        startAnimate
      }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
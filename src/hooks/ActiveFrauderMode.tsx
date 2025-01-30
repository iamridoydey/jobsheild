"use client"
import { createContext, ReactNode, useContext, useState } from "react";

interface ActiveFrauderMode{
  activeMode: string;
  setActiveMode: (mode: string)=> void;
}


// Create the context with default value undefined
const activeFrauderModeContext = createContext<ActiveFrauderMode | undefined>(undefined);


export const ActiveFrauderModeProvider = ({children}: { children: ReactNode})=> {
  const [activeMode, setActiveMode] = useState<string>("view")

  return (
    <activeFrauderModeContext.Provider value={{activeMode, setActiveMode}}>
      {children}
    </activeFrauderModeContext.Provider>
  )
}

// Create a custom hook
const useFrauderMode = ()=> {
  const frauderMode = useContext(activeFrauderModeContext)

  if (!frauderMode) throw new Error("useFrauderMode should be wrapped in ActiveFrauderModeProvider");

  return frauderMode;

  
}


export default useFrauderMode;
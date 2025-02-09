import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define interface for AuthContext
interface Auth {
  showAuthPopup: boolean;
  setAuthPopup: Dispatch<SetStateAction<boolean>>; // Correct type for setAuthPopup
}

// Create context with default value as undefined
const ShowAuthPopupContext = createContext<Auth | undefined>(undefined);

// ShowAuthProvider component
interface ShowAuthProviderProps {
  children: ReactNode;
}

const ShowAuthProvider = ({ children }: ShowAuthProviderProps) => {
  const [showAuthPopup, setAuthPopup] = useState(false);

  return (
    <ShowAuthPopupContext.Provider value={{ showAuthPopup, setAuthPopup }}>
      {children}
    </ShowAuthPopupContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuthPopup = () => {
  const authPopup = useContext(ShowAuthPopupContext);

  if (!authPopup) {
    throw new Error("useAuthPopup must be wrapped inside ShowAuthProvider");
  }

  return authPopup;
};

export { ShowAuthProvider, useAuthPopup };

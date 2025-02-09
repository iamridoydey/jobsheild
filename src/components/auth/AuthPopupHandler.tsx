import { useAuthPopup } from "@/hooks/authPopup";
import SignInSignUpPopup from "@/components/auth/Auth";

const AuthPopupHandler = () => {
  const { showAuthPopup } = useAuthPopup(); 

  return (
    <div className="absolute">
      {showAuthPopup && <SignInSignUpPopup />}
    </div>
  );
};

export default AuthPopupHandler;

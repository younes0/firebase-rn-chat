import { useState, useEffect } from "react";
import { getAuth, FirebaseAuthTypes } from "@react-native-firebase/auth";

interface SignInCheckResult {
  signedIn: boolean;
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: Error | null;
}

const useSignInCheck = () => {
  const [result, setResult] = useState<SignInCheckResult>({
    signedIn: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      setResult({
        signedIn: !!user,
        user,
        loading: false,
        error: null,
      });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return {
    data: result,
  };
};

export default useSignInCheck;

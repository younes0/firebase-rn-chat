import { useEffect } from "react";

import { signInAnonymously } from "@/modules/firebase/adapters/auth.adapter";

const useFirebaseLogin = () => {
  useEffect(() => {
    signInAnonymously();
  }, []);
};

export default useFirebaseLogin;

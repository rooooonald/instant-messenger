import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";

export const AuthContext = createContext({
  userId: "",
  userEmail: "",
  username: "",
  status: "",
  changeUserHandler: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const foundUser = userDoc.data();
        setUser({ userId: user.uid, ...foundUser, status: "authenticated" });
      } else {
        setUser({ status: "unauthenticated" });
      }
    });
  }, []);

  const context = {
    userId: user?.userId,
    userEmail: user?.email,
    username: user?.username,
    status: user?.status,
    changeUserHandler: setUser,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

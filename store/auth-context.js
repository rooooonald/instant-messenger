import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";

export const AuthContext = createContext({
  id: "",
  userEmail: "",
  username: "",
  changeUserHandler: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const foundUser = userDoc.data();
        setUser({ userId: user.uid, ...foundUser });
      } else {
        setUser(null);
      }
    });
  }, []);

  const context = {
    userId: user?.userId,
    userEmail: user?.email,
    username: user?.username,
    changeUserHandler: setUser,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

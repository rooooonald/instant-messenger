import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhzZ5CboHr0Dw-kqg2LZbQ0oBDjuEbqHA",
  authDomain: "forgotten-messenger.firebaseapp.com",
  projectId: "forgotten-messenger",
  storageBucket: "forgotten-messenger.appspot.com",
  messagingSenderId: "689824270517",
  appId: "1:689824270517:web:cb82d10194ec792b9756fc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();

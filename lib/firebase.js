import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKxFfTzbkH9b0GYAqQzY1YiYIo3Vw4kRY",
  authDomain: "react-native-auth-faaee.firebaseapp.com",
  projectId: "react-native-auth-faaee",
  storageBucket: "react-native-auth-faaee.appspot.com",
  messagingSenderId: "991451968593",
  appId: "1:991451968593:web:cccfae47ebae9ad1787470",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();

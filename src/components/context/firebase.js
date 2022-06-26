import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8hrYK2-7t_p_7GvKCMcp6229dHaPRdzw",
  authDomain: "clouds-46e4b.firebaseapp.com",
  projectId: "clouds-46e4b",
  storageBucket: "clouds-46e4b.appspot.com",
  messagingSenderId: "187498570926",
  appId: "1:187498570926:web:cb76b395f4e2a202cfb93f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export const auth = getAuth(app);
export default db;




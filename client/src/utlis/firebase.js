import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-interview-agent-b1ce7.firebaseapp.com",
  projectId: "ai-interview-agent-b1ce7",
  storageBucket: "ai-interview-agent-b1ce7.appspot.com",
  messagingSenderId: "589763303710",
  appId: "1:589763303710:web:9525634eed77844d9fd10f",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
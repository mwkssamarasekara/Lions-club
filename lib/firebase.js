import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrrpPxDYEyOQG5OO8i6lp_FWP7B5fxClw",
  authDomain: "lions-diamond-homagama.firebaseapp.com",
  projectId: "lions-diamond-homagama",
  storageBucket: "lions-diamond-homagama.firebasestorage.app",
  messagingSenderId: "135408730615",
  appId: "1:135408730615:web:6bac333b471413e9a56ef2",
  measurementId: "G-ZH1T33SPEX"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

// ============================================
// Firebase Configuration — Lions Diamond Homagama
// Uses Firebase CDN (ES Modules)
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDrrpPxDYEyOQG5OO8i6lp_FWP7B5fxClw",
  authDomain: "lions-diamond-homagama.firebaseapp.com",
  projectId: "lions-diamond-homagama",
  storageBucket: "lions-diamond-homagama.firebasestorage.app",
  messagingSenderId: "135408730615",
  appId: "1:135408730615:web:6bac333b471413e9a56ef2",
  measurementId: "G-ZH1T33SPEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

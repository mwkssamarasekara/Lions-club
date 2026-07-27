// ============================================
// Authentication Module — Lions Diamond Homagama
// Handles login, logout, register, and auth state
// ============================================

import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// ---- Login ----
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let message = 'Login failed. Please try again.';
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email address format.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
    }
    return { success: false, message };
  }
}

// ---- Register (Create Admin Account) ----
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let message = 'Registration failed. Please try again.';
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered. Please sign in instead.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address format.';
        break;
      case 'auth/weak-password':
        message = 'Password must be at least 6 characters.';
        break;
    }
    return { success: false, message };
  }
}

// ---- Logout ----
async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
  window.location.href = 'login.html';
}

// ---- Auth Guard (for dashboard pages) ----
function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (callback) callback(user);
    } else {
      window.location.href = 'login.html';
    }
  });
}

// ---- Check if already logged in (for login page) ----
function redirectIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = 'index.html';
    }
  });
}

export { loginUser, registerUser, logoutUser, requireAuth, redirectIfLoggedIn };

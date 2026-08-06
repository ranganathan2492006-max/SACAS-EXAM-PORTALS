import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";

// Environment variables configuration (Vite style)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase configs are provided
const isConfigComplete = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;

let app;
let auth;
let isMock = false;

if (isConfigComplete) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    console.log("Firebase initialized successfully in production mode.");
  } catch (error) {
    console.error("Failed to initialize Firebase, falling back to mock mode:", error);
    isMock = true;
  }
} else {
  console.warn("Firebase configuration is missing in .env. Falling back to local Mock Mode.");
  isMock = true;
}

// Mock auth interface for local development
const mockAuth = {
  currentUser: null,
  onAuthStateChangedListeners: new Set(),
  
  onAuthStateChanged(callback) {
    this.onAuthStateChangedListeners.add(callback);
    // Fire initial state
    callback(this.currentUser);
    return () => this.onAuthStateChangedListeners.delete(callback);
  },

  async signInWithEmailAndPassword(email, password) {
    // Basic verification for testing
    if (!email.includes("@")) {
      throw new Error("auth/invalid-email");
    }
    if (password.length < 6) {
      throw new Error("auth/weak-password");
    }
    
    this.currentUser = {
      uid: "mock-user-12345",
      email: email,
      displayName: email.split("@")[0],
      emailVerified: true
    };
    
    // Notify listeners
    this.onAuthStateChangedListeners.forEach(listener => listener(this.currentUser));
    localStorage.setItem("mock_user", JSON.stringify(this.currentUser));
    return { user: this.currentUser };
  },

  async createUserWithEmailAndPassword(email, password) {
    if (!email.includes("@")) {
      throw new Error("auth/invalid-email");
    }
    if (password.length < 6) {
      throw new Error("auth/weak-password");
    }
    
    this.currentUser = {
      uid: "mock-user-" + Math.random().toString(36).substr(2, 9),
      email: email,
      displayName: email.split("@")[0],
      emailVerified: true
    };
    
    this.onAuthStateChangedListeners.forEach(listener => listener(this.currentUser));
    localStorage.setItem("mock_user", JSON.stringify(this.currentUser));
    return { user: this.currentUser };
  },

  async signInWithGoogle() {
    this.currentUser = {
      uid: "mock-google-user-12345",
      email: "google.student@university.edu",
      displayName: "Google Student Demo",
      photoURL: "https://lh3.googleusercontent.com/a/default-user"
    };
    this.onAuthStateChangedListeners.forEach(listener => listener(this.currentUser));
    localStorage.setItem("mock_user", JSON.stringify(this.currentUser));
    return { user: this.currentUser };
  },

  async sendPasswordResetEmail(email) {
    if (!email.includes("@")) {
      throw new Error("auth/invalid-email");
    }
    console.log(`[MOCK PASSWORD RESET] Recovery link sent to: ${email}`);
    return true;
  },

  async signOut() {
    this.currentUser = null;
    this.onAuthStateChangedListeners.forEach(listener => listener(null));
    localStorage.removeItem("mock_user");
    return true;
  },

  // Load from storage if available
  initializeFromStorage() {
    const saved = localStorage.getItem("mock_user");
    if (saved) {
      this.currentUser = JSON.parse(saved);
      this.onAuthStateChangedListeners.forEach(listener => listener(this.currentUser));
    }
  }
};

if (isMock) {
  mockAuth.initializeFromStorage();
}

const activeAuth = isMock ? mockAuth : auth;
const activeSignIn = isMock ? (a, e, p) => mockAuth.signInWithEmailAndPassword(e, p) : signInWithEmailAndPassword;
const activeCreateUser = isMock ? (a, e, p) => mockAuth.createUserWithEmailAndPassword(e, p) : createUserWithEmailAndPassword;
const activeSignOut = isMock ? (a) => mockAuth.signOut() : signOut;
const activeOnAuthStateChanged = isMock ? (a, c) => mockAuth.onAuthStateChanged(c) : onAuthStateChanged;

const activeSignInWithGoogle = isMock 
  ? () => mockAuth.signInWithGoogle() 
  : () => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider);
    };

const activeSendPasswordResetEmail = isMock 
  ? (a, e) => mockAuth.sendPasswordResetEmail(e) 
  : (a, e) => sendPasswordResetEmail(auth, e);

export { 
  app, 
  activeAuth as auth, 
  activeSignIn as signInWithEmailAndPassword,
  activeCreateUser as createUserWithEmailAndPassword,
  activeSignOut as signOut,
  activeOnAuthStateChanged as onAuthStateChanged,
  activeSignInWithGoogle as signInWithGoogle,
  activeSendPasswordResetEmail as sendPasswordResetEmail,
  isMock
};

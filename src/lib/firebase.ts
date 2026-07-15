import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";

// Read from the configuration file created by AI Studio
const firebaseConfig = {
  apiKey: "AIzaSyB3wkkWn8SyB0x999JnE7xoPYWkGpNwZWA",
  authDomain: "emergent-forge-rt3g1.firebaseapp.com",
  projectId: "emergent-forge-rt3g1",
  storageBucket: "emergent-forge-rt3g1.firebasestorage.app",
  messagingSenderId: "702069890140",
  appId: "1:702069890140:web:a420e40df8d069ab5d1a99",
  firestoreDatabaseId: "ai-studio-physicscore-e8d58f5a-1087-44c8-a429-cde32cf15b3b"
};

const app = initializeApp(firebaseConfig);

// Critical: Initialize Firestore with the exact databaseId provisioned by AI Studio
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  db, 
  auth, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail
};

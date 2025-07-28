// src/firebase/firebase.js

// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (you already generated this)
const firebaseConfig = {
  apiKey: "AIzaSyApMfjjyXaeWcjAOdsFcAVYySYGnrCbbAo",
  authDomain: "skillnestcasestudysim.firebaseapp.com",
  projectId: "skillnestcasestudysim",
  storageBucket: "skillnestcasestudysim.appspot.com", // corrected bucket
  messagingSenderId: "859733761457",
  appId: "1:859733761457:web:f137f75a1c2b6c8400f190"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore instance
const db = getFirestore(app);
export default db;

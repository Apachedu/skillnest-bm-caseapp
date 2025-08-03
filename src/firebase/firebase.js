import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAifR2QGEN0ZZ3TLDMbPzM2zmWEdZHRS2k",
  authDomain: "skillnestcasestudysim-d6355.firebaseapp.com",
  projectId: "skillnestcasestudysim-d6355",
  storageBucket: "skillnestcasestudysim-d6355.appspot.com",
  messagingSenderId: "874264746569",
  appId: "1:874264746569:web:56fb675a374402373d7d98"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// ✅ FIXED: Named export for db and auth
export { db, auth };

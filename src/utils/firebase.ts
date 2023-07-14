import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FBASE_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOM,
  projectId: import.meta.env.VITE_PRO_ID,
  storageBucket: import.meta.env.VITE_STORE_BKT,
  messagingSenderId: import.meta.env.VITE_MSG_SEND_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MESURE_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const db = getFirestore(app);
export {auth, googleProvider, facebookProvider, db}
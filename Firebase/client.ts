// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDkzlhdg-qfffzh9pbzGclL0DWcO2IoUFg",
  authDomain: "preppath-7e4a0.firebaseapp.com",
  projectId: "preppath-7e4a0",
  storageBucket: "preppath-7e4a0.firebasestorage.app",
  messagingSenderId: "964813242226",
  appId: "1:964813242226:web:a8f229d5443df72cf5e7eb",
  measurementId: "G-FQNKENHNHP"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
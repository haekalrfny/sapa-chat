// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "fir-chat-67b96.firebaseapp.com",
  projectId: "fir-chat-67b96",
  storageBucket: "fir-chat-67b96.appspot.com",
  messagingSenderId: "788804034164",
  appId: "1:788804034164:web:7698b84d52e1cb0d50fb21",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvhzstaNoF0F-QXj21D5Y-FAMRESUk4Ew",
  authDomain: "service-desk-2ad5d.firebaseapp.com",
  projectId: "service-desk-2ad5d",
  storageBucket: "service-desk-2ad5d.appspot.com",
  messagingSenderId: "567994532696",
  appId: "1:567994532696:web:3d2122d1f79d73f4ba5b2d",
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth();
 const db = getFirestore();

export { app, auth, db };
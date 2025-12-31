import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAg3w-yIhtWUgLD0ae957yzvGFNtrQusIU",
  authDomain: "logger-e5f9d.firebaseapp.com",
  projectId: "logger-e5f9d",
  storageBucket: "logger-e5f9d.firebasestorage.app",
  messagingSenderId: "292747825694",
  appId: "1:292747825694:web:6ad0af3cc4b466f280940f",
  measurementId: "G-SHXHC073MT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

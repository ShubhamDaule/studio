// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "spendwise-analyzer-7oex8",
  "appId": "1:574813527964:web:9abc2b527862e585963259",
  "storageBucket": "spendwise-analyzer-7oex8.firebasestorage.app",
  "apiKey": "AIzaSyD00XPQimSLGqM7fykFZtk8g9qPAJfR-AY",
  "authDomain": "spendwise-analyzer-7oex8.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "574813527964"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

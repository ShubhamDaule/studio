// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your actual Firebase project configuration.
const firebaseConfig = {
  "projectId": "spendwise-analyzer-oy5ij",
  "appId": "1:434014565988:web:e7a0443a4ed9c3f339d171",
  "storageBucket": "spendwise-analyzer-oy5ij.firebasestorage.app",
  "apiKey": "AIzaSyBVtwwOLKyhakEqzv6IIjOnyIl6aqp02TE",
  "authDomain": "spendwise-analyzer-oy5ij.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "434014565988"
};

// Initialize Firebase for SSR
let app: FirebaseApp;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);

export { app, auth };

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your actual Firebase project configuration.
const firebaseConfig = {
  "projectId": "spendwise-backup1",
  "appId": "1:1071662308737:web:d4f3179dad906c06a09c80",
  "storageBucket": "spendwise-backup1.firebasestorage.app",
  "apiKey": "AIzaSyBvXKBR4av3Kbl_zw4T-iIiqp8fKjoPzzA",
  "authDomain": "spendwise-backup1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1071662308737"
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

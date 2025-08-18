// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: Replace this with your actual Firebase project configuration.
const firebaseConfig = {
  "projectId": "spendwise-analyzer",
  "appId": "1:691206124939:web:3553259275e771a3e147b1",
  "storageBucket": "spendwise-analyzer.appspot.com",
  "apiKey": "AIzaSyA_3iEKv_Y-7v_0hC5dYfEaF-gB6-Y2-iE",
  "authDomain": "spendwise-analyzer.firebaseapp.com",
  "messagingSenderId": "691206124939"
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

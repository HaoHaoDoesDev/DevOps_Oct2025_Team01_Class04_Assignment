// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCR7lfccnOn8-b1-k6xZkNRniAtLmOHT0M",
  authDomain: "devops-33359.firebaseapp.com",
  projectId: "devops-33359",
  storageBucket: "devops-33359.firebasestorage.app",
  messagingSenderId: "44736709499",
  appId: "1:44736709499:web:a3bfbe1b837051f088f3de",
  measurementId: "G-RCVKWZ6F0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
export const db = getFirestore(app);
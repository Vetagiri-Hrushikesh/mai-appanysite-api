// app/modules/database/FirestoreService.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuP4bwO_YRYpqEJmYkW9ChYyGKamO4MkM",
  authDomain: "maigha-auth-library-9f5cb.firebaseapp.com",
  projectId: "maigha-auth-library-9f5cb",
  storageBucket: "maigha-auth-library-9f5cb.appspot.com",
  messagingSenderId: "784858853136",
  appId: "1:784858853136:web:197cd671b44c3f73e23f95",
  measurementId: "G-CV2Q466Z31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
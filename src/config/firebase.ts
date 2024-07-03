import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC67N3F4qKVw8PatmATv7v3_FFIEqRnwjA",
    authDomain: "maiauthlib.firebaseapp.com",
    projectId: "maiauthlib",
    storageBucket: "maiauthlib.appspot.com",
    messagingSenderId: "805896962303",
    appId: "1:805896962303:web:66be6bbe59535b12a30cca",
    measurementId: "G-S10L5YEBBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
const auth = getAuth(app);

export { auth };

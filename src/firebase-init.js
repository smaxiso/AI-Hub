// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWeKWB8WqbTlmOvBQQ4uvcWGoOSHYJrVw",
    authDomain: "aihubx.firebaseapp.com",
    projectId: "aihubx",
    storageBucket: "aihubx.firebasestorage.app",
    messagingSenderId: "408813296254",
    appId: "1:408813296254:web:bbbf6497c459198e13962f",
    measurementId: "G-D0JG1MTB2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

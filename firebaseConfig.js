// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './secrets';

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
export const firestore_db = getFirestore(firebase_app);
export const firebase_auth = getAuth(firebase_app);

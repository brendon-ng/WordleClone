// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './secrets';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

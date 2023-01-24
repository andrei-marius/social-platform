import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAZ9vepewl2rx-BoxFg1qcPooFvhbs8HQs",
    authDomain: "r-sp-32567.firebaseapp.com",
    projectId: "r-sp-32567",
    storageBucket: "r-sp-32567.appspot.com",
    messagingSenderId: "332160269792",
    appId: "1:332160269792:web:0f46a52b19c57d1936bf85"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
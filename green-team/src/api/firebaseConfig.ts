import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';



const app = initializeApp({
    apiKey: "AIzaSyBvrJRo4C2TH7KvE5hnv78YeFnyWeUzffw",
    authDomain: "green-team-hackatoon.firebaseapp.com",
    projectId: "green-team-hackatoon",
    storageBucket: "green-team-hackatoon.appspot.com",
    messagingSenderId: "290979485161",
    appId: "1:290979485161:web:33fb85534ca58d1e582778",
    measurementId: "G-XQLEVEZDLB"
});


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();

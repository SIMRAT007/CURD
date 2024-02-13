import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBKGH8y32wvhkNIDwZgD8xL7j29iGSkKs8",
  authDomain: "crud-6eebf.firebaseapp.com",
  projectId: "crud-6eebf",
  storageBucket: "crud-6eebf.appspot.com",
  messagingSenderId: "748412849127",
  appId: "1:748412849127:web:f8fb8ae26dff0c95fb8b42",
  measurementId: "G-9J4BHMF0NL"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app); 
export const auth = getAuth(app);



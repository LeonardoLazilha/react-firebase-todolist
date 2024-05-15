import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJLeg3ktsG9anj-2Ig2rkTyMmvfqQ8EkM",
  authDomain: "projeto-login-7cc41.firebaseapp.com",
  projectId: "projeto-login-7cc41",
  storageBucket: "projeto-login-7cc41.appspot.com",
  messagingSenderId: "1070059338668",
  appId: "1:1070059338668:web:ed079d8d3d3582c80f5809",
  measurementId: "G-WJYQEC3N9W",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };

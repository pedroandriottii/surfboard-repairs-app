import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvZ00QECw1Ny7SnQPG4WF5_F8bw7ZOo1A",
  authDomain: "realce-nordeste.firebaseapp.com",
  projectId: "realce-nordeste",
  storageBucket: "realce-nordeste.appspot.com",
  messagingSenderId: "512761133967",
  appId: "1:512761133967:web:a30216cd3e8f72482729fa",
  measurementId: "G-7DSXREPFFP"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
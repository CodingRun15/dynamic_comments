import { initializeApp } from "firebase/app";
let key = process.env.REACT_APP_API_KEY;
console.log(key);
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "dynamiccomments.firebaseapp.com",
  databaseURL: "https://dynamiccomments-default-rtdb.firebaseio.com",
  projectId: "dynamiccomments",
  storageBucket: "dynamiccomments.appspot.com",
  messagingSenderId: "60018102676",
  appId: "1:60018102676:web:05437d89c1b71027733f81",
  measurementId: "G-SN1SSYZ54E"
  
};
  // Initialize Firebase
 export const app = initializeApp(firebaseConfig);

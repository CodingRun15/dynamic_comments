import { initializeApp } from "firebase/app";
const  key = process.env.REACT_APP_API_KEY;
console.log(key);
const firebaseConfig = {
  api_Key: key,
  authDomain: "dynamiccomments.firebaseapp.com",
  projectId: "dynamiccomments",
  storageBucket: "dynamiccomments.appspot.com",
  messagingSenderId: "60018102676",
  appId: "1:60018102676:web:05437d89c1b71027733f81",
  measurementId: "G-SN1SSYZ54E",
  databaseURL: 'https://dynamiccomments-default-rtdb.firebaseio.com'
  
};
  // Initialize Firebase
 export const app = initializeApp(firebaseConfig);

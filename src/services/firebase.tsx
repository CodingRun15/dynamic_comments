import { initializeApp } from "firebase/app";
import React from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyAVb7L09_AKbTqtseLZQ-OZUSSzPHu3Dgg",
    authDomain: "dynamiccomments.firebaseapp.com",
    projectId: "dynamiccomments",
    storageBucket: "dynamiccomments.appspot.com",
    messagingSenderId: "60018102676",
    appId: "1:60018102676:web:05437d89c1b71027733f81",
    measurementId: "G-SN1SSYZ54E",
    databaseURL: "https://dynamiccomments-default-rtdb.firebaseio.com/"
    
  };
  
  // Initialize Firebase
 export const app = initializeApp(firebaseConfig);

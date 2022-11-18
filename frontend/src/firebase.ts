import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getAnalytics} from "firebase/analytics";

require('dotenv').config();

console.log(require("dotenv").config());


console.log("api is", process.env.REACT_APP_API_KEY);

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyCFqq1Xgfr3zshpUDYVRhOWpmjCrILXFB4",
  authDomain: "term2-kai-yamashita.firebaseapp.com",
  projectId: "term2-kai-yamashita",
  storageBucket: "term2-kai-yamashita.appspot.com",
  messagingSenderId: "87386190840",
  appId: "1:87386190840:web:d8df500e8fbf88c2bb5c0d",
  measurementId: "G-P1SC19VRLH"
};

const app = initializeApp(firebaseConfig);

export const fireAuth = getAuth(app);
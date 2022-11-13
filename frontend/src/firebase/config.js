import firebase from 'firebase/app';
import firestore from 'firebase/firestore';
import storage from 'firebase/storage';
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhjVds4QsE-Y_sfp-QFWsMOs2Fq9-F2lQ",
  authDomain: "chat-be175.firebaseapp.com",
  projectId: "chat-be175",
  storageBucket: "chat-be175.appspot.com",
  messagingSenderId: "266146931124",
  appId: "1:266146931124:web:d6c01c32a067ddae1492e1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const projectStorage = firebase.storage();

export const auth = app.auth();

export {timestamp, projectStorage}
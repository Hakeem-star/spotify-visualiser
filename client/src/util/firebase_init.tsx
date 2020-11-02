import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbyA-7bgkqp-Oyyf8BZfjkN5nfqPY1V_A",
  authDomain: "spotify-visualiser-293211.firebaseapp.com",
  databaseURL: "https://spotify-visualiser-293211.firebaseio.com",
  projectId: "spotify-visualiser-293211",
  storageBucket: "spotify-visualiser-293211.appspot.com",
  messagingSenderId: "947650550606",
  appId: "1:947650550606:web:14afebc53c5379d4d75c1f",
};
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const fbAuth = firebase.auth();

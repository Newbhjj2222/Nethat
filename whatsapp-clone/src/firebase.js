// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase Configuration yawe
const firebaseConfig = {
  apiKey: "AIzaSyANRYaHPDS0KLwqC6RecIJaxGUiDEOy3Vg",
  authDomain: "netchat-96198.firebaseapp.com",
  databaseURL: "https://netchat-96198-default-rtdb.firebaseio.com",
  projectId: "netchat-96198",
  storageBucket: "netchat-96198.appspot.com",
  messagingSenderId: "328062279730",
  appId: "1:328062279730:web:9f91e036e1dd5033925c2b",
  measurementId: "G-GWKM3FMDYH"
};

// Tangiza Firebase App
const app = initializeApp(firebaseConfig);

// Exporte Realtime Database
export const db = getDatabase(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMjBZg16H0cOHj09wyIyrEju0bGocMINM",
  authDomain: "sistemaestacionamento-23cdb.firebaseapp.com",
  projectId: "sistemaestacionamento-23cdb",
  storageBucket: "sistemaestacionamento-23cdb.firebasestorage.app",
  messagingSenderId: "572924280467",
  appId: "1:572924280467:web:ffe1ae7311c86c1ae35766",
  measurementId: "G-QBNJK61NJH"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Exporte as instâncias necessárias
export { db, auth };

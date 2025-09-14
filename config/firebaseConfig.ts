// config/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAXRXv4KlU-Xfi7ycn-yLLplkSeNO_WgiY",
    authDomain: "livroapp-991eb.firebaseapp.com",
    databaseURL: "https://livroapp-991eb-default-rtdb.firebaseio.com", // ✅ ESSA LINHA É OBRIGATÓRIA
    projectId: "livroapp-991eb",
    storageBucket: "livroapp-991eb.appspot.com", // ⚠️ cuidado: antes você tinha `.firebasestorage.app`
    messagingSenderId: "1031865522460",
    appId: "1:1031865522460:web:9bd1c09f8427c25dbc02d9",
    measurementId: "G-S1K44DDGP5"
  };
  

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta auth e database
export const auth = getAuth(app);
export const database = getDatabase(app);

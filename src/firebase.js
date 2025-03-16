//Nota importante:
//este es el Firebase para la Web
//sdk Web

// Importar la función para inicializar la app de Firebase
import { initializeApp } from "firebase/app";

// Este objeto firebaseConfig contiene todas las credenciales
// y la configuración del proyecto de Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyBHhzamhhVlSKbTuixNtNjfjyMMr8bbK6A",
    authDomain: "mern-free.firebaseapp.com",
    projectId: "mern-free",
    storageBucket: "mern-free.firebasestorage.app", //solol se usa este actualmente para storage
    messagingSenderId: "459577992053",
    appId: "1:459577992053:web:e64ee1c08f23bfea5ae93c",
    measurementId: "G-L32LZW5KLB"
};

// Aquí se inicializa la aplicación de Firebase con tu configuración.
// `app` es la **instancia principal** de tu proyecto de Firebase.
// Con ella puedes acceder a todos los servicios de Firebase (Firestore, Auth, Storage, etc.).
const app = initializeApp(firebaseConfig);

// Exportar la instancia para poder usarla en otros módulos.
export default app; 

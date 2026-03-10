console.log("🚀 SCRIPT AUTH.JS CARICATO CON SUCCESSO!");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWr43om-WIK_nS1FCUXOj9X0goQgYSNvM",
    authDomain: "rodolicohub.firebaseapp.com",
    projectId: "rodolicohub",
    storageBucket: "rodolicohub.firebasestorage.app",
    messagingSenderId: "1066843178658",
    appId: "1:1066843178658:web:5c0d95f10eae4a7384b9fb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("🔥 FIREBASE PRONTO ALL'USO!");

window.handleLogin = async () => {
    console.log("🔘 Click sul tasto Login rilevato");
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('roleSelect').value;
    const password = "password_base_2026";
    const btn = document.getElementById('loginBtn');

    btn.disabled = true;
    btn.innerText = "Verifica...";

    try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('userRole', role === 'rappresentante' ? 'admin' : 'studente');
        window.location.href = 'dashboard.html';
    } catch (err) {
        console.error("❌ Errore durante il login:", err.code);
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
            try {
                const user = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "utenti", user.user.uid), { email, role });
                window.location.href = 'dashboard.html';
            } catch (e) { alert("Errore creazione: " + e.message); }
        } else {
            alert("Errore specifico: " + err.message);
        }
    }
    btn.disabled = false;
    btn.innerText = "ENTRA ORA";
};

window.checkRole = () => {
    const role = document.getElementById('roleSelect').value;
    document.getElementById('adminCodeBox').classList.toggle('hidden', role !== 'rappresentante');
};

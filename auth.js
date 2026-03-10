console.log("🚀 SCRIPT AUTH.JS CARICATO CON SUCCESSO!");

// --- 1. Import Firebase 10 modular ---
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 2. Config Firebase (aggiorna con la tua Web App corretta!) ---
const firebaseConfig = {
    apiKey: "QUI_LA_TUA_API_KEY",
    authDomain: "rodolicohub.firebaseapp.com",
    projectId: "rodolicohub",
    storageBucket: "rodolicohub.firebasestorage.app",
    messagingSenderId: "1066843178658",
    appId: "1:1066843178658:web:5c0d95f10eae4a7384b9fb"
};

// --- 3. Inizializza Firebase con controllo config ---
let app;
try {
    app = getApp(); // se già inizializzato
    console.log("⚡ Firebase già inizializzato");
} catch {
    app = initializeApp(firebaseConfig);
    console.log("🔥 Firebase inizializzato ora");
}

const auth = getAuth(app);
const db = getFirestore(app);

// --- 4. Login/Creazione Utente ---
window.handleLogin = async () => {
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('roleSelect').value;
    const password = "password_base_2026"; // password standard
    const btn = document.getElementById('loginBtn');

    if (!email) {
        alert("⚠️ Inserisci un'email valida!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Verifica...";

    try {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('userRole', role === 'rappresentante' ? 'admin' : 'studente');
        window.location.href = 'dashboard.html';
    } catch (err) {
        console.warn("❌ Login fallito:", err.code);

        // Se utente non esiste, crealo
        if (err.code === 'auth/user-not-found') {
            try {
                const user = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "utenti", user.user.uid), { email, role });
                localStorage.setItem('userRole', role === 'rappresentante' ? 'admin' : 'studente');
                window.location.href = 'dashboard.html';
            } catch (e) {
                alert("⚠️ Errore creazione utente: " + e.message);
            }
        } else {
            alert("⚠️ Errore login: " + err.message);
            // Se la configurazione è sbagliata, puliamo localStorage
            localStorage.clear();
        }
    }

    btn.disabled = false;
    btn.innerText = "ENTRA ORA";
};

// --- 5. Mostra/Nascondi campo codice rappresentante ---
window.checkRole = () => {
    const role = document.getElementById('roleSelect').value;
    document.getElementById('adminCodeBox').classList.toggle('hidden', role !== 'rappresentante');
};

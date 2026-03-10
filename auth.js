import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configurazione Certificata
const firebaseConfig = {
    apiKey: "AIzaSyDWr43om-WIK_nS1FCUXOj9X0goQgYSNvM",
    authDomain: "rodolicohub.firebaseapp.com",
    projectId: "rodolicohub",
    storageBucket: "rodolicohub.firebasestorage.app",
    messagingSenderId: "1066843178658",
    appId: "1:1066843178658:web:5c0d95f10eae4a7384b9fb"
};

// Inizializzazione con controllo errori
let auth, db;
try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("✅ Firebase inizializzato correttamente");
} catch (e) {
    console.error("❌ Errore inizializzazione Firebase:", e);
}

// Funzione Login Professionale
window.handleLogin = async () => {
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('roleSelect').value;
    const code = document.getElementById('adminCode')?.value;
    const btn = document.getElementById('loginBtn');
    const password = "password_base_2026"; // Password standard per il sistema

    if (!email || !email.includes('@')) {
        alert("Inserire un indirizzo email istituzionale valido.");
        return;
    }

    if (role === 'rappresentante' && code !== '12345') {
        alert("Accesso Negato: Codice rappresentante non valido.");
        return;
    }

    // Feedback visivo immediato
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-pulse">Verifica credenziali...</span>`;

    try {
        // Tentativo di accesso
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Accesso eseguito:", userCredential.user.email);
        finalizeLogin(role);
        
    } catch (error) {
        console.warn("Codice Errore Firebase:", error.code);

        // Se l'errore è 'configuration-not-found', il provider non è attivo
        if (error.code === 'auth/configuration-not-found') {
            alert("ERRORE CRITICO: Il provider Email/Password non è attivo nella console Firebase.");
            btn.disabled = false;
            btn.innerText = "ENTRA ORA";
            return;
        }

        // Se l'utente non esiste, lo registriamo automaticamente
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
            try {
                const newUser = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "utenti", newUser.user.uid), {
                    email: email,
                    role: role,
                    lastLogin: new Date().toISOString()
                });
                console.log("✅ Nuovo utente registrato con ruolo:", role);
                finalizeLogin(role);
            } catch (regError) {
                alert("Errore durante la creazione del profilo: " + regError.message);
                btn.disabled = false;
                btn.innerText = "ENTRA ORA";
            }
        } else {
            alert("Errore di sistema: " + error.message);
            btn.disabled = false;
            btn.innerText = "ENTRA ORA";
        }
    }
};

function finalizeLogin(role) {
    localStorage.setItem('userRole', role === 'rappresentante' ? 'admin' : 'studente');
    window.location.href = 'dashboard.html';
}

// Funzione Grafica
window.checkRole = () => {
    const role = document.getElementById('roleSelect').value;
    const adminBox = document.getElementById('adminCodeBox');
    adminBox.classList.toggle('hidden', role !== 'rappresentante');
};

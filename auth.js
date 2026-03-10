// Importiamo le funzioni necessarie da Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// La tua configurazione (aggiornata con la chiave funzionante)
const firebaseConfig = {
    apiKey: "AIzaSyDWr43om-WIK_nS1FCUXOj9X0goQgYSNvM",
    authDomain: "rodolicohub.firebaseapp.com",
    projectId: "rodolicohub",
    storageBucket: "rodolicohub.firebasestorage.app",
    messagingSenderId: "1066843178658",
    appId: "1:1066843178658:web:5c0d95f10eae4a7384b9fb"
};

// Inizializziamo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Funzione di Login (collegata al tasto nell'HTML)
window.handleLogin = async () => {
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('roleSelect').value;
    const code = document.getElementById('adminCode')?.value;
    const btn = document.getElementById('loginBtn');
    const password = "password_automatica_123";

    if (!email.includes('@')) {
        alert("Inserisci un'email valida!");
        return;
    }

    if (role === 'rappresentante' && code !== '12345') {
        alert("Codice rappresentante errato!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Sincronizzazione...";

    try {
        // Tentativo di Login
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('userRole', role === 'rappresentante' ? 'admin' : 'studente');
        window.location.href = 'dashboard.html';
    } catch (err) {
        // Se l'utente non esiste, lo creiamo (Registrazione automatica)
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
            try {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "utenti", userCred.user.uid), {
                    email: email,
                    role: role,
                    timestamp: new Date()
                });
                localStorage.setItem('userRole', role === 'rappresentante' ? 'admin' : 'studente');
                window.location.href = 'dashboard.html';
            } catch (createErr) {
                alert("Errore creazione account: " + createErr.message);
            }
        } else {
            alert("Errore Firebase: " + err.message);
        }
    } finally {
        btn.disabled = false;
        btn.innerText = "ENTRA ORA";
    }
};

// Funzione per mostrare/nascondere il codice segreto
window.checkRole = () => {
    const role = document.getElementById('roleSelect').value;
    const adminBox = document.getElementById('adminCodeBox');
    if (role === 'rappresentante') {
        adminBox.classList.remove('hidden');
    } else {
        adminBox.classList.add('hidden');
    }
};
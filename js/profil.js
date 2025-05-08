import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import { getAuth, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged } 

from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNi1_VTVC_5oCVTeGKS4jybLFnYIPCe54",
    authDomain: "webprojesi-4df83.firebaseapp.com",
    projectId: "webprojesi-4df83",
    storageBucket: "webprojesi-4df83.firebasestorage.app",
    messagingSenderId: "590718802999",
    appId: "1:590718802999:web:ea5464eb7a5934c896b3b2",
    measurementId: "G-1XXMYE4CMH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // Auth durumunu dinle
    onAuthStateChanged(auth, (user) => {
        if (user) {

            // Kullanıcı giriş yapmışsa
            document.getElementById('profileEmail').value = user.email || '';

            // Şifre değiştirme formunu dinle
            const passwordForm = document.getElementById('passwordForm');
            const currentPassword = document.getElementById('currentPassword');
            const newPassword = document.getElementById('newPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            const passwordMatch = document.getElementById('passwordMatch');

            // Şifre eşleşme kontrolü
            confirmPassword.addEventListener('input', () => {
                if (newPassword.value !== confirmPassword.value) 
                {
                    passwordMatch.textContent = 'Şifreler eşleşmiyor!';
                    confirmPassword.setCustomValidity('Şifreler eşleşmiyor');
                } 
                else 
                {
                    passwordMatch.textContent = '';
                    confirmPassword.setCustomValidity('');
                }
            });

            passwordForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Şifre eşleşme kontrolü
                if (newPassword.value !== confirmPassword.value) {
                    passwordMatch.textContent = 'Şifreler eşleşmiyor!';
                    return;
                }

                try {
                    // Kullanıcıyı yeniden doğrula
                    const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
                    await reauthenticateWithCredential(user, credential);

                    // Şifreyi güncelle
                    await updatePassword(user, newPassword.value);

                    alert('Şifreniz başarıyla güncellendi.');
                    passwordForm.reset();
                } catch (error) {
                    let errorMessage = 'Şifre güncellenirken bir hata oluştu.';
                    switch (error.code) {
                        case 'auth/wrong-password':
                            errorMessage = 'Mevcut şifre yanlış.';
                            break;
                        case 'auth/weak-password':
                            errorMessage = 'Yeni şifre çok zayıf.';
                            break;
                    }
                    alert(errorMessage);
                }
            });
        } else {
            // Kullanıcı giriş yapmamışsa
            window.location.href = 'giris-kayit.html';
        }
    });
});

async function loadProfileData() {
    try {
        const user = auth.currentUser;
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        // Profil bilgilerini form alanlarına doldur
        document.getElementById('profileName').value = user.displayName || '';
        document.getElementById('profileEmail').value = user.email || '';

        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('profilePhone').value = userData.phone || '';
        }
        
    } catch (error) {
        console.error('Profil bilgileri yüklenirken hata:', error);
        alert('Profil bilgileri yüklenirken bir hata oluştu.');
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();

    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    
    try {
        const user = auth.currentUser;

        // Profil bilgilerini güncelle
        await updateProfile(user, {
            displayName: name
        });

        // Firestore'da kullanıcı bilgilerini güncelle
        await updateDoc(doc(db, 'users', user.uid), {
            phone: phone
        });

        // Şifre değişikliği varsa
        if (currentPassword && newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                throw new Error('Yeni şifreler eşleşmiyor.');
            }

            // Kullanıcıyı yeniden doğrula
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Şifreyi güncelle
            await updatePassword(user, newPassword);
        }

        alert('Profil bilgileri başarıyla güncellendi.');
   
    }catch (error) {
        console.error('Profil güncellenirken hata:', error);
        alert('Profil güncellenirken bir hata oluştu: ' + error.message);
    }
} 
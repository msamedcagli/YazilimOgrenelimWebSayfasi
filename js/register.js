// Firebase yapılandırması ve başlatma
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNi1_VTVC_5oCVTeGKS4jybLFnYIPCe54",
  authDomain: "webprojesi-4df83.firebaseapp.com",
  projectId: "webprojesi-4df83",
  storageBucket: "webprojesi-4df83.firebasestorage.app",
  messagingSenderId: "590718802999",
  appId: "1:590718802999:web:ea5464eb7a5934c896b3b2",
  measurementId: "G-1XXMYE4CMH"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  // Form geçiş işlemleri
  const loginRadio = document.getElementById('login');
  const registerRadio = document.getElementById('register');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const formTitle = document.getElementById('formTitle');

  loginRadio.addEventListener('change', function () {
    if (this.checked) {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      formTitle.textContent = 'Giriş Yap';
    }
  });

  registerRadio.addEventListener('change', function () {
    if (this.checked) {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      formTitle.textContent = 'Kayıt Ol';
    }
  });

  // Kayıt formu işlemleri
  const registerEmail = document.getElementById('registerEmail');
  const registerPassword = document.getElementById('registerPassword');
  const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
  const passwordMatch = document.getElementById('passwordMatch');
  const terms = document.getElementById('terms');

  // Şifre eşleşme kontrolü
  registerPasswordConfirm.addEventListener('input', () => {
    if (registerPassword.value !== registerPasswordConfirm.value) {
      passwordMatch.textContent = 'Şifreler eşleşmiyor!';
      registerPasswordConfirm.setCustomValidity('Şifreler eşleşmiyor');
    } else {
      passwordMatch.textContent = '';
      registerPasswordConfirm.setCustomValidity('');
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const passwordMatchError = document.getElementById('passwordMatchError');

    // Şifrelerin eşleşip eşleşmediğini kontrol et
    if (password !== passwordConfirm) {
      passwordMatchError.style.display = 'block';
      return;
    } else {
      passwordMatchError.style.display = 'none';
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Kullanıcı başarıyla oluşturuldu
      alert('Kayıt işlemi başarılı! Giriş yapabilirsiniz.');
      window.location.href = 'giris-kayit.html';
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt olurken bir hata oluştu: ' + error.message);
    }
  });

  // Giriş formu işlemleri
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      // Giriş işlemi
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail.value,
        loginPassword.value
      );

      // Başarılı giriş
      window.location.href = 'girisyapildi.html';
    } catch (error) {
      // Hata mesajları
      let errorMessage = 'Giriş sırasında bir hata oluştu.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz e-posta adresi.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Bu hesap devre dışı bırakılmış.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Hatalı şifre.';
          break;
      }
      alert(errorMessage);
    }
  });
});





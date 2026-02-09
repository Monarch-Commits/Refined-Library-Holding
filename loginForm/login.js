import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    loginStatus.textContent = 'Please enter both email and password.';
    loginStatus.style.color = 'red';
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    loginStatus.textContent = `Welcome, ${user.email}! Redirecting...`;
    loginStatus.style.color = 'green';

    setTimeout(() => {
      window.location.href = 'dashboard.html'; // Change to your dashboard page
    }, 1500);
  } catch (error) {
    loginStatus.textContent = 'Invalid email or password.';
    loginStatus.style.color = 'red';
  }
});

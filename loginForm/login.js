import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCEaP3U6pOjNyoMKgNDRl2akWjPYZygIHY',
  authDomain: 'final-library-holding.firebaseapp.com',
  projectId: 'final-library-holding',
  storageBucket: 'final-library-holding.appspot.com',
  messagingSenderId: '1039508541227',
  appId: '1:1039508541227:web:4673a5b5d92e4c987e7f6e',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submit = document.getElementById('submit');
const statusDiv = document.getElementById('loginStatus');

submit.addEventListener('click', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  statusDiv.textContent = ''; // clear previous message
  statusDiv.style.color = '';

  if (email === '' || password === '') {
    statusDiv.textContent = 'Please fill out all required fields';
    statusDiv.style.color = 'red';
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      statusDiv.textContent = 'Login Successful! Redirecting...';
      statusDiv.style.color = 'green';

      document.getElementById('email').value = '';
      document.getElementById('password').value = '';

      setTimeout(() => {
        window.location.href = '../Books/AddBooks/RecordBook.html';
      }, 1000);
    })
    .catch((error) => {
      statusDiv.textContent = 'Login Failed';
      statusDiv.style.color = 'red';
    });
});

window.addEventListener('load', function () {
  document.getElementById('loginForm').reset();
});

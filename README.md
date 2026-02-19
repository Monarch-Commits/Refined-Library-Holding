# 📚 Library Holding System

## 📌 Project Overview

The **Library Holding System** is a web-based application designed to efficiently manage and monitor library collections. It allows librarians to record, update, organize, and generate reports for books and journals stored in the library.

The system provides centralized collection management, ensuring that all holdings are properly recorded, categorized, and easily accessible. It also supports monitoring outdated materials and organizing records using Firebase as the backend service.

---

## 🚀 Features

- Add, edit, and delete book records
- Separate management for books and journals
- Real-time data synchronization using Firebase
- Monitoring of outdated collections
- Secure user authentication
- Cloud-based data storage
- Responsive user interface using Tailwind CSS

---

## 🎯 System Objectives

- To develop a system that can easily generate reports for all collections of books and journals in the library.
- To develop a system that can efficiently monitor outdated collections and track the recency of books and journals associated with program subjects.
- To develop a system that allows the association of books and journals with all subjects of the program for efficient monitoring.

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- JavaScript (ES6+)
- Tailwind CSS

### Backend / Database
- Firebase Realtime Database
- Firebase Authentication
- Firebase Hosting

### Tools
- Git
- GitHub
- Visual Studio Code

---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository

Open your terminal or command prompt and run:

```bash
git clone https://github.com/Monarch-Commits/Refined-Library-Holding.git
cd Refined-Library-Holding
code .
```

---

### 2️⃣ Setup Firebase

1. Go to Firebase Console.
2. Create a new project.
3. Enable **Realtime Database**.
4. Enable **Authentication**.
5. Copy your Firebase configuration.

---

### 3️⃣ Connect Firebase Configuration

Create or open your `firebaseConfig.js` file and insert your configuration:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Make sure your Firebase app is initialized properly in your JavaScript file.

---

### 4️⃣ Run the Project

Simply open:

```
index.html
```

in your browser.

For better development experience, use **Live Server** in VS Code.

---

## 🌐 Deployment using Firebase Hosting

Follow these steps to deploy the project to Firebase Hosting.

---

### 1️⃣ Install Firebase CLI

Make sure Node.js is installed, then run:

```bash
npm install -g firebase-tools
```

Verify installation:

```bash
firebase --version
```

---

### 2️⃣ Login to Firebase

```bash
firebase login
```

A browser window will open. Sign in using your Google account.

---

### 3️⃣ Initialize Firebase in the Project

Inside your project folder, run:

```bash
firebase init
```

You will be prompted with several options:

- Select: **Hosting**
- Choose: **Use an existing project**
- Select your Firebase project
- Set public directory to:  
  ```
  .
  ```
  (since this is a plain HTML project)

- Configure as a single-page app (SPA)?  
  ```
  No
  ```
- Set up automatic builds and deploys with GitHub?  
  ```
  No
  ```
- Overwrite index.html?  
  ```
  No
  ```

After this, Firebase will generate:

- `firebase.json`
- `.firebaserc`

---

### 4️⃣ Deploy the Project

Run:

```bash
firebase deploy
```

If successful, you will see something like:

```
Hosting URL: https://your-project-id.web.app
```

Open that URL in your browser to view your live system.

---

### 5️⃣ Future Updates

Whenever you update your project, simply run:

```bash
firebase deploy
```

to publish changes.
---

## 🔐 Security Notes

- Firebase API keys are safe to expose in client-side applications, but they should only be used with proper security rules.
- Always configure Firebase Realtime Database or Firestore security rules properly.
- Restrict database read/write permissions to authenticated users.
- Never allow public write access in production.
- Enable proper authentication methods to secure user access.

---

## 👨‍💻 Author

Developed by Monarch  
Library Holdings System Project

---

## 📜 License

This project is for academic and educational purposes.


const firebaseConfig = {
  apiKey: "AIzaSyBBbRJjYhoParvH_bGMp5S1AyUYJyQl2uM",
  authDomain: "activadores-redes-sociales.firebaseapp.com",
  databaseURL: "https://activadores-redes-sociales-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "activadores-redes-sociales",
  storageBucket: "activadores-redes-sociales.appspot.com",
  messagingSenderId: "672713275674",
  appId: "1:672713275674:web:aaaabefc805ff04c8c94a3"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.database();

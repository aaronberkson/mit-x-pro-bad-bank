import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNuKThlYc_FiWQlKHp5NF0n6DVCRcZxAo",
  authDomain: "fir-ab-bad-bank.firebaseapp.com",
  projectId: "fir-ab-bad-bank",
  storageBucket: "fir-ab-bad-bank.appspot.com",
  messagingSenderId: "624475023697",
  appId: "1:624475023697:web:49b4dabebceb34be390b70"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };

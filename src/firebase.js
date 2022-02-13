import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD5bI-aa__e1XQBDlQ7QERQ9ClY5tFytlw',
  authDomain: 'smoothcommunity-8817b.firebaseapp.com',
  projectId: 'smoothcommunity-8817b',
  storageBucket: 'smoothcommunity-8817b.appspot.com',
  messagingSenderId: '871859759115',
  appId: '1:871859759115:web:6016377e601207d846bf0e',
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };

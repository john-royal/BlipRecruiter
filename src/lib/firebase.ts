import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const app = initializeApp({
  apiKey: 'AIzaSyAQwzl7Ol1S-wMc8WyZyIcg02MT-0ya1mM',
  authDomain: 'fliprecruiter-headstarter.firebaseapp.com',
  projectId: 'fliprecruiter-headstarter',
  storageBucket: 'fliprecruiter-headstarter.appspot.com',
  messagingSenderId: '999566169758',
  appId: '1:999566169758:web:39e387576fc08a17a88d8f',
  measurementId: 'G-HPX85BV6M3',
});

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBc6ryd-oY5FUoiI3lqRyNQf_vSMxK2zfE',
  authDomain: 'babearia-palatinus.firebaseapp.com',
  projectId: 'babearia-palatinus',
  storageBucket: 'babearia-palatinus.firebasestorage.app',
  messagingSenderId: '187763891668',
  appId: '1:187763891668:web:8de5c72e3d8f6a787c4a41',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export default app;

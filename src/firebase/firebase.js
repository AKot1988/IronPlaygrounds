import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { GoogleAuthProvider } from 'firebase/auth';

// !! TODO: use environmental variables for the config, NOT hardcoded values
const firebaseConfig = {
  apiKey: 'AIzaSyAWlFZ7XmJJTWSy5ZhOyT1BFjDFK1cFOFw',
  authDomain: 'ironplaygrounds.firebaseapp.com',
  projectId: 'ironplaygrounds',
  storageBucket: 'ironplaygrounds.appspot.com',
  messagingSenderId: '323855128394',
  appId: '1:323855128394:web:a68cbb662399493eb613b3',
  storageBucket: 'gs://ironplaygrounds.appspot.com',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const storageRef = ref(storage);
export const playgroundCollectionRef = collection(db, 'playgrounds');
export const favoritesCollectionRef = collection(db, 'favorites');
export const googleAuthProvider = new GoogleAuthProvider();

import { type FirebaseApp, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { firebaseEnv, isMockMode } from './mockMode';

// Lazily initialized so importing this module is safe in mock mode too —
// nothing here throws until something actually tries to use Auth/Firestore
// without real credentials configured.
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function ensureApp(): FirebaseApp {
  if (!app) {
    app = initializeApp({
      apiKey: firebaseEnv.apiKey,
      authDomain: firebaseEnv.authDomain,
      projectId: firebaseEnv.projectId,
      storageBucket: firebaseEnv.storageBucket,
      messagingSenderId: firebaseEnv.messagingSenderId,
      appId: firebaseEnv.appId,
    });
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (isMockMode()) {
    throw new Error('getFirebaseAuth() called in mock mode — check isMockMode() first.');
  }
  if (!authInstance) authInstance = getAuth(ensureApp());
  return authInstance;
}

export function getFirebaseDb(): Firestore {
  if (isMockMode()) {
    throw new Error('getFirebaseDb() called in mock mode — check isMockMode() first.');
  }
  if (!dbInstance) dbInstance = getFirestore(ensureApp());
  return dbInstance;
}

// Detects whether real Firebase credentials are configured. Every
// VITE_FIREBASE_* var ships in .env as a clearly-labeled "REPLACE_ME"
// placeholder (see .env.example) so the app builds and runs on mock data
// with zero code changes required — dropping in real keys just flips
// isMockMode() to false the next time the app builds.
const PLACEHOLDER = 'REPLACE_ME';

function isPlaceholder(value: string | undefined): boolean {
  return !value || value.trim() === '' || value.includes(PLACEHOLDER);
}

export const firebaseEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export function isMockMode(): boolean {
  return (
    isPlaceholder(firebaseEnv.apiKey) ||
    isPlaceholder(firebaseEnv.projectId) ||
    isPlaceholder(firebaseEnv.appId)
  );
}

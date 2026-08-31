import {
  GoogleAuthProvider,
  type Unsubscribe,
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../lib/firebase';
import type { AppUser } from '../types';

// `users/{uid}` field names are kept identical to reri-flutter's UserModel
// (`displayName`, `photoUrl`, `email`, `phoneNumber`, `isAnonymous`,
// `updatedAt` via a merge write on every sign-in) so both apps can share the
// same collection. `createdAt` is a schema extension — the Flutter model
// doesn't write one, but this task explicitly asked for a first-sign-in
// timestamp, so it's added here as a first-write-only field (merge writes
// never overwrite it on later sign-ins).
async function upsertUserProfile(user: User): Promise<void> {
  const ref = doc(getFirebaseDb(), 'users', user.uid);
  const existing = await getDoc(ref);

  await setDoc(
    ref,
    {
      uid: user.uid,
      isAnonymous: user.isAnonymous,
      ...(user.phoneNumber ? { phoneNumber: user.phoneNumber } : {}),
      ...(user.email ? { email: user.email } : {}),
      ...(user.displayName ? { displayName: user.displayName } : {}),
      ...(user.photoURL ? { photoUrl: user.photoURL } : {}),
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );
}

export function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    photoUrl: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function signInWithGoogle(): Promise<AppUser> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(getFirebaseAuth(), provider);
  await upsertUserProfile(result.user);
  return toAppUser(result.user);
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

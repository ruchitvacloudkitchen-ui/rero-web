import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import type { Room } from '../types';

// Mirrors the Flutter app's admin pattern exactly (see that repo's
// CLAUDE.md "Admin Dashboard" section): isAdmin is a plain client-readable
// Firestore field on the user's own users/{uid} doc, checked here and
// enforced server-side by firestore.rules' isAdmin() function. This is
// UI-gating, not a real security boundary on its own — the actual
// enforcement is the Firestore rule, which this only mirrors for the UI.
// There's no self-service way to become an admin; it's set by hand in the
// Firebase console.
export async function isCurrentUserAdmin(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(getFirebaseDb(), 'users', uid));
  return snap.exists() && snap.data().isAdmin === true;
}

export async function getPendingListings(): Promise<Room[]> {
  const q = query(collection(getFirebaseDb(), 'rooms'), where('status', '==', 'pending_verification'));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Room)
    .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
}

export async function approveListing(roomId: string): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), 'rooms', roomId), { status: 'live' });
}

export async function rejectListing(roomId: string, reason: string): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), 'rooms', roomId), { status: 'rejected', rejectionReason: reason });
}

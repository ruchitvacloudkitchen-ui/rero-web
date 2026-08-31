import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { MOCK_ROOMS, getMockRoomById } from '../data/mockRooms';
import { getFirebaseDb } from '../lib/firebase';
import { isMockMode } from '../lib/mockMode';
import type { Room } from '../types';

// Mirrors reri-flutter's RoomRepository: same method shapes, mock data in
// place of a real Firestore read until real Firebase keys are supplied —
// nothing else in the app needs to change when that happens.

export async function getAllRooms(): Promise<Room[]> {
  if (isMockMode()) {
    return Promise.resolve(MOCK_ROOMS);
  }
  const snap = await getDocs(collection(getFirebaseDb(), 'rooms'));
  if (snap.empty) {
    // Real Firestore is connected but `rooms` hasn't been seeded with real
    // listings yet — fall back to the same mock catalog mock mode uses, so
    // the site stays a working demo instead of going blank. Remove this
    // fallback once real listings exist.
    return MOCK_ROOMS;
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Room);
}

export async function getRoomById(id: string): Promise<Room | undefined> {
  if (isMockMode()) {
    return Promise.resolve(getMockRoomById(id));
  }
  const snap = await getDoc(doc(getFirebaseDb(), 'rooms', id));
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Room;
  }
  // Same fallback as getAllRooms — id might be one of the mock rooms linked
  // to from a mock-backed listing page.
  return getMockRoomById(id);
}

export async function searchRooms(query: string): Promise<Room[]> {
  const rooms = await getAllRooms();
  const q = query.trim().toLowerCase();
  if (!q) return rooms;
  return rooms.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.categoryIds.some((c) => c.toLowerCase().includes(q)),
  );
}

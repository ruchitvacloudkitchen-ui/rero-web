import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { MOCK_ROOMS, getMockRoomById } from '../data/mockRooms';
import { getFirebaseDb } from '../lib/firebase';
import { isMockMode } from '../lib/mockMode';
import type { Room } from '../types';

// Mirrors reri-flutter's RoomRepository: same method shapes, mock data in
// place of a real Firestore read until real Firebase keys are supplied —
// nothing else in the app needs to change when that happens.

// A listing is shown on Home/Search only once it's `live`. Filtered
// client-side (not a `where('status','==','live')` query) so that legacy/
// seed docs with no `status` field at all still show up as live — only
// listings created via the host-apply wizard ever set `pending_review`.
function isPubliclyVisible(room: Room): boolean {
  return room.status == null || room.status === 'live';
}

export async function getAllRooms(): Promise<Room[]> {
  if (isMockMode()) {
    return Promise.resolve(MOCK_ROOMS);
  }
  const snap = await getDocs(collection(getFirebaseDb(), 'rooms'));
  const liveRooms = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Room).filter(isPubliclyVisible);
  if (liveRooms.length === 0) {
    // Real Firestore is connected but there's no live listing yet (either
    // nothing seeded, or everything that exists is still pending_review) —
    // fall back to the same mock catalog mock mode uses, so the site stays
    // a working demo instead of going blank.
    return MOCK_ROOMS;
  }
  return liveRooms;
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

import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
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
  // Firestore rules only allow reading a non-live room if you're its owner
  // (see firestore.rules) — for a *collection* query (as opposed to a
  // single-doc get), Firestore requires the query itself to be provably
  // constrained to what the rule allows, or it denies the whole query
  // outright rather than silently filtering. So this explicitly queries
  // status == 'live', instead of fetching everything and filtering
  // client-side like it used to before that rule existed.
  const q = query(collection(getFirebaseDb(), 'rooms'), where('status', '==', 'live'));
  const snap = await getDocs(q);
  if (snap.empty) {
    // Real Firestore is connected but there's no live listing yet (either
    // nothing seeded, or everything that exists is still pending_verification) —
    // fall back to the same mock catalog mock mode uses, so the site stays
    // a working demo instead of going blank.
    return MOCK_ROOMS;
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Room);
}

export async function getRoomById(id: string): Promise<Room | undefined> {
  if (isMockMode()) {
    return Promise.resolve(getMockRoomById(id));
  }
  // Unlike getAllRooms, this is a single-doc get — Firestore evaluates the
  // rule directly against this one document. Two different cases both come
  // back as a `permission-denied` FirebaseError here, and Firestore
  // deliberately doesn't let a denied read distinguish them (otherwise the
  // response itself would leak which room IDs exist): a genuinely
  // nonexistent ID, or a real pending_verification listing that isn't yours. Try
  // the mock catalog first (covers the "id is a mock room" case the same
  // way an exists()-false response would), then let it propagate —
  // RoomDetailsPage shows one generic "not available" message either way.
  try {
    const snap = await getDoc(doc(getFirebaseDb(), 'rooms', id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Room;
    }
    return getMockRoomById(id);
  } catch (err) {
    const mockRoom = getMockRoomById(id);
    if (mockRoom) return mockRoom;
    throw err;
  }
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

import { collection, doc, getDoc, serverTimestamp, setDoc, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import type { AppUser, IdType, ListingStatus, OpenHours, OwnershipDocType, PropertyType, Room } from '../types';

export interface ListingDraft {
  wizardStep: number;
  propertyType: PropertyType | null;
  title: string;
  address: string;
  area: string;
  location: { lat: number; lng: number } | null;
  description: string;
  maxGuests: number;
  roomSizeSqft: number | null;
  amenities: {
    hasAc: boolean;
    hasWifi: boolean;
    hasBathroom: boolean;
    hasParking: boolean;
    isInstantBook: boolean;
    isWomenFriendly: boolean;
  };
  imageUrls: string[];
  pricePerHour: number;
  pricePerNight: number;
  minBookingHours: number;
  openHours: OpenHours;
  blockedDates: string[];
  ownerInfo: {
    fullName: string;
    phone: string;
    idType: IdType;
    idNumber: string;
    ownershipDocType: OwnershipDocType;
    idDocumentUrls: string[];
  };
}

const DRAFT_ID_STORAGE_PREFIX = 'rero_host_draft_';

function draftIdKey(uid: string) {
  return `${DRAFT_ID_STORAGE_PREFIX}${uid}`;
}

// A "draft" is a real rooms/{id} doc with status: 'draft' — the existing
// Firestore rule (`status == 'live' || owner || admin`) already keeps any
// non-live status owner-only with zero rule changes needed. The doc's own
// id is remembered in localStorage per-uid so returning to /host/apply on
// the same browser resumes it; the real data lives in Firestore either
// way, so nothing is lost even if that pointer is gone — only the
// "auto-resume" convenience depends on it.
export async function getOrCreateDraft(uid: string): Promise<{ id: string; draft: Partial<ListingDraft> }> {
  const db = getFirebaseDb();
  const existingId = localStorage.getItem(draftIdKey(uid));

  if (existingId) {
    const snap = await getDoc(doc(db, 'rooms', existingId));
    if (snap.exists() && snap.data().status === 'draft') {
      return { id: existingId, draft: (snap.data().draft as Partial<ListingDraft>) ?? {} };
    }
  }

  const newRef = doc(collection(db, 'rooms'));
  await setDoc(newRef, {
    status: 'draft' as ListingStatus,
    host: { id: uid, name: '', photoUrl: '', isVerified: false, rating: 0, reviewCount: 0 },
    createdAt: serverTimestamp(),
    draft: {},
  });
  localStorage.setItem(draftIdKey(uid), newRef.id);
  return { id: newRef.id, draft: {} };
}

// Called on every step transition — saves the whole in-progress draft as
// one nested field so partial/inconsistent top-level room fields never
// leak into a real listing if someone abandons the wizard mid-flow.
export async function saveDraftProgress(draftId: string, draft: ListingDraft): Promise<void> {
  await setDoc(doc(getFirebaseDb(), 'rooms', draftId), { draft }, { merge: true });
}

export async function submitListing(draftId: string, draft: ListingDraft, user: AppUser): Promise<string> {
  const db = getFirebaseDb();

  const roomDoc: Partial<Room> & Record<string, unknown> = {
    title: draft.title,
    description: draft.description,
    address: `${draft.address}, ${draft.area}, Hyderabad`,
    imageUrl: draft.imageUrls[0],
    imageUrls: draft.imageUrls,
    pricePerHour: draft.pricePerHour,
    pricePerNight: draft.pricePerNight,
    minBookingHours: draft.minBookingHours,
    openHours: draft.openHours,
    blockedDates: draft.blockedDates,
    rating: 0,
    reviewCount: 0,
    categoryIds: [],
    isAvailableNow: true,
    hasAc: draft.amenities.hasAc,
    hasParking: draft.amenities.hasParking,
    hasBathroom: draft.amenities.hasBathroom,
    hasWifi: draft.amenities.hasWifi,
    isInstantBook: draft.amenities.isInstantBook,
    isWomenFriendly: draft.amenities.isWomenFriendly,
    host: {
      id: user.uid,
      name: user.displayName ?? 'ReRo Host',
      photoUrl: user.photoUrl ?? '',
      isVerified: false,
      rating: 0,
      reviewCount: 0,
    },
    status: 'pending_verification' as ListingStatus,
    maxGuests: draft.maxGuests,
    ...(draft.roomSizeSqft ? { roomSizeSqft: draft.roomSizeSqft } : {}),
    ...(draft.propertyType ? { propertyType: draft.propertyType } : {}),
    ...(draft.location ? { location: draft.location } : {}),
  };

  await setDoc(doc(db, 'rooms', draftId), roomDoc, { merge: true });

  await setDoc(doc(db, 'rooms', draftId, 'owner_info', 'info'), {
    fullName: draft.ownerInfo.fullName,
    phone: draft.ownerInfo.phone,
    idType: draft.ownerInfo.idType,
    idNumber: draft.ownerInfo.idNumber,
    ownershipDocType: draft.ownerInfo.ownershipDocType,
    idDocumentUrls: draft.ownerInfo.idDocumentUrls,
    uid: user.uid,
    createdAt: serverTimestamp(),
  });

  localStorage.removeItem(draftIdKey(user.uid));
  return draftId;
}

// Host Dashboard's "my listings" — any status, including pending/rejected/
// drafts (drafts are filtered out client-side; a stray draft someone never
// finished shouldn't show up as a "listing").
export async function getMyListings(uid: string): Promise<Room[]> {
  const q = query(collection(getFirebaseDb(), 'rooms'), where('host.id', '==', uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Room)
    .filter((r) => r.status !== 'draft')
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}

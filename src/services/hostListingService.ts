import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import type { AppUser, IdType, PropertyType } from '../types';

export interface ListingDraft {
  propertyType: PropertyType;
  address: string;
  area: string;
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
  title: string;
  description: string;
  pricePerHour: number;
  ownerInfo: {
    fullName: string;
    phone: string;
    idType: IdType;
    idNumber: string;
  };
}

// A simple heuristic, not a form field — ReRo's whole pitch is hourly
// pricing (see the task that added this flow), but the pre-existing
// booking flow still offers a "Night Stay" duration app-wide using
// `pricePerNight`. Rather than leave that duration silently broken for
// listings created here (Rs 0), derive a placeholder ~8-hour-equivalent
// nightly rate. Flagged as a simplification, not a real pricing model.
const NIGHT_STAY_HOUR_MULTIPLIER = 8;

export async function submitListing(draft: ListingDraft, user: AppUser): Promise<string> {
  const db = getFirebaseDb();

  const roomDoc = {
    title: draft.title,
    description: draft.description,
    address: `${draft.address}, ${draft.area}, Hyderabad`,
    imageUrl: draft.imageUrls[0],
    imageUrls: draft.imageUrls,
    pricePerHour: draft.pricePerHour,
    pricePerNight: draft.pricePerHour * NIGHT_STAY_HOUR_MULTIPLIER,
    rating: 0,
    reviewCount: 0,
    categoryIds: [],
    isAvailableNow: true,
    createdAt: serverTimestamp(),
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
    status: 'pending_review' as const,
    propertyType: draft.propertyType,
    maxGuests: draft.maxGuests,
    ...(draft.roomSizeSqft ? { roomSizeSqft: draft.roomSizeSqft } : {}),
  };

  const roomRef = await addDoc(collection(db, 'rooms'), roomDoc);

  // Owner verification info — a separate, locked-down subcollection (see
  // firestore.rules in the reri-flutter repo: only the submitting user or
  // an admin can read it, unlike the public-read `rooms` doc above).
  await setDoc(doc(db, 'rooms', roomRef.id, 'owner_info', 'info'), {
    fullName: draft.ownerInfo.fullName,
    phone: draft.ownerInfo.phone,
    idType: draft.ownerInfo.idType,
    idNumber: draft.ownerInfo.idNumber,
    uid: user.uid,
    createdAt: serverTimestamp(),
  });

  return roomRef.id;
}

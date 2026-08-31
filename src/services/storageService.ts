import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { getFirebaseApp } from '../lib/firebase';

const MAX_DIMENSION = 1600; // px, longest side
const JPEG_QUALITY = 0.8;

// Downscales/recompresses an image client-side before it ever reaches
// Storage — a phone photo can be 4000px+ and several MB; nothing in this
// app needs more than ~1600px for a listing photo. Falls back to the
// original file untouched if canvas decoding fails for any reason (e.g. an
// unusual format), so a compression bug never blocks someone's upload.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
    if (!blob || blob.size >= file.size) return file; // compression didn't help — keep the original

    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
  } catch (err) {
    console.error('Image compression failed, uploading original:', err);
    return file;
  }
}

// Room listing photos live at room_images/{uid}/{draftId}/{filename} —
// mirrors the path shape reri-flutter's CLAUDE.md documents for its own
// storage rules, so both apps agree on the same layout.
export async function uploadListingImage(
  file: File,
  uid: string,
  draftId: string,
  onProgress: (pct: number) => void,
): Promise<string> {
  const compressed = await compressImage(file);
  const storage = getStorage(getFirebaseApp());
  const path = `room_images/${uid}/${draftId}/${Date.now()}-${compressed.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, compressed);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}

// Ownership-verification documents (Aadhaar/utility bill/property doc) —
// private, at host_kyc/{uid}/{draftId}/{filename}. Not compressed: these
// need to stay legible for manual review, and may be PDFs, not images.
export function uploadOwnershipDoc(
  file: File,
  uid: string,
  draftId: string,
  onProgress: (pct: number) => void,
): Promise<string> {
  const storage = getStorage(getFirebaseApp());
  const path = `host_kyc/${uid}/${draftId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}

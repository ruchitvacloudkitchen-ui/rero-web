import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { getFirebaseApp } from '../lib/firebase';

// Room listing photos live at room_images/{uid}/{draftId}/{filename} —
// mirrors the path shape reri-flutter's CLAUDE.md documents for its own
// (undeployed) storage rules, so both apps agree on the same layout.
export function uploadListingImage(
  file: File,
  uid: string,
  draftId: string,
  onProgress: (pct: number) => void,
): Promise<string> {
  const storage = getStorage(getFirebaseApp());
  const path = `room_images/${uid}/${draftId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

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

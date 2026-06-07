import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  type DocumentData,
} from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  username?: string;
  displayName?: string;
  photoURL?: string;
  email?: string;
  bio?: string;
  createdAt?: number;
} & DocumentData;

/**
 * Fetch a user profile document by UID.
 * Returns the profile object or null if it doesn't exist.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}

/**
 * Partially update a user profile document.
 * Uses Firestore's merge semantics — only the supplied fields are overwritten.
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>,
): Promise<void> {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, data);
}

/**
 * Check whether a username is already taken.
 * Returns `true` if the username is available (no existing doc found).
 */
export async function checkUsernameAvailability(
  username: string,
): Promise<boolean> {
  const ref = collection(db, 'users');
  const q = query(ref, where('username', '==', username));
  const snap = await getDocs(q);
  return snap.empty;
}

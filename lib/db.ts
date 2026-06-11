import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
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

/* ─── Feed posts ─────────────────────────────────────────────── */

export type Post = {
  id: string;
  creatorId: string;
  creatorName: string;
  videoUrl: string;
  caption: string;
  price: number;
  visibility: 'public' | 'subscribers' | 'private';
  createdAt: number;
} & DocumentData;

/**
 * Fetch latest posts for the feed.
 * Merges public posts + subscribed-only posts for the current user,
 * deduplicated and sorted by createdAt descending.
 */
export async function getFeedPosts(
  currentUserId: string | null,
  limitCount = 20,
): Promise<Post[]> {
  const ref = collection(db, 'posts');
  const constraints: Parameters<typeof query>[2][] = [
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  ];

  // Public posts
  const publicQ = query(ref, where('visibility', '==', 'public'), ...constraints);
  const publicSnap = await getDocs(publicQ);

  // Subscribed posts (posts whose 'subscribed' array includes current user)
  let subscribedSnap: DocumentData[] = [];
  if (currentUserId) {
    const subQ = query(
      ref,
      where('visibility', '==', 'subscribers'),
      where('subscribed', 'array-contains', currentUserId),
      ...constraints,
    );
    subscribedSnap = (await getDocs(subQ)).docs;
  }

  // Merge & deduplicate
  const seen = new Set<string>();
  const all = [...publicSnap.docs, ...subscribedSnap];
  const merged: Post[] = [];
  for (const d of all) {
    if (seen.has(d.id)) continue;
    seen.add(d.id);
    merged.push({ id: d.id, ...d.data() } as Post);
  }
  merged.sort((a, b) => b.createdAt - a.createdAt);
  return merged.slice(0, limitCount);
}

/* ─── Explore / creators ─────────────────────────────────────── */

export type CreatorProfile = {
  uid: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  subscriberCount: number;
} & DocumentData;

/**
 * Fetch all creator accounts for the explore page.
 * Assumes user docs with role === 'creator'.
 */
export async function getCreatorAccounts(): Promise<CreatorProfile[]> {
  const ref = collection(db, 'users');
  const q = query(ref, where('role', '==', 'creator'));
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ uid: d.id, ...d.data() }) as CreatorProfile,
  );
}

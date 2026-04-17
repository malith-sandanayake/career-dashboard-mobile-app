import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  updateDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firestoreService = {
  subscribeToGrades: (userId: string, callback: (grades: any[]) => void) => {
    const path = `users/${userId}/grades`;
    const q = query(collection(db, path));
    return onSnapshot(q, (snapshot) => {
      const grades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(grades);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  updateGrade: async (userId: string, moduleCode: string, data: any) => {
    const path = `users/${userId}/grades/${moduleCode}`;
    try {
      await setDoc(doc(db, path), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  resetGrades: async (userId: string, moduleCodes: string[]) => {
    const batch = writeBatch(db);
    moduleCodes.forEach(code => {
      const ref = doc(db, `users/${userId}/grades/${code}`);
      batch.delete(ref);
    });
    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}/grades`);
    }
  },

  updateProfile: async (userId: string, data: any) => {
    const path = `users/${userId}`;
    try {
      await setDoc(doc(db, path), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToProfile: (userId: string, callback: (profile: any) => void) => {
    const path = `users/${userId}`;
    return onSnapshot(doc(db, path), (snapshot) => {
      callback(snapshot.data());
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  }
};

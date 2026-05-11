import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  updateDoc,
  serverTimestamp,
  writeBatch,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  CodingSession,
  DailyLog,
  CodingStreakData,
  CodingUserSettings,
} from '../models/CodingSession';

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
  },

  subscribeToCodingSessions: (userId: string, callback: (sessions: CodingSession[]) => void) => {
    const path = `users/${userId}/codingSessions`;
    const q = query(collection(db, path), orderBy('startedAt', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<CodingSession, 'id'>),
      }));
      callback(sessions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  saveCodingSession: async (userId: string, session: CodingSession) => {
    const path = `users/${userId}/codingSessions/${session.id}`;
    try {
      await setDoc(doc(db, path), session, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  deleteCodingSession: async (userId: string, sessionId: string) => {
    const path = `users/${userId}/codingSessions/${sessionId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  updateDailyLog: async (userId: string, date: string, log: DailyLog) => {
    const path = `users/${userId}/codingDailyLogs/${date}`;
    try {
      await setDoc(doc(db, path), log, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToDailyLogs: (userId: string, callback: (logs: DailyLog[]) => void) => {
    const path = `users/${userId}/codingDailyLogs`;
    const q = query(collection(db, path), orderBy('date', 'desc'), limit(90));
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((item) => ({
        date: item.id,
        ...(item.data() as Omit<DailyLog, 'date'>),
      }));
      callback(logs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  saveCodingStreak: async (userId: string, streak: CodingStreakData) => {
    const path = `users/${userId}`;
    try {
      await setDoc(doc(db, path), {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActiveDate: streak.lastActiveDate,
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToCodingStreak: (userId: string, callback: (streak: CodingStreakData | null) => void) => {
    const path = `users/${userId}`;
    return onSnapshot(doc(db, path), (snapshot) => {
      const data = snapshot.data();
      if (!data) {
        callback(null);
        return;
      }
      callback({
        currentStreak: typeof data.currentStreak === 'number' ? data.currentStreak : 0,
        longestStreak: typeof data.longestStreak === 'number' ? data.longestStreak : 0,
        lastActiveDate: typeof data.lastActiveDate === 'string' ? data.lastActiveDate : '',
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  saveCodingSettings: async (userId: string, settings: CodingUserSettings) => {
    const path = `users/${userId}`;
    try {
      await setDoc(doc(db, path), {
        dailyGoalMinutes: settings.dailyGoalMinutes,
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
};

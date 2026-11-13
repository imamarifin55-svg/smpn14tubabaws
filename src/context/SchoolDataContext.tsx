import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  db,
  auth,
  signInWithGoogleAdmin,
  signOutFirebase,
  handleFirestoreError,
  OperationType
} from '../firebase';
import {
  SCHOOL_INFO as DEFAULT_SCHOOL_INFO,
  INITIAL_TEACHERS,
  SCHOOL_ACTIVITIES,
  ANNOUNCEMENTS,
  INITIAL_APPLICANTS,
  INITIAL_STUDENTS,
  INITIAL_MORNING_ACTIVITIES,
  SCHOOL_EXTRAS,
  Teacher,
  ActivityPhoto,
  Announcement,
  PPDBApplicant,
  Student,
  MorningActivity,
  ExtracurricularItem
} from '../data/schoolData';

export type SchoolInfoType = typeof DEFAULT_SCHOOL_INFO;

interface SchoolDataContextType {
  schoolInfo: SchoolInfoType;
  updateSchoolInfo: (info: SchoolInfoType) => Promise<void>;
  teachers: Teacher[];
  addTeacher: (teacher: Teacher) => Promise<void>;
  updateTeacher: (id: string, updated: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  importTeachers: (newTeachers: Teacher[]) => Promise<void>;
  students: Student[];
  addStudent: (student: Student) => Promise<void>;
  updateStudent: (id: string, updated: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  importStudents: (newStudents: Student[]) => Promise<void>;
  extracurriculars: ExtracurricularItem[];
  addExtracurricular: (item: ExtracurricularItem) => Promise<void>;
  updateExtracurricular: (id: string, updated: Partial<ExtracurricularItem>) => Promise<void>;
  deleteExtracurricular: (id: string) => Promise<void>;
  activities: ActivityPhoto[];
  addActivity: (activity: ActivityPhoto) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  morningActivities: MorningActivity[];
  addMorningActivity: (item: MorningActivity) => Promise<void>;
  updateMorningActivity: (id: string, updated: Partial<MorningActivity>) => Promise<void>;
  deleteMorningActivity: (id: string) => Promise<void>;
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  applicants: PPDBApplicant[];
  addApplicant: (applicant: PPDBApplicant) => Promise<void>;
  updateApplicantStatus: (regNumber: string, status: PPDBApplicant['status'], notes?: string) => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  isFirebaseAdmin: boolean;
  firebaseUser: User | null;
  cloudAuthError: string | null;
  clearCloudAuthError: () => void;
  loginAdmin: (username: string, password: string) => boolean;
  loginWithGoogleAdmin: () => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  adminInitialTab?: 'profil' | 'sambutan-visi' | 'guru' | 'peserta-didik' | 'ekstrakurikuler' | 'pengumuman' | 'galeri' | 'kegiatan-pagi' | 'ppdb';
  setAdminInitialTab: (tab: 'profil' | 'sambutan-visi' | 'guru' | 'peserta-didik' | 'ekstrakurikuler' | 'pengumuman' | 'galeri' | 'kegiatan-pagi' | 'ppdb') => void;
  resetToDefault: () => Promise<void>;
  isFirebaseConnected: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
}

function stripUndefined<T extends object>(obj: T): T {
  const result: Record<string, unknown> = {};
  Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value;
    }
  });
  return result as T;
}

const BOOTSTRAPPED_ADMIN_EMAIL = 'imamarifin55@admin.smp.belajar.id';

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfoType>(() => {
    const saved = localStorage.getItem('smpn14_school_info');
    if (saved) {
      try {
        return { ...DEFAULT_SCHOOL_INFO, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SCHOOL_INFO;
      }
    }
    return DEFAULT_SCHOOL_INFO;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('smpn14_teachers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TEACHERS;
      }
    }
    return INITIAL_TEACHERS;
  });

  const [activities, setActivities] = useState<ActivityPhoto[]>(() => {
    const saved = localStorage.getItem('smpn14_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SCHOOL_ACTIVITIES;
      }
    }
    return SCHOOL_ACTIVITIES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('smpn14_announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ANNOUNCEMENTS;
      }
    }
    return ANNOUNCEMENTS;
  });

  const [applicants, setApplicants] = useState<PPDBApplicant[]>(() => {
    const saved = localStorage.getItem('smpn14_ppdb_applicants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_APPLICANTS;
      }
    }
    return INITIAL_APPLICANTS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('smpn14_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STUDENTS;
      }
    }
    return INITIAL_STUDENTS;
  });

  const [morningActivities, setMorningActivities] = useState<MorningActivity[]>(() => {
    const saved = localStorage.getItem('smpn14_morning_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MORNING_ACTIVITIES;
      }
    }
    return INITIAL_MORNING_ACTIVITIES;
  });

  const [extracurriculars, setExtracurriculars] = useState<ExtracurricularItem[]>(() => {
    const saved = localStorage.getItem('smpn14_extracurriculars');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SCHOOL_EXTRAS;
      }
    }
    return SCHOOL_EXTRAS;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('smpn14_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseAdmin, setIsFirebaseAdmin] = useState(false);
  const [cloudAuthError, setCloudAuthError] = useState<string | null>(null);
  const [adminInitialTab, setAdminInitialTab] = useState<'profil' | 'sambutan-visi' | 'guru' | 'peserta-didik' | 'ekstrakurikuler' | 'pengumuman' | 'galeri' | 'kegiatan-pagi' | 'ppdb'>('profil');
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  const clearCloudAuthError = () => setCloudAuthError(null);

  const checkUserAdminRole = async (user: User | null): Promise<boolean> => {
    if (!user) return false;
    if (user.email === BOOTSTRAPPED_ADMIN_EMAIL && user.emailVerified) {
      return true;
    }
    try {
      const adminSnap = await getDoc(doc(db, 'admins', user.uid));
      return adminSnap.exists();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setIsFirebaseAdmin(false);
        return;
      }
      const allowed = await checkUserAdminRole(user);
      setIsFirebaseAdmin(allowed);
      if (allowed) {
        setIsAdminAuthenticated(true);
        setCloudAuthError(null);
        try {
          sessionStorage.setItem('smpn14_admin_auth', 'true');
        } catch {
          // Ignore storage restrictions
        }
      }
    });
    return () => unsubAuth();
  }, []);

  const reportFirestoreWriteError = (err: unknown, op: OperationType, path: string) => {
    const message = err instanceof Error ? err.message : String(err);
    const isPermissionError =
      message.toLowerCase().includes('permission') ||
      message.toLowerCase().includes('insufficient');
    if (isPermissionError) {
      try {
        handleFirestoreError(err, op, path);
      } catch {
        // Structured error logged via handleFirestoreError
      }
      setCloudAuthError(
        'Perubahan tersimpan di perangkat ini, namun penulisan ke Cloud Firestore membutuhkan verifikasi Akun Google Admin (imamarifin55@admin.smp.belajar.id).'
      );
    } else {
      console.warn(`Firestore ${op} (${path}) warning:`, err);
    }
    setSyncStatus('offline');
  };

  const loginAdmin = (username: string, password: string): boolean => {
    if (username.trim() === 'administrator' && password === 'administrator') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('smpn14_admin_auth', 'true');
      } catch {
        // Ignore storage restrictions
      }
      return true;
    }
    return false;
  };

  const loginWithGoogleAdmin = async (): Promise<boolean> => {
    setCloudAuthError(null);
    try {
      const cred = await signInWithGoogleAdmin();
      const allowed = await checkUserAdminRole(cred.user);
      if (!allowed) {
        await signOutFirebase();
        setIsFirebaseAdmin(false);
        setCloudAuthError(
          `Akun Google (${cred.user.email || 'tidak dikenal'}) tidak memiliki hak akses Administrator. Gunakan akun ${BOOTSTRAPPED_ADMIN_EMAIL}.`
        );
        return false;
      }
      setFirebaseUser(cred.user);
      setIsFirebaseAdmin(true);
      setIsAdminAuthenticated(true);
      setSyncStatus('synced');
      try {
        sessionStorage.setItem('smpn14_admin_auth', 'true');
      } catch {
        // Ignore storage restrictions
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes('popup-closed-by-user')) {
        setCloudAuthError('Gagal memverifikasi Google Admin. Pastikan popup browser diizinkan dan coba lagi.');
      }
      return false;
    }
  };

  const logoutAdmin = async () => {
    setIsAdminAuthenticated(false);
    setIsFirebaseAdmin(false);
    setCloudAuthError(null);
    setIsAdminOpen(false);
    try {
      sessionStorage.removeItem('smpn14_admin_auth');
    } catch {
      // Ignore storage restrictions
    }
    try {
      await signOutFirebase();
    } catch {
      // Ignore sign-out errors if already signed out
    }
  };

  // Local storage backups
  useEffect(() => {
    localStorage.setItem('smpn14_school_info', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem('smpn14_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('smpn14_extracurriculars', JSON.stringify(extracurriculars));
  }, [extracurriculars]);

  useEffect(() => {
    localStorage.setItem('smpn14_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('smpn14_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('smpn14_morning_activities', JSON.stringify(morningActivities));
  }, [morningActivities]);

  useEffect(() => {
    localStorage.setItem('smpn14_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('smpn14_ppdb_applicants', JSON.stringify(applicants));
  }, [applicants]);

  // Realtime Listeners with Firestore onSnapshot
  useEffect(() => {
    // 1. School Info Listener
    const unsubSchoolInfo = onSnapshot(
      doc(db, 'school_info', 'main'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = { ...DEFAULT_SCHOOL_INFO, ...(snapshot.data() as Partial<SchoolInfoType>) };
          setSchoolInfo(data);
          localStorage.setItem('smpn14_school_info', JSON.stringify(data));
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        console.warn('School info onSnapshot warning:', error);
        setIsFirebaseConnected(false);
      }
    );

    // 2. Teachers Listener
    const unsubTeachers = onSnapshot(
      collection(db, 'teachers'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Teacher[] = [];
          snapshot.forEach((d) => list.push(d.data() as Teacher));
          setTeachers(list);
          localStorage.setItem('smpn14_teachers', JSON.stringify(list));
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        console.warn('Teachers onSnapshot warning:', error);
        setIsFirebaseConnected(false);
      }
    );

    // 3. Students Listener
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Student[] = [];
          snapshot.forEach((d) => list.push(d.data() as Student));
          setStudents(list);
          localStorage.setItem('smpn14_students', JSON.stringify(list));
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        console.warn('Students onSnapshot warning:', error);
        setIsFirebaseConnected(false);
      }
    );

    // 4. Announcements Listener
    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Announcement[] = [];
          snapshot.forEach((d) => list.push(d.data() as Announcement));
          setAnnouncements(list);
          localStorage.setItem('smpn14_announcements', JSON.stringify(list));
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        console.warn('Announcements onSnapshot warning:', error);
        setIsFirebaseConnected(false);
      }
    );

    // 5. Activities Listener
    const unsubActivities = onSnapshot(
      collection(db, 'activities'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ActivityPhoto[] = [];
          snapshot.forEach((d) => list.push(d.data() as ActivityPhoto));
          setActivities(list);
          localStorage.setItem('smpn14_activities', JSON.stringify(list));
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        console.warn('Activities onSnapshot warning:', error);
        setIsFirebaseConnected(false);
      }
    );

    // 6. PPDB Applicants Listener
    const unsubApplicants = onSnapshot(
      collection(db, 'ppdb_applicants'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PPDBApplicant[] = [];
          snapshot.forEach((d) => list.push(d.data() as PPDBApplicant));
          setApplicants(list);
          localStorage.setItem('smpn14_ppdb_applicants', JSON.stringify(list));
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        console.warn('Applicants onSnapshot warning:', error);
        setIsFirebaseConnected(false);
      }
    );

    // 7. Morning Activities (Kegiatan Pagi) Listener
    const unsubMorningActivities = onSnapshot(
      collection(db, 'kegiatan_pagi'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MorningActivity[] = [];
          snapshot.forEach((d) => list.push(d.data() as MorningActivity));
          setMorningActivities(list);
          localStorage.setItem('smpn14_morning_activities', JSON.stringify(list));
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        console.warn('Morning activities onSnapshot warning:', error);
        setIsFirebaseConnected(false);
      }
    );

    // 8. Extracurriculars Listener
    const unsubExtracurriculars = onSnapshot(
      collection(db, 'ekstrakurikuler'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ExtracurricularItem[] = [];
          snapshot.forEach((d) => list.push(d.data() as ExtracurricularItem));
          setExtracurriculars(list);
          localStorage.setItem('smpn14_extracurriculars', JSON.stringify(list));
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        console.warn('Extracurriculars onSnapshot warning:', error);
        setIsFirebaseConnected(false);
      }
    );

    return () => {
      unsubSchoolInfo();
      unsubTeachers();
      unsubStudents();
      unsubAnnouncements();
      unsubActivities();
      unsubApplicants();
      unsubMorningActivities();
      unsubExtracurriculars();
    };
  }, []);

  // Update School Info
  const updateSchoolInfo = async (info: SchoolInfoType) => {
    const nextInfo = stripUndefined({
      ...info,
      updatedAt: new Date().toISOString()
    }) as SchoolInfoType;

    setSchoolInfo(nextInfo);
    localStorage.setItem('smpn14_school_info', JSON.stringify(nextInfo));
    setSyncStatus('syncing');
    try {
      const payloadBytes = new Blob([JSON.stringify(nextInfo)]).size;
      if (payloadBytes > 980000) {
        console.warn('School info payload approaches Firestore 1MB limit:', payloadBytes);
      }
      await setDoc(doc(db, 'school_info', 'main'), nextInfo);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, 'school_info/main');
    }
  };

  // Teachers CRUD
  const addTeacher = async (teacher: Teacher) => {
    const clean = stripUndefined(teacher);
    setTeachers((prev) => {
      const updated = [clean, ...prev.filter((t) => t.id !== clean.id)];
      localStorage.setItem('smpn14_teachers', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'teachers', clean.id), clean);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, `teachers/${clean.id}`);
    }
  };

  const updateTeacher = async (id: string, updated: Partial<Teacher>) => {
    const existingItem = teachers.find((t) => t.id === id);
    const merged = stripUndefined({ ...(existingItem || {}), ...updated, id }) as Teacher;
    setTeachers((prev) => {
      const newList = prev.map((t) => (t.id === id ? merged : t));
      localStorage.setItem('smpn14_teachers', JSON.stringify(newList));
      return newList;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'teachers', id), merged);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.UPDATE, `teachers/${id}`);
    }
  };

  const deleteTeacher = async (id: string) => {
    setTeachers((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      localStorage.setItem('smpn14_teachers', JSON.stringify(filtered));
      return filtered;
    });
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'teachers', id));
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.DELETE, `teachers/${id}`);
    }
  };

  const importTeachers = async (newTeachers: Teacher[]) => {
    const cleanList = newTeachers.map((t) => stripUndefined(t));
    let combined: Teacher[] = [];
    setTeachers((prev) => {
      const existingMap = new Map(
        prev.map((t) => [t.nip && t.nip !== '-' ? t.nip : t.name.toLowerCase(), t])
      );
      cleanList.forEach((nt) => {
        const key = nt.nip && nt.nip !== '-' ? nt.nip : nt.name.toLowerCase();
        existingMap.set(key, nt);
      });
      combined = Array.from(existingMap.values());
      localStorage.setItem('smpn14_teachers', JSON.stringify(combined));
      return combined;
    });

    setSyncStatus('syncing');
    try {
      const batch = writeBatch(db);
      cleanList.forEach((t) => {
        batch.set(doc(db, 'teachers', t.id), t);
      });
      await batch.commit();
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, 'teachers/batch');
    }
  };

  // Activities CRUD
  const addActivity = async (activity: ActivityPhoto) => {
    const clean = stripUndefined(activity);
    setActivities((prev) => {
      const updated = [clean, ...prev.filter((a) => a.id !== clean.id)];
      localStorage.setItem('smpn14_activities', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'activities', clean.id), clean);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, `activities/${clean.id}`);
    }
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      localStorage.setItem('smpn14_activities', JSON.stringify(filtered));
      return filtered;
    });
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'activities', id));
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.DELETE, `activities/${id}`);
    }
  };

  // Morning Activities (Kegiatan Pagi) CRUD
  const addMorningActivity = async (item: MorningActivity) => {
    const clean = stripUndefined(item);
    setMorningActivities((prev) => {
      const updated = [clean, ...prev.filter((m) => m.id !== clean.id)];
      localStorage.setItem('smpn14_morning_activities', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'kegiatan_pagi', clean.id), clean);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, `kegiatan_pagi/${clean.id}`);
    }
  };

  const updateMorningActivity = async (id: string, updated: Partial<MorningActivity>) => {
    const existingItem = morningActivities.find((m) => m.id === id);
    const merged = stripUndefined({ ...(existingItem || {}), ...updated, id }) as MorningActivity;
    setMorningActivities((prev) => {
      const newList = prev.map((m) => (m.id === id ? merged : m));
      localStorage.setItem('smpn14_morning_activities', JSON.stringify(newList));
      return newList;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'kegiatan_pagi', id), merged);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.UPDATE, `kegiatan_pagi/${id}`);
    }
  };

  const deleteMorningActivity = async (id: string) => {
    setMorningActivities((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      localStorage.setItem('smpn14_morning_activities', JSON.stringify(filtered));
      return filtered;
    });
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'kegiatan_pagi', id));
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.DELETE, `kegiatan_pagi/${id}`);
    }
  };

  // Announcements CRUD
  const addAnnouncement = async (announcement: Announcement) => {
    const clean = stripUndefined(announcement);
    setAnnouncements((prev) => {
      const updated = [clean, ...prev.filter((a) => a.id !== clean.id)];
      localStorage.setItem('smpn14_announcements', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'announcements', clean.id), clean);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, `announcements/${clean.id}`);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements((prev) => {
      const filtered = prev.filter((ann) => ann.id !== id);
      localStorage.setItem('smpn14_announcements', JSON.stringify(filtered));
      return filtered;
    });
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.DELETE, `announcements/${id}`);
    }
  };

  // PPDB Applicants CRUD
  const addApplicant = async (applicant: PPDBApplicant) => {
    const clean = stripUndefined(applicant);
    setApplicants((prev) => {
      const updated = [clean, ...prev.filter((a) => a.registrationNumber !== clean.registrationNumber)];
      localStorage.setItem('smpn14_ppdb_applicants', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'ppdb_applicants', clean.registrationNumber), clean);
      setSyncStatus('synced');
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.CREATE, `ppdb_applicants/${clean.registrationNumber}`);
    }
  };

  const updateApplicantStatus = async (
    regNumber: string,
    status: PPDBApplicant['status'],
    notes?: string
  ) => {
    const existingItem = applicants.find((a) => a.registrationNumber === regNumber);
    const merged = stripUndefined({
      ...(existingItem || {}),
      registrationNumber: regNumber,
      status,
      ...(notes ? { notes } : {})
    }) as PPDBApplicant;

    setApplicants((prev) => {
      const updated = prev.map((app) =>
        app.registrationNumber === regNumber ? merged : app
      );
      localStorage.setItem('smpn14_ppdb_applicants', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'ppdb_applicants', regNumber), merged);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.UPDATE, `ppdb_applicants/${regNumber}`);
    }
  };

  // Students CRUD
  const addStudent = async (student: Student) => {
    const clean = stripUndefined(student);
    setStudents((prev) => {
      const updated = [clean, ...prev.filter((s) => s.id !== clean.id)];
      localStorage.setItem('smpn14_students', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'students', clean.id), clean);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, `students/${clean.id}`);
    }
  };

  const updateStudent = async (id: string, updated: Partial<Student>) => {
    const existingItem = students.find((s) => s.id === id);
    const merged = stripUndefined({ ...(existingItem || {}), ...updated, id }) as Student;
    setStudents((prev) => {
      const newList = prev.map((s) => (s.id === id ? merged : s));
      localStorage.setItem('smpn14_students', JSON.stringify(newList));
      return newList;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'students', id), merged);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.UPDATE, `students/${id}`);
    }
  };

  const deleteStudent = async (id: string) => {
    setStudents((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      localStorage.setItem('smpn14_students', JSON.stringify(filtered));
      return filtered;
    });
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'students', id));
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.DELETE, `students/${id}`);
    }
  };

  const importStudents = async (newStudents: Student[]) => {
    const cleanList = newStudents.map((s) => stripUndefined(s));
    let combined: Student[] = [];
    setStudents((prev) => {
      const existingMap = new Map(prev.map((s) => [s.nisn, s]));
      cleanList.forEach((ns) => {
        existingMap.set(ns.nisn, ns);
      });
      combined = Array.from(existingMap.values());
      localStorage.setItem('smpn14_students', JSON.stringify(combined));
      return combined;
    });

    setSyncStatus('syncing');
    try {
      const batch = writeBatch(db);
      cleanList.forEach((s) => {
        batch.set(doc(db, 'students', s.id), s);
      });
      await batch.commit();
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, 'students/batch');
    }
  };

  // Extracurriculars CRUD
  const addExtracurricular = async (item: ExtracurricularItem) => {
    const clean = stripUndefined(item);
    setExtracurriculars((prev) => {
      const updated = [clean, ...prev.filter((e) => e.id !== clean.id)];
      localStorage.setItem('smpn14_extracurriculars', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'ekstrakurikuler', clean.id), clean);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, `ekstrakurikuler/${clean.id}`);
    }
  };

  const updateExtracurricular = async (id: string, updated: Partial<ExtracurricularItem>) => {
    const existingItem = extracurriculars.find((e) => e.id === id);
    const merged = stripUndefined({ ...(existingItem || {}), ...updated, id }) as ExtracurricularItem;
    setExtracurriculars((prev) => {
      const newList = prev.map((e) => (e.id === id ? merged : e));
      localStorage.setItem('smpn14_extracurriculars', JSON.stringify(newList));
      return newList;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'ekstrakurikuler', id), merged);
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.UPDATE, `ekstrakurikuler/${id}`);
    }
  };

  const deleteExtracurricular = async (id: string) => {
    setExtracurriculars((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      localStorage.setItem('smpn14_extracurriculars', JSON.stringify(filtered));
      return filtered;
    });
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'ekstrakurikuler', id));
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.DELETE, `ekstrakurikuler/${id}`);
    }
  };

  const resetToDefault = async () => {
    setSchoolInfo(DEFAULT_SCHOOL_INFO);
    setTeachers(INITIAL_TEACHERS);
    setStudents(INITIAL_STUDENTS);
    setExtracurriculars(SCHOOL_EXTRAS);
    setActivities(SCHOOL_ACTIVITIES);
    setMorningActivities(INITIAL_MORNING_ACTIVITIES);
    setAnnouncements(ANNOUNCEMENTS);
    setApplicants(INITIAL_APPLICANTS);
    setSyncStatus('syncing');

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'school_info', 'main'), stripUndefined(DEFAULT_SCHOOL_INFO));
      INITIAL_TEACHERS.forEach((t) => batch.set(doc(db, 'teachers', t.id), stripUndefined(t)));
      INITIAL_STUDENTS.forEach((s) => batch.set(doc(db, 'students', s.id), stripUndefined(s)));
      SCHOOL_EXTRAS.forEach((ek) => batch.set(doc(db, 'ekstrakurikuler', ek.id), stripUndefined(ek)));
      ANNOUNCEMENTS.forEach((a) => batch.set(doc(db, 'announcements', a.id), stripUndefined(a)));
      SCHOOL_ACTIVITIES.forEach((ac) => batch.set(doc(db, 'activities', ac.id), stripUndefined(ac)));
      INITIAL_MORNING_ACTIVITIES.forEach((ma) => batch.set(doc(db, 'kegiatan_pagi', ma.id), stripUndefined(ma)));
      INITIAL_APPLICANTS.forEach((ap) => batch.set(doc(db, 'ppdb_applicants', ap.registrationNumber), stripUndefined(ap)));
      await batch.commit();
      setSyncStatus('synced');
      setCloudAuthError(null);
    } catch (err) {
      reportFirestoreWriteError(err, OperationType.WRITE, 'batch/resetToDefault');
    }
  };

  return (
    <SchoolDataContext.Provider
      value={{
        schoolInfo,
        updateSchoolInfo,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        importTeachers,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        importStudents,
        extracurriculars,
        addExtracurricular,
        updateExtracurricular,
        deleteExtracurricular,
        activities,
        addActivity,
        deleteActivity,
        morningActivities,
        addMorningActivity,
        updateMorningActivity,
        deleteMorningActivity,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        applicants,
        addApplicant,
        updateApplicantStatus,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        isFirebaseAdmin,
        firebaseUser,
        cloudAuthError,
        clearCloudAuthError,
        loginAdmin,
        loginWithGoogleAdmin,
        logoutAdmin,
        adminInitialTab,
        setAdminInitialTab,
        resetToDefault,
        isFirebaseConnected,
        syncStatus
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = (): SchoolDataContextType => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};

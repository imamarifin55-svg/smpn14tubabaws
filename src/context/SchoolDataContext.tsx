import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  SCHOOL_INFO as DEFAULT_SCHOOL_INFO,
  INITIAL_TEACHERS,
  SCHOOL_ACTIVITIES,
  ANNOUNCEMENTS,
  INITIAL_APPLICANTS,
  INITIAL_STUDENTS,
  INITIAL_MORNING_ACTIVITIES,
  Teacher,
  ActivityPhoto,
  Announcement,
  PPDBApplicant,
  Student,
  MorningActivity
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
  adminInitialTab?: 'profil' | 'sambutan-visi' | 'guru' | 'peserta-didik' | 'pengumuman' | 'galeri' | 'kegiatan-pagi' | 'ppdb';
  setAdminInitialTab: (tab: 'profil' | 'sambutan-visi' | 'guru' | 'peserta-didik' | 'pengumuman' | 'galeri' | 'kegiatan-pagi' | 'ppdb') => void;
  resetToDefault: () => Promise<void>;
  isFirebaseConnected: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
}

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

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'profil' | 'sambutan-visi' | 'guru' | 'peserta-didik' | 'pengumuman' | 'galeri' | 'kegiatan-pagi' | 'ppdb'>('profil');
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Local storage backups
  useEffect(() => {
    localStorage.setItem('smpn14_school_info', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem('smpn14_students', JSON.stringify(students));
  }, [students]);

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

    return () => {
      unsubSchoolInfo();
      unsubTeachers();
      unsubStudents();
      unsubAnnouncements();
      unsubActivities();
      unsubApplicants();
      unsubMorningActivities();
    };
  }, []);

  // Update School Info
  const updateSchoolInfo = async (info: SchoolInfoType) => {
    const nextInfo: SchoolInfoType = {
      ...info,
      updatedAt: new Date().toISOString()
    } as SchoolInfoType;

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
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('permission') || message.toLowerCase().includes('insufficient')) {
        handleFirestoreError(err, OperationType.WRITE, 'school_info/main');
      }
      console.warn('Firestore updateSchoolInfo warning:', err);
      setSyncStatus('offline');
    }
  };

  // Teachers CRUD
  const addTeacher = async (teacher: Teacher) => {
    setTeachers((prev) => {
      const updated = [teacher, ...prev.filter((t) => t.id !== teacher.id)];
      localStorage.setItem('smpn14_teachers', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'teachers', teacher.id), teacher);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore addTeacher warning:', err);
      setSyncStatus('offline');
    }
  };

  const updateTeacher = async (id: string, updated: Partial<Teacher>) => {
    setTeachers((prev) => {
      const newList = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      localStorage.setItem('smpn14_teachers', JSON.stringify(newList));
      return newList;
    });
    setSyncStatus('syncing');
    try {
      await updateDoc(doc(db, 'teachers', id), updated);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore updateTeacher warning:', err);
      setSyncStatus('offline');
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
    } catch (err) {
      console.warn('Firestore deleteTeacher warning:', err);
      setSyncStatus('offline');
    }
  };

  const importTeachers = async (newTeachers: Teacher[]) => {
    let combined: Teacher[] = [];
    setTeachers((prev) => {
      const existingMap = new Map(
        prev.map((t) => [t.nip && t.nip !== '-' ? t.nip : t.name.toLowerCase(), t])
      );
      newTeachers.forEach((nt) => {
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
      newTeachers.forEach((t) => {
        batch.set(doc(db, 'teachers', t.id), t);
      });
      await batch.commit();
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore importTeachers warning:', err);
      setSyncStatus('offline');
    }
  };

  // Activities CRUD
  const addActivity = async (activity: ActivityPhoto) => {
    setActivities((prev) => {
      const updated = [activity, ...prev.filter((a) => a.id !== activity.id)];
      localStorage.setItem('smpn14_activities', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'activities', activity.id), activity);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore addActivity warning:', err);
      setSyncStatus('offline');
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
    } catch (err) {
      console.warn('Firestore deleteActivity warning:', err);
      setSyncStatus('offline');
    }
  };

  // Morning Activities (Kegiatan Pagi) CRUD
  const addMorningActivity = async (item: MorningActivity) => {
    setMorningActivities((prev) => {
      const updated = [item, ...prev.filter((m) => m.id !== item.id)];
      localStorage.setItem('smpn14_morning_activities', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'kegiatan_pagi', item.id), item);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore addMorningActivity warning:', err);
      setSyncStatus('offline');
    }
  };

  const updateMorningActivity = async (id: string, updated: Partial<MorningActivity>) => {
    setMorningActivities((prev) => {
      const newList = prev.map((m) => (m.id === id ? { ...m, ...updated } : m));
      localStorage.setItem('smpn14_morning_activities', JSON.stringify(newList));
      return newList;
    });
    setSyncStatus('syncing');
    try {
      await updateDoc(doc(db, 'kegiatan_pagi', id), updated);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore updateMorningActivity warning:', err);
      setSyncStatus('offline');
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
    } catch (err) {
      console.warn('Firestore deleteMorningActivity warning:', err);
      setSyncStatus('offline');
    }
  };

  // Announcements CRUD
  const addAnnouncement = async (announcement: Announcement) => {
    setAnnouncements((prev) => {
      const updated = [announcement, ...prev.filter((a) => a.id !== announcement.id)];
      localStorage.setItem('smpn14_announcements', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'announcements', announcement.id), announcement);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore addAnnouncement warning:', err);
      setSyncStatus('offline');
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
    } catch (err) {
      console.warn('Firestore deleteAnnouncement warning:', err);
      setSyncStatus('offline');
    }
  };

  // PPDB Applicants CRUD
  const addApplicant = async (applicant: PPDBApplicant) => {
    setApplicants((prev) => {
      const updated = [applicant, ...prev.filter((a) => a.registrationNumber !== applicant.registrationNumber)];
      localStorage.setItem('smpn14_ppdb_applicants', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'ppdb_applicants', applicant.registrationNumber), applicant);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore addApplicant warning:', err);
      setSyncStatus('offline');
    }
  };

  const updateApplicantStatus = async (
    regNumber: string,
    status: PPDBApplicant['status'],
    notes?: string
  ) => {
    setApplicants((prev) => {
      const updated = prev.map((app) =>
        app.registrationNumber === regNumber
          ? {
              ...app,
              status,
              ...(notes ? { notes } : {})
            }
          : app
      );
      localStorage.setItem('smpn14_ppdb_applicants', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await updateDoc(doc(db, 'ppdb_applicants', regNumber), {
        status,
        ...(notes ? { notes } : {})
      });
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore updateApplicantStatus warning:', err);
      setSyncStatus('offline');
    }
  };

  // Students CRUD
  const addStudent = async (student: Student) => {
    setStudents((prev) => {
      const updated = [student, ...prev.filter((s) => s.id !== student.id)];
      localStorage.setItem('smpn14_students', JSON.stringify(updated));
      return updated;
    });
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'students', student.id), student);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore addStudent warning:', err);
      setSyncStatus('offline');
    }
  };

  const updateStudent = async (id: string, updated: Partial<Student>) => {
    setStudents((prev) => {
      const newList = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      localStorage.setItem('smpn14_students', JSON.stringify(newList));
      return newList;
    });
    setSyncStatus('syncing');
    try {
      await updateDoc(doc(db, 'students', id), updated);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore updateStudent warning:', err);
      setSyncStatus('offline');
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
    } catch (err) {
      console.warn('Firestore deleteStudent warning:', err);
      setSyncStatus('offline');
    }
  };

  const importStudents = async (newStudents: Student[]) => {
    let combined: Student[] = [];
    setStudents((prev) => {
      const existingMap = new Map(prev.map((s) => [s.nisn, s]));
      newStudents.forEach((ns) => {
        existingMap.set(ns.nisn, ns);
      });
      combined = Array.from(existingMap.values());
      localStorage.setItem('smpn14_students', JSON.stringify(combined));
      return combined;
    });

    setSyncStatus('syncing');
    try {
      const batch = writeBatch(db);
      newStudents.forEach((s) => {
        batch.set(doc(db, 'students', s.id), s);
      });
      await batch.commit();
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Firestore importStudents warning:', err);
      setSyncStatus('offline');
    }
  };

  const resetToDefault = async () => {
    setSchoolInfo(DEFAULT_SCHOOL_INFO);
    setTeachers(INITIAL_TEACHERS);
    setStudents(INITIAL_STUDENTS);
    setActivities(SCHOOL_ACTIVITIES);
    setMorningActivities(INITIAL_MORNING_ACTIVITIES);
    setAnnouncements(ANNOUNCEMENTS);
    setApplicants(INITIAL_APPLICANTS);
    setSyncStatus('syncing');

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'school_info', 'main'), DEFAULT_SCHOOL_INFO);
      INITIAL_TEACHERS.forEach((t) => batch.set(doc(db, 'teachers', t.id), t));
      INITIAL_STUDENTS.forEach((s) => batch.set(doc(db, 'students', s.id), s));
      ANNOUNCEMENTS.forEach((a) => batch.set(doc(db, 'announcements', a.id), a));
      SCHOOL_ACTIVITIES.forEach((ac) => batch.set(doc(db, 'activities', ac.id), ac));
      INITIAL_MORNING_ACTIVITIES.forEach((ma) => batch.set(doc(db, 'kegiatan_pagi', ma.id), ma));
      INITIAL_APPLICANTS.forEach((ap) => batch.set(doc(db, 'ppdb_applicants', ap.registrationNumber), ap));
      await batch.commit();
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Reset sync warning:', err);
      setSyncStatus('offline');
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

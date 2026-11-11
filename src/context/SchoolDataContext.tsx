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
  Teacher,
  ActivityPhoto,
  Announcement,
  PPDBApplicant,
  Student
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
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  applicants: PPDBApplicant[];
  addApplicant: (applicant: PPDBApplicant) => Promise<void>;
  updateApplicantStatus: (regNumber: string, status: PPDBApplicant['status'], notes?: string) => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminInitialTab?: 'profil' | 'guru' | 'peserta-didik' | 'pengumuman' | 'galeri' | 'ppdb';
  setAdminInitialTab: (tab: 'profil' | 'guru' | 'peserta-didik' | 'pengumuman' | 'galeri' | 'ppdb') => void;
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
        return JSON.parse(saved);
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

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'profil' | 'guru' | 'peserta-didik' | 'pengumuman' | 'galeri' | 'ppdb'>('profil');
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
          setSchoolInfo(snapshot.data() as SchoolInfoType);
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'school_info/main');
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
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'teachers');
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
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'students');
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
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'announcements');
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
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'activities');
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
          setIsFirebaseConnected(true);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'ppdb_applicants');
      }
    );

    return () => {
      unsubSchoolInfo();
      unsubTeachers();
      unsubStudents();
      unsubAnnouncements();
      unsubActivities();
      unsubApplicants();
    };
  }, []);

  // Update School Info
  const updateSchoolInfo = async (info: SchoolInfoType) => {
    setSchoolInfo(info);
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'school_info', 'main'), info);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, 'school_info/main');
    }
  };

  // Teachers CRUD
  const addTeacher = async (teacher: Teacher) => {
    setTeachers((prev) => [teacher, ...prev]);
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'teachers', teacher.id), teacher);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, `teachers/${teacher.id}`);
    }
  };

  const updateTeacher = async (id: string, updated: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    setSyncStatus('syncing');
    try {
      await updateDoc(doc(db, 'teachers', id), updated);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.UPDATE, `teachers/${id}`);
    }
  };

  const deleteTeacher = async (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'teachers', id));
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.DELETE, `teachers/${id}`);
    }
  };

  const importTeachers = async (newTeachers: Teacher[]) => {
    setTeachers((prev) => {
      const existingMap = new Map(
        prev.map((t) => [t.nip && t.nip !== '-' ? t.nip : t.name.toLowerCase(), t])
      );
      newTeachers.forEach((nt) => {
        const key = nt.nip && nt.nip !== '-' ? nt.nip : nt.name.toLowerCase();
        existingMap.set(key, nt);
      });
      return Array.from(existingMap.values());
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
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, 'teachers');
    }
  };

  // Activities CRUD
  const addActivity = async (activity: ActivityPhoto) => {
    setActivities((prev) => [activity, ...prev]);
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'activities', activity.id), activity);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, `activities/${activity.id}`);
    }
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'activities', id));
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.DELETE, `activities/${id}`);
    }
  };

  // Announcements CRUD
  const addAnnouncement = async (announcement: Announcement) => {
    setAnnouncements((prev) => [announcement, ...prev]);
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'announcements', announcement.id), announcement);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, `announcements/${announcement.id}`);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.DELETE, `announcements/${id}`);
    }
  };

  // PPDB Applicants CRUD
  const addApplicant = async (applicant: PPDBApplicant) => {
    setApplicants((prev) => [applicant, ...prev]);
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'ppdb_applicants', applicant.registrationNumber), applicant);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, `ppdb_applicants/${applicant.registrationNumber}`);
    }
  };

  const updateApplicantStatus = async (
    regNumber: string,
    status: PPDBApplicant['status'],
    notes?: string
  ) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.registrationNumber === regNumber
          ? {
              ...app,
              status,
              ...(notes ? { notes } : {})
            }
          : app
      )
    );
    setSyncStatus('syncing');
    try {
      await updateDoc(doc(db, 'ppdb_applicants', regNumber), {
        status,
        ...(notes ? { notes } : {})
      });
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.UPDATE, `ppdb_applicants/${regNumber}`);
    }
  };

  // Students CRUD
  const addStudent = async (student: Student) => {
    setStudents((prev) => [student, ...prev]);
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'students', student.id), student);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, `students/${student.id}`);
    }
  };

  const updateStudent = async (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    setSyncStatus('syncing');
    try {
      await updateDoc(doc(db, 'students', id), updated);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.UPDATE, `students/${id}`);
    }
  };

  const deleteStudent = async (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setSyncStatus('syncing');
    try {
      await deleteDoc(doc(db, 'students', id));
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.DELETE, `students/${id}`);
    }
  };

  const importStudents = async (newStudents: Student[]) => {
    setStudents((prev) => {
      const existingMap = new Map(prev.map((s) => [s.nisn, s]));
      newStudents.forEach((ns) => {
        existingMap.set(ns.nisn, ns);
      });
      return Array.from(existingMap.values());
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
      setSyncStatus('offline');
      handleFirestoreError(err, OperationType.WRITE, 'students');
    }
  };

  const resetToDefault = async () => {
    setSchoolInfo(DEFAULT_SCHOOL_INFO);
    setTeachers(INITIAL_TEACHERS);
    setStudents(INITIAL_STUDENTS);
    setActivities(SCHOOL_ACTIVITIES);
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

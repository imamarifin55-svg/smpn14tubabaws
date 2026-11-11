import React, { createContext, useContext, useState, useEffect } from 'react';
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
  updateSchoolInfo: (info: SchoolInfoType) => void;
  teachers: Teacher[];
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  importTeachers: (newTeachers: Teacher[]) => void;
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  importStudents: (newStudents: Student[]) => void;
  activities: ActivityPhoto[];
  addActivity: (activity: ActivityPhoto) => void;
  deleteActivity: (id: string) => void;
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  applicants: PPDBApplicant[];
  addApplicant: (applicant: PPDBApplicant) => void;
  updateApplicantStatus: (regNumber: string, status: PPDBApplicant['status'], notes?: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminInitialTab?: 'profil' | 'guru' | 'peserta-didik' | 'pengumuman' | 'galeri' | 'ppdb';
  setAdminInitialTab: (tab: 'profil' | 'guru' | 'peserta-didik' | 'pengumuman' | 'galeri' | 'ppdb') => void;
  resetToDefault: () => void;
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

  // Sync to localStorage
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

  const updateSchoolInfo = (info: SchoolInfoType) => {
    setSchoolInfo(info);
  };

  const addTeacher = (teacher: Teacher) => {
    setTeachers((prev) => [teacher, ...prev]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const importTeachers = (newTeachers: Teacher[]) => {
    setTeachers((prev) => {
      // Key by NIP if present or by Name
      const existingMap = new Map(
        prev.map((t) => [t.nip && t.nip !== '-' ? t.nip : t.name.toLowerCase(), t])
      );
      newTeachers.forEach((nt) => {
        const key = nt.nip && nt.nip !== '-' ? nt.nip : nt.name.toLowerCase();
        existingMap.set(key, nt);
      });
      return Array.from(existingMap.values());
    });
  };

  const addActivity = (activity: ActivityPhoto) => {
    setActivities((prev) => [activity, ...prev]);
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const addAnnouncement = (announcement: Announcement) => {
    setAnnouncements((prev) => [announcement, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
  };

  const addApplicant = (applicant: PPDBApplicant) => {
    setApplicants((prev) => [applicant, ...prev]);
  };

  const updateApplicantStatus = (
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
  };

  const addStudent = (student: Student) => {
    setStudents((prev) => [student, ...prev]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const importStudents = (newStudents: Student[]) => {
    setStudents((prev) => {
      // Overwrite by NISN or append if new
      const existingMap = new Map(prev.map((s) => [s.nisn, s]));
      newStudents.forEach((ns) => {
        existingMap.set(ns.nisn, ns);
      });
      return Array.from(existingMap.values());
    });
  };

  const resetToDefault = () => {
    setSchoolInfo(DEFAULT_SCHOOL_INFO);
    setTeachers(INITIAL_TEACHERS);
    setStudents(INITIAL_STUDENTS);
    setActivities(SCHOOL_ACTIVITIES);
    setAnnouncements(ANNOUNCEMENTS);
    setApplicants(INITIAL_APPLICANTS);
    localStorage.removeItem('smpn14_school_info');
    localStorage.removeItem('smpn14_teachers');
    localStorage.removeItem('smpn14_students');
    localStorage.removeItem('smpn14_activities');
    localStorage.removeItem('smpn14_announcements');
    localStorage.removeItem('smpn14_ppdb_applicants');
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
        resetToDefault
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within SchoolDataProvider');
  }
  return context;
};

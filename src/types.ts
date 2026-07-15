export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  university?: string;
  course?: string;
  semester?: string;
  targetExamination?: string;
  dailyStudyGoal?: number; // in hours
  weeklyStudyGoal?: number; // in hours
  monthlyGoal?: string;
  studyStreak: number;
  totalStudyHours: number;
  joinDate: string;
  achievementBadges: string[];
  profilePicture?: string;
}

export interface Subtopic {
  id: string;
  name: string;
  isCompleted?: boolean;
}

export interface PhysicsSubject {
  id: string;
  name: string;
  description: string;
  subtopics: Subtopic[];
}

export interface SubjectProgress {
  subjectId: string;
  completedSubtopics: string[]; // array of completed subtopic IDs
  studyHours: number;
  lastStudiedDate?: string;
  longestStudyGap?: number; // in days
  averageStudyGap?: number; // in days
  consistencyScore?: number; // 0 to 100
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  subjectId: string;
  notes?: string;
}

export interface MotivationQuote {
  quote: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: "streak" | "hours" | "subjects" | "special";
  requirementText: string;
}

import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { auth, db, signOut, deleteUser } from "./lib/firebase";
import { UserProfile, SubjectProgress, StudySession } from "./types";
import { PHYSICS_SUBJECTS } from "./data/physicsData";
import { motion } from "motion/react";

// Components
import AuthScreen from "./components/AuthScreen";
import DashboardView from "./components/DashboardView";
import SubjectsView from "./components/SubjectsView";
import AIAssistantView from "./components/AIAssistantView";
import ProfileView from "./components/ProfileView";

// Icons
import { 
  Atom, 
  Home, 
  BookOpen, 
  BrainCircuit, 
  User, 
  LogOut, 
  Loader2,
  Sparkles,
  Award
} from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subjectProgress, setSubjectProgress] = useState<Record<string, SubjectProgress>>({});
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"dashboard" | "subjects" | "ai" | "profile">("dashboard");

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid, user.email || "", user.displayName || "Researcher");
      } else {
        setUserProfile(null);
        setSubjectProgress({});
        setStudySessions([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch or Initialise user data in Firestore
  const fetchUserData = async (uid: string, email: string, displayName: string) => {
    try {
      setLoading(true);

      // 1. Fetch/Initialise profile
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      let profileData: UserProfile;
      if (userSnap.exists()) {
        profileData = userSnap.data() as UserProfile;
      } else {
        // Initialise default profile
        profileData = {
          uid,
          fullName: displayName,
          email,
          studyStreak: 1,
          totalStudyHours: 0,
          joinDate: new Date().toISOString(),
          achievementBadges: ["unified_intro"],
          profilePicture: "Physicist_1",
          dailyStudyGoal: 2,
          weeklyStudyGoal: 15,
          monthlyGoal: "Complete core physics subtopic exploration."
        };
        await setDoc(userRef, profileData);
      }
      setUserProfile(profileData);

      // 2. Fetch subject progress
      const progressRef = collection(db, "users", uid, "subjectProgress");
      const progressSnap = await getDocs(progressRef);
      const progressMap: Record<string, SubjectProgress> = {};

      progressSnap.forEach((d) => {
        const item = d.data() as SubjectProgress;
        progressMap[item.subjectId] = item;
      });

      // Populate empty subjects if they don't exist yet
      PHYSICS_SUBJECTS.forEach((subject) => {
        if (!progressMap[subject.id]) {
          progressMap[subject.id] = {
            subjectId: subject.id,
            completedSubtopics: [],
            studyHours: 0,
            consistencyScore: 0
          };
        }
      });
      setSubjectProgress(progressMap);

      // 3. Fetch study sessions history
      const sessionsRef = collection(db, "users", uid, "studySessions");
      const sessionsSnap = await getDocs(sessionsRef);
      const sessionsList: StudySession[] = [];
      sessionsSnap.forEach((d) => {
        sessionsList.push({ id: d.id, ...d.data() } as StudySession);
      });
      setStudySessions(sessionsList);

    } catch (err) {
      console.error("Error fetching Firestore user data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Subtopic Completion
  const handleToggleSubtopic = async (subjectId: string, subtopicId: string) => {
    if (!currentUser || !userProfile) return;

    const currentProg = subjectProgress[subjectId] || {
      subjectId,
      completedSubtopics: [],
      studyHours: 0,
      consistencyScore: 0
    };

    let updatedList = [...currentProg.completedSubtopics];
    if (updatedList.includes(subtopicId)) {
      updatedList = updatedList.filter(id => id !== subtopicId);
    } else {
      updatedList.push(subtopicId);
    }

    const updatedProg: SubjectProgress = {
      ...currentProg,
      completedSubtopics: updatedList,
      lastStudiedDate: new Date().toISOString()
    };

    // Update local state
    setSubjectProgress({
      ...subjectProgress,
      [subjectId]: updatedProg
    });

    // Sync to Firestore
    try {
      const docRef = doc(db, "users", currentUser.uid, "subjectProgress", subjectId);
      await setDoc(docRef, updatedProg, { merge: true });
    } catch (err) {
      console.error("Firestore sync error:", err);
    }
  };

  // Log study session hours
  const handleAddSession = async (subjectId: string, durationMinutes: number, notes?: string) => {
    if (!currentUser || !userProfile) return;

    const sessionDate = new Date().toISOString().split("T")[0];
    const durationHours = durationMinutes / 60;

    const newSession: Omit<StudySession, "id"> = {
      date: sessionDate,
      durationMinutes,
      subjectId,
      notes: notes || "Focus session block."
    };

    try {
      // 1. Add session log
      const sessionsCollRef = collection(db, "users", currentUser.uid, "studySessions");
      const snapDoc = doc(sessionsCollRef);
      await setDoc(snapDoc, newSession);

      // Update session history local state
      const addedSession: StudySession = { id: snapDoc.id, ...newSession };
      const updatedSessions = [...studySessions, addedSession];
      setStudySessions(updatedSessions);

      // 2. Increment subject hours
      const currentProg = subjectProgress[subjectId] || {
        subjectId,
        completedSubtopics: [],
        studyHours: 0,
        consistencyScore: 0
      };
      const updatedProgHours = Math.round((currentProg.studyHours + durationHours) * 10) / 10;
      const updatedProg: SubjectProgress = {
        ...currentProg,
        studyHours: updatedProgHours,
        lastStudiedDate: new Date().toISOString()
      };
      setSubjectProgress({
        ...subjectProgress,
        [subjectId]: updatedProg
      });
      const progDocRef = doc(db, "users", currentUser.uid, "subjectProgress", subjectId);
      await setDoc(progDocRef, updatedProg, { merge: true });

      // 3. Update total profile hours and streak calculation
      const updatedTotalHours = Math.round((userProfile.totalStudyHours + durationHours) * 10) / 10;
      
      // Calculate active streak
      let updatedStreak = userProfile.studyStreak;
      const lastSessionDate = studySessions.length > 0 ? studySessions[studySessions.length - 1].date : "";
      if (lastSessionDate && lastSessionDate !== sessionDate) {
        const diffTime = Math.abs(new Date(sessionDate).getTime() - new Date(lastSessionDate).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          updatedStreak += 1;
        } else if (diffDays > 1) {
          updatedStreak = 1; // reset streak if gap exists
        }
      }

      const updatedProfile: UserProfile = {
        ...userProfile,
        totalStudyHours: updatedTotalHours,
        studyStreak: updatedStreak
      };
      setUserProfile(updatedProfile);
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        totalStudyHours: updatedTotalHours,
        studyStreak: updatedStreak
      });

    } catch (err) {
      console.error("Error logging study session:", err);
    }
  };

  // Update Profile Targets
  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return;

    const updatedProfile = {
      ...userProfile,
      ...updated
    };

    setUserProfile(updatedProfile);

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, updated);
    } catch (err) {
      console.error("Firestore profile update error:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Wipe Account
  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    try {
      // 1. Delete Firestore collections (Optional for zero-leak privacy)
      const batch = writeBatch(db);
      const progRef = collection(db, "users", currentUser.uid, "subjectProgress");
      const progSnap = await getDocs(progRef);
      progSnap.forEach((d) => batch.delete(d.ref));

      const sessionsRef = collection(db, "users", currentUser.uid, "studySessions");
      const sessionsSnap = await getDocs(sessionsRef);
      sessionsSnap.forEach((d) => batch.delete(d.ref));

      const userDocRef = doc(db, "users", currentUser.uid);
      batch.delete(userDocRef);

      await batch.commit();

      // 2. Delete Auth user
      await deleteUser(currentUser);
    } catch (err) {
      console.error("Error wiping account:", err);
      // fallback logout
      await handleLogout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D13] flex flex-col items-center justify-center text-center gap-4" id="main_loader">
        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 shadow-xl shadow-indigo-500/5">
          <Atom className="w-10 h-10 animate-spin text-indigo-400" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white mt-2">Physics Core</h1>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Resolving Quantum State...
        </p>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return <AuthScreen onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col lg:flex-row font-sans relative" id="app_frame">
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar Navigation - Elegant Dark styling */}
      <aside className="lg:w-64 w-full bg-[#0F0F12] border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-row lg:flex-col justify-between items-center lg:items-stretch gap-4 shrink-0 relative z-40">
        
        {/* Upper Brand details */}
        <div className="flex lg:flex-col items-center lg:items-start gap-4 flex-1 lg:flex-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-extrabold text-white shadow-lg shadow-indigo-500/20 font-display">
              Φ
            </div>
            <div>
              <h1 className="font-semibold text-base text-white tracking-tight leading-none font-display">Physics Core</h1>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">Study Engine</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs List */}
        <nav className="flex lg:flex-col items-center lg:items-stretch gap-1 lg:my-8 flex-row">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
              currentTab === "dashboard" 
                ? "bg-white/5 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4 opacity-75" /> <span className="hidden lg:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab("subjects")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
              currentTab === "subjects" 
                ? "bg-white/5 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4 opacity-75" /> <span className="hidden lg:inline">Curriculum</span>
          </button>

          <button
            onClick={() => setCurrentTab("ai")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
              currentTab === "ai" 
                ? "bg-white/5 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BrainCircuit className="w-4 h-4 opacity-75" /> <span className="hidden lg:inline">AI Advisor</span>
          </button>

          <button
            onClick={() => setCurrentTab("profile")}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
              currentTab === "profile" 
                ? "bg-white/5 text-white" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4 opacity-75" /> <span className="hidden lg:inline">Profile Settings</span>
          </button>
        </nav>

        {/* Active Topics - Sleek indicators in Sidebar for desktop */}
        <div className="hidden lg:block my-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 block">Active Topics</span>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 text-[11px]">Quantum Mechanics</span>
                <span className="text-indigo-400 font-medium">
                  {Math.round(((subjectProgress["quantum_mechanics"]?.completedSubtopics?.length || 0) / 10) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full">
                <div 
                  className="bg-indigo-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-500" 
                  style={{ width: `${Math.max(4, Math.round(((subjectProgress["quantum_mechanics"]?.completedSubtopics?.length || 0) / 10) * 100))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 text-[11px]">Statistical Mechanics</span>
                <span className="text-emerald-400 font-medium">
                  {Math.round(((subjectProgress["statistical_mechanics"]?.completedSubtopics?.length || 0) / 10) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full">
                <div 
                  className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-500" 
                  style={{ width: `${Math.max(4, Math.round(((subjectProgress["statistical_mechanics"]?.completedSubtopics?.length || 0) / 10) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lower user settings */}
        <div className="hidden lg:flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
              {userProfile.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="max-w-[110px] truncate">
              <p className="text-sm font-medium text-slate-100 leading-tight truncate">{userProfile.fullName}</p>
              <span className="text-[10px] text-slate-500 mt-0.5 block truncate">{userProfile.university || "Researcher"}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </aside>

      {/* Main Study Stage container */}
      <main className="flex-1 max-h-screen overflow-y-auto relative z-10 flex flex-col bg-[#0A0A0B]" id="main_content_stage">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0D0D10]/50 backdrop-blur-md shrink-0">
          <div>
            <h1 className="text-base font-medium text-slate-200">
              Welcome back, <span className="text-indigo-400 font-semibold">{userProfile.fullName.split(" ")[0]}</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-slate-400 font-mono tracking-wider">{userProfile.studyStreak || 0} DAY STREAK</span>
            </div>
            <button 
              onClick={() => setCurrentTab("profile")}
              className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium hover:bg-white/10 transition-all cursor-pointer"
            >
              Account Settings
            </button>
          </div>
        </header>

        {/* View Component Body */}
        <div className="p-8 flex-1 overflow-y-auto">
          {currentTab === "dashboard" && (
            <DashboardView 
              userProfile={userProfile}
              subjectProgress={subjectProgress}
              studySessions={studySessions}
              onAddSession={handleAddSession}
            />
          )}

          {currentTab === "subjects" && (
            <SubjectsView 
              subjectProgress={subjectProgress}
              onToggleSubtopic={handleToggleSubtopic}
              onAddSession={handleAddSession}
            />
          )}

          {currentTab === "ai" && (
            <AIAssistantView 
              userProfile={userProfile}
              subjectProgress={subjectProgress}
            />
          )}

          {currentTab === "profile" && (
            <ProfileView 
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
            />
          )}
        </div>
      </main>
    </div>
  );
}

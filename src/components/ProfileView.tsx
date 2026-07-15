import { useState, FormEvent } from "react";
import { UserProfile, AchievementBadge } from "../types";
import { ACHIEVEMENT_BADGES } from "../data/physicsData";
import { motion } from "motion/react";
import { 
  User, 
  Settings, 
  Award, 
  Trash2, 
  LogOut, 
  Save, 
  GraduationCap, 
  Target, 
  BookOpen, 
  Hourglass,
  CheckCircle,
  Flame,
  Zap,
  Atom,
  Compass,
  Sparkles
} from "lucide-react";

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const BADGE_ICONS: Record<string, any> = {
  Flame: Flame,
  Sparkles: Sparkles,
  Zap: Zap,
  Atom: Atom,
  Compass: Compass,
  Award: Award
};

export default function ProfileView({ 
  userProfile, 
  onUpdateProfile, 
  onLogout, 
  onDeleteAccount 
}: ProfileViewProps) {
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [university, setUniversity] = useState(userProfile.university || "");
  const [course, setCourse] = useState(userProfile.course || "");
  const [semester, setSemester] = useState(userProfile.semester || "");
  const [targetExam, setTargetExam] = useState(userProfile.targetExamination || "");
  const [dailyGoal, setDailyGoal] = useState(userProfile.dailyStudyGoal || 2);
  const [weeklyGoal, setWeeklyGoal] = useState(userProfile.weeklyStudyGoal || 15);
  const [monthlyGoal, setMonthlyGoal] = useState(userProfile.monthlyGoal || "");
  const [avatar, setAvatar] = useState(userProfile.profilePicture || "Physicist_1");
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName,
      university,
      course,
      semester,
      targetExamination: targetExam,
      dailyStudyGoal: Number(dailyGoal),
      weeklyStudyGoal: Number(weeklyGoal),
      monthlyGoal,
      profilePicture: avatar
    });
    setIsEditing(false);
  };

  const AVATARS = [
    { id: "Physicist_1", label: "Dirac Black", bg: "bg-slate-900 border-indigo-500/30 text-indigo-400" },
    { id: "Physicist_2", label: "Schrödinger Cat Blue", bg: "bg-blue-950 border-blue-500/30 text-blue-400" },
    { id: "Physicist_3", label: "Feynman Orange", bg: "bg-orange-950 border-orange-500/30 text-orange-400" },
    { id: "Physicist_4", label: "Einstein Violet", bg: "bg-violet-950 border-violet-500/30 text-violet-400" }
  ];

  const currentAvatar = AVATARS.find(a => a.id === avatar) || AVATARS[0];

  return (
    <div className="space-y-6" id="profile_view">
      <div>
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-display">Researcher Profile</span>
        <h2 className="text-xl font-semibold text-white tracking-tight mt-1 flex items-center gap-2 font-display" id="profile_title">
          Settings & Milestone Targets
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="profile_layout_grid">
        {/* Left Column: Profile Card + Badges */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Info Card */}
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl text-center space-y-4">
            <div className="flex justify-center">
              <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center ${currentAvatar.bg} text-2xl font-extrabold shadow-lg shadow-indigo-500/5`}>
                {fullName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-100">{fullName}</h3>
              <p className="text-xs text-indigo-400 mt-0.5 font-mono">{userProfile.email}</p>
              <p className="text-[10px] text-slate-500 mt-2">Researcher registered: {new Date(userProfile.joinDate).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-left">
              <div className="bg-[#0F0F12] border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Streak</span>
                <span className="text-sm font-semibold text-white mt-1 block">{userProfile.studyStreak || 0} Days</span>
              </div>
              <div className="bg-[#0F0F12] border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Total Hours</span>
                <span className="text-sm font-semibold text-white mt-1 block font-mono">{userProfile.totalStudyHours || 0} hrs</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full bg-[#0F0F12] hover:bg-white/5 border border-white/5 text-slate-200 font-medium py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" /> {isEditing ? "Cancel Edit" : "Configure Targets"}
            </button>
          </div>

          {/* Achievement Badges Card */}
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> Scientific Achievements
            </h3>

            <div className="grid grid-cols-2 gap-3" id="badges_grid">
              {ACHIEVEMENT_BADGES.map((badge) => {
                // Determine if badge is unlocked
                let isUnlocked = false;
                if (badge.id === "streak_3" && userProfile.studyStreak >= 3) isUnlocked = true;
                if (badge.id === "streak_7" && userProfile.studyStreak >= 7) isUnlocked = true;
                if (badge.id === "hours_10" && userProfile.totalStudyHours >= 10) isUnlocked = true;
                if (badge.id === "hours_50" && userProfile.totalStudyHours >= 50) isUnlocked = true;
                if (badge.id === "subjects_3" && userProfile.totalStudyHours >= 2) isUnlocked = true; // simplified threshold
                if (badge.id === "subjects_all" && userProfile.totalStudyHours >= 8) isUnlocked = true; // simplified threshold

                const IconComponent = BADGE_ICONS[badge.iconName] || Award;

                return (
                  <div 
                    key={badge.id}
                    className={`p-3.5 border rounded-2xl text-center space-y-2 transition-all ${
                      isUnlocked 
                        ? "bg-indigo-950/10 border-indigo-500/15 text-indigo-400" 
                        : "bg-[#0F0F12]/30 border-white/5 text-slate-600 opacity-60"
                    }`}
                    id={`badge_${badge.id}`}
                  >
                    <div className="flex justify-center">
                      <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-indigo-500/10 border-indigo-500/15' : 'bg-white/5 border-white/5'} border`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-300 truncate leading-snug">{badge.name}</h4>
                      <p className="text-[8px] text-slate-500 mt-0.5 leading-normal truncate">{badge.requirementText}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile or Details display */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#121216] border border-white/5 p-6 rounded-3xl"
              id="edit_profile_form_container"
            >
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" /> Edit Research Targets
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">University / Institute</label>
                    <input 
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. Oxford, MIT"
                      className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Degree / Course</label>
                    <input 
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. BS in Theoretical Physics"
                      className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Semester / Year</label>
                    <input 
                      type="text"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      placeholder="e.g. 3rd Semester, Postdoc"
                      className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Examination</label>
                    <input 
                      type="text"
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value)}
                      placeholder="e.g. Physics GRE, Joint Entrance, PhD Qualifier"
                      className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Profile Avatar Theme</label>
                    <select 
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    >
                      {AVATARS.map(av => (
                        <option key={av.id} value={av.id}>{av.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Daily Goal (Hours)</label>
                    <input 
                      type="number"
                      min="1"
                      max="24"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(Number(e.target.value))}
                      className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Weekly Goal (Hours)</label>
                    <input 
                      type="number"
                      min="1"
                      max="168"
                      value={weeklyGoal}
                      onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                      className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Monthly Focus Goal</label>
                  <textarea 
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(e.target.value)}
                    placeholder="e.g. Master the standard model formulation and solve 10 astrophysics problem sheets."
                    className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none h-20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <Save className="w-4 h-4" /> Save Targets & Sync Database
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Targets Summary Pane */}
              <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" /> Active Milestones
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Institution & course</span>
                      <p className="text-xs text-slate-200 font-bold mt-0.5">{university || "Not set"} • {course || "Not set"}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center gap-3">
                    <Target className="w-5 h-5 text-red-400" />
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Target Examination</span>
                      <p className="text-xs text-slate-200 font-bold mt-0.5">{targetExam || "Physics Competitions"}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center gap-3">
                    <Hourglass className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Daily Goal Target</span>
                      <p className="text-xs text-slate-200 font-bold mt-0.5">{dailyGoal} Hours of Focus</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-yellow-400" />
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Monthly Objective</span>
                      <p className="text-xs text-slate-200 font-bold mt-0.5 truncate max-w-xs">{monthlyGoal || "Exhaustive syllabus review"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Settings / Account deletion */}
              <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" /> Security & Account
                </h3>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onLogout}
                    className="flex-1 bg-[#0F0F12] hover:bg-white/5 border border-white/5 text-slate-300 hover:text-white font-medium py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>

                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex-1 bg-red-950/20 hover:bg-red-950/30 border border-red-900/30 text-red-400 hover:text-red-300 font-medium py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                </div>

                {showConfirmDelete && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-950/15 border border-red-500/20 rounded-2xl space-y-3"
                    id="confirm_delete_box"
                  >
                    <p className="text-xs text-red-300 font-semibold leading-relaxed">
                      Are you absolutely sure you want to delete your Physics Core account? This action is irreversible and will permanently wipe your profiles, study history, and completed subtopics from our cloud database.
                    </p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowConfirmDelete(false)}
                        className="flex-1 bg-slate-950 border border-slate-850 text-xs text-slate-400 hover:text-white font-bold py-2 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={onDeleteAccount}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-xs text-white font-bold py-2 rounded-lg cursor-pointer"
                      >
                        Yes, Wipe Account
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

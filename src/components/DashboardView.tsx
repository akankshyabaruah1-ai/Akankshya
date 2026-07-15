import { useState, useEffect, FormEvent } from "react";
import { UserProfile, SubjectProgress, StudySession } from "../types";
import { fetchMotivationQuote, fetchAIRecommendations } from "../lib/api";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  Play,
  RotateCw,
  Plus,
  BookOpen
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";

interface DashboardViewProps {
  userProfile: UserProfile;
  subjectProgress: Record<string, SubjectProgress>;
  studySessions: StudySession[];
  onAddSession: (subjectId: string, durationMinutes: number, notes?: string) => void;
}

export default function DashboardView({ 
  userProfile, 
  subjectProgress, 
  studySessions,
  onAddSession
}: DashboardViewProps) {
  const [quote, setQuote] = useState("Nature hides her secrets in the harmony of her equations.");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [advice, setAdvice] = useState<string[]>([]);
  const [adviceLoading, setAdviceLoading] = useState(false);
  
  // Quick Log Session Form
  const [showLogModal, setShowLogModal] = useState(false);
  const [logSubject, setLogSubject] = useState("mathematical_physics");
  const [logDuration, setLogDuration] = useState(45);
  const [logNotes, setLogNotes] = useState("");

  const handleFetchQuote = async () => {
    setQuoteLoading(true);
    const text = await fetchMotivationQuote(
      userProfile.targetExamination || "Higher Physics",
      userProfile.monthlyGoal || "Mastery of physical principles",
      userProfile.fullName
    );
    setQuote(text);
    setQuoteLoading(false);
  };

  const handleFetchAdvice = async () => {
    setAdviceLoading(true);
    const items = await fetchAIRecommendations(
      Object.values(subjectProgress).map(p => ({
        name: p.subjectId,
        completedCount: p.completedSubtopics.length,
        totalCount: 10 // estimation
      })),
      userProfile.targetExamination || "Graduate Physics",
      userProfile.university || "Self-Study"
    );
    setAdvice(items);
    setAdviceLoading(false);
  };

  useEffect(() => {
    handleFetchQuote();
    handleFetchAdvice();
  }, []);

  // Calculate stats
  const totalSubtopicsCompleted = Object.values(subjectProgress).reduce(
    (sum, p) => sum + p.completedSubtopics.length, 0
  );
  const totalSubtopicsPossible = 16 * 10; // 16 subjects, avg 10 subtopics
  const overallPercentage = totalSubtopicsPossible > 0 
    ? Math.round((totalSubtopicsCompleted / totalSubtopicsPossible) * 100) 
    : 0;

  // Study hours this week (last 7 days)
  const last7DaysSessions = studySessions.filter(s => {
    const sessionDate = new Date(s.date);
    const diffTime = Math.abs(new Date().getTime() - sessionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  const weeklyHours = Math.round(
    (last7DaysSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60) * 10
  ) / 10;

  // Chart Data preparation (Last 7 days)
  const getChartData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = days[d.getDay()];
      
      const sessionsForDay = studySessions.filter(s => s.date === dateStr);
      const hours = Math.round((sessionsForDay.reduce((sum, s) => sum + s.durationMinutes, 0) / 60) * 10) / 10;
      
      result.push({
        name: dayName,
        Hours: hours,
      });
    }
    return result;
  };

  const chartData = getChartData();

  const handleQuickLog = (e: FormEvent) => {
    e.preventDefault();
    onAddSession(logSubject, Number(logDuration), logNotes);
    setShowLogModal(false);
    setLogNotes("");
  };

  return (
    <div className="space-y-8" id="dashboard_view">
      {/* Top Banner / Welcome message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="welcome_section">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-display">Academic Status</span>
          <h2 className="text-xl font-semibold text-white tracking-tight mt-1 flex items-center gap-2 font-display">
            Workspace Overview
          </h2>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
          id="quick_log_btn"
        >
          <Plus className="w-4 h-4" /> Log Study Session
        </button>
      </div>

      {/* Hero Stats Section & Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="stats_bento">
        {/* Dynamic AI Study Insight Hero Box */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-transparent border border-indigo-500/15 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          <div className="relative z-10">
            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest font-display">AI Study Insight</span>
            <p className="text-lg mt-3 leading-snug font-light text-slate-200">
              You have completed <span className="font-semibold text-white">{totalSubtopicsCompleted} subtopics</span> across your syllabus. {userProfile.studyStreak > 1 ? `Keep up your ${userProfile.studyStreak}-day streak!` : "Try launching a smart focus block today."}
            </p>
          </div>
          <button 
            onClick={() => setShowLogModal(true)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-medium shadow-md shadow-indigo-500/20 transition-all w-fit z-10 cursor-pointer"
          >
            Start Session
          </button>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
        </div>

        {/* Overall Completion */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-white/5 flex flex-col justify-between min-h-[180px]">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Overall Completion</span>
          <div>
            <p className="text-4xl font-light mb-3 text-slate-100">{overallPercentage}<span className="text-lg opacity-50">%</span></p>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Study Hours / Week */}
        <div className="p-6 rounded-3xl bg-[#121216] border border-white/5 flex flex-col justify-between min-h-[180px]">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Study Hours / Week</span>
          <div>
            <p className="text-4xl font-light mb-1 text-slate-100">{weeklyHours}</p>
            <p className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              Goal: {userProfile.weeklyStudyGoal || 15} hrs
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard_main_layout">
        {/* Chart + Recent Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Study Activity Chart */}
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl" id="study_chart_container">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Study Intensity (Hours per Day)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f0f12", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="Hours" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Planner & Activity Logs */}
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl" id="recent_logs_container">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Recent Study Logs & Sessions
            </h3>
            
            {studySessions.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-xs font-medium">No study sessions logged yet. Record your first block today!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {studySessions.slice(-4).reverse().map((session, index) => (
                  <div key={session.id || index} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        {session.subjectId.replace(/_/g, " ")}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{session.notes || "Focus session block."}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block font-mono">{session.date}</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2.5 py-1 rounded-lg font-mono">
                      {session.durationMinutes} mins
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI-Powered Motivation + Recommendations Panels */}
        <div className="space-y-6">
          {/* AI Motivation Quote Card */}
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl relative overflow-hidden" id="motivation_quote_card">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Physics Epiphany
              </h3>
              <button 
                onClick={handleFetchQuote}
                disabled={quoteLoading}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Generate fresh quote"
              >
                <RotateCw className={`w-3.5 h-3.5 ${quoteLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {quoteLoading ? (
              <div className="space-y-2 py-4">
                <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-200 leading-relaxed italic whitespace-pre-line">
                "{quote}"
              </p>
            )}
          </div>

          {/* AI Study Recommendations */}
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl" id="ai_advice_card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-400" /> Academic Warnings & Tips
              </h3>
              <button 
                onClick={handleFetchAdvice}
                disabled={adviceLoading}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh recommendations"
              >
                <RotateCw className={`w-3.5 h-3.5 ${adviceLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {adviceLoading ? (
              <div className="space-y-3 py-2">
                <div className="h-10 bg-white/5 rounded animate-pulse w-full" />
                <div className="h-10 bg-white/5 rounded animate-pulse w-full" />
                <div className="h-10 bg-white/5 rounded animate-pulse w-full" />
              </div>
            ) : (
              <div className="space-y-3">
                {advice.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Study Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-55" id="log_session_modal">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0F0F12] border border-white/10 p-6 rounded-3xl shadow-2xl relative"
          >
            <h3 className="text-base font-semibold text-white mb-4 font-display">Log Study Session</h3>
            <form onSubmit={handleQuickLog} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                <select 
                  value={logSubject} 
                  onChange={(e) => setLogSubject(e.target.value)}
                  className="w-full bg-[#121216] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-sm text-slate-200 outline-none"
                >
                  <option value="mathematical_physics">Mathematical Physics</option>
                  <option value="classical_mechanics">Classical Mechanics</option>
                  <option value="electromagnetic_theory">Electromagnetic Theory</option>
                  <option value="thermodynamics">Thermodynamics</option>
                  <option value="statistical_mechanics">Statistical Mechanics</option>
                  <option value="quantum_mechanics">Quantum Mechanics</option>
                  <option value="solid_state_physics">Solid State Physics</option>
                  <option value="atomic_physics">Atomic Physics</option>
                  <option value="nuclear_physics">Nuclear Physics</option>
                  <option value="particle_physics">Particle Physics</option>
                  <option value="electronics">Electronics</option>
                  <option value="optics">Optics</option>
                  <option value="condensed_matter_physics">Condensed Matter Physics</option>
                  <option value="computational_physics">Computational Physics</option>
                  <option value="experimental_physics">Experimental Physics</option>
                  <option value="astrophysics">Astrophysics</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Duration (Minutes)</label>
                <input 
                  type="number" 
                  min="5" 
                  max="480" 
                  value={logDuration} 
                  onChange={(e) => setLogDuration(Number(e.target.value))}
                  className="w-full bg-[#121216] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-sm text-slate-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Study Notes / Topics Covered</label>
                <textarea 
                  value={logNotes} 
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="e.g. Mastered the derivation of Green's functions for electrostatic boundary value problems."
                  className="w-full bg-[#121216] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-sm text-slate-200 outline-none h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 border border-white/5 text-slate-400 hover:text-white py-3 rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-medium transition-all cursor-pointer font-bold"
                >
                  Save Log
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

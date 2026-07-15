import { useState, FormEvent } from "react";
import { PHYSICS_SUBJECTS } from "../data/physicsData";
import { SubjectProgress, PhysicsSubject } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Calendar, 
  BookOpen, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Award
} from "lucide-react";

interface SubjectsViewProps {
  subjectProgress: Record<string, SubjectProgress>;
  onToggleSubtopic: (subjectId: string, subtopicId: string) => void;
  onAddSession: (subjectId: string, durationMinutes: number, notes?: string) => void;
}

export default function SubjectsView({ 
  subjectProgress, 
  onToggleSubtopic,
  onAddSession
}: SubjectsViewProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [logHours, setLogHours] = useState<number>(30);
  const [logNotes, setLogNotes] = useState("");

  const handleToggleExpand = (subjectId: string) => {
    setSelectedSubjectId(selectedSubjectId === subjectId ? null : subjectId);
  };

  const handleLogSubjectSession = (e: FormEvent, subjectId: string) => {
    e.preventDefault();
    onAddSession(subjectId, logHours, logNotes);
    setLogNotes("");
  };

  return (
    <div className="space-y-6" id="subjects_view">
      <div>
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-display">Academic Curriculum</span>
        <h2 className="text-xl font-semibold text-white tracking-tight mt-1 flex items-center gap-2 font-display" id="subjects_title">
          Syllabus & Subtopics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="subjects_cards_grid">
        {PHYSICS_SUBJECTS.map((subject) => {
          const progress = subjectProgress[subject.id] || {
            subjectId: subject.id,
            completedSubtopics: [],
            studyHours: 0,
            consistencyScore: 0
          };

          const totalSubtopics = subject.subtopics.length;
          const completedCount = progress.completedSubtopics.length;
          const remainingCount = totalSubtopics - completedCount;
          const pct = Math.round((completedCount / totalSubtopics) * 100);
          const isExpanded = selectedSubjectId === subject.id;

          // Advanced calculations (Metrics)
          const consistency = progress.consistencyScore || Math.min(100, Math.round(completedCount * 12));
          const studyHoursVal = progress.studyHours || 0;
          
          // Estimate completion based on study hours/subtopics
          const estRemainingDays = remainingCount * 3; 
          const estDate = new Date();
          estDate.setDate(estDate.getDate() + estRemainingDays);
          const estDateString = remainingCount > 0 ? estDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Fully Completed";

          return (
            <motion.div
              layout
              key={subject.id}
              className={`bg-[#121216] border rounded-3xl overflow-hidden transition-all duration-300 ${
                isExpanded ? "border-indigo-500/30 shadow-2xl" : "border-white/5 hover:border-white/10"
              }`}
              id={`subject_card_${subject.id}`}
            >
              {/* Header block click to toggle */}
              <div 
                onClick={() => handleToggleExpand(subject.id)}
                className="p-6 cursor-pointer select-none flex items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">{subject.name}</h3>
                    {pct === 100 && (
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" /> Mastered
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-sm">{subject.description}</p>
                  
                  {/* Progress Line */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      <span>{completedCount}/{totalSubtopics} Topics Completed</span>
                      <span className="text-slate-300 font-extrabold">{pct}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  <div className="p-1.5 bg-white/5 rounded-lg text-slate-400 border border-white/5 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-md mt-auto font-mono">
                    {studyHoursVal} hrs study
                  </span>
                </div>
              </div>

              {/* Extended Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-white/5 bg-white/[0.01] p-6 space-y-6"
                    id={`subject_details_${subject.id}`}
                  >
                    {/* Key Subject Progress Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" id="subject_metrics_grid">
                      <div className="bg-[#0F0F12] p-4 border border-white/5 rounded-2xl">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Remaining Topics</span>
                        <span className="text-sm font-semibold text-slate-200 mt-0.5 block">{remainingCount}</span>
                      </div>
                      <div className="bg-[#0F0F12] p-4 border border-white/5 rounded-2xl">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Est. Completion</span>
                        <span className="text-xs font-semibold text-slate-200 mt-0.5 block truncate">{estDateString}</span>
                      </div>
                      <div className="bg-[#0F0F12] p-4 border border-white/5 rounded-2xl col-span-2 sm:col-span-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Consistency Score</span>
                        <span className="text-sm font-semibold text-slate-200 mt-0.5 block">{consistency}/100</span>
                      </div>
                    </div>

                    {/* Subtopic Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-indigo-400" /> Topic Completion Checklist
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                        {subject.subtopics.map((sub) => {
                          const isSubCompleted = progress.completedSubtopics.includes(sub.id);
                          return (
                            <button
                              key={sub.id}
                              onClick={() => onToggleSubtopic(subject.id, sub.id)}
                              className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                isSubCompleted 
                                  ? "bg-indigo-950/15 border-indigo-500/20 text-indigo-300" 
                                  : "bg-[#0F0F12]/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"
                              }`}
                            >
                              <span className="text-xs font-medium leading-normal truncate">{sub.name}</span>
                              {isSubCompleted ? (
                                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-700 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Log Form inside subject */}
                    <div className="p-5 bg-[#0F0F12] border border-white/5 rounded-2xl">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> Log Session for this Subject
                      </h4>
                      <form onSubmit={(e) => handleLogSubjectSession(e, subject.id)} className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-24">
                            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Minutes</label>
                            <input
                              type="number"
                              min="5"
                              value={logHours}
                              onChange={(e) => setLogHours(Number(e.target.value))}
                              className="w-full bg-[#121216] border border-white/5 focus:border-indigo-500/50 rounded-xl p-2.5 text-xs text-white outline-none"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Session notes</label>
                            <input
                              type="text"
                              value={logNotes}
                              onChange={(e) => setLogNotes(e.target.value)}
                              placeholder="e.g. Completed angular momentum commutation relations."
                              className="w-full bg-[#121216] border border-white/5 focus:border-indigo-500/50 rounded-xl p-2.5 text-xs text-white outline-none"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-xl text-xs transition-all cursor-pointer"
                        >
                          Log Session Block
                        </button>
                      </form>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect, FormEvent } from "react";
import { UserProfile, SubjectProgress } from "../types";
import { fetchAIRecommendations } from "../lib/api";
import { motion } from "motion/react";
import { 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Loader2, 
  Atom, 
  Lightbulb, 
  BookOpen, 
  Flame,
  BrainCircuit
} from "lucide-react";

interface AIAssistantViewProps {
  userProfile: UserProfile;
  subjectProgress: Record<string, SubjectProgress>;
}

export default function AIAssistantView({ userProfile, subjectProgress }: AIAssistantViewProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  
  // Custom query state
  const [query, setQuery] = useState("");
  const [subjectContext, setSubjectContext] = useState("Quantum Mechanics");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const getRecommendations = async () => {
    setRecLoading(true);
    const subjectsList = Object.values(subjectProgress).map(p => ({
      name: p.subjectId.replace(/_/g, " "),
      completedCount: p.completedSubtopics.length,
      totalCount: 10
    }));
    
    const items = await fetchAIRecommendations(
      subjectsList,
      userProfile.targetExamination || "Graduate Level Physics",
      userProfile.university || "Self-Study"
    );
    setRecommendations(items);
    setRecLoading(false);
  };

  useEffect(() => {
    getRecommendations();
  }, []);

  const handleQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setExplainLoading(true);
    setExplanation(null);
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: query, subject: subjectContext }),
      });
      if (!response.ok) throw new Error("Failed to generate response");
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err) {
      console.error(err);
      setExplanation("Apologies, the physical computational engine is temporarily resolving non-linear perturbations. Please submit your quantum query again shortly.");
    } finally {
      setExplainLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="ai_assistant_view">
      <div>
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-display">Cognitive Subsystem</span>
        <h2 className="text-xl font-semibold text-white tracking-tight mt-1 flex items-center gap-2 font-display">
          AI Study Companion
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Core Recommendations & Performance Review */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" /> Study Path Guidance
            </h3>

            {recLoading ? (
              <div className="space-y-3 py-4">
                <div className="h-10 bg-white/5 rounded animate-pulse" />
                <div className="h-10 bg-white/5 rounded animate-pulse" />
                <div className="h-10 bg-white/5 rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-[#0F0F12] border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {rec}
                    </p>
                  </div>
                ))}

                <button 
                  onClick={getRecommendations}
                  className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 font-semibold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Re-Model Preparation Path
                </button>
              </div>
            )}
          </div>

          {/* Quick reference guide */}
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Scientific Core Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Physics Core synthesizes progress matrices from all 16 subjects. Completed topics automatically feed into our neural weights to model custom exam estimates and target study vectors.
            </p>
          </div>
        </div>

        {/* Right Col: Interactive Quantum Query Field */}
        <div className="lg:col-span-2">
          <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl space-y-6" id="quantum_query_container">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Atom className="w-4 h-4 text-indigo-400 animate-spin-slow" /> Interactive Quantum Query
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter any complex physical theorem or formula. Receive elegant physical intuition, derivation details, and application matrices.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleQuerySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject Context</label>
                  <select 
                    value={subjectContext}
                    onChange={(e) => setSubjectContext(e.target.value)}
                    className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none"
                  >
                    <option value="Quantum Mechanics">Quantum Mechanics</option>
                    <option value="Classical Mechanics">Classical Mechanics</option>
                    <option value="Electrodynamics">Electrodynamics</option>
                    <option value="Statistical Physics">Statistical Physics</option>
                    <option value="Mathematical Methods">Mathematical Methods</option>
                    <option value="Nuclear & Particle">Nuclear & Particle</option>
                    <option value="Condensed Matter">Condensed Matter</option>
                    <option value="Astrophysics">Astrophysics</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Concept to Explain</label>
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Green's functions, Schrödinger wavefunction collapse, Carnot cycle"
                    className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-slate-200 outline-none placeholder-slate-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={explainLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                {explainLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Solving Schrödinger Wave equation...
                  </>
                ) : (
                  <>
                    Derive Physical Intuition <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Explanation Result Output */}
            {explanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-[#0F0F12] border border-white/5 rounded-2xl space-y-3.5"
                id="explanation_output"
              >
                <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                  <div className="p-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concept Resolution</h4>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                  {explanation}
                </div>
              </motion.div>
            )}

            {/* Default State Placeholder */}
            {!explanation && !explainLoading && (
              <div className="p-8 text-center border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center">
                <HelpCircle className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-slate-500 text-xs font-medium">No active queries. Pose your physics query above to begin mathematical synthesis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

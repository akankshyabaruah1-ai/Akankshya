import React, { useState } from "react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import { motion } from "motion/react";
import { 
  Atom, 
  Mail, 
  Lock, 
  User, 
  Chrome, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  GraduationCap
} from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (isResettingPassword) {
      if (!email) {
        setError("Please enter your email to reset password.");
        setLoading(false);
        return;
      }
      try {
        await sendPasswordResetEmail(auth, email);
        setSuccess("Password reset email sent! Check your inbox.");
        setIsResettingPassword(false);
      } catch (err: any) {
        setError(err.message || "Failed to send reset email.");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      if (isSignUp) {
        if (!fullName) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        onAuthSuccess(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuthSuccess(result.user);
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-blocked") {
        setError("Google Pop-up was blocked. Please enable pop-ups in your browser or try logging in with Email & Password.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-4 relative overflow-hidden" id="auth_container">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />
      
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-[#121216] border border-white/5 p-8 rounded-3xl shadow-2xl relative z-10"
        id="auth_card"
      >
        {/* App Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/15 text-indigo-400 mb-4 shadow-inner" id="logo_frame">
            <Atom className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest block mb-1 font-display">Syllabus Engine</span>
          <h1 className="text-xl font-semibold tracking-tight text-white font-display" id="app_title">
            Physics Planner Pro
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Master higher-level physics with adaptive AI guidance
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-start gap-3"
            id="error_box"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs flex items-start gap-3"
            id="success_box"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{success}</span>
          </motion.div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4" id="auth_form">
          {isSignUp && !isResettingPassword && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 text-xs text-white pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-200 font-medium placeholder-slate-600"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
              <input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 text-xs text-white pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-200 font-medium placeholder-slate-600"
                required
              />
            </div>
          </div>

          {!isResettingPassword && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsResettingPassword(true)}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F0F12] border border-white/5 focus:border-indigo-500/50 text-xs text-white pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-200 font-medium placeholder-slate-600"
                  required={!isResettingPassword}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
            id="auth_submit_btn"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isResettingPassword ? (
              "Send Reset Link"
            ) : isSignUp ? (
              <>
                Create Account <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* OAuth / Google Login */}
        {!isResettingPassword && (
          <>
            <div className="relative my-6 flex items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-[#0F0F12] hover:bg-white/5 border border-white/5 text-slate-200 font-medium py-3 px-4 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
              id="google_auth_btn"
            >
              <Chrome className="w-4 h-4 text-indigo-400" />
              Sign in with Google
            </button>
          </>
        )}

        {/* Switch mode */}
        <div className="text-center mt-6">
          {isResettingPassword ? (
            <button
              onClick={() => setIsResettingPassword(false)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
              id="switch_auth_mode"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

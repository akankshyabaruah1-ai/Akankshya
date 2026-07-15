import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper for generating custom physics quotes
app.post("/api/motivation", async (req, res) => {
  try {
    const { subject, goal, name } = req.body;
    const prompt = `Write a premium, short, deep, and intellectually inspiring motivation quote for a higher-level physics student named ${name || 'Researcher'}.
Focus on the beauty of the subject "${subject || 'Higher Physics'}" and matching their study goal of "${goal || 'becoming a physicist'}".
Keep it elegant, philosophical, and professional. It should sound like a quote from an accomplished physicist (like Feynman, Einstein, or Dirac) but original. Max 35 words. Return ONLY the quote text, optionally with an elegant author-like signature on a new line (e.g. "- Physics Core Engine" or a famous physicist flavor, but keeping it original).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const quoteText = response.text || "Nature hides her secrets in the harmony of her equations.";
    res.json({ quote: quoteText.trim() });
  } catch (error: any) {
    console.error("Gemini motivation generation error:", error);
    res.json({ quote: "Equilibrium is not static; it is a dynamic balance of forces waiting to be mastered.\n- Classical Mechanics" });
  }
});

// Helper for study advice
app.post("/api/recommendations", async (req, res) => {
  try {
    const { subjects, targetExam, university } = req.body;
    
    // subjects is a list of subject names and their completion rates
    const prompt = `You are an elite academic advisor in higher-level physics. 
Based on the student's background:
- Target Exam: ${targetExam || 'Graduate Physics Exams'}
- University/College: ${university || 'Self-Study'}
- Current Subjects under study: ${JSON.stringify(subjects || [])}

Provide exactly 3 premium, highly actionable, laser-focused academic recommendations or study warnings.
Each recommendation should:
1. Be short and direct (1-2 sentences).
2. Reference connections between subjects (e.g., "To excel in Quantum Mechanics, reinforce your Solid State foundation or review Linear Algebra in Mathematical Physics").
3. Give technical, specific physics tips (e.g., "Pay close attention to Hermiticity of operators when solving the infinite square well").

Return the result strictly as a JSON array of strings:
[
  "Recommendation 1",
  "Recommendation 2",
  "Recommendation 3"
]
Do not wrap it in markdown code blocks. Just return the JSON array string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let text = response.text || "[]";
    // clean markdown code blocks if any
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const recommendations = JSON.parse(text);
      res.json({ recommendations });
    } catch {
      // fallback
      res.json({
        recommendations: [
          "Cross-reference Quantum Mechanics Operators with Linear Algebra to build a rigorous foundation for Hilbert Space formulations.",
          "Ensure you master Maxwell's Equations and Vector Calculus before moving deeply into Electrodynamics and Wave Propagation.",
          "Connect Statistical Mechanics partition functions to Thermodynamic potentials to easily derive entropy and free energy relations."
        ]
      });
    }
  } catch (error: any) {
    console.error("Gemini recommendations error:", error);
    res.json({
      recommendations: [
        "Cross-reference Quantum Mechanics Operators with Linear Algebra to build a rigorous foundation for Hilbert Space formulations.",
        "Ensure you master Maxwell's Equations and Vector Calculus before moving deeply into Electrodynamics and Wave Propagation.",
        "Connect Statistical Mechanics partition functions to Thermodynamic potentials to easily derive entropy and free energy relations."
      ]
    });
  }
});

// Endpoint to explain physical concepts
app.post("/api/explain", async (req, res) => {
  try {
    const { concept, subject } = req.body;
    const prompt = `You are an elite, Nobel-prize winning physicist who explains complex higher-level physics in a clear, deep, intuitive, and highly elegant manner.
Explain the following concept: "${concept}"
Within the context of the subject: "${subject || 'Higher Physics'}"

Requirements:
1. Provide a beautiful physical intuition first (why do we care, what is the geometric/physical meaning).
2. Detail the crucial mathematical formulation elegantly (write clean explanation of equations using text).
3. Connect it to a real-world application or modern research context (e.g. quantum computing, semiconductors, cosmology, particle colliders).
4. Keep the output clean, readable, professional, and well-structured. Keep it around 150-250 words total. Do not use complex latex block notations that won't render, keep standard symbols clean.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ explanation: response.text || "Failed to generate explanation. Please try again." });
  } catch (error: any) {
    console.error("Gemini explain concept error:", error);
    res.status(500).json({ error: "Failed to connect to the physical calculation engine." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Physics Core Server running on port ${PORT}`);
  });
}

startServer();

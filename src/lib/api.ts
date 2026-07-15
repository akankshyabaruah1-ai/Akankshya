export async function fetchMotivationQuote(subject: string, goal: string, name: string): Promise<string> {
  try {
    const response = await fetch("/api/motivation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, goal, name }),
    });
    if (!response.ok) throw new Error("Failed to fetch motivation");
    const data = await response.json();
    return data.quote;
  } catch (err) {
    console.error("fetchMotivationQuote error:", err);
    return "In physics, the secrets of the cosmos are unlocked not by casual observers, but by those who dare to master the underlying mathematical harmonies.\n- Physics Core Engine";
  }
}

export async function fetchAIRecommendations(
  subjects: { name: string; completedCount: number; totalCount: number }[],
  targetExam: string,
  university: string
): Promise<string[]> {
  try {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjects, targetExam, university }),
    });
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    const data = await response.json();
    return data.recommendations;
  } catch (err) {
    console.error("fetchAIRecommendations error:", err);
    return [
      "Focus on building solid Vector Analysis foundations before diving deep into Electromagnetic waves.",
      "Ensure operators and eigenvalue equations are thoroughly understood in Mathematical Physics to ease your transition into Quantum Mechanics.",
      "Derive Thermodynamic potentials sequentially; remembering Maxwell's relations will save you valuable time during examinations."
    ];
  }
}

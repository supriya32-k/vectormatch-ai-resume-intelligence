import { AnalysisResult } from "../types";

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const response = await fetch("/api/analyze-resume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeText, jobDescription }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
};

export const generateJobDescription = async (title: string, company: string, requirements: string): Promise<string> => {
  const response = await fetch("/api/generate-job-description", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, company, requirements }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.text || "Failed to generate job description.";
};

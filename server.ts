import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { MongoClient, Db } from "mongodb";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: "10mb" }));

  // MongoDB state and lazily initialized client
  let mongoClient: MongoClient | null = null;
  let dbInstance: Db | null = null;

  async function getDb(): Promise<Db | null> {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return null; // Gracefully fall back to local file-based DB
    }
    try {
      if (!dbInstance) {
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        dbInstance = mongoClient.db("vectormatch");
        console.log("Successfully connected to MongoDB database 'vectormatch'!");
      }
      return dbInstance;
    } catch (err) {
      console.error("Failed to connect to MongoDB, falling back to local database:", err);
      return null;
    }
  }

  // Local JSON database fallback
  const LOCAL_DB_PATH = path.join(process.cwd(), "db.json");

  interface LocalDb {
    users: any[];
    history: any[];
  }

  async function getLocalData(): Promise<LocalDb> {
    try {
      const content = await fs.readFile(LOCAL_DB_PATH, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      return { users: [], history: [] };
    }
  }

  async function saveLocalData(data: LocalDb): Promise<void> {
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  }

  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not defined. Please set it in Settings > Secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // Database and Auth API Endpoints

  app.get("/api/users", async (req, res) => {
    try {
      const db = await getDb();
      if (db) {
        const users = await db.collection("users").find({}).toArray();
        res.json(users);
      } else {
        const data = await getLocalData();
        res.json(data.users);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
  });

  app.post("/api/db/seed", async (req, res) => {
    try {
      const seeds = [
        { 
          id: 'u1', 
          name: 'Sarah Chen', 
          email: 'sarah.c@vectormatch.ai', 
          password: 'password', 
          role: 'Lead Talent Partner',
          bio: 'Ex-Google recruiter specializing in L6+ technical hires and engineering leadership sourcing.',
          stats: { scans: 142, accuracy: 94 },
          joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 30 
        },
        { 
          id: 'u2', 
          name: 'Marcus Wright', 
          email: 'm.wright@vectormatch.ai', 
          password: 'password', 
          role: 'Technical Analyst',
          bio: 'Deep expertise in NLP and semantic search applied to high-volume recruitment pipelines.',
          stats: { scans: 89, accuracy: 91 },
          joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 15
        },
        { 
          id: 'u3', 
          name: 'Elena Rodriguez', 
          email: 'elena.r@vectormatch.ai', 
          password: 'password', 
          role: 'Executive Recruiter',
          bio: 'Focused on C-suite placements and architectural talent for high-growth FinTech startups.',
          stats: { scans: 56, accuracy: 98 },
          joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 60
        }
      ];

      const db = await getDb();
      if (db) {
        const accountsCollection = db.collection("users");
        const count = await accountsCollection.countDocuments();
        if (count === 0) {
          await accountsCollection.insertMany(seeds);
        }
        const users = await accountsCollection.find({}).toArray();
        res.json(users);
      } else {
        const data = await getLocalData();
        if (data.users.length === 0) {
          data.users = seeds;
          await saveLocalData(data);
        }
        res.json(data.users);
      }
    } catch (error: any) {
      console.error("Error seeding database:", error);
      res.status(500).json({ error: error.message || "Failed to seed database" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Missing email or password" });
        return;
      }

      const db = await getDb();
      let existingUser: any = null;

      if (db) {
        existingUser = await db.collection("users").findOne({ email });
      } else {
        const data = await getLocalData();
        existingUser = data.users.find(u => u.email === email);
      }

      if (existingUser && existingUser.password === password) {
        res.json({
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          token: 'session-' + Math.random().toString(36).substring(2)
        });
        return;
      }

      res.status(401).json({ error: "Invalid credentials" });
    } catch (error: any) {
      console.error("Error signing in:", error);
      res.status(500).json({ error: error.message || "Sign in failed" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ error: "Missing name, email, or password" });
        return;
      }

      const newUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 11),
        name,
        email,
        password,
        role: 'Candidate Auditor',
        bio: 'Professional recruiter using AI to optimize talent selection and skill mapping.',
        stats: { scans: 0, accuracy: 0 },
        joinedAt: Date.now()
      };

      const db = await getDb();
      if (db) {
        const existing = await db.collection("users").findOne({ email });
        if (existing) {
          res.status(400).json({ error: "Email is already registered" });
          return;
        }
        await db.collection("users").insertOne(newUser);
      } else {
        const data = await getLocalData();
        const existing = data.users.find(u => u.email === email);
        if (existing) {
          res.status(400).json({ error: "Email is already registered" });
          return;
        }
        data.users.push(newUser);
        await saveLocalData(data);
      }

      res.json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token: 'session-' + Math.random().toString(36).substring(2)
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      res.status(500).json({ error: error.message || "Sign up failed" });
    }
  });

  app.get("/api/history", async (req, res) => {
    try {
      const db = await getDb();
      if (db) {
        const history = await db.collection("history").find({}).sort({ timestamp: -1 }).toArray();
        res.json(history);
      } else {
        const data = await getLocalData();
        const sorted = [...data.history].sort((a, b) => b.timestamp - a.timestamp);
        res.json(sorted);
      }
    } catch (error: any) {
      console.error("Error fetching history:", error);
      res.status(500).json({ error: error.message || "Failed to fetch history" });
    }
  });

  app.post("/api/history", async (req, res) => {
    try {
      const { fileName, jobTitle, result } = req.body;
      if (!fileName || !result) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const entry = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: Date.now(),
        fileName,
        jobTitle: jobTitle || result.jobTitleMatch || "Candidate Audit",
        matchPercentage: result.matchPercentage,
        result
      };

      const db = await getDb();
      if (db) {
        await db.collection("history").insertOne(entry);
        try {
          await db.collection("resume").insertOne(entry);
        } catch (e) {
          console.error("Failed to insert into resume collection, skipping:", e);
        }
      } else {
        const data = await getLocalData();
        data.history.unshift(entry);
        await saveLocalData(data);
      }

      res.json(entry);
    } catch (error: any) {
      console.error("Error saving history:", error);
      res.status(500).json({ error: error.message || "Failed to save analysis" });
    }
  });

  app.delete("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Missing id" });
        return;
      }

      const db = await getDb();
      if (db) {
        await db.collection("history").deleteOne({ id });
        try {
          await db.collection("resume").deleteOne({ id });
        } catch (e) {
          console.error("Failed to delete from resume collection, skipping:", e);
        }
      } else {
        const data = await getLocalData();
        data.history = data.history.filter(item => item.id !== id);
        await saveLocalData(data);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting history entry:", error);
      res.status(500).json({ error: error.message || "Failed to delete entry" });
    }
  });

  // API endpoints
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { resumeText, jobDescription } = req.body;
      if (!resumeText || !jobDescription) {
        res.status(400).json({ error: "Missing resumeText or jobDescription" });
        return;
      }

      const ai = getAiClient();
      const model = "gemini-3.1-flash-lite";
      const prompt = `
        Analyze the following resume text against the provided job description.
        Focus on technical skills, experience levels, and overall suitability.
        Additionally, generate 3 technical and 2 behavioral interview questions tailored to this specific match.
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        RESUME TEXT:
        ${resumeText}
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchPercentage: { type: Type.NUMBER },
              jobTitleMatch: { type: Type.STRING },
              topSkillsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingCriticalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experienceMatch: { type: Type.STRING },
              overallSummary: { type: Type.STRING },
              actionableRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedBulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              interviewPrep: {
                type: Type.OBJECT,
                properties: {
                  technicalQuestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING },
                        targetAnswer: { type: Type.STRING }
                      },
                      required: ["question", "targetAnswer"]
                    }
                  },
                  behavioralQuestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING },
                        strategy: { type: Type.STRING }
                      },
                      required: ["question", "strategy"]
                    }
                  }
                },
                required: ["technicalQuestions", "behavioralQuestions"]
              }
            },
            required: [
              "matchPercentage", 
              "jobTitleMatch", 
              "topSkillsFound", 
              "missingCriticalSkills", 
              "experienceMatch", 
              "overallSummary", 
              "actionableRecommendations", 
              "suggestedBulletPoints",
              "interviewPrep"
            ]
          }
        }
      });

      if (!response.text) {
        throw new Error("Failed to get analysis from Gemini.");
      }

      const parsed = JSON.parse(response.text.trim());
      res.json(parsed);
    } catch (error: any) {
      console.error("Error during resume analysis:", error);
      res.status(500).json({ error: error.message || "An error occurred during resume analysis." });
    }
  });

  app.post("/api/generate-job-description", async (req, res) => {
    try {
      const { title, company, requirements } = req.body;
      if (!title || !requirements) {
        res.status(400).json({ error: "Missing title or requirements" });
        return;
      }

      const ai = getAiClient();
      const model = "gemini-3.1-flash-lite";
      const prompt = `Create a professional, modern job description for the following role:
        Title: ${title}
        Company: ${company || "VectorMatch AI"}
        Key Requirements: ${requirements}
        
        Format it with clear sections: About the Role, Responsibilities, and Requirements. Use a professional tone.`;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      const text = response.text || "Failed to generate job description.";
      res.json({ text });
    } catch (error: any) {
      console.error("Error during job description generation:", error);
      res.status(500).json({ error: error.message || "An error occurred during job description generation." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

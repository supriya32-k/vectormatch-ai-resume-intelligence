
import { SavedAnalysis, AnalysisResult, User } from '../types';

const STORAGE_KEYS = {
  USER: 'vm_auth_user',
};

export const seedDatabase = async (): Promise<any[]> => {
  try {
    const response = await fetch("/api/db/seed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error("Failed to seed database.");
    }
    return response.json();
  } catch (err) {
    console.error("Error seeding database:", err);
    return [];
  }
};

export const clearDatabase = async (): Promise<void> => {
  // Keeping session logout-only, no destructive operations on shared DB
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Access denied.");
  }

  const user = await response.json();
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create account.");
  }

  const user = await response.json();
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
};

export const getAllUsers = async (): Promise<any[]> => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users.");
  }
  return response.json();
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const saveAnalysis = async (fileName: string, jobTitle: string, result: AnalysisResult): Promise<SavedAnalysis> => {
  const response = await fetch("/api/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName, jobTitle, result }),
  });

  if (!response.ok) {
    throw new Error("Failed to save report.");
  }

  return response.json();
};

export const getAllHistory = async (): Promise<SavedAnalysis[]> => {
  const response = await fetch("/api/history");
  if (!response.ok) {
    throw new Error("Failed to fetch history.");
  }
  return response.json();
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  const response = await fetch(`/api/history/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete report.");
  }
};

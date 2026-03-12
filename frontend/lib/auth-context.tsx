"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "teacher" | "student" | "parent" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simple validation - in real app, this would hit a backend
      if (!email || !password || !role) {
        throw new Error("Please provide email, password, and role");
      }

      // Mock user data based on role
      const mockUsers: Record<string, User> = {
        admin: {
          id: "admin-1",
          name: "Admin User",
          email: "admin@school.com",
          role: "admin",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        },
        teacher: {
          id: "teacher-1",
          name: "Dr. Ramesh Sharma",
          email: "ramesh.sharma@school.com",
          role: "teacher",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh",
        },
        student: {
          id: "student-1",
          name: "Aarav Kumar",
          email: "aarav@school.com",
          role: "student",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aarav",
        },
        parent: {
          id: "parent-1",
          name: "Rajesh Kumar",
          email: "parent@school.com",
          role: "parent",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh",
        },
      };

      const mockUser = mockUsers[role] || mockUsers["admin"];

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

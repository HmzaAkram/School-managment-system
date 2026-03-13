'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthorized: boolean;
  userRole: 'admin' | 'teacher' | 'student' | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthorized: false,
  userRole: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ isAuthorized: true, userRole: null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

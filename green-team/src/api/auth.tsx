"use client"

// auth.tsx (ou onde você configura o contexto de autenticação)

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "./firebaseConfig";

type User = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  // Adicione outros campos de usuário conforme necessário
};

type AuthContextType = {
  user: User | null;
  // Adicione outras funções ou informações de autenticação aqui, se necessário
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const user: User = {
          uid: authUser.uid,
          displayName: authUser.displayName || null,
          email: authUser.email || null,
          // Adicione outros campos de usuário conforme necessário
        };
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    // Adicione outras funções ou informações de autenticação aqui, se necessário
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return context;
}

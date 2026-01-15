import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ServerConfig, AuthState } from '../types';
import { navidromeAPI } from '../services/navidrome/api';
import { saveServerConfig, loadServerConfig, clearServerConfig } from '../utils/storage';

interface AuthContextType {
  authState: AuthState;
  login: (config: ServerConfig) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    serverConfig: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const config = loadServerConfig();
      if (config) {
        navidromeAPI.setServerConfig(config);
        const isValid = await navidromeAPI.ping();
        if (isValid) {
          setAuthState({
            isAuthenticated: true,
            serverConfig: config
          });
        } else {
          clearServerConfig();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (config: ServerConfig): Promise<boolean> => {
    try {
      navidromeAPI.setServerConfig(config);
      const isValid = await navidromeAPI.ping();

      if (isValid) {
        saveServerConfig(config);
        setAuthState({
          isAuthenticated: true,
          serverConfig: config
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    clearServerConfig();
    setAuthState({
      isAuthenticated: false,
      serverConfig: null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

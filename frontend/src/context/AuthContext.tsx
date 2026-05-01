import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'Admin' | 'Member') => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      console.log('AuthContext: Initializing auth...');
      if (authService.isAuthenticated() && isMounted) {
        try {
          console.log('AuthContext: Getting profile...');
          const response = await authService.getProfile();
          if (isMounted) {
            if (response.success) {
              console.log('AuthContext: Profile loaded successfully');
              dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
            } else {
              console.log('AuthContext: Profile load failed');
              dispatch({ type: 'LOGOUT' });
            }
          }
        } catch (error) {
          console.log('AuthContext: Profile load error', error);
          if (isMounted) {
            dispatch({ type: 'LOGOUT' });
          }
        }
      } else if (isMounted) {
        console.log('AuthContext: Not authenticated');
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.message });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  const register = async (name: string, email: string, password: string, role?: 'Admin' | 'Member') => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.register({ name, email, password, role });
      if (response.success) {
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.message });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

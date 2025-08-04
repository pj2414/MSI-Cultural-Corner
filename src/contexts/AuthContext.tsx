import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { apiService, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, type: 'admin' | 'society') => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = apiService.getToken();
      const rawUser = localStorage.getItem('user');

      if (!token || !rawUser) {
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser: User = JSON.parse(rawUser);
        if (parsedUser.role === 'society') {
          await apiService.getSocietyProfile(); // validate token
        } else if (parsedUser.role === 'admin') {
          await apiService.getAllSocieties(); // a safe admin-only call
        }

        setUser(parsedUser);
      } catch (err) {
        console.warn('Token invalid or expired. Logging out.');
        apiService.clearToken();
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (
    email: string,
    password: string,
    type: 'admin' | 'society'
  ) => {
    try {
      const response =
        type === 'admin'
          ? await apiService.adminLogin(email, password)
          : await apiService.societyLogin(email, password);

      apiService.setToken(response.token);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await apiService.societyRegister(data);
      apiService.setToken(response.token);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    apiService.clearToken();
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

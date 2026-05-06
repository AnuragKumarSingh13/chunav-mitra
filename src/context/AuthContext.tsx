import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  phone: string;
  name?: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing login on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("chunav_mitra_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        localStorage.removeItem("chunav_mitra_user");
      }
    }
  }, []);

  const login = async (phone: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll just validate phone format
      if (!/^[6-9]\d{9}$/.test(phone)) {
        throw new Error("Invalid phone number format");
      }
      
      // In real implementation, this would send OTP to the phone
      console.log(`OTP sent to ${phone}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo OTP is 1234
      if (otp === "1234") {
        const newUser: User = {
          phone,
          name: `User ${phone.slice(-4)}`, // Generate a simple name
          isLoggedIn: true
        };
        
        setUser(newUser);
        localStorage.setItem("chunav_mitra_user", JSON.stringify(newUser));
        return true;
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    login,
    verifyOtp,
    logout,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

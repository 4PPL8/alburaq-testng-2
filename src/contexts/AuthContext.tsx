import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  // User authentication
  user: User | null;
  isUserAuthenticated: boolean;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  
  // Admin authentication
  isAdminAuthenticated: boolean;
  loginAdmin: (name: string, email: string, password: string) => boolean;
  loginAdminByEmail: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  adminInfo: { name: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo admin credentials - in production, this would be handled securely on the backend

// Additional admin user
const ADMIN_CREDENTIALS = {
  name: 'hamid',
  email: 'hzubair25@gmail.com',
  password: '123ha45mid'
};

// Simple password encryption (in production, use proper hashing)
const encryptPassword = (password: string): string => {
  return btoa(password + 'alburaq_salt');
};

const decryptPassword = (encrypted: string): string => {
  try {
    return atob(encrypted).replace('alburaq_salt', '');
  } catch {
    return '';
  }
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Check for existing user session
    const userSession = localStorage.getItem('user_session');
    if (userSession) {
      const parsedUser = JSON.parse(userSession);
      setUser(parsedUser);
      setIsUserAuthenticated(true);
    }

    // Check for existing admin session
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      const parsedAdmin = JSON.parse(adminSession);
      setIsAdminAuthenticated(true);
      setAdminInfo(parsedAdmin);
    }
  }, []);

  const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Validation
    if (!name.trim()) {
      return { success: false, message: 'Full name is required' };
    }
    
    if (!isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }
    
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userExists = existingUsers.some((u: any) => u.email === email);
    
    if (userExists) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase()
    };

    const userWithPassword = {
      ...newUser,
      password: encryptPassword(password)
    };

    // Save to localStorage (in production, this would be a backend API call)
    existingUsers.push(userWithPassword);
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));

    // Auto-login the user
    setUser(newUser);
    setIsUserAuthenticated(true);
    localStorage.setItem('user_session', JSON.stringify(newUser));

    return { success: true, message: 'Account created successfully!' };
  };

  const loginUser = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    if (!password) {
      return { success: false, message: 'Password is required' };
    }

    // Find user in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const foundUser = existingUsers.find((u: any) => 
      u.email === email.toLowerCase() && decryptPassword(u.password) === password
    );

    if (!foundUser) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Login successful
    const userSession = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email
    };

    setUser(userSession);
    setIsUserAuthenticated(true);
    localStorage.setItem('user_session', JSON.stringify(userSession));

    return { success: true, message: 'Login successful!' };
  };

  const logoutUser = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    setIsUserAuthenticated(false);
  };

  const loginAdmin = (name: string, email: string, password: string): boolean => {
    // Check against both admin accounts
    const isFirstAdmin = (
      name === ADMIN_CREDENTIALS.name &&
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    );
    
   
    if (isFirstAdmin) {
      const sessionData = { name, email };
      localStorage.setItem('admin_session', JSON.stringify(sessionData));
      setIsAdminAuthenticated(true);
      setAdminInfo(sessionData);
      return true;
    }
    return false;
  };

  const loginAdminByEmail = (email: string, password: string): boolean => {
    // Check against both admin accounts by email and password only
    const isFirstAdmin = (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    );
    
    
    
    if (isFirstAdmin) {
      const sessionData = { name: ADMIN_CREDENTIALS.name, email };
      localStorage.setItem('admin_session', JSON.stringify(sessionData));
      setIsAdminAuthenticated(true);
      setAdminInfo(sessionData);
      return true;
    } 
    return false;
  };
  const logoutAdmin = () => {
    localStorage.removeItem('admin_session');
    setIsAdminAuthenticated(false);
    setAdminInfo(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isUserAuthenticated,
      registerUser,
      loginUser,
      logoutUser,
      isAdminAuthenticated,
      loginAdmin,
      loginAdminByEmail,
      logoutAdmin,
      adminInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
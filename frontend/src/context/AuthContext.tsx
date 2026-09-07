import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, UserDashboardData } from "../types/user";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalTab: "login" | "register" | "otp" | "forgot" | "reset";
  openAuthModal: (tab?: "login" | "register" | "otp" | "forgot" | "reset") => void;
  closeAuthModal: () => void;
  login: (credentials: { identifier: string; password?: string; rememberMe?: boolean }) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; phone: string; password?: string; referralCode?: string }) => Promise<{ success: boolean; message: string }>;
  sendOtp: (identifier: string, type?: string) => Promise<{ success: boolean; message: string; demoOtp?: string }>;
  verifyOtp: (identifier: string, otp: string, name?: string, referralCode?: string) => Promise<{ success: boolean; message: string }>;
  socialLogin: (provider: "google" | "apple", profile: { name: string; email: string; avatar?: string }) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (identifier: string) => Promise<{ success: boolean; message: string; demoOtp?: string }>;
  resetPassword: (identifier: string, otp: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (fields: Partial<UserProfile>) => Promise<{ success: boolean; message: string; data?: UserProfile }>;
  uploadKyc: (docs: any) => Promise<{ success: boolean; message: string; data?: UserProfile }>;
  toggleFavoriteCar: (carId: number | string) => Promise<boolean>;
  addWalletFunds: (amount: number) => Promise<{ success: boolean; message: string; newBalance?: number }>;
  redeemRewards: (points: number) => Promise<{ success: boolean; message: string }>;
  fetchDashboardData: () => Promise<UserDashboardData | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "moar_user_profile";
const LOCAL_STORAGE_TOKEN_KEY = "moar_auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register" | "otp" | "forgot" | "reset">("login");

  // Sync state to localStorage
  const saveSession = useCallback((newUser: UserProfile | null, newToken: string | null) => {
    setUser(newUser);
    setToken(newToken);
    if (newUser && newToken) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    }
  }, []);

  // Fetch updated profile on mount if token exists
  useEffect(() => {
    if (user?.email || user?.id || token) {
      fetch(`/api/user/profile?email=${encodeURIComponent(user?.email || "")}&id=${user?.id || 0}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res.data));
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const openAuthModal = (tab: "login" | "register" | "otp" | "forgot" | "reset" = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (credentials: { identifier: string; password?: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success && data.data) {
        saveSession(data.data, data.token || "usr_session");
        setAuthModalOpen(false);
        return { success: true, message: data.message || "Logged in successfully!" };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password?: string; referralCode?: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.data) {
        saveSession(json.data, json.token || "usr_session");
        setAuthModalOpen(false);
        return { success: true, message: json.message || "Registered successfully!" };
      }
      return { success: false, message: json.message || "Registration failed" };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error." };
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (identifier: string, type: string = "SMS") => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, type }),
      });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message || "OTP sent successfully",
        demoOtp: data.demoOtp,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to send OTP." };
    }
  };

  const verifyOtp = async (identifier: string, otp: string, name?: string, referralCode?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp, name, referralCode }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        saveSession(data.data, data.token || "usr_session");
        setAuthModalOpen(false);
        return { success: true, message: data.message || "Verified successfully!" };
      }
      return { success: false, message: data.message || "Verification failed." };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error." };
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: "google" | "apple", profile: { name: string; email: string; avatar?: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, ...profile }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        saveSession(data.data, data.token || "usr_session");
        setAuthModalOpen(false);
        return { success: true, message: data.message || "Signed in!" };
      }
      return { success: false, message: data.message || "Social login failed." };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error." };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (identifier: string) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to send reset code." };
    }
  };

  const resetPassword = async (identifier: string, otp: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err?.message || "Password reset failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    saveSession(null, null);
  };

  const updateProfile = async (fields: Partial<UserProfile>) => {
    if (!user) return { success: false, message: "User not logged in." };
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: user.id, email: user.email, ...fields }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        saveSession(data.data, token);
        return { success: true, message: data.message || "Profile updated!", data: data.data };
      }
      return { success: false, message: data.message || "Failed to update profile." };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error." };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadKyc = async (docs: any) => {
    if (!user) return { success: false, message: "User not logged in." };
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/kyc-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: user.id, email: user.email, ...docs }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        saveSession(data.data, token);
        return { success: true, message: data.message || "KYC submitted!", data: data.data };
      }
      return { success: false, message: data.message || "Failed to upload KYC." };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error." };
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavoriteCar = async (carId: number | string): Promise<boolean> => {
    if (!user) {
      openAuthModal("login");
      return false;
    }
    try {
      const res = await fetch("/api/user/saved-cars/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userEmail: user.email, carId: Number(carId) }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.favoriteCars)) {
        const updatedUser = { ...user, favoriteCars: data.favoriteCars };
        saveSession(updatedUser, token);
        return !!data.saved;
      }
    } catch {}
    return false;
  };

  const addWalletFunds = async (amount: number) => {
    if (!user) return { success: false, message: "User not logged in." };
    try {
      const res = await fetch("/api/user/wallet/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userEmail: user.email, amount }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, walletBalance: data.newBalance ?? (user.walletBalance + amount) };
        saveSession(updatedUser, token);
        return { success: true, message: data.message || "Funds added!", newBalance: data.newBalance };
      }
      return { success: false, message: data.message || "Failed to add balance." };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error." };
    }
  };

  const redeemRewards = async (points: number) => {
    if (!user) return { success: false, message: "User not logged in." };
    try {
      const res = await fetch("/api/user/wallet/redeem-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userEmail: user.email, points }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = {
          ...user,
          rewardPoints: data.newRewardPoints ?? (user.rewardPoints - points),
          walletBalance: data.newWalletBalance ?? (user.walletBalance + points),
        };
        saveSession(updatedUser, token);
        return { success: true, message: data.message || "Coins redeemed!" };
      }
      return { success: false, message: data.message || "Failed to redeem." };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error." };
    }
  };

  const fetchDashboardData = async (): Promise<UserDashboardData | null> => {
    if (!user) return null;
    try {
      const res = await fetch(`/api/user/dashboard?email=${encodeURIComponent(user.email)}&id=${user.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.user) {
          saveSession(data.data.user, token);
        }
        return data.data;
      }
    } catch {}
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        sendOtp,
        verifyOtp,
        socialLogin,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
        uploadKyc,
        toggleFavoriteCar,
        addWalletFunds,
        redeemRewards,
        fetchDashboardData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

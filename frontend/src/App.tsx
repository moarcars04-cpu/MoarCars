import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage.tsx";
import AdminDashboard from "./AdminDashboard.tsx";
import { UserDashboard } from "./components/dashboard/UserDashboard.tsx";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { AuthModal } from "./components/auth/AuthModal.tsx";

function AppContent() {
  const [path, setPath] = useState(window.location.pathname);
  const [targetCarToBook, setTargetCarToBook] = useState<string>("");
  const { openAuthModal } = useAuth();

  useEffect(() => {
    const handleLocationChange = () => {
      const currentPath = window.location.pathname;
      setPath(currentPath);

      if (currentPath === "/login") {
        openAuthModal("login");
      } else if (currentPath === "/register") {
        openAuthModal("register");
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [openAuthModal]);

  const navigateTo = (newPath: string) => {
    if (newPath.startsWith("/#")) {
      const hash = newPath.replace("/", "");
      window.location.hash = hash;
      setPath("/");
      return;
    }

    window.history.pushState(null, "", newPath);
    setPath(newPath);

    if (newPath === "/login") {
      openAuthModal("login");
    } else if (newPath === "/register") {
      openAuthModal("register");
    }
  };

  return (
    <>
      <AuthModal />
      {path === "/admin" || path === "/admin/" ? (
        <AdminDashboard onNavigate={navigateTo} />
      ) : path === "/dashboard" || path === "/dashboard/" || path === "/profile" || path === "/my-bookings" ? (
        <UserDashboard onNavigate={navigateTo} onSelectCarToBook={(car) => setTargetCarToBook(car)} />
      ) : (
        <LandingPage onNavigate={navigateTo} preselectedCar={targetCarToBook} />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

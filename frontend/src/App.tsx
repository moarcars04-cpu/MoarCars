import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage.tsx";
import AdminDashboard from "./AdminDashboard.tsx";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const navigateTo = (newPath: string) => {
    window.history.pushState(null, "", newPath);
    setPath(newPath);
  };

  if (path === "/admin" || path === "/admin/") {
    return <AdminDashboard onNavigate={navigateTo} />;
  }

  return <LandingPage />;
}

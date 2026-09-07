import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage.tsx";
import AdminDashboard from "./AdminDashboard.tsx";
import { UserDashboard } from "./components/dashboard/UserDashboard.tsx";
import { CarDetailsPage } from "./CarDetailsPage.tsx";
import { CheckoutPage } from "./CheckoutPage.tsx";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { AuthModal } from "./components/auth/AuthModal.tsx";

function AppContent() {
  const [path, setPath] = useState(window.location.pathname);
  const [targetCarToBook, setTargetCarToBook] = useState<string>("");
  const [selectedCarForDetails, setSelectedCarForDetails] = useState<string | number>("");
  const [checkoutParams, setCheckoutParams] = useState<any>(null);
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

  const navigateTo = (newPath: string, state?: any) => {
    if (newPath.startsWith("/#")) {
      const hash = newPath.replace("/", "");
      window.location.hash = hash;
      setPath("/");
      return;
    }

    if (state) {
      setCheckoutParams(state);
    }

    // Extract car ID if path is like /car/3 or /car-details?id=3
    if (newPath.startsWith("/car/")) {
      const carParam = newPath.replace("/car/", "");
      setSelectedCarForDetails(carParam);
    }

    window.history.pushState(null, "", newPath);
    setPath(newPath);

    if (newPath === "/login") {
      openAuthModal("login");
    } else if (newPath === "/register") {
      openAuthModal("register");
    }
  };

  // Determine car ID if directly loaded from URL like /car/3
  const activeCarParam = path.startsWith("/car/") ? path.replace("/car/", "") : selectedCarForDetails;

  return (
    <>
      <AuthModal />
      {path === "/admin" || path === "/admin/" ? (
        <AdminDashboard onNavigate={navigateTo} />
      ) : path === "/dashboard" || path === "/dashboard/" || path === "/profile" || path === "/my-bookings" ? (
        <UserDashboard onNavigate={navigateTo} onSelectCarToBook={(car) => setTargetCarToBook(car)} />
      ) : path === "/checkout" || path.startsWith("/checkout") ? (
        <CheckoutPage
          initialCar={checkoutParams?.car}
          initialParams={checkoutParams}
          onNavigate={navigateTo}
        />
      ) : path.startsWith("/car/") || path === "/car-details" || path === "/car" ? (
        <CarDetailsPage carIdOrName={activeCarParam} onNavigate={navigateTo} />
      ) : (
        <LandingPage
          onNavigate={(p, st) => {
            if (p.startsWith("/car/")) {
              setSelectedCarForDetails(p.replace("/car/", ""));
            }
            navigateTo(p, st);
          }}
          preselectedCar={targetCarToBook}
        />
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

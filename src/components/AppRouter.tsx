import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCandidate } from "@/context/CandidateContext";

export function AppRouter({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { profile } = useCandidate();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem("chunav_mitra_user");
    
    if (savedUser) {
      // User exists, check if profile is complete
      const savedProfile = localStorage.getItem("chunav_mitra_candidate_profile");
      if (savedProfile) {
        // Profile exists, go to dashboard
        setInitialRoute("/dashboard");
      } else {
        // User exists but no profile, go to registration
        setInitialRoute("/register");
      }
    } else {
      // No user exists, go to registration
      setInitialRoute("/register");
    }
  }, []);

  // If we haven't determined the initial route yet, show loading
  if (initialRoute === null) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // If current path is not the initial route and user is not authenticated, redirect
  const currentPath = window.location.pathname;
  if (currentPath !== initialRoute && currentPath !== "/login" && !user) {
    return <Navigate to={initialRoute} replace />;
  }

  return <>{children}</>;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCandidate } from "@/context/CandidateContext";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useCandidate();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // If user is logged in but no profile exists, redirect to registration
    if (!profile) {
      navigate("/register");
      return;
    }
  }, [navigate, user, profile]);

  // Only render children if user is logged in and profile exists
  if (!user || !profile) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

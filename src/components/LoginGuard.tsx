import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function LoginGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }
  }, [navigate, user]);

  // Only render children if user is logged in
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

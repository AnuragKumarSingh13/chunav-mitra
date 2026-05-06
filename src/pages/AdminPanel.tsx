import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabase'
import "../styles/app.css";

export function AdminPanel() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [confirmUser, setConfirmUser] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadUsers = async () => {
    const { data, error } = await supabase.from('users').select('*')
    console.log('Admin fetch:', data, error)
    if (data) setUsers(data)
  }

  useEffect(() => {
    // Call loadUsers on component mount
    loadUsers();
  }, []);

  useEffect(() => {
    // Call loadUsers after password verification
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "chunavmitra2026") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password · गलत पासवर्ड");
    }
  };

  const handlePremiumToggle = (user: any) => {
    if (user.is_premium) {
      // Remove premium without confirmation
      togglePremium(user.phone, user.is_premium);
    } else {
      // Show confirmation for adding premium
      setConfirmUser(user);
    }
  };

  const confirmPremiumToggle = async () => {
    if (confirmUser) {
      await togglePremium(confirmUser.phone, confirmUser.is_premium);
      setConfirmUser(null);
    }
  };

  const togglePremium = async (phone: string, currentStatus: boolean) => {
    try {
      const newPremiumStatus = !currentStatus;
      console.log(`Updating premium status for ${phone}: ${currentStatus} -> ${newPremiumStatus}`);
      
      const { error } = await supabase
        .from('users')
        .update({ is_premium: newPremiumStatus })
        .eq('phone', phone);
      
      if (!error) {
        alert('Premium status updated!');
        loadUsers(); // refresh list
        
        // Update localStorage for immediate app unlock
        const userData = localStorage.getItem('chunavMitraUser') || localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.phone === phone) {
            user.is_premium = newPremiumStatus;
            user.isPremium = newPremiumStatus;
            localStorage.setItem('chunavMitraUser', JSON.stringify(user));
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Updated localStorage:', user);
          }
        }
      } else {
        console.error('Error updating premium:', error);
        alert('Error updating premium status');
      }
    } catch (error) {
      console.error('Error toggling premium:', error);
      alert('Error updating premium status');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <header className="login-top">
          <div className="login-brand">
            <span className="flag-dot" aria-hidden />
            <span>
              <strong>Chunav Mitra</strong>
              <small>Admin Panel · एडमिन पैनल</small>
            </span>
          </div>
        </header>

        <main className="login-main">
          <h1 className="page-title">Admin Login · एडमिन लॉगिन</h1>
          <p className="page-sub">Enter admin password to continue · जारी रखने के लिए एडमिन पासवर्ड दर्ज करें</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-field">
              <label className="field-label" htmlFor="password">
                Password · पासवर्ड
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="form-input"
                required
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: "var(--error-bg)",
                border: "1px solid var(--error)",
                borderRadius: "4px",
                padding: "0.75rem",
                color: "var(--error)",
                fontSize: "0.9rem"
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Login · लॉगिन
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard · डैशबोर्ड पर वापस
            </button>
          </div>
        </main>
      </div>
    );
  }

  
  return (
    <div className="login-page">
      <header className="login-top">
        <div className="login-brand">
          <span className="flag-dot" aria-hidden />
          <span>
            <strong>Chunav Mitra</strong>
            <small>Admin Panel · एडमिन पैनल</small>
          </span>
        </div>
        <div className="login-top-row">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/dashboard")}
          >
            ← Back · वापस
          </button>
        </div>
      </header>

      <main className="login-main">
        <h1 className="page-title">Registered Users · पंजीकृत उपयोगकर्ता</h1>
        <p className="page-sub">
          Total registered: {users.length} · कुल पंजीकृत: {users.length} | 
          Premium users: {users.filter(u => u.is_premium).length} · प्रीमियम उपयोगकर्ता: {users.filter(u => u.is_premium).length}
        </p>

        {/* Confirmation Dialog */}
        {confirmUser && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center"
            }}>
              <h3 style={{ marginBottom: "1rem" }}>Premium करें?</h3>
              <p style={{ marginBottom: "1.5rem", color: "var(--muted)" }}>
                Kya aap <strong>{confirmUser.name}</strong> ({confirmUser.hindi_name}) ko Premium karna chahte hain?
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button
                  onClick={() => setConfirmUser(null)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPremiumToggle}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Premium Karo
                </button>
              </div>
            </div>
          </div>
        )}

        
        
        {users.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
            No registered users found · कोई पंजीकृत उपयोगकर्ता नहीं मिला
          </div>
        ) : (
          <div style={{ display: isMobile ? 'block' : 'block' }}>
            {users.map((user: any) => (
              <div
                key={user.phone}
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                {/* Header with name and status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>{user.name}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{user.hindi_name}</div>
                  </div>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      backgroundColor: user.is_premium ? "#10b981" : "#ef4444",
                      color: "white"
                    }}
                  >
                    {user.is_premium ? "🟢 Premium" : "🔴 Free"}
                  </span>
                </div>

                {/* Contact info */}
                <div style={{ marginBottom: "0.5rem", color: "var(--muted)" }}>
                  📱 {user.phone}
                </div>

                {/* Post, Ward, Panchayat */}
                <div style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                  <div><strong>पद:</strong> {user.post}</div>
                  <div><strong>वार्ड:</strong> {user.ward}</div>
                  <div><strong>पंचायत:</strong> {user.panchayat}</div>
                </div>

                {/* Action button */}
                <div>
                  {user.is_premium ? (
                    <span style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      backgroundColor: "#10b981",
                      color: "white",
                      fontWeight: "600",
                      display: "inline-block"
                    }}>
                      ✅ Premium Hai
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePremiumToggle(user)}
                      style={{
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        backgroundColor: "#10b981",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "1rem",
                        border: "none",
                        cursor: "pointer",
                        width: isMobile ? "100%" : "auto"
                      }}
                    >
                      🎉 Premium Karo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Total Users: {users.length} | Premium Users: {users.filter(u => u.is_premium).length}
          </p>
        </div>
      </main>
    </div>
  );
}

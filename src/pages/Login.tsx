import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WhatsAppShareButton } from "../components/WhatsAppShareButton";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import "../styles/app.css";

type Step = "phone" | "otp";

export function Login() {
  const navigate = useNavigate();
  const { login, verifyOtp, isLoading, error } = useAuth();
  const phoneId = useId();
  const otpId = useId();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const digitsOk = /^\d{10}$/.test(phone);
  const otpOk = /^\d{4}$/.test(otp); // Changed to 4 digits

  async function sendOtp() {
    if (!digitsOk) return;
    await login(phone);
    if (!error) {
      setStep("otp");
      setOtp("");
    }
  }

  async function verify() {
    if (!otpOk) return;
    const success = await verifyOtp(phone, otp);
    if (success) {
      const phoneNumber = phone.replace(/\D/g, "").slice(0, 10);
      
      // Fetch user with premium status from Supabase
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phoneNumber)
        .single();

      if (user) {
        localStorage.setItem('chunavMitraUser', JSON.stringify(user));
        navigate('/dashboard', { replace: true });
      } else {
        localStorage.setItem('tempPhone', phoneNumber);
        navigate('/register', { replace: true });
      }
    }
  }

  return (
    <div className="login-page">
      <header className="login-top">
        <div className="login-top-row">
          <Link to="/" className="back-link">
            ← Back · होम
          </Link>
          <WhatsAppShareButton />
        </div>
        <div className="login-brand">
          <span className="flag-dot" aria-hidden />
          <span>
            <strong>Chunav Mitra</strong>
            <small>Bihar Panchayat 2026</small>
          </span>
        </div>
      </header>

      <main className="login-main">
        <h1 className="page-title">Login · लॉगिन</h1>
        <p className="page-sub">Mobile number + OTP (Demo OTP: 1234)</p>

        {error && (
          <div style={{
            backgroundColor: "var(--error-bg)",
            border: "1px solid var(--error)",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            color: "var(--error)"
          }}>
            {error}
          </div>
        )}

        {step === "phone" ? (
          <div className="login-card">
            <label className="field-label" htmlFor={phoneId}>
              Mobile number · मोबाइल नंबर
            </label>
            <div className="phone-row">
              <span className="phone-cc" aria-hidden>
                +91
              </span>
              <input
                id={phoneId}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>
            <button type="button" className="btn btn-primary login-full" disabled={!digitsOk || isLoading} onClick={sendOtp}>
              {isLoading ? "Sending… · भेज रहे हैं" : "OTP Bhejo · OTP भेजें"}
            </button>
          </div>
        ) : (
          <div className="login-card">
            <p className="otp-sent">
              OTP sent to <strong>+91 {phone}</strong>{" "}
              <button type="button" className="link-btn" onClick={() => setStep("phone")}>
                Edit · बदलें
              </button>
            </p>
            <label className="field-label" htmlFor={otpId}>
              Enter 4-digit OTP · चार अंकों का OTP
            </label>
            <input
              id={otpId}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="• • • •"
              maxLength={4}
              value={otp}
              className="otp-input"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
            <button type="button" className="btn btn-primary login-full" disabled={!otpOk || isLoading} onClick={verify}>
              {isLoading ? "Verifying… · जाँच रहे हैं" : "Verify · वेरिफाई करें"}
            </button>
            <button type="button" className="btn btn-outline login-full" disabled={isLoading} onClick={sendOtp}>
              Resend OTP · फिर भेजें
            </button>
            <div style={{ marginTop: "1rem" }}>
              <Link to="/" className="link-btn">
                Wapas Jao · वापस जाओ
              </Link>
            </div>
          </div>
        )}

        <p className="login-note">
          Demo: Use OTP <strong>1234</strong> for login. असली OTP बाद में कनेक्ट करें। प्रत्याशी पंजीकरण:{" "}
          <Link to="/register">यहाँ क्लिक करें</Link>।
        </p>
      </main>
    </div>
  );
}

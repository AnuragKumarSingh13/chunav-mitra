import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidate, type CandidatePost } from "@/context/CandidateContext";

const POSTS: { v: CandidatePost; en: string; hi: string; icon: string }[] = [
  { v: "mukhiya", en: "Mukhiya", hi: "मुखिया", icon: "👑" },
  { v: "ward_sadasy", en: "Ward Sadasy", hi: "वार्ड सदस्य", icon: "🏘️" },
  { v: "panch", en: "Panch", hi: "पंच", icon: "⚖️" },
  { v: "sarpanch", en: "Sarpanch", hi: "सरपंच", icon: "📋" },
  { v: "panchayat_samiti", en: "Panchayat Samiti Sadasy", hi: "पंचायत समिति सदस्य", icon: "🏛️" },
];

const WARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useCandidate();
  const [step, setStep] = useState(1);
  const [selectedPost, setSelectedPost] = useState<CandidatePost | null>(null);
  const [selectedWard, setSelectedWard] = useState(1);

  // Default area data
  const areaData = {
    district: "Gopalganj",
    block: "Barauli",
    panchayat: "Sarfara"
  };

  const handleStep1Next = () => {
    setStep(2);
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const handleStep3Complete = () => {
    if (!selectedPost) return;

    // Save onboarding completion and basic profile data
    saveProfile({
      fullNameEn: "",
      fullNameHi: "",
      age: 25,
      gender: "male",
      district: areaData.district,
      block: areaData.block,
      panchayat: areaData.panchayat,
      ward: selectedWard,
      post: selectedPost,
      party: "Independent",
      phone: "0000000000"
    });

    // Mark onboarding as complete
    localStorage.setItem("chunav_mitra_onboarding_complete", "true");
    
    // Navigate to candidate dashboard
    navigate("/dashboard");
  };

  const renderStep1 = () => (
    <div className="onboarding-step">
      <div className="onboarding-content" style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🙏</div>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--accent)" }}>
          Chunav Mitra में आपका स्वागत है! 🙏
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "var(--muted)" }}>
          Bihar Panchayat Elections 2026 ke liye apna campaign shuru karein
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleStep1Next}
          style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}
        >
          Shuru Karein · शुरू करें
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="onboarding-step">
      <div className="onboarding-content" style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", textAlign: "center" }}>
          Apna Kshetra Chuniye · अपना क्षेत्र चुनिए
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="onboarding-field">
            <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              District · ज़िला
            </label>
            <input
              type="text"
              value={areaData.district}
              readOnly
              style={{
                padding: "1rem",
                border: "2px solid var(--border)",
                borderRadius: "8px",
                fontSize: "1rem",
                backgroundColor: "var(--muted-bg)"
              }}
            />
          </div>

          <div className="onboarding-field">
            <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Block · प्रखंड
            </label>
            <input
              type="text"
              value={areaData.block}
              readOnly
              style={{
                padding: "1rem",
                border: "2px solid var(--border)",
                borderRadius: "8px",
                fontSize: "1rem",
                backgroundColor: "var(--muted-bg)"
              }}
            />
          </div>

          <div className="onboarding-field">
            <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Panchayat · पंचायत
            </label>
            <input
              type="text"
              value={areaData.panchayat}
              readOnly
              style={{
                padding: "1rem",
                border: "2px solid var(--border)",
                borderRadius: "8px",
                fontSize: "1rem",
                backgroundColor: "var(--muted-bg)"
              }}
            />
          </div>

          <div className="onboarding-field">
            <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Ward · वार्ड
            </label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(Number(e.target.value))}
              style={{
                padding: "1rem",
                border: "2px solid var(--accent)",
                borderRadius: "8px",
                fontSize: "1rem",
                backgroundColor: "white"
              }}
            >
              {WARDS.map((w) => (
                <option key={w} value={w}>
                  Ward {w} · वार्ड {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setStep(1)}
            style={{ flex: 1 }}
          >
            Back · पीछे
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStep2Next}
            style={{ flex: 1 }}
          >
            Next · आगे
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="onboarding-step">
      <div className="onboarding-content" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", textAlign: "center" }}>
          Aap kaunse pad ke liye ladd rahe hain?
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {POSTS.map((post) => (
            <div
              key={post.v}
              className={`post-card ${selectedPost === post.v ? "selected" : ""}`}
              onClick={() => setSelectedPost(post.v)}
              style={{
                padding: "1.5rem",
                border: `2px solid ${selectedPost === post.v ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: selectedPost === post.v ? "var(--accent-bg)" : "white",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{post.icon}</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontWeight: "600" }}>
                {post.en}
              </h3>
              <p style={{ fontSize: "1rem", color: "var(--muted)" }}>
                {post.hi}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setStep(2)}
            style={{ flex: 1 }}
          >
            Back · पीछे
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStep3Complete}
            disabled={!selectedPost}
            style={{ flex: 1 }}
          >
            Complete Onboarding · पूरा करें
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="login-page">
      <header className="login-top">
        <div className="login-brand">
          <span className="flag-dot" aria-hidden />
          <span>
            <strong>Chunav Mitra</strong>
            <small>Candidate Onboarding · प्रत्याशी पंजीकरण</small>
          </span>
        </div>
      </header>

      <main className="login-main">
        <div className="onboarding-progress" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="progress-dot"
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: step >= s ? "var(--accent)" : "var(--muted)"
                }}
              />
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--muted)" }}>
            Step {step} of 3
          </p>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </main>
    </div>
  );
}

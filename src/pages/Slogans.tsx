import { Link } from "react-router-dom";
import { useState } from "react";
import { SloganShareButton } from "@/components/SloganShareButton";
import "../styles/app.css";

const ELECTION_SLOGANS = [
  "गाँव के विकास के लिए, हमरे साथ दीजिए!",
  "ईमानदारी से काम, गाँव का होगा नाम",
  "हर घर तक पहुँचे सरकारी योजना, यही है हमारा सपना",
  "बेटी पढ़ाओ, गाँव बचाओ",
  "सड़क, पानी, बिजली — यही है असली जिंदगी",
  "जात-पात से ऊपर उठो, गाँव के विकास से जुड़ो",
  "हमार वोट, हमार अधिकार"
];

export function Slogans() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const raw = localStorage.getItem('chunavMitraUser')
  const userData = raw ? JSON.parse(raw) : {}
  const isPremium = userData?.is_premium === true || userData?.is_premium === 'true'

  return (
    <div className="login-page">
      <header className="login-top">
        <div className="login-top-row">
          <Link to="/" className="back-link">
            ← Back · होम
          </Link>
        </div>
        <div className="login-brand">
          <span className="flag-dot" aria-hidden />
          <span>
            <strong>Chunav Mitra</strong>
            <small>Election Slogans · चुनाव नारे</small>
          </span>
        </div>
      </header>

      <main className="login-main">
        <h1 className="page-title">Election Slogans · चुनाव नारे</h1>
        <p className="page-sub">
          Hindi/Bhojpuri slogans for Panchayat elections — पंचायत चुनाव के लिए हिंदी/भोजपुरी नारे।
        </p>

        {userData?.phone ? (
          <>
            <div className="slogans-grid" style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
              {ELECTION_SLOGANS.map((slogan, index) => {
                const isLocked = !isPremium && index >= 2;
                
                return (
                  <div key={index} className="slogan-card" style={{
                    padding: "1rem",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    backgroundColor: isLocked ? "var(--muted-bg)" : "white",
                    position: "relative"
                  }}>
                    {isLocked && (
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        zIndex: 10
                      }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</div>
                        <button 
                          type="button"
                          className="btn btn-primary"
                          onClick={() => window.location.href = "/premium"}
                        >
                          Premium lo ₹499
                        </button>
                      </div>
                    )}
                    
                    <p className="slogan-text" style={{ 
                      margin: "0 0 1rem 0", 
                      fontSize: "1.1rem",
                      color: isLocked ? "var(--muted)" : "inherit",
                      filter: isLocked ? "blur(3px)" : "none",
                      userSelect: isLocked ? "none" : "auto",
                      pointerEvents: isLocked ? "none" : "auto"
                    }}>
                      {slogan}
                    </p>
                    
                    {!isLocked && (
                      <div className="slogan-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <SloganShareButton slogan={slogan} />
                        <button
                          className="btn btn-outline btn-small"
                          onClick={() => {
                            navigator.clipboard.writeText(slogan);
                            setCopiedIndex(index);
                            setTimeout(() => setCopiedIndex(null), 2000);
                          }}
                        >
                          {copiedIndex === index ? "Copied!" : "Copy · कॉपी"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="slogans-note" style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "var(--muted-bg)",
              borderRadius: "8px",
              fontSize: "0.9rem",
              color: "var(--muted)"
            }}>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong>Note:</strong> These slogans are for reference only. Please use them responsibly and ensure they comply with election commission guidelines.
              </p>
              <p style={{ margin: 0 }}>
                <strong>नोट:</strong> ये नारे केवल संदर्भ के लिए हैं। कृपया जिम्मेदारी से उपयोग करें और सुनिश्चित करें कि ये चुनाव आयोग के दिशानिर्देशों का पालन करते हैं।
              </p>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Please login</p>
          </div>
        )}
      </main>
    </div>
  );
}

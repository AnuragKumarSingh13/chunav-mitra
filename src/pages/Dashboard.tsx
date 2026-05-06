import { Link, useNavigate } from "react-router-dom";
import { useCandidate } from "@/context/CandidateContext";
import { useAuth } from "@/context/AuthContext";
import { SloganShareButton } from "@/components/SloganShareButton";

const ELECTION_SLOGANS: Record<string, string[]> = {
  mukhiya: [
    "गाँव के विकास के लिए, हमरे साथ दीजिए!",
    "ईमानदारी से काम, गाँव का होगा नाम",
    "हर घर तक पहुँचे सरकारी योजना, यही है हमारा सपना",
    "बेटी पढ़ाओ, गाँव बचाओ",
    "सड़क, पानी, बिजली — यही है असली जिंदगी",
    "जात-पात से ऊपर उठो, गाँव के विकास से जुड़ो",
    "हमार वोट, हमार अधिकार"
  ],
  ward_sadasy: [
    "वार्ड का विकास, मेरा संकल्प",
    "आपकी सेवा, मेरा कर्तव्य",
    "सबका साथ, सबका विकास",
    "पारदर्शिता और जवाबदेही",
    "वार्ड की प्रगति, मेरी प्राथमिकता"
  ],
  panch: [
    "पंच की पहचान - ईमानदारी",
    "गाँव की सेवा, भगवान की भक्ति",
    "समाज सेवक, नहीं नेता",
    "पंचायत की शक्ति, ग्रामीणों की हितैषी"
  ],
  sarpanch: [
    "सरपंच - गाँव का सेवक",
    "विकास की राह, नई ऊँचाई",
    "गाँव की आवाज़, गाँव का विकास",
    "ईमानदार प्रशासन, सबका साथ"
  ],
  panchayat_samiti: [
    "पंचायत समिति - विकास की सोपान",
    "ग्रामीणों की आवाज़, सरकार तक पहुँच",
    "संगठन की शक्ति, विकास की दिशा"
  ]
};

const POST_HI: Record<string, string> = {
  mukhiya: "मुखिया",
  ward_sadasy: "वार्ड सदस्य",
  panch: "पंच",
  sarpanch: "सरपंच",
  panchayat_samiti: "पंचायत समिति सदस्य",
};

export function Dashboard() {
  const navigate = useNavigate();
  const { setPremium } = useCandidate();
  const { user, logout } = useAuth();

  // Read user from localStorage with fallback
  const userData = JSON.parse(localStorage.getItem('chunavMitraUser') || '{}');
  const isPremium = userData?.is_premium === true || userData?.isPremium === true;

  if (!userData?.phone) {
    return (
      <div className="login-page">
        <header className="login-top">
          <div className="login-brand">
            <span className="flag-dot" aria-hidden />
            <span>
              <strong>Chunav Mitra</strong>
              <small>Dashboard · डैशबोर्ड</small>
            </span>
          </div>
        </header>
        <main className="login-main">
          <h1 className="page-title">Dashboard · डैशबोर्ड</h1>
          <p className="page-sub">अभी कोई प्रोफ़ाइल नहीं मिला। पहले पंजीकरण करें।</p>
          <Link className="btn btn-primary" to="/register">
            Register · पंजीकरण
          </Link>
        </main>
      </div>
    );
  }

  const postSlogans = ELECTION_SLOGANS[userData?.post] || [];

  return (
    <>
      <div style={{
        backgroundColor: "var(--accent-bg)",
        border: "1px solid var(--accent)",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "2rem",
        textAlign: "center"
      }}>
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", color: "var(--accent)" }}>
          Swagat hai, {userData?.name || userData?.fullNameEn} ji 🙏
        </h1>
        <p style={{ margin: 0, fontSize: "1.1rem", color: "var(--muted)" }}>
          {POST_HI[userData?.post]} Pratiyashi · {userData?.panchayat}
        </p>
      </div>

      <main className="login-main">
        {/* Profile Summary */}
        <div className="profile-summary" style={{
          padding: "1.5rem",
          backgroundColor: "var(--accent-bg)",
          border: "1px solid var(--accent)",
          borderRadius: "12px",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.3rem" }}>
                {userData?.hindi_name || userData?.fullNameHi || "Candidate Name"} · {userData?.name || userData?.fullNameEn || "Candidate Name"}
              </h2>
              <p style={{ margin: "0 0 0.25rem 0", color: "var(--muted)" }}>
                {POST_HI[userData?.post]} · Ward {userData?.ward} · {userData?.panchayat}, {userData?.block || ''}, {userData?.district || ''}
              </p>
              {user && (
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--accent)" }}>
                  📱 +91 {user.phone} · {user.name}
                </p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              {isPremium ? (
                <span className="premium-badge">Premium · प्रीमियम</span>
              ) : (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setPremium(true)}
                    style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}
                  >
                    Upgrade to Premium · ₹499
                  </button>
                </div>
              )}
              {user && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={logout}
                  style={{ fontSize: "0.9rem" }}
                >
                  Logout · लॉगआउट
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Slogans Section */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
            Election Slogans for {POST_HI[userData.post]} · {POST_HI[userData.post]} के लिए चुनाव नारे
          </h2>
          
          <div style={{ display: "grid", gap: "1rem" }}>
            {/* Show only 2 slogans for free users */}
            {postSlogans.slice(0, 2).map((slogan: string, index: number) => (
              <div key={index} style={{
                padding: "1rem",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                backgroundColor: "white"
              }}>
                <p style={{ 
                  margin: "0 0 1rem 0", 
                  fontSize: "1.1rem"
                }}>
                  {slogan}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <SloganShareButton slogan={slogan} />
                </div>
              </div>
            ))}
            
            {/* Show locked premium slogans */}
            {!isPremium && postSlogans.slice(2).map((slogan: string, index: number) => (
              <div key={index + 2} style={{
                padding: "1rem",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                backgroundColor: "var(--muted-bg)",
                position: "relative"
              }}>
                <div style={{ 
                  margin: "0 0 1rem 0", 
                  fontSize: "1.1rem",
                  color: "var(--muted)",
                  filter: "blur(3px)",
                  userSelect: "none"
                }}>
                  {slogan}
                </div>
                <div style={{ 
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</div>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => navigate("/premium")}
                  >
                    Premium lo ₹499
                  </button>
                </div>
              </div>
            ))}
            
            {/* Show all slogans for premium users */}
            {isPremium && postSlogans.slice(2).map((slogan: string, index: number) => (
              <div key={index + 2} style={{
                padding: "1rem",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                backgroundColor: "white"
              }}>
                <p style={{ 
                  margin: "0 0 1rem 0", 
                  fontSize: "1.1rem"
                }}>
                  {slogan}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <SloganShareButton slogan={slogan} />
                </div>
              </div>
            ))}
          </div>

          {!isPremium && (
            <div style={{
              padding: "1rem",
              backgroundColor: "var(--accent-bg)",
              border: "1px solid var(--accent)",
              borderRadius: "8px",
              textAlign: "center",
              marginTop: "1rem"
            }}>
              <p style={{ margin: 0, fontWeight: "600", color: "var(--accent)" }}>
                सभी {postSlogans.length} नारे देखने और शेयर करने के लिए Premium लें - ₹499
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/premium")}
                style={{ marginTop: "0.5rem" }}
              >
                Premium खरीदें
              </button>
            </div>
          )}
        </section>

        {/* Apna Ward Info - FREE Feature */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
            Apna Ward Info · अपना वार्ड जानकारी
          </h2>
          
          <div style={{
            padding: "1.5rem",
            backgroundColor: "var(--accent-bg)",
            border: "1px solid var(--accent)",
            borderRadius: "12px"
          }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem" }}>
              Ward {userData.ward} · वार्ड {userData.ward}
            </h3>
            <div style={{ lineHeight: "1.8" }}>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong>Panchayat · पंचायत:</strong> {userData.panchayat}
              </p>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong>Block · प्रखंड:</strong> {userData.block}
              </p>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong>District · ज़िला:</strong> {userData.district}
              </p>
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong>Your Post · आपका पद:</strong> {POST_HI[userData.post]}
              </p>
            </div>
          </div>
        </section>

        {/* Chunav Parinaam · चुनाव परिणाम */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
            Chunav Parinaam · चुनाव परिणाम
          </h2>
          
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            <Link
              to="/results-2016"
              className="btn btn-outline"
              style={{ display: "block", textAlign: "center", padding: "1rem", textDecoration: "none" }}
            >
              📊 2016 Chunav Parinaam · 2016 चुनाव परिणाम
            </Link>
            <Link
              to="/results-2021"
              className="btn btn-outline"
              style={{ display: "block", textAlign: "center", padding: "1rem", textDecoration: "none" }}
            >
              📊 2021 Chunav Parinaam · 2021 चुनाव परिणाम
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
            Quick Actions · त्वरित कार्य
          </h2>
          
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            <Link to="/profile" className="btn btn-outline" style={{ display: "block", textAlign: "center", padding: "1rem", textDecoration: "none" }}>
              👤 Edit Profile · प्रोफाइल संपादित करें
            </Link>
            <Link to="/slogans" className="btn btn-outline" style={{ display: "block", textAlign: "center", padding: "1rem", textDecoration: "none" }}>
              💬 View Slogans · स्लोगन देखें
            </Link>
            <Link to="/wards" className="btn btn-outline" style={{ display: "block", textAlign: "center", padding: "1rem", textDecoration: "none" }}>
              📋 Ward Candidates · वार्ड प्रत्याशी
            </Link>
            {!isPremium ? (
              <div style={{ position: "relative" }}>
                <button 
                  className="btn btn-outline" 
                  disabled 
                  style={{ 
                    display: "block", 
                    textAlign: "center", 
                    padding: "1rem", 
                    textDecoration: "none", 
                    width: "100%",
                    opacity: 0.6,
                    cursor: "not-allowed"
                  }}
                >
                  🎨 Apna Poster Banao · अपना पोस्टर बनाओ 🔒
                </button>
                <div style={{ 
                  position: "absolute", 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)",
                  fontSize: "1.5rem"
                }}>
                  🔒
                </div>
              </div>
            ) : (
              <Link 
                to="/poster-maker" 
                className="btn btn-outline" 
                style={{ 
                  display: "block", 
                  textAlign: "center", 
                  padding: "1rem", 
                  textDecoration: "none"
                }}
              >
                🎨 Apna Poster Banao · अपना पोस्टर बनाओ
              </Link>
            )}
            <Link to="/premium" className="btn btn-outline" style={{ display: "block", textAlign: "center", padding: "1rem", textDecoration: "none" }}>
              💎 Upgrade to Premium · प्रीमियम अपग्रेड करें
            </Link>
          </div>
        </section>

            {isPremium && (
          <section style={{ marginBottom: "2rem" }}>
            <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
              Premium Features · प्रीमियम सुविधाएं
            </h2>
            <div style={{
              backgroundColor: "var(--success-bg)",
              border: "1px solid var(--success)",
              borderRadius: "8px",
              padding: "1rem",
              color: "var(--success)"
            }}>
              <p style={{ margin: 0 }}>
                ✅ All slogans unlocked · सभी नारे खुले हैं<br/>
                ✅ Voter list download · मतदाता सूची डाउनलोड<br/>
                ✅ Campaign tools · प्रचार उपकरण
              </p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

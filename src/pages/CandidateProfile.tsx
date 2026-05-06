import { Link } from "react-router-dom";
import { useState } from "react";
import { voters } from "@/data/mockData";
import { CAMPAIGN_POSTS_HI, WHATSAPP_BROADCAST_TEMPLATES } from "@/data/campaignTemplates";
import { LoginRequired } from "@/components/LoginRequired";
import "../styles/app.css";

const POST_HI: Record<string, string> = {
  mukhiya: "मुखिया",
  ward_sadasy: "वार्ड सदस्य",
  panch: "पंच",
  sarpanch: "सरपंच",
  panchayat_samiti: "पंचायत समिति सदस्य",
};

const GENDER_HI: Record<string, string> = {
  male: "पुरुष",
  female: "महिला",
  other: "अन्य",
};

function downloadWardVoterListCsv(ward: number) {
  const rows = voters.filter((v) => v.ward === ward);
  const header = "Voter ID,Name (English),Name (Hindi),Ward,Booth,Relation\n";
  const body = rows
    .map(
      (v) =>
        `"${v.id.replace(/"/g, '""')}","${v.nameEn.replace(/"/g, '""')}","${v.nameHi.replace(/"/g, '""')}",${v.ward},"${v.booth.replace(/"/g, '""')}","${v.relation.replace(/"/g, '""')}"`
    )
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `voter-list-ward-${ward}-demo.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPanchayatVoterListCsv() {
  const header = "Voter ID,Name (English),Name (Hindi),Ward,Booth,Relation\n";
  const body = voters
    .map(
      (v) =>
        `"${v.id.replace(/"/g, '""')}","${v.nameEn.replace(/"/g, '""')}","${v.nameHi.replace(/"/g, '""')}",${v.ward},"${v.booth.replace(/"/g, '""')}","${v.relation.replace(/"/g, '""')}"`
    )
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `voter-list-sarfara-panchayat-demo.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function CandidateProfile() {
  // Read user data from localStorage
  const userData = JSON.parse(localStorage.getItem('chunavMitraUser') || '{}');
  const isPremium = userData?.is_premium === true || userData?.isPremium === true;
  const [selectedWard, setSelectedWard] = useState(1);

  if (!userData?.phone) {
    return (
      <>
        <h1 className="page-title">Profile · प्रोफ़ाइल</h1>
        <p className="page-sub">अभी कोई पंजीकरण नहीं मिला। पहले फॉर्म भरें।</p>
        <Link className="btn btn-primary" to="/register">
          Register · पंजीकरण
        </Link>
      </>
    );
  }

  const p = userData;

  return (
    <>
      <h1 className="page-title">Your profile · आपका प्रोफ़ाइल</h1>
      <p className="page-sub">
        {p.premium ? (
          <>
            <span className="premium-badge">Premium · प्रीमियम</span> सार्वजनिक प्रोफ़ाइल सक्रिय।
          </>
        ) : (
          <>फ्री खाता — मतदाता खोज में केवल अपना नाम। प्रीमियम के लिए </>
        )}
        {!p.premium && (
          <Link to="/premium">₹499 प्लान</Link>
        )}
        {!p.premium && " देखें।"}
      </p>

      <article className="profile-card profile-card-main" aria-label="Candidate profile">
        <header className="profile-card-head">
          <div>
            <h2 className="profile-name-hi" lang="hi">
              {p.fullNameHi}
            </h2>
            <p className="profile-name-en" lang="en">
              {p.fullNameEn}
            </p>
          </div>
          <span className="ward-pill">
            Ward {p.ward} · वार्ड {p.ward}
          </span>
        </header>

        <dl className="profile-dl">
          <div>
            <dt>उम्र · Age</dt>
            <dd>{p.age}</dd>
          </div>
          <div>
            <dt>लिंग · Gender</dt>
            <dd>
              {GENDER_HI[p.gender] ?? p.gender} · <span lang="en">{p.gender}</span>
            </dd>
          </div>
          <div>
            <dt>ज़िला · District</dt>
            <dd>{p.district}</dd>
          </div>
          <div>
            <dt>प्रखंड · Block</dt>
            <dd>{p.block}</dd>
          </div>
          <div>
            <dt>पंचायत · Panchayat</dt>
            <dd>{p.panchayat}</dd>
          </div>
          <div>
            <dt>पद · Post</dt>
            <dd>
              {POST_HI[p.post] ?? p.post} · <span lang="en">{p.post.split("_").join(" ")}</span>
            </dd>
          </div>
          <div>
            <dt>दल · Party</dt>
            <dd>
              {p.party} ·{" "}
              <span className="muted-inline">
                {p.party === "JDU" && "जद(यू)"}
                {p.party === "RJD" && "राजद"}
                {p.party === "BJP" && "भाजपा"}
                {p.party === "INC" && "कांग्रेस"}
                {p.party === "Independent" && "निर्दलीय"}
              </span>
            </dd>
          </div>
          <div>
            <dt>फ़ोन · Phone</dt>
            <dd>
              <a href={`tel:+91${p.phone}`}>+91 {p.phone}</a>
            </dd>
          </div>
        </dl>

        <div className="profile-actions">
          <Link className="btn btn-outline" to="/register">
            Edit registration · बदलाव
          </Link>
        </div>
      </article>

      <section className="premium-extras" aria-label="Voter download tools">
          <h2 className="section-heading">{p.premium ? "Premium tools · प्रीमियम उपकरण" : "Voter list download · मतदाता सूची डाउनलोड"}</h2>

          <div className="tool-block">
            <h3>Voter list download · मतदाता सूची डाउनलोड</h3>
            <p className="tool-desc">सरफारा पंचायत की मतदाता सूची CSV में डाउनलोड करें।</p>
            
            {userData?.phone ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Option 1: Apna Ward - Available for logged-in users */}
                <div style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>1. Apna Ward · अपना वार्ड</h4>
                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", color: "var(--muted)" }}>
                    Ward {p.ward} की मतदाता सूची डाउनलोड करें
                  </p>
                  <button type="button" className="btn btn-primary" onClick={() => downloadWardVoterListCsv(p.ward)}>
                    Download Ward {p.ward} · वार्ड {p.ward} डाउनलोड
                  </button>
                </div>

                {/* Option 2: Pure Panchayat ki List - Premium only */}
                <div style={{ 
                  padding: "1rem", 
                  border: "1px solid var(--muted)", 
                  borderRadius: "8px",
                  backgroundColor: "var(--muted-bg)",
                  position: "relative"
                }}>
                  <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "1.2rem" }}>
                    🔒
                  </div>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "var(--muted)" }}>
                    2. Pure Panchayat ki List · पूरी पंचायत की लिस्ट
                  </h4>
                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", color: "var(--muted)" }}>
                    सभी 13 वार्ड की मतदाता सूची एक साथ डाउनलोड करें
                  </p>
                  {p.premium ? (
                    <button type="button" className="btn btn-primary" onClick={downloadPanchayatVoterListCsv}>
                      Download Complete Panchayat · पूरी पंचायत डाउनलोड
                    </button>
                  ) : (
                    <div>
                      <button type="button" className="btn btn-outline" disabled>
                        Premium lo - ₹499
                      </button>
                      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "var(--accent)" }}>
                        🔒 Premium lo - ₹499
                      </p>
                    </div>
                  )}
                </div>

                {/* Option 3: Kisi bhi Ward ki List - Premium only */}
                <div style={{ 
                  padding: "1rem", 
                  border: "1px solid var(--muted)", 
                  borderRadius: "8px",
                  backgroundColor: "var(--muted-bg)",
                  position: "relative"
                }}>
                  <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "1.2rem" }}>
                    🔒
                  </div>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "var(--muted)" }}>
                    3. Kisi bhi Ward ki List · किसी भी वार्ड की लिस्ट
                  </h4>
                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", color: "var(--muted)" }}>
                    कोई भी वार्ड (1-13) चुनकर मतदाता सूची डाउनलोड करें
                  </p>
                  {p.premium ? (
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <select 
                        value={selectedWard} 
                        onChange={(e) => setSelectedWard(Number(e.target.value))}
                        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border)" }}
                      >
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(w => (
                          <option key={w} value={w}>Ward {w}</option>
                        ))}
                      </select>
                      <button type="button" className="btn btn-primary" onClick={() => downloadWardVoterListCsv(selectedWard)}>
                        Download Ward {selectedWard} · वार्ड {selectedWard} डाउनलोड
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button type="button" className="btn btn-outline" disabled>
                        Premium lo - ₹499
                      </button>
                      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "var(--accent)" }}>
                        🔒 Premium lo - ₹499
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <LoginRequired />
            )}
          </div>

          <div className="tool-block">
            <h3>Campaign posts (Hindi) · प्रचार संदेश</h3>
            <ul className="template-list">
              {CAMPAIGN_POSTS_HI.map((item, i) => (
                <li key={i} className="template-card">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => void navigator.clipboard.writeText(item.body)}
                  >
                    Copy · कॉपी
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="tool-block">
            <h3>WhatsApp broadcast · व्हाट्सऐप प्रसारण</h3>
            <ul className="template-list">
              {WHATSAPP_BROADCAST_TEMPLATES.map((item, i) => (
                <li key={i} className="template-card">
                  <strong>{item.label}</strong>
                  <pre className="wa-pre">{item.text}</pre>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => void navigator.clipboard.writeText(item.text)}
                  >
                    Copy · कॉपी
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

      {p.premium && (
        <section className="premium-extras" aria-label="Premium tools">
          <h2 className="section-heading">Campaign tools · प्रचार उपकरण</h2>

          <div className="tool-block">
            <h3>Campaign posts (Hindi) · प्रचार संदेश</h3>
            <ul className="template-list">
              {CAMPAIGN_POSTS_HI.map((item, i) => (
                <li key={i} className="template-card">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => void navigator.clipboard.writeText(item.body)}
                  >
                    Copy · कॉपी
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="tool-block">
            <h3>WhatsApp broadcast · व्हाट्सऐप प्रसारण</h3>
            <ul className="template-list">
              {WHATSAPP_BROADCAST_TEMPLATES.map((item, i) => (
                <li key={i} className="template-card">
                  <strong>{item.label}</strong>
                  <pre className="wa-pre">{item.text}</pre>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => void navigator.clipboard.writeText(item.text)}
                  >
                    Copy · कॉपी
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

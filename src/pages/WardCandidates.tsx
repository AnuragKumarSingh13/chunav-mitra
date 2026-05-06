import { useState } from "react";
import { candidates, wards } from "@/data/mockData";

export function WardCandidates() {
  const raw = localStorage.getItem('chunavMitraUser')
  const userData = raw ? JSON.parse(raw) : {}
  const isPremium = userData?.is_premium === true || userData?.is_premium === 'true' || userData?.isPremium === true;
  const userWard = userData?.ward || '1';
  const [ward, setWard] = useState(1);

  const list = candidates.filter((c) => c.ward === ward);

  return (
    <>
      <h1 className="page-title">Sarfara Panchayat Ward Candidates · सरफारा पंचायत वार्ड प्रत्याशी</h1>
      <p className="page-sub">
        सरफारा पंचायत (गोपालगंज, बरौली) - वार्ड नंबर चुनें। Sample list + ₹499 पर पंजीकृत सार्वजनिक प्रत्याशी · अंतिम सूची आयोग से जाँचें।
        {!isPremium && userWard && `आपका वार्ड: ${userWard} (केवल अपना वार्ड देख सकते हैं)`}
      </p>

      <div className="ward-controls">
        <label htmlFor="ward-select">Ward / वार्ड</label>
        <select 
          id="ward-select" 
          value={ward} 
          onChange={(e) => setWard(Number(e.target.value))}
          disabled={false}
        >
          {wards.map((w) => (
            <option key={w} value={w}>
              Ward {w} · वार्ड {w} {!isPremium && w !== Number(userWard) ? "(🔒 Locked)" : ""}
            </option>
          ))}
        </select>
        {!isPremium && (
          <small style={{ color: "var(--muted)" }}>
            🔒 Only your ward (Ward {userWard}) is accessible. Upgrade to Premium to access all wards.
          </small>
        )}
      </div>

      {userData?.phone ? (
        <>
          {isPremium || ward === Number(userWard) ? (
            <>
              {list.length > 0 ? (
                <>
                  <h2 className="ward-section-sub">Sample Candidates · नमूना प्रत्याशी</h2>
                  <ol className="candidate-list" start={1}>
                    {list.map((c: any, i: number) => (
                      <li key={c.ward} className="candidate-card">
                        <span className="candidate-num">{i + 1}</span>
                        <div>
                          <span className="ward-pill">
                            Ward {c.ward} · वार्ड {c.ward}
                          </span>
                          <h3>
                            {c.hindi_name || c.fullNameHi} <span lang="en">({c.name || c.fullNameEn})</span>
                          </h3>
                          <p>
                            Party / दल: <strong>{c.party}</strong>
                            <br />
                            Symbol / चुनाव चिन्ह: {c.symbol}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <p className="empty-state">
                  इस वार्ड के लिए sample डेटा उपलब्ध नहीं। दूसरा ward चुनें।
                </p>
              )}
            </>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "3rem 1rem",
              backgroundColor: "var(--muted-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              margin: "2rem 0"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
              <h3 style={{ margin: "0 0 1rem 0", color: "var(--accent)" }}>
                Ward {ward} is Locked · वार्ड {ward} लॉक है
              </h3>
              <p style={{ margin: "0 0 1.5rem 0", color: "var(--muted)" }}>
                You can only access your own ward (Ward {userWard}) for free.<br/>
                Upgrade to Premium to access all wards.<br/>
                आप केवल अपने वार्ड (वार्ड {userWard}) तक मुफ़्त में पहुँच सकते हैं।<br/>
                सभी वार्डों तक पहुँचने के लिए प्रीमियम अपग्रेड करें।
              </p>
              <button 
                type="button"
                className="btn btn-primary"
                onClick={() => window.location.href = "/premium"}
              >
                Upgrade to Premium · ₹499
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Please login</p>
        </div>
      )}
    </>
  );
}

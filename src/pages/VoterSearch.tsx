import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { voters } from "@/data/mockData";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function VoterSearch() {
  const [q, setQ] = useState("");
  
  const userData = JSON.parse(localStorage.getItem('chunavMitraUser') || '{}');
  const isPremium = userData?.is_premium === true;
  const userWard = userData?.ward;

  const results = useMemo(() => {
    const n = normalize(q);
    let pool = voters;

    // Filter by ward for non-premium users
    if (!isPremium && userWard) {
      pool = voters.filter((v) => v.ward === userWard);
    }

    if (!n) return pool;
    return pool.filter(
      (v) =>
        normalize(v.nameEn).includes(n) ||
        normalize(v.nameHi).includes(n) ||
        normalize(v.id).includes(n.replace(/\s+/g, ""))
    );
  }, [q, isPremium, userWard]);

  const placeholder = "जैसे: Ramesh, सुनीता, BR26-PN-10001...";

  return (
    <>
      <h1 className="page-title">Voter Search · मतदाता खोज</h1>
      <p className="page-sub">
        {!isPremium && userWard ? (
          <>
            फ्री खाता: केवल वार्ड {userWard} के मतदाता दिख रहे हैं। सभी वार्ड देखने के लिए{" "}
            <Link to="/premium">₹499 प्रीमियम</Link> लें।
          </>
        ) : (
          <>naam / नाम या Voter ID टाइप करें। Demo list — असली रोल अधिकृत स्रोत से जोड़ें।</>
        )}
      </p>

      <label className="sr-only" htmlFor="voter-query">
        Search
      </label>
      <div className="search-bar">
        <input
          id="voter-query"
          type="search"
          inputMode="search"
          placeholder={placeholder}
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {results.length === 0 ? (
        <p className="empty-state">
          कोई परिणाम नहीं · No matching voter in sample data. थोड़ा और आसान शब्द try करें।
        </p>
      ) : (
        <ul className="voter-list">
          {results.map((v) => (
            <li key={v.id} className="voter-card">
              <h3>
                {v.nameHi} <span lang="en">({v.nameEn})</span>
              </h3>
              <div className="voter-meta">
                <span>
                  Voter ID: <code>{v.id}</code>
                </span>
                {" · "}
                <span>
                  Ward {v.ward} / वार्ड {v.ward}
                </span>
                <br />
                <span>Booth · मतदान केंद्र: {v.booth}</span>
                <br />
                <span>{v.relation}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* Show premium lock message for non-premium users when no userWard or showing restricted access */}
      {!isPremium && (!userWard || q === "") && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>
            📋 सभी वार्ड की पूरी वोटर लिस्ट देखने के लिए प्रीमियम लें
          </p>
          <Link to="/premium" style={{ display: 'inline-block', marginTop: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Premium लो ₹499
          </Link>
        </div>
      )}
    </>
  );
}

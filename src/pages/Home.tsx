import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getPublicPremiumCandidates, groupCandidatesByWard, useCandidate } from "@/context/CandidateContext";
import { OnboardingGuard } from "@/components/OnboardingGuard";

export function Home() {
  const { registry } = useCandidate();
  const byWard = useMemo(() => {
    const pub = getPublicPremiumCandidates(registry);
    return groupCandidatesByWard(pub);
  }, [registry]);

  return (
    <OnboardingGuard>
      <div className="hero">
        <div className="hero-badge">
          <span aria-hidden>🇮🇳</span>
          <span>Bihar Panchayat Elections 2026 · बिहार पंचायत चुनाव 2026</span>
        </div>
        <h1>
          चुनाव मित्र<span className="sr-only"> · Chunav Mitra</span>
        </h1>
        <p className="tagline-hi">आपके गाँव का चुनावी साथी — प्रत्याशी प्रबंधन और अपडेट्स एक जगह।</p>
        <p className="tagline-en">Your polling companion — candidate management and updates in one place.</p>

        <div className="cta-row">
          <Link className="btn btn-primary" to="/dashboard">
            My Dashboard · मेरा डैशबोर्ड
          </Link>
          <Link className="btn btn-outline" to="/onboarding">
            Start Onboarding · ऑनबोर्डिंग शुरू करें
          </Link>
        </div>
      </div>

      <section className="home-candidates-section" aria-label="Registered candidates by ward">
        <h2 className="section-heading">Candidates · प्रत्याशी (पंजीकृत)</h2>
        <p className="page-sub home-candidates-intro">
          ₹499 प्रीमियम प्रत्याशी यहाँ वार्ड अनुसार सार्वजनिक दिखते हैं। डेमो डेटा इसी ब्राउज़र में सेव होता है।
        </p>
        {byWard.length === 0 ? (
          <p className="empty-state home-candidates-empty">
            अभी कोई प्रीमियम प्रत्याशी पंजीकृत नहीं। पंजीकरण करके प्रीमियम सक्रिय करें।
          </p>
        ) : (
          <div className="ward-candidate-groups">
            {byWard.map(([ward, list]) => (
              <div key={ward} className="ward-group">
                <h3 className="ward-group-title">
                  Ward {ward} · वार्ड {ward}
                </h3>
                <ul className="home-candidate-chips">
                  {list.map((c) => (
                    <li key={c.id} className="home-candidate-chip">
                      <span lang="hi" className="hc-name-hi">
                        {c.fullNameHi}
                      </span>
                      <span lang="en" className="hc-name-en">
                        {c.fullNameEn}
                      </span>
                      <span className="hc-party">
                        {c.party} · वार्ड {c.ward}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className="home-candidates-links">
          <Link className="btn btn-outline btn-compact" to="/dashboard">
            My Dashboard · मेरा डैशबोर्ड
          </Link>
          <Link className="btn btn-outline btn-compact" to="/profile">
            Complete Profile · पूरा प्रोफ़ाइल
          </Link>
        </div>
      </section>

      <section className="feature-grid" aria-label="Shortcuts">
        <Link className="feature-card" to="/dashboard">
          <span className="feature-icon" aria-hidden>
            �
          </span>
          <div>
            <strong>My Dashboard · मेरा डैशबोर्ड</strong>
            <span>Personalized campaign dashboard with slogans and tools — निजी प्रचार डैशबोर्ड।</span>
          </div>
        </Link>
        <Link className="feature-card" to="/wards">
          <span className="feature-icon" aria-hidden>
            🗳️
          </span>
          <div>
            <strong>Ward Candidates · वार्ड के प्रत्याशी</strong>
            <span>See ward-wise indicative list — वार्ड नंबर चुनकर प्रत्याशी देखें (sample data).</span>
          </div>
        </Link>
        <Link className="feature-card" to="/slogans">
          <span className="feature-icon" aria-hidden>
            📣
          </span>
          <div>
            <strong>Election Slogans · चुनाव नारे</strong>
            <span>Hindi/Bhojpuri slogans for all posts — सभी पदों के लिए नारे।</span>
          </div>
        </Link>
        <Link className="feature-card" to="/results">
          <span className="feature-icon" aria-hidden>
            📊
          </span>
          <div>
            <strong>Chunav Parinaam · चुनाव परिणाम</strong>
            <span>2016 & 2021 election results for Sarfara Panchayat — सरफारा पंचायत चुनाव परिणाम।</span>
          </div>
        </Link>
        <Link className="feature-card" to="/premium">
          <span className="feature-icon" aria-hidden>
            ⭐
          </span>
          <div>
            <strong>Premium · ₹499 में सदस्यता</strong>
            <span>Unlock all features, voter lists, and campaign tools — सभी सुविधाएं खोलें।</span>
          </div>
        </Link>
      </section>
    </OnboardingGuard>
  );
}

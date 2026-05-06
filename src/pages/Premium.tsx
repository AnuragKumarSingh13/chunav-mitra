import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCandidate } from "@/context/CandidateContext";
import { supabase } from "@/lib/supabase";

const UPI_ID = "anuragsingh13@ptaxis";


const WA_CONFIRM_TEXT = "Maine Chunav Mitra Premium ke liye ₹499 pay kar diya";
const WA_CONFIRM_URL = `https://wa.me/919304870703?text=${encodeURIComponent(WA_CONFIRM_TEXT)}`;

export function Premium() {
  const { profile, setPremium } = useCandidate();
  const [copied, setCopied] = useState(false);
  const upiRef = useRef<HTMLElement>(null);

  async function recordPayment(userId: string, amount: number, method: string) {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          amount,
          method,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error recording payment:', error);
      }
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  }

  function demoActivatePremium() {
    setPremium(true);
  }

  
  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
      
      // Record payment when UPI ID is copied
      if (profile) {
        await recordPayment(profile.id, 499, 'UPI');
      }
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Premium Membership · प्रीमियम सदस्यता</h1>
      <p className="page-sub">
        प्रत्याशी प्रीमियम (₹499): सार्वजनिक प्रोफ़ाइल, पूरी मतदाता खोज, वार्ड सूची डाउनलोड, प्रचार व WhatsApp
        टेम्पलेट। भुगतान UI डेमो — पुष्टि के बाद सक्रिय करें।
      </p>

      {profile && (
        <div className="premium-profile-strip">
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            पंजीकृत: <strong lang="hi">{profile.fullNameHi}</strong> ({profile.fullNameEn}) · फ़ोन +91 {profile.phone}
          </p>
          {profile.premium ? (
            <p className="premium-active-msg">
              Premium सक्रिय। <Link to="/profile">प्रोफ़ाइल</Link> पर टूल देखें।
            </p>
          ) : (
            <button type="button" className="btn btn-outline btn-compact" onClick={demoActivatePremium}>
              Demo: भुगतान के बाद सक्रिय मानें · Activate premium
            </button>
          )}
        </div>
      )}

      {!profile && (
        <p className="page-sub" style={{ marginTop: 0 }}>
          <Link to="/register">पहले प्रत्याशी पंजीकरण</Link> करें, फिर यहाँ से प्रीमियम जोड़ें।
        </p>
      )}

      <div className="price-card">
        <p style={{ margin: 0, fontWeight: 700 }}>Candidate Premium · प्रत्याशी प्रीमियम</p>
        <p className="price">₹499</p>
        <p className="per">one-time · डेमो दर — शर्तें लागू</p>

        <ul className="benefits">
          <li>🌐 सार्वजनिक प्रोफ़ाइल · Public candidate profile on home</li>
          <li>🔍 पूरी मतदाता सूची खोज · Full voter search (not only your name)</li>
          <li>⬇️ वार्ड मतदाता सूची CSV डाउनलोड · Ward voter list download</li>
          <li>📣 Hindi campaign post templates · प्रचार संदेश</li>
          <li>📲 WhatsApp broadcast templates · ब्रॉडकास्ट टेम्पलेट</li>
        </ul>

        <div className="upi-pay-row">
          <a 
  href="upi://pay?pa=anuragsingh13@ptaxis&pn=Chunav%20Mitra&am=499&cu=INR&tn=Chunav%20Mitra%20Premium"
  style={{
    display: 'block',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '10px 0'
  }}
>
  💳 UPI se ₹499 Pay Karo
</a>
          <button
            type="button"
            className="btn btn-outline"
            style={{ width: "100%", maxWidth: 280 }}
            onClick={() => upiRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
          >
            QR &amp; details · क्यूआर व विवरण
          </button>
        </div>
      </div>

      <section ref={upiRef} className="upi-section" aria-label="UPI payment">
        <h2 style={{ margin: "0 0 0.35rem", fontSize: "1.05rem" }}>भुगतान निर्देश · Payment instructions</h2>
        <ul className="payment-steps-hi">
          <li>UPI se ₹499 pay karo</li>
          <li>Screenshot WhatsApp karo: 9304870703</li>
          <li>2 ghante mein premium activate ho jayega</li>
        </ul>

        <div className="upi-qr-block">
          <div className="upi-qr-frame">
            <img
              className="upi-qr-image"
              src="/qr-code.png"
              alt="UPI QR code: pay ₹499 to anuragsingh13@ptaxis — Chunav Mitra Premium"
              decoding="async"
              loading="lazy"
            />
          </div>
          <p className="upi-qr-caption">PhonePe/GPay/Paytm se scan karo — ₹499 · {UPI_ID}</p>
        </div>

        <p style={{ margin: "0.65rem 0 0.35rem", fontSize: "0.85rem", color: "var(--muted)" }}>
          UPI ID · यूपीआई आईडी — नीचे कॉपी करके किसी भी ऐप से भेज सकते हैं।
        </p>
        <div className="upi-id-row">
          <code>{UPI_ID}</code>
          <button type="button" className="btn btn-outline" style={{ padding: "0.45rem 0.85rem" }} onClick={copyUpi}>
            {copied ? "Copied! · कॉपी हो गया" : "Copy UPI · UPI कॉपी करें"}
          </button>
        </div>

        <div className="wa-confirm-row">
          <a
            className="btn btn-primary wa-confirm-btn"
            href={WA_CONFIRM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp पर भुगतान की पुष्टि करें · Confirmation
          </a>
          <p className="wa-confirm-hint">{`संदेश तैयार रहेगा: "${WA_CONFIRM_TEXT}"`}</p>
        </div>
      </section>

      <p className="disclaimer">
        Chunav Mitra is not affiliated with the Election Commission. Final voter roll and nominations must be verified
        from official gazette sources. डेमो ऐप — भुगतान बिना पुष्ट प्रक्रिया के न करें।
      </p>
    </>
  );
}

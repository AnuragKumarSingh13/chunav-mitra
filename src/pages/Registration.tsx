import { useId, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCandidate, type CandidatePost } from "@/context/CandidateContext";
import { useAuth } from "@/context/AuthContext";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";
import { supabase } from '../lib/supabase'
import "../styles/app.css";

type Step = "phone" | "otp" | "profile";

const POSTS: { v: CandidatePost; en: string; hi: string }[] = [
  { v: "mukhiya", en: "Mukhiya", hi: "मुखिया" },
  { v: "ward_sadasy", en: "Ward Sadasy", hi: "वार्ड सदस्य" },
  { v: "panch", en: "Panch", hi: "पंच" },
  { v: "sarpanch", en: "Sarpanch", hi: "सरपंच" },
  { v: "panchayat_samiti", en: "Panchayat Samiti Sadasy", hi: "पंचायत समिति सदस्य" },
];

const WARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function Registration() {
  const navigate = useNavigate();
  const { login, verifyOtp, isLoading, error } = useAuth();
  const { saveProfile } = useCandidate();
  const baseId = useId();
  
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  // Profile fields
  const [fullNameEn, setFullNameEn] = useState("");
  const [fullNameHi, setFullNameHi] = useState("");
  const [nameErrors, setNameErrors] = useState({
    en: "",
    hi: ""
  });
  const [district, setDistrict] = useState("Gopalganj");
  const [block, setBlock] = useState("Barauli");
  const [panchayat, setPanchayat] = useState("Sarfara");
  const [ward, setWard] = useState(1);
  const [post, setPost] = useState<CandidatePost>("ward_sadasy");
  
  // Dropdown data
  const [districts, setDistricts] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [panchayats, setPanchayats] = useState<any[]>([]);

  const digitsOk = /^\d{10}$/.test(phone);
  const otpOk = /^\d{4}$/.test(otp);
  const phoneOk = /^\d{10}$/.test(phone.replace(/\D/g, ""));

  // Language validation functions
  const isDevanagari = (text: string) => /^[\u0900-\u097F\s]+$/.test(text);
  const isEnglish = (text: string) => /^[a-zA-Z\s]+$/.test(text);

  const handleEnglishNameChange = (value: string) => {
    setFullNameEn(value);
    if (value && !isEnglish(value)) {
      setNameErrors(prev => ({ ...prev, en: "Please type in English only" }));
    } else {
      setNameErrors(prev => ({ ...prev, en: "" }));
    }
  };

  const handleHindiNameChange = (value: string) => {
    setFullNameHi(value);
    if (value && !isDevanagari(value)) {
      setNameErrors(prev => ({ ...prev, hi: "कृपया हिंदी में लिखें" }));
    } else {
      setNameErrors(prev => ({ ...prev, hi: "" }));
    }
  };
  // Fetch functions for dropdowns
  const fetchDistricts = async () => {
    const { data: districtData } = await supabase
      .from('districts')
      .select('district')
      .order('district');
    
    if (districtData) {
      const uniqueDistricts = districtData.map(d => ({ district: d.district }));
      setDistricts(uniqueDistricts);
    }
  };

  const fetchBlocks = async (selectedDistrict: string) => {
    const { data: blockData } = await supabase
      .from('blocks')
      .select('block')
      .eq('district', selectedDistrict)
      .order('block');
    
    if (blockData) {
      const uniqueBlocks = blockData.map(b => ({ block: b.block }));
      setBlocks(uniqueBlocks);
    }
  };

  const fetchPanchayats = async (selectedDistrict: string, selectedBlock: string) => {
    const { data: panchayatData } = await supabase
      .from('panchayats')
      .select('panchayat')
      .eq('district', selectedDistrict)
      .eq('block', selectedBlock)
      .order('panchayat');
    
    if (panchayatData) {
      const uniquePanchayats = panchayatData.map(p => ({ panchayat: p.panchayat }));
      setPanchayats(uniquePanchayats);
    }
  };

  // Load temp phone from localStorage on component mount
  useEffect(() => {
    const tempPhone = localStorage.getItem('tempPhone');
    if (tempPhone) {
      setPhone(tempPhone);
      setStep("profile"); // Skip to profile step if phone already verified
    }
    fetchDistricts();
  }, []);

  // Load blocks when district changes
  useEffect(() => {
    if (district) {
      fetchBlocks(district);
    }
  }, [district]);

  // Load panchayats when district and block change
  useEffect(() => {
    if (district && block) {
      fetchPanchayats(district, block);
    }
  }, [district, block]);

  const canSubmitProfile =
    fullNameEn.trim().length >= 2 &&
    fullNameHi.trim().length >= 2 &&
    district.trim() &&
    block.trim() &&
    panchayat.trim() &&
    phoneOk &&
    !nameErrors.en &&
    !nameErrors.hi;

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
      // Save tempPhone to localStorage for future use
      localStorage.setItem('tempPhone', phone);
      
      // Check if user already exists in Supabase
      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('phone', phone.replace(/\D/g, "").slice(0, 10))
          .single();
        
        if (existingUser) {
          // User exists - save to localStorage and go to dashboard
          localStorage.setItem('chunavMitraUser', JSON.stringify(existingUser));
          localStorage.setItem('user', JSON.stringify(existingUser));
          navigate("/dashboard", { replace: true });
          return;
        }
        
        // User doesn't exist - go to registration
        setStep("profile");
      } catch (error) {
        console.error('Error checking user existence:', error);
        setStep("profile");
      }
    }
  }

  
async function submitProfile(e: React.FormEvent) {
  e.preventDefault();
  if (!canSubmitProfile) return;
    
  const phoneNum = phone.replace(/\D/g, "").slice(0, 10);
  const name = fullNameEn;
  const hindiName = fullNameHi;
  
  try {
  const insertData = {
    phone: phoneNum,
    name: name, 
    hindi_name: hindiName,
    post: post,
    ward: ward,
    panchayat: 'Sarfara',
    is_premium: false
  }
  
  const result = await supabase.from('users').insert(insertData)
  
  if (result.error) {
    alert('DB Error: ' + result.error.message)
    return
  }
  
  localStorage.setItem('chunavMitraUser', JSON.stringify(insertData))
  
  saveProfile({
    fullNameEn: name,
    fullNameHi: hindiName,
    age: 25, // Default age since not required
    gender: "male", // Default gender since not required
    district,
    block,
    panchayat: 'Sarfara',
    ward: ward,
    post: post,
    party: "Independent",
    phone: phoneNum,
    id: undefined,
  });
  
  navigate('/dashboard')
  
} catch(e) {
  alert('Exception: ' + e.message)
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
            <small>Registration · पंजीकरण</small>
          </span>
        </div>
      </header>

      <main className="login-main">
        <h1 className="page-title">Registration · पंजीकरण</h1>
        <p className="page-sub">
          {step === "phone" && "Mobile number + OTP (Demo OTP: 1234)"}
          {step === "otp" && "4-digit OTP verify करें"}
          {step === "profile" && "अपनी जानकारी भरें"}
        </p>

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

        {step === "phone" && (
          <div className="login-card">
            <label className="field-label" htmlFor={`${baseId}-phone`}>
              Mobile number · मोबाइल नंबर
            </label>
            <div className="phone-row">
              <span className="phone-cc" aria-hidden>
                +91
              </span>
              <input
                id={`${baseId}-phone`}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                disabled={!!localStorage.getItem('tempPhone')}
              />
            </div>
            <button type="button" className="btn btn-primary login-full" disabled={!digitsOk || isLoading} onClick={sendOtp}>
              {isLoading ? "Sending… · भेज रहे हैं" : "OTP Bhejo · OTP भेजें"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="login-card">
            <p className="otp-sent">
              OTP sent to <strong>+91 {phone}</strong>{" "}
              <button type="button" className="link-btn" onClick={() => setStep("phone")}>
                Edit · बदलें
              </button>
            </p>
            <label className="field-label" htmlFor={`${baseId}-otp`}>
              Enter 4-digit OTP · चार अंकों का OTP
            </label>
            <input
              id={`${baseId}-otp`}
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
          </div>
        )}

        {step === "profile" && (
          <form className="login-card register-form" onSubmit={submitProfile}>
            <label className="field-label" htmlFor={`${baseId}-en`}>
              Full name (English) · पूरा नाम (अंग्रेज़ी)
            </label>
            <input
              id={`${baseId}-en`}
              required
              autoComplete="name"
              value={fullNameEn}
              onChange={(e) => handleEnglishNameChange(e.target.value)}
              style={{ borderColor: nameErrors.en ? "var(--error)" : "var(--border)" }}
            />
            {nameErrors.en && (
              <div style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {nameErrors.en}
              </div>
            )}

            <label className="field-label" htmlFor={`${baseId}-hi`}>
              Full name (Hindi) · पूरा नाम (हिंदी)
            </label>
            <input
              id={`${baseId}-hi`}
              required
              lang="hi"
              value={fullNameHi}
              onChange={(e) => handleHindiNameChange(e.target.value)}
              style={{ borderColor: nameErrors.hi ? "var(--error)" : "var(--border)" }}
            />
            {nameErrors.hi && (
              <div style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {nameErrors.hi}
              </div>
            )}

            
            <label className="field-label" htmlFor={`${baseId}-dist`}>
              District · ज़िला
            </label>
            <select 
              id={`${baseId}-dist`} 
              required 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select District · ज़िला चुनें</option>
              {districts.map((dist: any, index: number) => (
                <option key={index} value={dist.district}>
                  {dist.district}
                </option>
              ))}
            </select>

            <label className="field-label" htmlFor={`${baseId}-block`}>
              Block · प्रखंड
            </label>
            <select 
              id={`${baseId}-block`} 
              required 
              value={block} 
              onChange={(e) => setBlock(e.target.value)}
              disabled={!district}
            >
              <option value="">Select Block · प्रखंड चुनें</option>
              {blocks.map((blk: any, index: number) => (
                <option key={index} value={blk.block}>
                  {blk.block}
                </option>
              ))}
            </select>

            <label className="field-label" htmlFor={`${baseId}-pan`}>
              Panchayat · पंचायत
            </label>
            <select 
              id={`${baseId}-pan`} 
              required 
              value={panchayat} 
              onChange={(e) => setPanchayat(e.target.value)}
              disabled={!district || !block}
            >
              <option value="">Select Panchayat · पंचायत चुनें</option>
              {panchayats.map((panch: any, index: number) => (
                <option key={index} value={panch.panchayat}>
                  {panch.panchayat}
                </option>
              ))}
            </select>

            <label className="field-label" htmlFor={`${baseId}-ward`}>
              Ward number · वार्ड संख्या
            </label>
            <select id={`${baseId}-ward`} value={ward} onChange={(e) => setWard(Number(e.target.value))}>
              {WARDS.map((w) => (
                <option key={w} value={w}>
                  Ward {w} · वार्ड {w}
                </option>
              ))}
            </select>

            <label className="field-label" htmlFor={`${baseId}-post`}>
              Post · पद
            </label>
            <select id={`${baseId}-post`} value={post} onChange={(e) => setPost(e.target.value as CandidatePost)}>
              {POSTS.map(({ v, en, hi }) => (
                <option key={v} value={v}>
                  {hi} · {en}
                </option>
              ))}
            </select>

            <label className="field-label" htmlFor={`${baseId}-state`}>
              State · राज्य
            </label>
            <input 
              id={`${baseId}-state`} 
              value="Bihar" 
              disabled 
              style={{ backgroundColor: "var(--muted-bg)" }}
            />

            <button type="submit" className="btn btn-primary login-full" disabled={!canSubmitProfile}>
              Complete Registration · पंजीकरण पूर्ण करें
            </button>
          </form>
        )}

        <p className="login-note">
          Demo: Use OTP <strong>1234</strong> for registration. असली OTP बाद में कनेक्ट करें।
        </p>
      </main>
    </div>
  );
}

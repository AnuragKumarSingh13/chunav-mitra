import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCandidate, type CandidatePost, type CandidateParty, type Gender } from "@/context/CandidateContext";
import { useAuth } from "@/context/AuthContext";
import { LoginRequired } from "@/components/LoginRequired";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";
import "../styles/app.css";

const GENDERS: { v: Gender; en: string; hi: string }[] = [
  { v: "male", en: "Male", hi: "पुरुष" },
  { v: "female", en: "Female", hi: "महिला" },
  { v: "other", en: "Other", hi: "अन्य" },
];

const POSTS: { v: CandidatePost; en: string; hi: string }[] = [
  { v: "mukhiya", en: "Mukhiya", hi: "मुखिया" },
  { v: "ward_sadasy", en: "Ward Sadasy", hi: "वार्ड सदस्य" },
  { v: "panch", en: "Panch", hi: "पंच" },
  { v: "sarpanch", en: "Sarpanch", hi: "सरपंच" },
  { v: "panchayat_samiti", en: "Panchayat Samiti Sadasy", hi: "पंचायत समिति सदस्य" },
];


const WARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function CandidateRegister() {
  const navigate = useNavigate();
  const { saveProfile, profile } = useCandidate();
  const { user } = useAuth();
  const baseId = useId();

  const [fullNameEn, setFullNameEn] = useState(profile?.fullNameEn ?? "");
  const [fullNameHi, setFullNameHi] = useState(profile?.fullNameHi ?? "");
  const [age, setAge] = useState(profile?.age ? String(profile.age) : "");
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "male");
  const [district, setDistrict] = useState(profile?.district ?? "Gopalganj");
  const [block, setBlock] = useState(profile?.block ?? "Barauli");
  const [panchayat, setPanchayat] = useState(profile?.panchayat ?? "Sarfara");
  const [ward, setWard] = useState(profile?.ward ?? 1);
  const [post, setPost] = useState<CandidatePost>(profile?.post ?? "ward_sadasy");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  const ageNum = Number(age);
  const ageOk = Number.isFinite(ageNum) && ageNum >= 18 && ageNum <= 120;
  const phoneOk = /^\d{10}$/.test(phone.replace(/\D/g, ""));
  const canSubmit =
    fullNameEn.trim().length >= 2 &&
    fullNameHi.trim().length >= 2 &&
    ageOk &&
    district.trim() &&
    block.trim() &&
    panchayat.trim() &&
    phoneOk;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    saveProfile({
      fullNameEn,
      fullNameHi,
      age: ageNum,
      gender,
      district,
      block,
      panchayat,
      ward,
      post,
      party: "Independent",
      phone: phone.replace(/\D/g, "").slice(0, 10),
      id: profile?.id,
    });
    navigate("/profile", { replace: true });
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
            <small>Candidate registration · प्रत्याशी पंजीकरण</small>
          </span>
        </div>
      </header>

      <main className="login-main">
        <h1 className="page-title">Candidate registration · प्रत्याशी पंजीकरण</h1>
        <p className="page-sub">
          सभी फ़ील्ड भरें। सबमिट के बाद आपका प्रोफ़ाइल कार्ड दिखेगा। Demo — डेटा इसी डिवाइस पर सेव होता है।
        </p>

        {user ? (
          <form className="login-card register-form" onSubmit={submit}>
          <label className="field-label" htmlFor={`${baseId}-en`}>
            Full name (English) · पूरा नाम (अंग्रेज़ी)
          </label>
          <input
            id={`${baseId}-en`}
            required
            autoComplete="name"
            value={fullNameEn}
            onChange={(e) => setFullNameEn(e.target.value)}
          />

          <label className="field-label" htmlFor={`${baseId}-hi`}>
            Full name (Hindi) · पूरा नाम (हिंदी)
          </label>
          <input
            id={`${baseId}-hi`}
            required
            lang="hi"
            value={fullNameHi}
            onChange={(e) => setFullNameHi(e.target.value)}
          />

          <label className="field-label" htmlFor={`${baseId}-age`}>
            Age · उम्र
          </label>
          <input
            id={`${baseId}-age`}
            inputMode="numeric"
            maxLength={3}
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
          />

          <fieldset className="register-fieldset">
            <legend className="field-label">Gender · लिंग</legend>
            <div className="chip-row">
              {GENDERS.map(({ v, en, hi }) => (
                <label key={v} className={`chip${gender === v ? " chip-on" : ""}`}>
                  <input
                    type="radio"
                    name="gender"
                    value={v}
                    checked={gender === v}
                    onChange={() => setGender(v)}
                  />
                  <span>
                    {hi} · {en}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field-label" htmlFor={`${baseId}-dist`}>
            District · ज़िला (Gopalganj)
          </label>
          <input id={`${baseId}-dist`} required value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Gopalganj" />

          <label className="field-label" htmlFor={`${baseId}-block`}>
            Block · प्रखंड (Barauli)
          </label>
          <input id={`${baseId}-block`} required value={block} onChange={(e) => setBlock(e.target.value)} placeholder="Barauli" />

          <label className="field-label" htmlFor={`${baseId}-pan`}>
            Panchayat · पंचायत (Sarfara)
          </label>
          <input id={`${baseId}-pan`} required value={panchayat} onChange={(e) => setPanchayat(e.target.value)} placeholder="Sarfara" />

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

          
          <label className="field-label" htmlFor={`${baseId}-phone`}>
            Phone number · फ़ोन नंबर
          </label>
          <div className="phone-row">
            <span className="phone-cc" aria-hidden>
              +91
            </span>
            <input
              id={`${baseId}-phone`}
              type="tel"
              inputMode="numeric"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </div>

          <button type="submit" className="btn btn-primary login-full" disabled={!canSubmit}>
            Save profile · प्रोफ़ाइल सेव करें
          </button>
        </form>
        ) : (
          <LoginRequired />
        )}

        <p className="login-note">
          फ्री उपयोगकर्ता मतदाता सूची में केवल अपना नाम खोज सकते हैं। सार्वजनिक प्रोफ़ाइल व अन्य सुविधाएँ ₹499 प्रीमियम में।
        </p>
      </main>
    </div>
  );
}

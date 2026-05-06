import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

const STORAGE_MY = "chunav_mitra_my_candidate";
const STORAGE_PREMIUM = "chunav_mitra_premium";

export type Gender = "male" | "female" | "other";
export type CandidatePost = "mukhiya" | "ward_sadasy" | "panch" | "sarpanch" | "panchayat_samiti";
export type CandidateParty = "JDU" | "RJD" | "BJP" | "INC" | "Independent";

export type RegisteredCandidateProfile = {
  id: string;
  fullNameEn: string;
  fullNameHi: string;
  age: number;
  gender: Gender;
  district: string;
  block: string;
  panchayat: string;
  ward: number;
  post: CandidatePost;
  party: CandidateParty;
  phone: string;
  premium: boolean;
  registeredAt: string;
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveMy(p: RegisteredCandidateProfile | null) {
  if (!p) localStorage.removeItem(STORAGE_MY);
  else localStorage.setItem(STORAGE_MY, JSON.stringify(p));
}

export function normalizeKey(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function genId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

type CandidateContextValue = {
  profile: RegisteredCandidateProfile | null;
  registry: RegisteredCandidateProfile[];
  saveProfile: (p: Omit<RegisteredCandidateProfile, "id" | "premium" | "registeredAt"> & { id?: string }) => void;
  setPremium: (premium: boolean) => void;
  setUserPremium: (userId: string, premium: boolean) => void;
  refresh: () => void;
  isPremium: boolean;
};

const CandidateContext = createContext<CandidateContextValue | null>(null);

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<RegisteredCandidateProfile[]>([]);
  const [profile, setProfile] = useState<RegisteredCandidateProfile | null>(() =>
    loadJson<RegisteredCandidateProfile | null>(STORAGE_MY, null)
  );
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_MY);
    const savedPremium = localStorage.getItem(STORAGE_PREMIUM);

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);

        // Check if profile has premium status
        if (parsedProfile.premium) {
          setIsPremium(true);
          localStorage.setItem(STORAGE_PREMIUM, "true");
        }
      } catch {
        localStorage.removeItem(STORAGE_MY);
      }
    }

    if (savedPremium) {
      try {
        setIsPremium(JSON.parse(savedPremium));
      } catch {
        localStorage.removeItem(STORAGE_PREMIUM);
      }
    }

    // Load registry from Supabase
    loadRegistryFromSupabase();
  }, []);

  const loadRegistryFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Error loading users from Supabase:', error);
        return;
      }
      
      // Transform Supabase data to match local structure
      const transformedData = (data || []).map(user => ({
        id: user.phone, // Use phone as ID for compatibility
        fullNameEn: user.name,
        fullNameHi: user.hindi_name,
        age: 25, // Default age
        gender: 'male' as const, // Default gender
        district: 'Gopalganj', // Default district
        block: 'Barauli', // Default block
        panchayat: user.panchayat || 'Sarfara',
        ward: user.ward || 1,
        post: user.post,
        party: 'Independent' as const, // Default party
        phone: user.phone,
        premium: user.is_premium || false,
        registeredAt: new Date().toISOString()
      }));
      
      setRegistry(transformedData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const refresh = useCallback(() => {
    setProfile(loadJson<RegisteredCandidateProfile | null>(STORAGE_MY, null));
    setIsPremium(loadJson<boolean>(STORAGE_PREMIUM, false));
    loadRegistryFromSupabase();
  }, []);

  const saveProfile = useCallback(
    async (
      input: Omit<RegisteredCandidateProfile, "id" | "premium" | "registeredAt"> & {
        id?: string;
      }
    ) => {
      const now = new Date().toISOString();
      const phoneDigits = input.phone.replace(/\D/g, "").slice(0, 10);
      const byPhone = registry.find((r) => r.phone === phoneDigits);
      const existingId = input.id ?? profile?.id ?? byPhone?.id;
      const prev = existingId ? registry.find((r) => r.id === existingId) ?? byPhone : byPhone;
      const next: RegisteredCandidateProfile = {
        id: prev?.id ?? existingId ?? genId(),
        fullNameEn: input.fullNameEn.trim(),
        fullNameHi: input.fullNameHi.trim(),
        age: input.age,
        gender: input.gender,
        district: input.district.trim(),
        block: input.block.trim(),
        panchayat: input.panchayat.trim(),
        ward: input.ward,
        post: input.post,
        party: input.party,
        phone: phoneDigits,
        premium: prev?.premium ?? false,
        registeredAt: prev?.registeredAt ?? now,
      };

      try {
        // Save to Supabase users table
        const { error } = await supabase
          .from('users')
          .upsert({
            phone: next.phone,
            name: next.fullNameEn,
            hindi_name: next.fullNameHi,
            post: next.post,
            ward: next.ward,
            panchayat: next.panchayat,
            is_premium: next.premium
          }, { onConflict: 'phone' });

        if (error) {
          console.error('Error saving profile to Supabase:', error);
          return;
        }

        // Update local state
        const list = [...registry.filter((r) => r.id !== next.id && r.phone !== next.phone), next];
        saveMy(next);
        setRegistry(list);
        setProfile(next);
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    },
    [profile, registry]
  );

  const setPremium = useCallback(
    async (premium: boolean) => {
      if (!profile) return;
      const next = { ...profile, premium };
      
      try {
        // Update Supabase users table
        const { error } = await supabase
          .from('users')
          .update({ is_premium: premium })
          .eq('phone', next.phone);

        if (error) {
          console.error('Error updating premium status in Supabase:', error);
          return;
        }

        // Update local state
        const list = registry.map((r) => (r.id === next.id ? next : r));
        if (!list.some((r) => r.id === next.id)) list.push(next);
        saveMy(next);
        setRegistry(list);
        setProfile(next);
        setIsPremium(premium);
        localStorage.setItem(STORAGE_PREMIUM, JSON.stringify(premium));
      } catch (error) {
        console.error('Error updating premium status:', error);
      }
    },
    [profile, registry]
  );

  const setUserPremium = useCallback(
    async (userId: string, premium: boolean) => {
      const user = registry.find((r) => r.id === userId);
      if (!user) return;
      
      const updatedUser = { ...user, premium };
      
      try {
        // Update Supabase users table
        const { error } = await supabase
          .from('users')
          .update({ is_premium: premium })
          .eq('phone', user.phone);

        if (error) {
          console.error('Error updating user premium in Supabase:', error);
          return;
        }

        // Update local state
        const list = registry.map((r) => (r.id === userId ? updatedUser : r));
        setRegistry(list);
        
        // If updating current user, also update their profile and premium status
        if (profile && profile.id === userId) {
          saveMy(updatedUser);
          setProfile(updatedUser);
          setIsPremium(premium);
          localStorage.setItem(STORAGE_PREMIUM, JSON.stringify(premium));
        }
      } catch (error) {
        console.error('Error updating user premium:', error);
      }
    },
    [registry, profile]
  );

  const value = useMemo(
    () => ({ profile, registry, saveProfile, setPremium, setUserPremium, refresh, isPremium }),
    [profile, registry, saveProfile, setPremium, setUserPremium, refresh, isPremium]
  );

  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
}

export function useCandidate() {
  const ctx = useContext(CandidateContext);
  if (!ctx) throw new Error("useCandidate must be used within CandidateProvider");
  return ctx;
}

/** Premium registrations visible on home / public directory. */
export function getPublicPremiumCandidates(registry: RegisteredCandidateProfile[]) {
  return registry.filter((r) => r.premium);
}

export function groupCandidatesByWard(cands: RegisteredCandidateProfile[]) {
  const map = new Map<number, RegisteredCandidateProfile[]>();
  for (const c of cands) {
    const w = c.ward;
    if (!map.has(w)) map.set(w, []);
    map.get(w)!.push(c);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

import type { Voter } from "@/data/mockData";
import type { RegisteredCandidateProfile } from "@/context/CandidateContext";
import { normalizeKey } from "@/context/CandidateContext";

function words(s: string) {
  return normalizeKey(s)
    .split(/\s+/)
    .map((w) => w.replace(/[.,()]/g, ""))
    .filter((w) => w.length >= 2);
}

/** Whether sample roll row likely matches the registered candidate's name. */
export function voterMatchesCandidateName(v: Voter, p: RegisteredCandidateProfile): boolean {
  const vEn = normalizeKey(v.nameEn);
  const vHi = normalizeKey(v.nameHi);
  const pool = new Set([...words(p.fullNameEn), ...words(p.fullNameHi)]);
  for (const w of pool) {
    if (vEn.includes(w) || vHi.includes(w) || w.includes(vEn) || w.includes(vHi)) return true;
  }
  const pe = normalizeKey(p.fullNameEn);
  const ph = normalizeKey(p.fullNameHi);
  if (pe.length >= 2 && (vEn.includes(pe) || vHi.includes(pe))) return true;
  if (ph.length >= 2 && (vEn.includes(ph) || vHi.includes(ph))) return true;
  return false;
}

export function searchQueryAllowedForFreeCandidate(
  q: string,
  p: RegisteredCandidateProfile
): boolean {
  const n = normalizeKey(q);
  if (!n) return true;
  const parts = [normalizeKey(p.fullNameEn), normalizeKey(p.fullNameHi), ...words(p.fullNameEn), ...words(p.fullNameHi)];
  return parts.some((part) => part.length >= 1 && n.length >= 1 && (part.includes(n) || n.includes(part)));
}

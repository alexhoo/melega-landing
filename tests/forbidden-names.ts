import { createHash } from 'node:crypto';

/**
 * SHA-256 of the lower-cased org-chart surnames from the client dossier. Stored as hashes so the
 * (public) repo never contains the names themselves.
 */
export const ORG_CHART_NAME_HASHES = new Set([
  'fbeeb691742aaacb0fc61627b04de83323a6d9e6d86921208bf62d203383fb65',
  '89d647c25fd5da8f150f917fb8841264c4fa7ca9a42c836268d48984e7bb96b6',
  '6cab0318decc3fccc88849b00d522ccca457387380dc1040437ee2ac014411c0',
  '51d671049063bb0ec73fee685600dbb2f1cd439f4e3f58afc3788ead5004e3b6',
]);

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

/** True if any one- or two-word sequence in `text` hashes to one of `hashes`. */
export function containsHashedName(text: string, hashes: Set<string> = ORG_CHART_NAME_HASHES): boolean {
  const words = text.toLowerCase().match(/[\p{L}]+/gu) ?? [];
  return words.some((w, i) => hashes.has(sha256(w)) || (i > 0 && hashes.has(sha256(`${words[i - 1]} ${w}`))));
}

import { ScoredCandidate } from './types';

export function normalizeScores(candidates: ScoredCandidate[]): ScoredCandidate[] {
    if (candidates.length === 0) return [];

    const scores = candidates.map(c => c.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    // If all scores are the same, or single candidate, default to 1 or proportional
    if (maxScore === minScore) {
        return candidates.map(c => ({ ...c, score: 1.0 }));
    }

    return candidates.map(c => ({
        ...c,
        // (x - min) / (max - min)
        score: Number(((c.score - minScore) / (maxScore - minScore)).toFixed(2))
    }));
}

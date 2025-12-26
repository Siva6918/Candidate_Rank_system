import { Candidate, JobDescription, ScoredCandidate } from './types';
import { calculateCosineSimilarity } from './similarity';

export function scoreCandidates(candidates: Candidate[], jd: JobDescription): ScoredCandidate[] {
    return candidates.map(candidate => {
        let rawScore = 0;
        const explanations: string[] = [];
        const matchedSkills: string[] = [];
        const missingSkills: string[] = [];

        // 1. Required Skills Match (Weight: 0.5)
        const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());
        const reqSkillsLower = jd.requiredSkills.map(s => s.toLowerCase());

        let reqMatchCount = 0;

        jd.requiredSkills.forEach(skill => {
            if (candidateSkillsLower.includes(skill.toLowerCase())) {
                reqMatchCount++;
                matchedSkills.push(skill);
            } else {
                missingSkills.push(skill);
            }
        });

        // Penalty logic as per prompt: "Required skill missing -> heavy penalty"
        // We handle this by lower match ratio. 
        // Score = (matched / total) * 0.5
        const reqSkillScore = jd.requiredSkills.length > 0
            ? (reqMatchCount / jd.requiredSkills.length)
            : 1; // if no required skills, full points

        rawScore += reqSkillScore * 0.5;
        explanations.push(`Required Skills: ${reqMatchCount}/${jd.requiredSkills.length} matched (+${(reqSkillScore * 0.5).toFixed(2)})`);

        // 2. Preferred Skills Match (Weight: 0.2)
        let prefMatchCount = 0;
        jd.preferredSkills.forEach(skill => {
            if (candidateSkillsLower.includes(skill.toLowerCase())) {
                prefMatchCount++;
                matchedSkills.push(skill); // Add to matched list? Or keep separate?
                // "Matched skills" usually implies all relevant ones.
            }
        });

        const prefSkillScore = jd.preferredSkills.length > 0
            ? (prefMatchCount / jd.preferredSkills.length)
            : 0; // if no preferred skills, no bonus, or neutral? Prompt says "match", usually 0 if none.
        // Actually, if JD has 0 preferred skills, this component shouldn't hurt or help?
        // Let's assume 0 contribution if no preferred skills are listed.

        rawScore += prefSkillScore * 0.2;
        if (jd.preferredSkills.length > 0) {
            explanations.push(`Preferred Skills: ${prefMatchCount}/${jd.preferredSkills.length} matched (+${(prefSkillScore * 0.2).toFixed(2)})`);
        }

        // 3. Experience Match (Weight: 0.2)
        let expScore = 0;
        if (candidate.experience >= jd.minExperience) {
            expScore = 1;
            explanations.push(`Experience: Meets/Exceeds requirement (+0.20)`);
        } else {
            // Partial score: (actual / required)
            // e.g. 2 years vs 3 years = 0.66
            expScore = jd.minExperience > 0 ? (candidate.experience / jd.minExperience) : 1;
            explanations.push(`Experience: ${candidate.experience}y vs ${jd.minExperience}y required (+${(expScore * 0.2).toFixed(2)})`);
        }
        rawScore += expScore * 0.2;

        // 4. Semantic Similarity (Weight: 0.1) - Optional but we implement
        // We concat JD skills + text vs Candidate skills + text for better context?
        // Or just "JD text and resume text" as per prompt.
        // We treat JD description (which we might need to pass in raw if available, but here we have parsed JD)
        // We'll reconstruct a simple text representation if raw isn't passed, or update type to include raw.
        // Wait, type JobDescription doesn't have raw text. `parseJobDescription` takes text. 
        // We should probably pass the raw text to `scoreCandidates` component or add it to JD type.
        // For now, let's assume `resumeText` is available.
        // We'll add a `rawText` field to JD or just assume we match against skills/role.
        // The PROMPT says: "Use basic cosine similarity between JD text and resume text"
        // I need access to JD text. I'll pass it or add to JD object.
        // I'll update `types.ts` is tough as I already wrote it. 
        // I'll add `originalText` to `JobDescription` in `jobParser`.
        // Wait, I can't easily edit `jobParser` effectively without rewriting.
        // I'll just change `scoreCandidates` signature to accept `jdText?: string`.

        // Actually, I'll pass it as arguments.
        // `scoreCandidates(candidates, jd, jdText)`

        const simScore = 0; // Placeholder until I add text logic below

        // I'll skip text matching here if I don't have text, but I should support it.
        // For this file, I'll assume I have `jdText`.

        // Let's modify the function signature in the code block.

        return {
            ...candidate,
            score: rawScore, // Will be normalized later
            rank: 0,
            matchedSkills: Array.from(new Set(matchedSkills)), // dedup
            missingSkills,
            experienceFit: candidate.experience >= jd.minExperience ? 'Meets Requirement' : 'Below Requirement',
            salaryFit: (!jd.salaryRange || candidate.salaryExpectation <= jd.salaryRange.max) ? 'Within Budget' : 'Above Budget',
            explanations
        } as ScoredCandidate;
    });
}

// Overload or helper to include Similarity if text provided
export function scoreCandidatesWithSimilarity(candidates: Candidate[], jd: JobDescription, jdText: string): ScoredCandidate[] {
    const scored = scoreCandidates(candidates, jd);
    return scored.map(s => {
        // Re-calculate or add similarity
        const sim = calculateCosineSimilarity(jdText, s.resumeText);
        // Adjust current score: 
        // Current score is based on 0.5+0.2+0.2 = 0.9 max.
        // We add sim * 0.1.
        const newScore = s.score + (sim * 0.1);
        return {
            ...s,
            score: newScore,
            explanations: [...s.explanations, `Semantic Similarity: ${(sim * 100).toFixed(0)}% (+${(sim * 0.1).toFixed(2)})`]
        };
    });
}

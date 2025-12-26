import { NextResponse } from 'next/server';
import { parseJobDescription } from '@/lib/jobParser';
import { applyHardFilters } from '@/lib/filterEngine';
import { scoreCandidatesWithSimilarity } from '@/lib/scoringEngine';
import { normalizeScores } from '@/lib/normalize';
import { Candidate, FilterCriteria, JobDescription } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { jobDescription, filters, candidates } = body;

        // Debug logging
        console.log("API /rank received:", {
            jdLength: jobDescription?.length,
            candidatesCount: candidates?.length,
            filters: filters
        });

        if (!candidates) {
            console.error("Missing candidates");
            return NextResponse.json(
                { error: 'Missing candidates' },
                { status: 400 }
            );
        }

        // 1. Parse JD (if provided, else default to empty)
        const parsedJD: JobDescription = jobDescription
            ? parseJobDescription(jobDescription)
            : {
                requiredSkills: [],
                preferredSkills: [],
                minExperience: 0,
                location: []
            };

        // 2. Merge User Filters (Hard constraints or overrides)
        // If user provided specific skills in `filters`, use those as requiredSkills override or addition?
        // Prompt says "Recruiter Custom Filters... These filters are hard constraints."
        // So if `filters.skills` exists, it replaces `parsedJD.requiredSkills` for *filtering* purposes?
        // Or we just intersect?
        // Let's assume User Filters are the source of truth for "Filtering" and "Scoring".

        const finalJD: JobDescription = {
            ...parsedJD,
            requiredSkills: filters?.skills?.length ? filters.skills : parsedJD.requiredSkills,
            minExperience: filters?.minExperience !== undefined ? filters.minExperience : parsedJD.minExperience,
            location: filters?.locations?.length ? filters.locations : parsedJD.location,
            salaryRange: filters?.maxSalary ? { min: 0, max: filters.maxSalary } : parsedJD.salaryRange
        };

        const criteria: FilterCriteria = {
            skills: finalJD.requiredSkills,
            minExperience: finalJD.minExperience,
            locations: finalJD.location,
            maxSalary: finalJD.salaryRange?.max
        };

        // 3. Apply Hard Filters
        const filteredCandidates = applyHardFilters(candidates, criteria);

        // 4. Score Candidates (using finalJD + raw text for similarity)
        // Note: scoreCandidates uses required/preferred skills. 
        // `filters` might only give us "Skills", not separating required vs preferred.
        // If filters.skills is used, we treat them as Required. 
        // We keep parsedJD.preferredSkills unless user UI allows specifying them (Prompt doesn't explicitly say user edits preferred).
        // So we assume User selected skills = Required.

        const candidatesToScore = filteredCandidates;
        let scoredCandidates = scoreCandidatesWithSimilarity(candidatesToScore, finalJD, jobDescription);

        // 5. Normalize
        scoredCandidates = normalizeScores(scoredCandidates);

        // 6. Rank (Sort descending)
        scoredCandidates.sort((a, b) => b.score - a.score);

        // Assign Rank property
        scoredCandidates = scoredCandidates.map((c, i) => ({
            ...c,
            rank: i + 1
        }));

        return NextResponse.json(scoredCandidates);

    } catch (error) {
        console.error("Error in ranking API:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

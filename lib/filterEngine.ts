import { Candidate, FilterCriteria } from './types';
import { isFuzzyMatch } from './similarity';

export function applyHardFilters(candidates: Candidate[], filters: FilterCriteria): Candidate[] {
    return candidates.filter(candidate => {
        // 1. Minimum Experience
        if (filters.minExperience && candidate.experience < filters.minExperience) {
            return false;
        }

        // 2. Location (Fuzzy Match)
        if (filters.locations && filters.locations.length > 0) {
            // Check if candidate's location matches ANY allowed location (fuzzy)
            const matchesAny = filters.locations.some(allowedLoc =>
                isFuzzyMatch(allowedLoc, candidate.location)
            );

            if (!matchesAny) {
                return false;
            }
        }

        // 3. Max Salary (Budget) - Candidate expectation should not exceed max budget
        if (filters.maxSalary && candidate.salaryExpectation > filters.maxSalary) {
            return false;
        }

        // 4. Skills 
        // MOVED TO SCORING: Per Prompt Section 4, "Hard Reject" applies to Experience, Location, and Salary.
        // Skills are handled in the Scoring Engine (Section 5) where missing skills incur a penalty.
        // This prevents "No Candidates" when the JD Parser extracts too many keywords (like Python + Java + React).

        return true;
    });
}

export interface JobDescription {
  requiredSkills: string[];
  preferredSkills: string[];
  minExperience: number;
  location: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
}

export interface Candidate {
  id: string;
  name: string;
  skills: string[];
  experience: number;
  location: string;
  salaryExpectation: number;
  resumeText: string;
}

export interface FilterCriteria {
  skills?: string[];
  minExperience?: number;
  locations?: string[];
  maxSalary?: number;
}

export interface ScoredCandidate extends Candidate {
  score: number;
  rank: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceFit: 'Meets Requirement' | 'Below Requirement';
  salaryFit: 'Within Budget' | 'Above Budget';
  explanations: string[];
}

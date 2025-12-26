import { JobDescription } from './types';

export function parseJobDescription(text: string): JobDescription {
    const result: JobDescription = {
        requiredSkills: [],
        preferredSkills: [],
        minExperience: 0,
        location: [],
    };

    // 1. Skill Extraction (Keyword based - simple list for demo)
    // In a real app, this would be a larger dictionary or NLP model
    const knownSkills = [
        "React", "Next.js", "JavaScript", "TypeScript", "Node.js", "CSS", "Tailwind", "HTML",
        "Python", "Java", "AWS", "Docker", "Kubernetes", "GraphQL", "Redux", "Zustand"
    ];

    const lowerText = text.toLowerCase();

    const foundSkills = knownSkills.filter(skill => lowerText.includes(skill.toLowerCase()));

    // Heuristic: If "must have" or "required" text is near, it's required. 
    // For this simple version, we'll split by "Preferred" or "Nice to have" if present.

    const sections = text.split(/(?:preferred|nice to have|plus)/i);
    const requiredSection = sections[0].toLowerCase();
    const preferredSection = sections.slice(1).join(' ').toLowerCase();

    result.requiredSkills = knownSkills.filter(skill => requiredSection.includes(skill.toLowerCase()));

    // Avoid duplicates in preferred if already in required
    result.preferredSkills = knownSkills.filter(skill =>
        preferredSection.includes(skill.toLowerCase()) && !result.requiredSkills.includes(skill)
    );

    // Fallback: if no split detected, assign all to required for now (or split 70/30)
    if (result.requiredSkills.length === 0 && result.preferredSkills.length === 0) {
        result.requiredSkills = foundSkills;
    }

    // 2. Experience Extraction
    const expRegex = /(\d+)[\+]?\s*(?:-\s*\d+\s*)?(?:years?|yrs?)/i;
    const expMatch = text.match(expRegex);
    if (expMatch) {
        result.minExperience = parseInt(expMatch[1], 10);
    }

    // 3. Location Extraction
    // Simple list of major tech hubs
    const knownLocations = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Remote", "Gurgaon", "Noida", "San Francisco", "London"];
    result.location = knownLocations.filter(loc => lowerText.includes(loc.toLowerCase()));

    // 4. Salary Extraction
    // Look for patterns like "8-12 LPA", "800000-1200000"
    // Regex for "X to Y LPA" or "X-Y LPA"
    const lpaRegex = /(\d+)(?:\s*-\s*|\s+to\s+)(\d+)\s*LPA/i;
    const lpaMatch = text.match(lpaRegex);

    if (lpaMatch) {
        result.salaryRange = {
            min: parseInt(lpaMatch[1], 10) * 100000,
            max: parseInt(lpaMatch[2], 10) * 100000
        };
    } else {
        // numeric fallback
        const salaryRegex = /(\d{6,})/;
        const salMatch = text.match(salaryRegex);
        if (salMatch) {
            result.salaryRange = {
                min: parseInt(salMatch[1], 10),
                max: parseInt(salMatch[1], 10) * 1.2 // arbitrary max
            };
        }
    }

    return result;
}

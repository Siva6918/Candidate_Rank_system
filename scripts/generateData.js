const fs = require('fs');
const path = require('path');

const SKILLS = [
    "React", "Node.js", "JavaScript", "TypeScript", "Next.js", "Python", "Java", "C++", "C#", ".NET",
    "Go", "Rust", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "SQL", "MongoDB", "PostgreSQL",
    "Redis", "GraphQL", "Rest API", "Angular", "Vue.js", "Svelte", "Tailwind CSS", "SASS", "Redux",
    "Express", "Django", "Flask", "Spring Boot", "Hibernate", "Terraform", "Ansible", "Jenkins",
    "Git", "Linux", "Machine Learning", "Data Science", "Pytorch", "Tensorflow"
];

const LOCATIONS = [
    "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Gurgaon", "Noida", "Kolkata",
    "Ahmedabad", "Jaipur", "Indore", "Chandigarh", "Coimbatore", "Kochi", "Remote", "San Francisco",
    "London", "New York", "Berlin", "Singapore", "Dubai", "Toronto"
];

const NAMES = [
    "Aarav", "Aditi", "Rohan", "Priya", "Vikram", "Neha", "Amit", "Sneha", "Rahul", "Anjali",
    "Suresh", "Kavita", "Arjun", "Deepa", "Karan", "Pooja", "Varun", "Riya", "Aryan", "Ishaan",
    "Meera", "Sanjay", "Divya", "Vivek", "Tanvi", "Aditya", "Nisha", "Manish", "Shweta", "Rajat",
    "Simran", "Kabir", "Radhika", "Dhruv", "Ananya", "Rishi", "Sana", "Yash", "Kritika", "Sameer",
    "John", "Alice", "Bob", "Emma", "David", "Sarah", "Michael", "Emily", "Chris", "Jessica"
];

const TITLES = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "DevOps Engineer", "Data Scientist", "System Architect", "Solutions Architect", "QA Engineer",
    "Product Manager" // outliers
];

function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateCandidate(id) {
    const exp = Math.floor(Math.random() * 16); // 0-15 years
    const numSkills = Math.floor(Math.random() * 6) + 3; // 3-8 skills
    const skills = getRandomItems(SKILLS, numSkills);
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const name = `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`;

    // Salary roughly based on exp (3LPA base + 2-3LPA per year)
    // Random variation +/- 20%
    const baseSal = 300000 + (exp * 250000);
    const salary = Math.floor(baseSal * (0.8 + Math.random() * 0.4));

    // Resume text generation
    const title = TITLES[Math.floor(Math.random() * TITLES.length)];
    const text = `${title} with ${exp} years of experience in ${skills.slice(0, 3).join(", ")}. Passionate about building scalable applications. Located in ${location}.`;

    return {
        id: `C${1000 + id}`,
        name: name,
        skills: skills,
        experience: exp,
        location: location,
        salaryExpectation: salary,
        resumeText: text
    };
}

const candidates = [];
for (let i = 0; i < 500; i++) {
    candidates.push(generateCandidate(i + 1));
}

const outputPath = path.join(__dirname, '../data/candidates.json');
fs.writeFileSync(outputPath, JSON.stringify(candidates, null, 2));

console.log(`Successfully generated ${candidates.length} candidates.`);

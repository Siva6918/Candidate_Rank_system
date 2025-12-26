import React from 'react';
import { FilterCriteria } from '@/lib/types';

interface FiltersPanelProps {
    filters: FilterCriteria;
    onFilterChange: (newFilters: FilterCriteria) => void;
}

export default function FiltersPanel({ filters, onFilterChange }: FiltersPanelProps) {
    // Local state to manage input value without aggressive re-formatting while typing
    const [skillInput, setSkillInput] = React.useState(filters.skills?.join(', ') || '');

    // Sync local input ONLY when external filters change significantly (e.g. new JD parsed)
    React.useEffect(() => {
        const currentParsed = skillInput.split(',').map(s => s.trim()).filter(Boolean);
        const incoming = filters.skills || [];

        // Check if arrays are equal content-wise
        const areEqual = currentParsed.length === incoming.length &&
            currentParsed.every((val, index) => val === incoming[index]);

        // Only overwrite local state if the incoming data is actually "new" / different logic
        if (!areEqual) {
            setSkillInput(incoming.join(', '));
        }
    }, [filters.skills]);

    const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSkillInput(val); // Update text immediately

        // Update parent with parsed array
        const skills = val.split(',').map(s => s.trim()).filter(Boolean);
        onFilterChange({ ...filters, skills });
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const locations = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        onFilterChange({ ...filters, locations });
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl h-full">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                Recruiter Controls
            </h2>

            <div className="space-y-6">

                {/* Skills */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">Required Skills (Hard Filter)</label>
                    <input
                        type="text"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                        placeholder="React, Node.js, TypeScript"
                        value={skillInput}
                        onChange={handleSkillChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma separated. These are mandatory.</p>
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">Min Experience (Years)</label>
                    <input
                        type="number"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                        value={filters.minExperience || ''}
                        onChange={(e) => onFilterChange({ ...filters, minExperience: parseInt(e.target.value) || 0 })}
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">Locations</label>
                    <input
                        type="text"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                        placeholder="Bangalore, Remote"
                        value={filters.locations?.join(', ') || ''}
                        onChange={handleLocationChange}
                    />
                </div>

                {/* Budget */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium">Max Candidate Budget (₹)</label>
                    <input
                        type="number"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                        value={filters.maxSalary || ''}
                        onChange={(e) => onFilterChange({ ...filters, maxSalary: parseInt(e.target.value) || 0 })}
                    />
                </div>

            </div>
        </div>
    );
}

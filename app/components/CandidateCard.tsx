import React from 'react';
import { ScoredCandidate } from '@/lib/types';

interface CandidateCardProps {
    candidate: ScoredCandidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 0.8) return 'text-green-400 border-green-500/30 bg-green-500/10';
        if (score >= 0.5) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
        return 'text-red-400 border-red-500/30 bg-red-500/10';
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all group">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                            #{candidate.rank}
                        </div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{candidate.name}</h3>
                        <span className="text-sm text-gray-400">({candidate.location})</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{candidate.resumeText}</p>
                </div>

                <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${getScoreColor(candidate.score)}`}>
                    <span className="text-2xl font-bold">{candidate.score.toFixed(2)}</span>
                    <span className="text-xs uppercase tracking-wider opacity-80">Score</span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span className="block text-gray-500 text-xs uppercase mb-1">Experience</span>
                    <span className={candidate.experienceFit === 'Meets Requirement' ? 'text-green-400' : 'text-red-400'}>
                        {candidate.experience} Years ({candidate.experienceFit})
                    </span>
                </div>
                <div>
                    <span className="block text-gray-500 text-xs uppercase mb-1">Expected Salary</span>
                    <span className={candidate.salaryFit === 'Within Budget' ? 'text-green-400' : 'text-yellow-500'}>
                        ₹{(candidate.salaryExpectation / 100000).toFixed(1)} LPA
                    </span>
                </div>
                <div className="col-span-2">
                    <span className="block text-gray-500 text-xs uppercase mb-1">Skills Match</span>
                    <div className="flex flex-wrap gap-1">
                        {candidate.matchedSkills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-xs">{s}</span>
                        ))}
                        {candidate.missingSkills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs opacity-70">-{s}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Explanations Section */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2 font-medium text-blue-300">Why this score?</p>
                <ul className="space-y-1">
                    {candidate.explanations.map((exp, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-blue-500/50">•</span> {exp}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

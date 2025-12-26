import React from 'react';
import CandidateCard from './CandidateCard';
import { ScoredCandidate } from '@/lib/types';

interface CandidateResultsProps {
    candidates: ScoredCandidate[];
    loading: boolean;
    hasRanked: boolean;
}

export default function CandidateResults({ candidates, loading, hasRanked }: CandidateResultsProps) {
    if (loading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                Ranking Candidates...
            </div>
        );
    }

    if (candidates.length === 0) {
        if (!hasRanked) {
            return (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-xl text-gray-300 font-semibold">Ready to Rank</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Enter a JD description on the left,<br />check the filters on the right, and click <span className="text-blue-400 font-bold">"Rank Candidates"</span>.
                    </p>
                </div>
            );
        }

        return (
            <div className="text-center py-20 bg-red-500/5 border border-red-500/20 rounded-xl">
                <p className="text-lg text-red-300">No candidates matched your filters.</p>
                <p className="text-sm text-gray-500 mt-1">
                    Try lowering the <b className="text-white">Experience</b> requirement or removing some <b className="text-white">Locations</b>/<b>Skills</b>.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Ranked Candidates <span className="text-gray-500 text-sm font-normal">({candidates.length} results)</span></h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition">Export JSON</button>
            </div>
            <div className="flex flex-col gap-4">
                {candidates.map((c) => (
                    <CandidateCard key={c.id} candidate={c} />
                ))}
            </div>
        </div>
    );
}

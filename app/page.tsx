"use client";

import React, { useState, useEffect } from 'react';
import JobDescriptionInput from './components/JobDescriptionInput';
import FiltersPanel from './components/FiltersPanel';
import CandidateResults from './components/CandidateResults';
import { FilterCriteria, ScoredCandidate } from '@/lib/types';
import { parseJobDescription } from '@/lib/jobParser';
import candidatesData from '@/data/candidates.json';

// Import local candidates. In prod, this might come from a DB API.
import { Candidate } from '@/lib/types';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [candidates, setCandidates] = useState<ScoredCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  // Track if user has pressed the rank button at least once
  const [hasRanked, setHasRanked] = useState(false);

  // Auto-extraction logic
  useEffect(() => {
    // Simple debounce or just run when JD is substantial
    if (jobDescription.length > 50) {
      const timeoutId = setTimeout(() => {
        const parsed = parseJobDescription(jobDescription);
        setFilters(prev => ({
          ...prev,
          skills: parsed.requiredSkills,
          minExperience: parsed.minExperience,
          locations: parsed.location,
          maxSalary: parsed.salaryRange?.max
        }));
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [jobDescription]);

  const handleRank = async () => {
    setLoading(true);
    // Mark as ranked so we show "No Results" instead of "Ready to Rank" if empty
    setHasRanked(true);
    try {
      // API call
      const res = await fetch('/api/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          filters,
          candidates: candidatesData // Send all candidates to rank
        })
      });

      if (!res.ok) throw new Error('Ranking failed');

      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      console.error(error);
      alert('Failed to rank candidates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              AI Candidate Ranker
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Intelligent Scoring & Filtering System</p>
          </div>
          <button
            onClick={handleRank}
            className="mt-4 md:mt-0 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-bold text-white shadow-lg transform active:scale-95 transition-all text-lg flex items-center gap-2"
          >
            🚀 Rank Candidates
          </button>
        </header>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <JobDescriptionInput value={jobDescription} onJDChange={setJobDescription} />
            <CandidateResults candidates={candidates} loading={loading} hasRanked={hasRanked} />
          </div>

          <div className="lg:col-span-1">
            <FiltersPanel filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

      </div>
    </main>
  );
}

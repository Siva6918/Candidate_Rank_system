import React, { useRef } from 'react';

interface JobDescriptionInputProps {
    onJDChange: (jd: string) => void;
    value: string;
}

export default function JobDescriptionInput({ onJDChange, value }: JobDescriptionInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simple validation for text files
        // In a real app we might support PDF parsing via an API, 
        // but client-side we can only safely read text without heavy libraries.
        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
            alert('For this demo version, please upload a .txt file. PDF/Docx would require server-side parsing.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            onJDChange(text);
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                Job Description
            </h2>
            <p className="text-gray-300 text-sm mb-3">Paste the job description below to automatically extract requirements.</p>

            <textarea
                className="w-full h-48 bg-black/20 border border-white/10 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none placeholder-gray-500"
                placeholder="Paste JD here (e.g., 'We are looking for a Senior React Developer with 5+ years of experience in Bangalore...')"
                value={value}
                onChange={(e) => onJDChange(e.target.value)}
            />

            <div className="mt-4 flex gap-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".txt"
                    onChange={handleFileUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition text-sm flex items-center gap-2"
                >
                    📁 Upload Text File
                </button>
            </div>
        </div>
    );
}

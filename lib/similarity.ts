export function calculateCosineSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;

    const tokenize = (text: string) => {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '') // remove punctuation
            .split(/\s+/)
            .filter(w => w.length > 2); // ignore short words
    };

    const tokens1 = tokenize(text1);
    const tokens2 = tokenize(text2);

    const uniqueTokens = new Set([...tokens1, ...tokens2]);
    const vector1 = Array.from(uniqueTokens).map(token => tokens1.filter(t => t === token).length);
    const vector2 = Array.from(uniqueTokens).map(token => tokens2.filter(t => t === token).length);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
        magnitude1 += vector1[i] * vector1[i];
        magnitude2 += vector2[i] * vector2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
}

// Simple Levenshtein Distance for fuzzy string matching
export function getLevenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

export function isFuzzyMatch(source: string, target: string, threshold = 3): boolean {
    // If target is empty, no match
    if (!target) return false;
    const dist = getLevenshteinDistance(source.toLowerCase(), target.toLowerCase());
    return dist <= threshold;
}

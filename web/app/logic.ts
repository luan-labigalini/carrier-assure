export function getScoreColor(score: number) {
    if (score > 70) return "green";
    if (score >= 40) return "yellow";
    return "red";
}
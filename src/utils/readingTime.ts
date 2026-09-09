const WORDS_PER_MINUTE = 200;

export function readingTime(body: string | undefined): number | undefined {
  if (!body) return undefined;

  const textOnly = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '');

  const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

import { getEntry } from 'astro:content';

export async function validateSeriesIntegrity(publishedPosts: any[]) {
  const errors: string[] = [];

  // Group posts by series
  const postsBySeries = new Map<string, { id: string; part: number }[]>();
  for (const post of publishedPosts) {
    if (!post.data.series) continue;

    // reference() returns an EntryReference with a .id property
    const seriesId = typeof post.data.series.id === 'string'
      ? post.data.series.id
      : post.data.series.id.id;

    if (!postsBySeries.has(seriesId)) {
      postsBySeries.set(seriesId, []);
    }
    postsBySeries.get(seriesId)!.push({
      id: post.id,
      part: post.data.series.part,
    });
  }

  // Validate each series
  for (const [seriesId, parts] of postsBySeries.entries()) {
    // Check series exists (getEntry returns undefined, it does not throw)
    const entry = await getEntry('series', seriesId);
    if (!entry) {
      const postIds = parts.map((p) => p.id).join(', ');
      errors.push(`Series "${seriesId}" referenced by posts [${postIds}] does not exist`);
      continue;
    }

    // Check for duplicate parts
    const partsByNumber = new Map<number, string[]>();
    for (const p of parts) {
      if (!partsByNumber.has(p.part)) {
        partsByNumber.set(p.part, []);
      }
      partsByNumber.get(p.part)!.push(p.id);
    }

    for (const [partNumber, postIds] of partsByNumber.entries()) {
      if (postIds.length > 1) {
        errors.push(
          `Series "${seriesId}" part ${partNumber} is declared by multiple posts: ${postIds.join(', ')}`
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error('Series validation failed:\n' + errors.join('\n'));
  }
}

import { getEntry } from 'astro:content';

// reference() returns an EntryReference with a .id property
export function seriesIdOf(post: any): string | undefined {
  const series = post.data.series;
  if (!series) return undefined;
  return typeof series.id === 'string' ? series.id : series.id.id;
}

// Published parts of a series in ascending part order. Callers must pass
// posts already filtered by !data.draft (single publication decision point).
export function getPublishedSeriesParts(publishedPosts: any[], seriesId: string) {
  return publishedPosts
    .filter((p) => seriesIdOf(p) === seriesId)
    .sort((a, b) => a.data.series.part - b.data.series.part);
}

export interface SeriesOutlineItem {
  part: number;
  status: 'published' | 'planned';
  title: string;
  description: string;
  href?: string;
}

// One item per position in the series' `parts` list (position = part number).
// A published post wins over the registry data; drafts must already be
// filtered out by the caller, so they are treated as if they did not exist.
export function buildSeriesOutline(entry: any, publishedPosts: any[]): SeriesOutlineItem[] {
  const seriesParts = getPublishedSeriesParts(publishedPosts, entry.id);
  return entry.data.parts.map((def: { title: string; summary: string }, index: number) => {
    const part = index + 1;
    const post = seriesParts.find((p) => p.data.series.part === part);
    return post
      ? {
          part,
          status: 'published',
          title: post.data.title,
          description: post.data.description,
          href: `/blog/${post.id}`,
        }
      : { part, status: 'planned', title: def.title, description: def.summary };
  });
}

export async function validateSeriesIntegrity(publishedPosts: any[]) {
  const errors: string[] = [];

  // Group posts by series
  const postsBySeries = new Map<string, { id: string; part: number }[]>();
  for (const post of publishedPosts) {
    if (!post.data.series) continue;

    const seriesId = seriesIdOf(post)!;

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

    // Check published parts fall inside the series' parts list
    const total = entry.data.parts.length;
    for (const p of parts) {
      if (p.part > total) {
        errors.push(
          `Series "${seriesId}" has ${total} parts, but post "${p.id}" declares part ${p.part}`
        );
      }
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

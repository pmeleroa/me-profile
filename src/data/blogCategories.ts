export const BLOG_CATEGORIES = ['Opinión', 'Análisis', 'Guía', 'Recursos'] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const categoryColors: Record<BlogCategory, string> = {
  Opinión: '#F6AD55',
  Análisis: 'var(--color-accent)',
  Guía: 'var(--color-logo-green)',
  Recursos: 'var(--color-logo-yellow)',
};

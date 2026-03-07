import { sections } from './sections';

export const pageSections = {
  experience: {
    enabled: sections.experience,
    navLabel: 'Experiencia',
    title: 'Experiencia - Pablo Melero Alonso',
    description:
      'Mi historia profesional: arquitectura de software, plataformas de ingenieria, DevOps y liderazgo tecnico.',
  },
  skills: {
    enabled: sections.skills,
    navLabel: 'Skills',
    title: 'Skills - Pablo Melero Alonso',
    description:
      'Stack tecnologico y competencias de Pablo Melero Alonso: Frontend, Backend, Cloud & DevOps, Data & AI y liderazgo tecnico.',
  },
} as const;

export type PageSection = keyof typeof pageSections;


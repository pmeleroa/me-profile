import { sections } from './sections';

export const pageSections = {
  experience: {
    enabled: sections.experience,
    navLabel: 'Experiencia',
    title: 'Pablo Melero Alonso - Experiencia',
    description:
      'Mi historia profesional: arquitectura de software, plataformas de ingeniería, DevOps y liderazgo técnico.',
  },
  skills: {
    enabled: sections.skills,
    navLabel: 'Skills',
    title: 'Pablo Melero Alonso - Skills',
    description:
      'Stack tecnológico y competencias de Pablo Melero Alonso: Tecnología, IA Generativa, Procesos y Personas.',
  },
} as const;

export type PageSection = keyof typeof pageSections;


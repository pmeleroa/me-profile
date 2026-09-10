export interface Author {
  name: string;
  avatar: string;
  bio: string;
  links: { label: string; href: string }[];
}

export const author: Author | null = {
  name: 'Pablo Melero Alonso',
  avatar: '/avatar.png',
  bio: 'Arquitecto tecnológico especializado en plataformas de ingeniería, DevOps y arquitectura empresarial. Exploro cómo la IA puede amplificar el trabajo de los equipos técnicos.',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pmeleroalonso' },
    { label: 'GitHub', href: 'https://github.com/pmeleroa' },
  ],
};

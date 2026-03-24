export const hero = {
  label: "Hola 👋, soy",
  firstName: "Pablo",
  lastName: "Melero Alonso",
  description: `<p>
  Me apasiona entender <strong>cómo funcionan las organizaciones</strong> y cómo
  <strong>la arquitectura puede ayudarlas a evolucionar</strong>.
  Trabajo <strong>conectando organizaciones, </strong><strong style="color: var(--color-accent-light); font-weight: 600;">tecnología, procesos y personas</strong>
  para <strong>construir capacidades</strong> que permitan a las empresas
  <strong>adaptarse a un mundo cada vez más complejo y acelerado</strong>, 
  explorando también cómo la <strong style="color: var(--color-accent-light); font-weight: 600;">inteligencia artificial puede amplificar</strong> nuestra forma de pensar, diseñar y construir tecnología.
  </p>`,
  actions: {
    primary: { label: "Ver proyectos", href: "#projects", enabled: false },
    secondary: { label: "Contactar", href: "#contact", enabled: true },
  },
  social: {
    github: { url: "https://github.com/pmeleroa", enabled: true },
    linkedin: { url: "https://linkedin.com/in/pmeleroalonso", enabled: true },
    twitter: { url: "https://twitter.com/pmeleroa", enabled: false },
  },
  roles: [
  "Enterprise Architect",
  "Systems Thinker",
  "People Advocate",
  "AI-Augmented"
  ],
};

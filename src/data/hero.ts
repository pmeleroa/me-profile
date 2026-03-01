export const hero = {
  label: "Hola👋, soy",
  firstName: "Pablo",
  lastName: "Melero Alonso",
  description: `
    <p>
Me apasiona entender cómo funcionan las organizaciones y cómo la <strong>arquitectura</strong> puede ayudarlas a evolucionar.
Trabajo conectando <strong>negocio, tecnología, procesos y personas</strong> para construir capacidades que permitan a las empresas adaptarse a un mundo cada vez más complejo y acelerado.
</p>`,
  actions: {
    primary: { label: "Ver proyectos", href: "#projects", enabled: false },
    secondary: { label: "Contactar", href: "#contact", enabled: true },
  },
  social: {
    github: { url: "https://github.com/pmeleroa", enabled: true },
    linkedin: { url: "https://linkedin.com/in/pmeleroa", enabled: true },
    twitter: { url: "https://twitter.com/pmeleroa", enabled: false },
  },
  roles: [
  "Enterprise Architect",
  "Systems Thinker",
  "People Advocate",
  "AI-Augmented"
  ],
};

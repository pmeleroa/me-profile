export interface SkillCategory {
  id: string;
  label: string;
  image: string;
  color: string;
}

export interface Skill {
  name: string;
  categoryId: string;
  level: 1 | 2 | 3 | 4 | 5;
  image: string;
  tagline: string;
  featured?: boolean;
}

export const levelLabels = ['', 'Básico',     // Level 1
                                'Intermedio', // Level 2
                                'Avanzado',   // Level 3
                                'Experto',    // Level 4
                                'Maestro'];   // Level 5


export const skillCategories: SkillCategory[] = [
  { id: 'tecnologia', label: 'Tecnología', image: 'skills/categories/tecnologia.svg', color: '#61DAFB' },
  { id: 'procesos', label: 'Procesos', image: 'skills/categories/procesos.svg', color: '#F6AD55' },
  { id: 'personas', label: 'Personas', image: 'skills/categories/personas.svg', color: '#FC8181' },
  { id: 'ia', label: 'Inteligencia Artificial', image: 'skills/categories/ia.svg', color: '#A78BFA' },
];

export const skills: Skill[] = [
  // ── Tecnología ──────────────────────────────────────────────
  // Lenguajes & Frameworks
  { name: 'React', categoryId: 'tecnologia', level: 5, image: 'skills/react.svg', featured: true, tagline: 'Mi framework principal para construir interfaces complejas' },
  { name: 'TypeScript', categoryId: 'tecnologia', level: 5, image: 'skills/typescript.svg', featured: true, tagline: 'Tipado estricto en cada proyecto, sin excepciones' },
  { name: 'Node.js', categoryId: 'tecnologia', level: 5, image: 'skills/nodejs.svg', featured: true, tagline: 'APIs de alto rendimiento y servicios en tiempo real' },
  { name: 'Python', categoryId: 'tecnologia', level: 4, image: 'skills/python.svg', featured: true, tagline: 'Automatización, scripts y backends con FastAPI' },
  { name: 'Vue.js', categoryId: 'tecnologia', level: 4, image: 'skills/vuejs.svg', tagline: 'Ecosistema ágil para MVPs y prototipos rápidos' },
  { name: 'Next.js', categoryId: 'tecnologia', level: 4, image: 'skills/nextjs.svg', tagline: 'SSR, ISR y App Router para aplicaciones de producción' },
  { name: 'Astro', categoryId: 'tecnologia', level: 3, image: 'skills/astro.svg', tagline: 'Este sitio está hecho con Astro' },
  { name: 'FastAPI', categoryId: 'tecnologia', level: 4, image: 'skills/fastapi.svg', tagline: 'APIs modernas, rápidas y con documentación automática' },
  { name: 'HTML / CSS', categoryId: 'tecnologia', level: 5, image: 'skills/html-css.svg', tagline: 'La base de todo: semántica, accesibilidad y CSS moderno' },
  // APIs & Comunicación
  { name: 'GraphQL', categoryId: 'tecnologia', level: 4, image: 'skills/graphql.svg', tagline: 'Consultas flexibles y eficientes para frontends exigentes' },
  { name: 'REST APIs', categoryId: 'tecnologia', level: 5, image: 'skills/rest-api.svg', tagline: 'Diseño de APIs RESTful robustas y bien documentadas' },
  { name: 'WebSockets', categoryId: 'tecnologia', level: 3, image: 'skills/websockets.svg', tagline: 'Comunicación bidireccional en tiempo real' },
  // Datos
  { name: 'PostgreSQL', categoryId: 'tecnologia', level: 5, image: 'skills/postgresql.svg', tagline: 'Mi base de datos relacional de referencia' },
  { name: 'MongoDB', categoryId: 'tecnologia', level: 4, image: 'skills/mongodb.svg', tagline: 'Documentos flexibles para datos no estructurados' },
  { name: 'Redis', categoryId: 'tecnologia', level: 4, image: 'skills/redis.svg', tagline: 'Caché, colas y pub/sub de alto rendimiento' },
  // Cloud & Infra
  { name: 'AWS', categoryId: 'tecnologia', level: 4, image: 'skills/aws.svg', tagline: 'Lambda, ECS, S3, RDS y más en producción' },
  { name: 'GCP', categoryId: 'tecnologia', level: 3, image: 'skills/gcp.svg', tagline: 'Cloud Run, BigQuery y Firebase' },
  { name: 'Docker', categoryId: 'tecnologia', level: 4, image: 'skills/docker.svg', tagline: 'Contenedores para desarrollo y despliegue consistente' },
  { name: 'Kubernetes', categoryId: 'tecnologia', level: 3, image: 'skills/kubernetes.svg', tagline: 'Orquestación de contenedores a escala' },
  // Visualización
  { name: 'D3.js', categoryId: 'tecnologia', level: 3, image: 'skills/d3js.svg', tagline: 'Visualizaciones de datos interactivas y personalizadas' },

  // ── Inteligencia Artificial ────────────────────────────────
  { name: 'Prompt Engineering', categoryId: 'ia', level: 4, image: 'skills/prompt-engineering.svg', featured: true, tagline: 'Diseño de prompts efectivos, chain-of-thought y técnicas avanzadas' },
  { name: 'OpenAI / LLMs', categoryId: 'ia', level: 3, image: 'skills/openai.svg', featured: true, tagline: 'Integración de modelos de lenguaje en productos reales' },
  { name: 'AI Agents & Orquestación', categoryId: 'ia', level: 3, image: 'skills/ai-agents.svg', tagline: 'Agentes autónomos, tool-use y flujos multi-step con LLMs' },
  { name: 'RAG', categoryId: 'ia', level: 3, image: 'skills/rag.svg', tagline: 'Búsqueda semántica y generación aumentada con conocimiento propio' },
  { name: 'AI-Assisted Development', categoryId: 'ia', level: 4, image: 'skills/ai-dev.svg', featured: true, tagline: 'Copilot, Claude Code y herramientas de IA para acelerar el desarrollo' },
  { name: 'Embeddings & Vector DBs', categoryId: 'ia', level: 3, image: 'skills/embeddings.svg', tagline: 'Representaciones vectoriales y bases de datos como Pinecone o pgvector' },
  { name: 'Evaluación & Observabilidad de IA', categoryId: 'ia', level: 2, image: 'skills/ai-observability.svg', tagline: 'Métricas, evals y monitorización de sistemas basados en LLMs' },
  { name: 'Ética & Gobernanza de IA', categoryId: 'ia', level: 3, image: 'skills/ai-ethics.svg', tagline: 'Uso responsable, sesgos, privacidad y marcos de gobernanza de IA' },

  // ── Procesos ────────────────────────────────────────────────
  { name: 'Arquitectura de Software', categoryId: 'procesos', level: 5, image: 'skills/software-architecture.svg', featured: true, tagline: 'Decisiones técnicas que equilibran pragmatismo y visión' },
  { name: 'Platform Engineering', categoryId: 'procesos', level: 4, image: 'skills/platform-engineering.svg', featured: true, tagline: 'Plataformas internas que aceleran a los equipos' },
  { name: 'Microservicios', categoryId: 'procesos', level: 4, image: 'skills/microservices.svg', tagline: 'Descomposición, contratos y orquestación de servicios' },
  { name: 'CI/CD', categoryId: 'procesos', level: 4, image: 'skills/cicd.svg', tagline: 'Pipelines automatizados con GitHub Actions y GitLab CI' },
  { name: 'Serverless', categoryId: 'procesos', level: 4, image: 'skills/serverless.svg', tagline: 'Arquitecturas event-driven sin gestión de servidores' },
  { name: 'Gobierno Técnico', categoryId: 'procesos', level: 4, image: 'skills/technical-governance.svg', tagline: 'Estándares, ADRs y marcos de decisión técnica' },
  { name: 'Design Systems', categoryId: 'procesos', level: 4, image: 'skills/design-systems.svg', tagline: 'Tokens, componentes y guías de estilo escalables' },
  { name: 'Storybook', categoryId: 'procesos', level: 4, image: 'skills/storybook.svg', tagline: 'Desarrollo de componentes aislados y documentación viva' },
  { name: 'Cultura DevOps', categoryId: 'procesos', level: 4, image: 'skills/devops-culture.svg', tagline: 'Ownership, colaboración y mejora continua' },

  // ── Personas ────────────────────────────────────────────────
  { name: 'Gestión de Equipos', categoryId: 'personas', level: 4, image: 'skills/team-management.svg', featured: true, tagline: 'Liderazgo técnico con foco en las personas' },
  { name: 'Mentoría Técnica', categoryId: 'personas', level: 4, image: 'skills/mentoring.svg', featured: true, tagline: 'Acompañar el crecimiento de otros ingenieros' },
  { name: 'Comunicación Técnica', categoryId: 'personas', level: 4, image: 'skills/technical-communication.svg', tagline: 'Traducir lo complejo para audiencias no técnicas' },
  { name: 'Stakeholder Management', categoryId: 'personas', level: 4, image: 'skills/stakeholder-management.svg', tagline: 'Alinear expectativas y prioridades con negocio' },
  { name: 'Hiring Técnico', categoryId: 'personas', level: 4, image: 'skills/hiring.svg', tagline: 'Diseño de procesos de selección y entrevistas técnicas' },
  { name: 'Facilitación', categoryId: 'personas', level: 3, image: 'skills/facilitation.svg', tagline: 'Workshops, retrospectivas y decisiones grupales' },
  { name: 'Colaboración Cross-team', categoryId: 'personas', level: 4, image: 'skills/cross-team.svg', tagline: 'Coordinación técnica entre equipos y resolución de dependencias' },
  { name: 'Gestión del Cambio', categoryId: 'personas', level: 3, image: 'skills/change-management.svg', tagline: 'Liderar transformaciones organizativas y adopción de nuevas prácticas' },
  { name: 'Charlas Técnicas', categoryId: 'personas', level: 3, image: 'skills/public-speaking.svg', tagline: 'Divulgación y evangelización técnica interna y externa' },
];

export const skillsPage = {
  label: 'Skills',
  title: 'Mi stack tecnológico',
  description:
    'Las herramientas, tecnologías y competencias que utilizo para diseñar, construir y operar software de forma efectiva.',
};

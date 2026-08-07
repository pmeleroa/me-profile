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

export interface SkillDetail {
  summary: string;
  usage: string[];
  related: string[];
}

export const levelLabels = [
  '',
  'Básico',
  'Intermedio',
  'Avanzado',
  'Experto',
  'Maestro',
];

export const skillCategories: SkillCategory[] = [
  { id: 'tecnologia', label: 'Tecnología', image: 'skills/categories/tecnologia.svg', color: '#61DAFB' },
  { id: 'procesos', label: 'Procesos', image: 'skills/categories/procesos.svg', color: '#F6AD55' },
  { id: 'personas', label: 'Personas', image: 'skills/categories/personas.svg', color: '#FC8181' },
  { id: 'ia', label: 'Inteligencia Artificial', image: 'skills/categories/ia.svg', color: '#A78BFA' },
];

const simpleIcon = (slug: string) => `https://cdn.simpleicons.org/${slug}?viewbox=auto`;
const simpleIconPackage = (slug: string) => `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;

export const skills: Skill[] = [
  { name: 'Arquitectura de Producto', categoryId: 'procesos', level: 5, image: 'skills/software-architecture.svg', featured: true, tagline: 'Evolución estratégica de plataformas tecnológicas con foco product-centric' },
  { name: 'Platform Engineering', categoryId: 'procesos', level: 5, image: 'skills/platform-engineering.svg', featured: true, tagline: 'Plataformas internas, autoservicio y experiencia del desarrollador' },
  { name: 'Gobierno Técnico', categoryId: 'procesos', level: 5, image: 'skills/technical-governance.svg', featured: true, tagline: 'Normativas, estándares y decisiones técnicas a escala corporativa' },
  { name: 'Arquitectura de Soluciones', categoryId: 'procesos', level: 5, image: 'skills/software-architecture.svg', featured: true, tagline: 'Definición end-to-end de arquitecturas para proyectos corporativos' },
  { name: 'Cloud Native', categoryId: 'tecnologia', level: 5, image: 'https://www.cncf.io/wp-content/uploads/2022/08/cncf-color.svg', featured: true, tagline: 'Arquitecturas resilientes, escalables y automatizadas' },
  { name: 'OpenShift', categoryId: 'tecnologia', level: 5, image: simpleIcon('redhatopenshift'), featured: true, tagline: 'Plataforma empresarial de contenedores, despliegue y operación' },
  { name: 'Kafka / Confluent', categoryId: 'tecnologia', level: 5, image: simpleIcon('apachekafka'), featured: true, tagline: 'Integración corporativa, streaming y arquitecturas orientadas a eventos' },
  { name: 'DevOps & CI/CD', categoryId: 'procesos', level: 5, image: 'skills/cicd.svg', featured: true, tagline: 'Pipelines, automatización de despliegues y excelencia operativa' },
  { name: 'GitHub', categoryId: 'tecnologia', level: 4, image: simpleIcon('github'), tagline: 'Colaboración técnica, repositorios, pull requests y trazabilidad del ciclo de desarrollo' },
  { name: 'GitHub Actions', categoryId: 'procesos', level: 4, image: simpleIcon('githubactions'), tagline: 'Automatización de workflows, validaciones y pipelines CI/CD sobre repositorios' },
  { name: 'IA Generativa en SDLC', categoryId: 'ia', level: 4, image: 'skills/ai-dev.svg', featured: true, tagline: 'Aplicación de IA en diseño, desarrollo, pruebas y operaciones' },
  { name: 'Agentes Autónomos', categoryId: 'ia', level: 4, image: 'skills/ai-agents.svg', featured: true, tagline: 'Automatización proactiva de tareas operativas con mínima intervención humana' },
  { name: 'Java / J2EE', categoryId: 'tecnologia', level: 5, image: simpleIcon('openjdk'), tagline: 'Base técnica de desarrollo empresarial y sistemas corporativos' },
  { name: 'Spring Framework', categoryId: 'tecnologia', level: 4, image: simpleIcon('spring'), tagline: 'Aplicaciones empresariales, microservicios y web apps sobre ecosistema Java' },
  { name: 'Oracle', categoryId: 'tecnologia', level: 4, image: 'https://www.oracle.com/a/ocom/img/oracle-logo.svg', tagline: 'Bases de datos corporativas, migraciones y optimización operativa' },
  { name: 'JavaScript', categoryId: 'tecnologia', level: 4, image: simpleIcon('javascript'), tagline: 'Aplicaciones web, tooling interno y automatizaciones sobre navegador' },
  { name: 'Angular', categoryId: 'tecnologia', level: 3, image: simpleIcon('angular'), tagline: 'Frontends corporativos y aplicaciones de gestión' },
  { name: 'HTML / CSS', categoryId: 'tecnologia', level: 4, image: 'skills/html-css.svg', tagline: 'Interfaces web, responsive design y fundamentos frontend' },
  { name: 'APIs & Web Services', categoryId: 'tecnologia', level: 5, image: 'skills/rest-api.svg', tagline: 'Contratos, integración entre sistemas y diseño de servicios' },
  { name: 'Microservicios', categoryId: 'procesos', level: 5, image: 'skills/microservices.svg', tagline: 'Descomposición, arquitectura distribuida y operación cloud-native' },
  { name: 'Kubernetes', categoryId: 'tecnologia', level: 4, image: simpleIcon('kubernetes'), tagline: 'Orquestación, escalabilidad y operación de contenedores' },
  { name: 'Docker', categoryId: 'tecnologia', level: 4, image: simpleIcon('docker'), tagline: 'Contenerización y entornos reproducibles de despliegue' },
  { name: 'Google Cloud Platform', categoryId: 'tecnologia', level: 4, image: simpleIcon('googlecloud'), tagline: 'Arquitectura cloud, IA aplicada y servicios gestionados' },
  { name: 'Multicloud / Hybrid Cloud', categoryId: 'tecnologia', level: 4, image: 'skills/categories/tecnologia.svg', tagline: 'Estrategias híbridas y multi-cloud para plataformas corporativas' },
  { name: 'BigQuery / Snowflake', categoryId: 'tecnologia', level: 4, image: simpleIcon('googlebigquery'), tagline: 'Procesamiento analítico, integración de datos y arquitecturas DataOps' },
  { name: 'DataOps', categoryId: 'procesos', level: 4, image: 'skills/categories/procesos.svg', tagline: 'Automatización de integración, streaming y procesamiento distribuido de datos' },
  { name: 'Apache Flink', categoryId: 'tecnologia', level: 3, image: simpleIcon('apacheflink'), tagline: 'Procesamiento de datos en tiempo real y streaming' },
  { name: 'Kafka Streams', categoryId: 'tecnologia', level: 4, image: simpleIcon('apachekafka'), tagline: 'Procesamiento distribuido sobre flujos de eventos' },
  { name: 'Python / ML', categoryId: 'ia', level: 3, image: 'skills/python.svg', tagline: 'Machine Learning, automatización y análisis técnico con Python' },
  { name: 'ML e IA en Google Cloud', categoryId: 'ia', level: 3, image: 'skills/gcp.svg', tagline: 'Soluciones de IA aplicada sobre servicios de Google Cloud' },
  { name: 'AI-Assisted Development', categoryId: 'ia', level: 4, image: 'skills/ai-dev.svg', tagline: 'Uso de IA para acelerar diseño, construcción y revisión de software' },
  { name: 'GitHub Copilot', categoryId: 'ia', level: 4, image: simpleIcon('githubcopilot'), tagline: 'Asistencia de IA en desarrollo, refactorización, revisión y documentación técnica' },
  { name: 'Prompt Engineering', categoryId: 'ia', level: 3, image: 'skills/prompt-engineering.svg', tagline: 'Diseño de instrucciones y flujos útiles con modelos generativos' },
  { name: 'Evaluación & Observabilidad de IA', categoryId: 'ia', level: 3, image: 'skills/ai-observability.svg', tagline: 'Control de calidad, métricas y monitorización de soluciones con IA' },
  { name: 'Hyperledger Fabric', categoryId: 'tecnologia', level: 3, image: simpleIconPackage('hyperledger'), tagline: 'Blockchain empresarial aplicado a trazabilidad alimentaria' },
  { name: 'GitOps', categoryId: 'procesos', level: 4, image: simpleIcon('git'), tagline: 'Entrega declarativa, trazabilidad y despliegue controlado' },
  { name: 'Jenkins', categoryId: 'procesos', level: 4, image: simpleIcon('jenkins'), tagline: 'Automatización de pipelines y construcción continua' },
  { name: 'Helm', categoryId: 'tecnologia', level: 4, image: simpleIcon('helm'), tagline: 'Empaquetado y despliegue de aplicaciones en Kubernetes' },
  { name: 'Prometheus', categoryId: 'tecnologia', level: 4, image: simpleIcon('prometheus'), tagline: 'Monitorización, métricas y alertas en plataformas técnicas' },
  { name: 'Elastic Stack', categoryId: 'tecnologia', level: 4, image: simpleIcon('elastic'), tagline: 'Logs, observabilidad y análisis operativo con ELK' },
  { name: 'ITSM / ITIL', categoryId: 'procesos', level: 5, image: 'skills/technical-governance.svg', tagline: 'Gestión de incidencias, problemas, operación y mejora continua' },
  { name: 'Mejora Continua', categoryId: 'procesos', level: 5, image: 'skills/devops-culture.svg', tagline: 'Planes iterativos de reducción de incidencias, calidad y performance' },
  { name: 'Automatización Operativa', categoryId: 'procesos', level: 5, image: 'skills/serverless.svg', tagline: 'Automatización de despliegues, procesos y tareas recurrentes' },
  { name: 'JIRA Tooling', categoryId: 'tecnologia', level: 4, image: simpleIcon('jira'), tagline: 'Plugins, integraciones por API y métricas operativas sobre JIRA' },
  { name: 'SCRUM / Agile', categoryId: 'procesos', level: 4, image: 'skills/devops-culture.svg', tagline: 'Adopción de marcos ágiles, métricas y seguimiento de equipos' },
  { name: 'Technical Product Ownership', categoryId: 'personas', level: 4, image: 'skills/stakeholder-management.svg', tagline: 'Priorización técnica, viabilidad y evolución de componentes de producto' },
  { name: 'Liderazgo Técnico', categoryId: 'personas', level: 5, image: 'skills/team-management.svg', featured: true, tagline: 'Dirección técnica, criterios de calidad y acompañamiento de equipos' },
  { name: 'Gestión de Equipos', categoryId: 'personas', level: 5, image: 'skills/team-management.svg', tagline: 'Coordinación de equipos internos, externos y factorías de software' },
  { name: 'Stakeholder Management', categoryId: 'personas', level: 5, image: 'skills/stakeholder-management.svg', tagline: 'Interlocución con negocio, soporte IT, consultoría y dirección técnica' },
  { name: 'Comité Técnico de Arquitectura', categoryId: 'personas', level: 4, image: 'skills/technical-communication.svg', tagline: 'Participación en decisiones técnicas transversales y viabilidad de soluciones' },
  { name: 'Comunicación Técnica', categoryId: 'personas', level: 5, image: 'skills/technical-communication.svg', tagline: 'Traducción entre arquitectura, operación, negocio y equipos de desarrollo' },
  { name: 'Mentoría Técnica', categoryId: 'personas', level: 4, image: 'skills/mentoring.svg', tagline: 'Acompañamiento de perfiles y elevación de prácticas técnicas' },
  { name: 'Gestión del Cambio', categoryId: 'personas', level: 4, image: 'skills/change-management.svg', tagline: 'Implantación de nuevas prácticas, plataformas y modelos operativos' },
];

export const skillsPage = {
  label: 'Skills',
  title: 'Mapa de capacidades',
  description:
    'Una lectura práctica de las tecnologías, procesos y competencias que he aplicado en entornos corporativos, plataformas de ingeniería y arquitectura empresarial.',
};

export const getSkillSlug = (skill: Pick<Skill, 'name'>) =>
  skill.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getSkillCategory = (skill: Skill) =>
  skillCategories.find((category) => category.id === skill.categoryId);

export const isExternalSkillImage = (image: string) =>
  /^https?:\/\//.test(image);

export const getSkillImageSrc = (skill: Pick<Skill, 'image'>, baseUrl = '') =>
  isExternalSkillImage(skill.image) ? skill.image : `${baseUrl}${skill.image}`;

export const usesGenericSkillIcon = (skill: Skill) =>
  !isExternalSkillImage(skill.image) && skill.image.startsWith('skills/categories/');

export const getSkillIconLabel = (skill: Pick<Skill, 'name'>) => {
  const normalizedName = skill.name.replace(/\([^)]*\)/g, '').trim();
  const explicitLabels: Record<string, string> = {
    'Arquitectura de Producto': 'AP',
    'Platform Engineering': 'PE',
    'Gobierno Técnico': 'GT',
    'Arquitectura de Soluciones': 'AS',
    'Cloud Native': 'CN',
    OpenShift: 'OS',
    'Kafka / Confluent': 'KC',
    'DevOps & CI/CD': 'DO',
    'IA Generativa en SDLC': 'IA',
    'Agentes Autónomos': 'AA',
    'Java / J2EE': 'J2',
    'Spring Framework': 'SF',
    Oracle: 'OR',
    JavaScript: 'JS',
    Angular: 'NG',
    GitHub: 'GH',
    'GitHub Actions': 'GA',
    'APIs & Web Services': 'API',
    'Google Cloud Platform': 'GCP',
    'Multicloud / Hybrid Cloud': 'MC',
    'BigQuery / Snowflake': 'BQ',
    DataOps: 'DO',
    'Apache Flink': 'AF',
    'Kafka Streams': 'KS',
    'Python / ML': 'PY',
    'ML e IA en Google Cloud': 'ML',
    'GitHub Copilot': 'GC',
    'Hyperledger Fabric': 'HF',
    GitOps: 'GO',
    Jenkins: 'JN',
    Helm: 'HM',
    Prometheus: 'PR',
    'Elastic Stack': 'ELK',
    'ITSM / ITIL': 'IT',
    'Mejora Continua': 'MC',
    'Automatización Operativa': 'AO',
    'JIRA Tooling': 'JR',
    'SCRUM / Agile': 'SC',
    'Technical Product Ownership': 'TPO',
    'Liderazgo Técnico': 'LT',
    'Gestión de Equipos': 'GE',
    'Stakeholder Management': 'SM',
    'Comité Técnico de Arquitectura': 'CTA',
    'Comunicación Técnica': 'CT',
    'Mentoría Técnica': 'MT',
    'Gestión del Cambio': 'GC',
  };

  if (explicitLabels[skill.name]) return explicitLabels[skill.name];

  const initials = normalizedName
    .split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || 'SK';
};

const categoryUsage: Record<string, string[]> = {
  tecnologia: [
    'Aplicación en sistemas corporativos con requisitos de integración, operación y evolución a largo plazo.',
    'Selección de tecnología en función de madurez, mantenibilidad, coste operativo y encaje con la plataforma.',
    'Diseño de soluciones que conectan desarrollo, despliegue, datos y operación.',
  ],
  ia: [
    'Uso de IA como capacidad integrada en el ciclo de vida del software y en plataformas internas.',
    'Evaluación de utilidad, calidad, coste, trazabilidad y riesgo antes de escalar casos de uso.',
    'Combinación de automatización, criterio técnico y supervisión humana en procesos críticos.',
  ],
  procesos: [
    'Definición de estándares, marcos operativos y prácticas que hacen más predecible la entrega.',
    'Alineación entre arquitectura, operación, calidad y objetivos de negocio.',
    'Creación de mecanismos repetibles para que los equipos trabajen con más autonomía y menos fricción.',
  ],
  personas: [
    'Coordinación entre equipos técnicos, negocio, soporte, dirección y proveedores.',
    'Traducción de restricciones técnicas en decisiones comprensibles y accionables.',
    'Acompañamiento del cambio para que las prácticas no se queden solo en documentación.',
  ],
};

const skillDetails: Record<string, Partial<SkillDetail>> = {
  'arquitectura-de-producto': {
    summary: 'Actualmente centro mi trabajo en la evolución estratégica de una plataforma tecnológica corporativa de desarrollo, con una visión product-centric orientada a excelencia operativa, autoservicio y soporte al ciclo de vida del software.',
    usage: [
      'Definición de la evolución de la plataforma como producto tecnológico interno.',
      'Alineación de arquitectura, experiencia del desarrollador, automatización y necesidades de negocio.',
      'Priorización de capacidades cloud-native, IA generativa y operación eficiente.',
    ],
    related: ['platform-engineering', 'ia-generativa-en-sdlc', 'gobierno-tecnico'],
  },
  'platform-engineering': {
    summary: 'La plataforma de ingeniería es el eje donde conecto arquitectura, automatización, estándares y experiencia del desarrollador para que los equipos puedan construir y operar software con menos fricción.',
    usage: [
      'Diseño de capacidades comunes para despliegue, operación, integración y autoservicio.',
      'Estandarización de caminos de desarrollo sin bloquear la autonomía de los equipos.',
      'Evolución hacia una plataforma inteligente apoyada por componentes de IA y automatización.',
    ],
    related: ['openshift', 'devops-and-ci-cd', 'arquitectura-de-producto'],
  },
  'gobierno-tecnico': {
    summary: 'Mi experiencia en gobierno técnico incluye definición de normativas, estándares y criterios de decisión para plataformas corporativas de contenedores, integración y desarrollo.',
    usage: [
      'Definición de estándares de desarrollo y despliegue sobre plataformas corporativas.',
      'Evaluación de requisitos funcionales y no funcionales para validar arquitecturas objetivo.',
      'Uso de comités, normativas y PoCs para reducir incertidumbre técnica.',
    ],
    related: ['arquitectura-de-soluciones', 'comite-tecnico-de-arquitectura', 'itsm-itil'],
  },
  openshift: {
    summary: 'He trabajado en la implantación de OpenShift como plataforma empresarial de contenedores, incluyendo arquitectura de plataforma, pipelines de CI/CD y normativas de desarrollo.',
    usage: [
      'Definición de arquitectura de plataforma para despliegue corporativo.',
      'Diseño de pipelines y normas de entrega sobre contenedores.',
      'Alineación entre plataforma, equipos de desarrollo y operación.',
    ],
    related: ['kubernetes', 'devops-and-ci-cd', 'cloud-native'],
  },
  'kafka-confluent': {
    summary: 'Kafka y Confluent aparecen en mi experiencia como plataforma corporativa de integración, streaming y soporte a arquitecturas orientadas a eventos.',
    usage: [
      'Definición de arquitectura de integración empresarial basada en eventos.',
      'Soporte a casos de streaming, procesamiento distribuido e integración de datos.',
      'Estandarización de patrones de uso dentro de entornos corporativos.',
    ],
    related: ['kafka-streams', 'dataops', 'bigquery-snowflake'],
  },
  'ia-generativa-en-sdlc': {
    summary: 'Estoy impulsando la aplicación de IA Generativa en fases de diseño, desarrollo, pruebas y operaciones para acelerar entrega de valor, mejorar calidad y facilitar decisiones basadas en datos.',
    usage: [
      'Exploración de casos de uso de IA en el ciclo de vida completo del software.',
      'Integración de servicios de IA en la plataforma tecnológica corporativa.',
      'Búsqueda de equilibrio entre automatización, supervisión y criterio técnico.',
    ],
    related: ['agentes-autonomos', 'ai-assisted-development', 'evaluacion-and-observabilidad-de-ia'],
  },
  'agentes-autonomos': {
    summary: 'Trabajo la automatización mediante agentes autónomos como evolución de la plataforma: tareas operativas proactivas, resilientes y con mínima intervención humana cuando el riesgo lo permite.',
    usage: [
      'Identificación de tareas operativas candidatas a automatización autónoma.',
      'Diseño de flujos con límites, supervisión y trazabilidad.',
      'Conexión entre plataforma, IA y operación para reducir carga manual repetitiva.',
    ],
    related: ['ia-generativa-en-sdlc', 'automatizacion-operativa', 'platform-engineering'],
  },
  'devops-and-ci-cd': {
    summary: 'DevOps y CI/CD forman parte de mi experiencia tanto desde la implantación de plataformas como desde la automatización de modelos de despliegue y mejora de la operación.',
    usage: [
      'Diseño de pipelines y automatización de despliegue sobre plataformas corporativas.',
      'Reducción de costes de implantación y mejora del alineamiento entre entornos.',
      'Conexión entre desarrollo, operación, calidad y trazabilidad.',
    ],
    related: ['github-actions', 'gitops', 'jenkins'],
  },
  github: {
    summary: 'GitHub lo sitúo como una capacidad de colaboración técnica y trazabilidad del ciclo de desarrollo: repositorios, revisiones, pull requests y conexión con automatización e IA.',
    usage: [
      'Gestión de repositorios, ramas, revisiones y pull requests en entornos colaborativos.',
      'Trazabilidad de cambios técnicos y alineamiento entre decisiones, código y entrega.',
      'Conexión con workflows de automatización, revisión asistida e integración continua.',
    ],
    related: ['github-actions', 'github-copilot', 'gitops'],
  },
  'github-actions': {
    summary: 'GitHub Actions encaja dentro de CI/CD y automatización: workflows reproducibles para validar, construir y desplegar software desde el propio repositorio.',
    usage: [
      'Automatización de validaciones, builds y tareas recurrentes vinculadas al repositorio.',
      'Definición de workflows de CI/CD con foco en trazabilidad y repetibilidad.',
      'Integración con prácticas DevOps, GitOps y controles de calidad técnica.',
    ],
    related: ['devops-and-ci-cd', 'github', 'gitops'],
  },
  'github-copilot': {
    summary: 'GitHub Copilot lo trato como una herramienta de desarrollo asistido por IA, útil para acelerar implementación, refactorización, documentación y revisión técnica manteniendo criterio humano.',
    usage: [
      'Asistencia en generación, explicación y refactorización de código.',
      'Apoyo en documentación técnica, pruebas y exploración de alternativas de implementación.',
      'Uso controlado dentro del SDLC, validando calidad, contexto y mantenibilidad del resultado.',
    ],
    related: ['ai-assisted-development', 'ia-generativa-en-sdlc', 'github'],
  },
  'itsm-itil': {
    summary: 'Antes de mi etapa más centrada en arquitectura, trabajé intensamente en operación, ITIL, gestión de incidencias, problemas y mejora continua de servicios software.',
    usage: [
      'Definición de procesos de gestión de incidencias y problemas.',
      'Diseño de métricas de calidad, trazabilidad y seguimiento del servicio.',
      'Planes iterativos de reducción de incidencias basados en patrones y causas raíz.',
    ],
    related: ['mejora-continua', 'jira-tooling', 'automatizacion-operativa'],
  },
  'liderazgo-tecnico': {
    summary: 'Mi liderazgo técnico se ha construido coordinando equipos internos, externos y factorías, tomando decisiones de arquitectura y conectando ejecución técnica con prioridades de negocio.',
    usage: [
      'Dirección técnica de componentes, dominios y plataformas corporativas.',
      'Acompañamiento de equipos en criterios de calidad, viabilidad y entrega.',
      'Interlocución entre desarrollo, soporte, consultoría, arquitectura y negocio.',
    ],
    related: ['gestion-de-equipos', 'stakeholder-management', 'comunicacion-tecnica'],
  },
};

const fallbackRelatedByCategory = (skill: Skill) =>
  skills
    .filter((candidate) => candidate.categoryId === skill.categoryId && candidate.name !== skill.name)
    .slice(0, 3)
    .map(getSkillSlug);

export const getSkillDetail = (skill: Skill): SkillDetail => {
  const slug = getSkillSlug(skill);
  const category = getSkillCategory(skill);
  const customDetail = skillDetails[slug];

  return {
    summary:
      customDetail?.summary ??
      `${skill.tagline}. Dentro del área de ${category?.label.toLowerCase() ?? 'trabajo'}, la aplico desde una perspectiva práctica: contexto corporativo, operación real, calidad técnica y evolución sostenible.`,
    usage: customDetail?.usage ?? categoryUsage[skill.categoryId] ?? [],
    related: customDetail?.related ?? fallbackRelatedByCategory(skill),
  };
};

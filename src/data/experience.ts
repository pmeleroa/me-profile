export interface Role {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export interface Stage {
  id: string;
  number: number;
  name: string;
  period: string;
  theme: string;
  narrative: string;
  roles: Role[];
  current?: boolean;
}

export const experience = {
  label: "Experiencia",
  title: "Mi historia profesional",
  subtitle:
    "Cada etapa ha sido un capitulo que me ha llevado a entender mejor como la tecnologia, los procesos y las personas construyen algo que realmente funciona.",
  stages: [
    {
      id: "stage-1",
      number: 1,
      name: "Los cimientos",
      period: "2006 — 2010",
      theme: "Codigo, curiosidad y primeras cicatrices",
      narrative:
        "Todo empezo escribiendo codigo. Aprendi los fundamentos construyendo aplicaciones desde cero, entendiendo que el software no es solo logica — es comunicacion entre personas a traves de la tecnologia.",
      roles: [
        {
          title: "Desarrollador Junior",
          company: "Empresa A",
          period: "2006 — 2008",
          description:
            "Primeros proyectos reales. Desarrollo de aplicaciones web y backends en Java, aprendiendo a entregar valor desde el primer dia.",
          tags: ["Java", "SQL", "HTML/CSS"],
        },
        {
          title: "Desarrollador de Software",
          company: "Empresa B",
          period: "2008 — 2010",
          description:
            "Mayor responsabilidad tecnica. Participacion en proyectos de mayor envergadura y primeros contactos con patrones de diseno y arquitectura.",
          tags: ["Java EE", "Spring", "Oracle", "Web Services"],
        },
      ],
    },
    {
      id: "stage-2",
      number: 2,
      name: "El crecimiento",
      period: "2010 — 2014",
      theme: "Liderazgo tecnico y vision de equipo",
      narrative:
        "Empece a liderar decisiones tecnicas y a entender que la calidad del software depende tanto del codigo como del contexto en el que se construye. Aqui descubri la importancia de los procesos y la colaboracion.",
      roles: [
        {
          title: "Ingeniero de Software Senior",
          company: "Empresa C",
          period: "2010 — 2012",
          description:
            "Liderazgo tecnico en equipos multidisciplinares. Definicion de estandares, code reviews y mentorias a perfiles junior.",
          tags: ["Arquitectura", "Agile", "CI/CD", "Mentoring"],
        },
        {
          title: "Tech Lead",
          company: "Empresa D",
          period: "2012 — 2014",
          description:
            "Primera experiencia liderando equipos de desarrollo. Responsabilidad end-to-end sobre productos y coordinacion con stakeholders.",
          tags: ["Liderazgo", "Scrum", "Microservicios", "Docker"],
        },
      ],
    },
    {
      id: "stage-3",
      number: 3,
      name: "La vision sistemica",
      period: "2014 — 2018",
      theme: "Pensar en sistemas, no solo en codigo",
      narrative:
        "Di el salto a pensar en sistemas completos. Disenar arquitecturas que escalan, que son mantenibles y que permiten a los equipos trabajar con autonomia. Descubri que la mejor arquitectura es la que nadie nota.",
      roles: [
        {
          title: "Arquitecto de Software",
          company: "Empresa E",
          period: "2014 — 2016",
          description:
            "Diseno de arquitecturas distribuidas y migracion a microservicios. Primeros proyectos en cloud y definicion de estrategias tecnicas.",
          tags: ["Microservicios", "AWS", "Event-Driven", "API Design"],
        },
        {
          title: "Arquitecto de Soluciones",
          company: "Empresa F",
          period: "2016 — 2018",
          description:
            "Gobierno tecnico y toma de decisiones estrategicas. Puente entre negocio y tecnologia en proyectos de transformacion digital.",
          tags: ["Cloud Native", "Kubernetes", "DevOps", "Solution Design"],
        },
      ],
    },
    {
      id: "stage-4",
      number: 4,
      name: "El impacto organizacional",
      period: "2018 — 2022",
      theme: "Plataformas, equipos y estrategia",
      narrative:
        "La arquitectura dejo de ser solo tecnica para convertirse en una herramienta de transformacion organizacional. Empece a trabajar en la interseccion entre plataformas, equipos y estrategia.",
      roles: [
        {
          title: "Enterprise Architect",
          company: "Empresa G",
          period: "2018 — 2020",
          description:
            "Diseno de plataformas de ingenieria para +100 desarrolladores. Modelos DevOps a escala corporativa y estandarizacion de practicas.",
          tags: ["Platform Engineering", "DevOps", "Governance", "IaC"],
        },
        {
          title: "Head of Architecture",
          company: "Empresa H",
          period: "2020 — 2022",
          description:
            "Direccion del area de arquitectura. Alineacion de capacidades tecnicas con objetivos de negocio y definicion de roadmaps tecnologicos.",
          tags: ["Strategy", "Team Building", "Cloud Strategy", "OKRs"],
        },
      ],
    },
    {
      id: "stage-5",
      number: 5,
      name: "El capitulo actual",
      period: "2022 — Presente",
      theme: "IA, sistemas complejos y nuevos paradigmas",
      narrative:
        "Hoy combino todo lo aprendido: arquitectura, plataformas, personas y una nueva dimension — la inteligencia artificial como amplificador del pensamiento y la construccion de software.",
      roles: [
        {
          title: "Enterprise Architect & AI Explorer",
          company: "Empresa I",
          period: "2022 — Presente",
          description:
            "Integracion de IA en flujos de trabajo de ingenieria. Arquitectura de plataformas AI-augmented y pensamiento sistemico aplicado a organizaciones complejas.",
          tags: ["AI/ML", "Platform Engineering", "Systems Thinking", "Innovation"],
        },
      ],
      current: true,
    },
  ] as Stage[],
};

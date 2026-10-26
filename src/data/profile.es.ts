import type { Profile } from './types';
import { CONTACT, STATIONS } from './shared';

// Contenido en español. La versión en inglés vive en profile.en.ts y debe
// mantener los mismos ids para que la selección se conserve al cambiar idioma.

const profile: Profile = {
  ...CONTACT,
  name: 'Juan Pablo Sánchez Rey',
  shortName: 'JPSR',
  title: 'Desarrollador Full Stack',
  headline: 'Java · Spring Boot · Angular · TypeScript',
  location: 'Bucaramanga, Santander, Colombia',
  timezoneLabel: 'UTC-5 (Bogotá)',
  careerStart: '2022-02',

  summary: [
    'Desarrollador Full Stack con más de 4 años de experiencia en la construcción de software empresarial escalable. Especializado en backend con Java y Spring Boot (arquitectura limpia, microservicios, mensajería) y frontend con Angular y TypeScript (microfrontends, PrimeNG).',
    'Experiencia comprobada en aseguramiento de calidad (JUnit, Mockito, Jasmine, Karma, SonarQube) y despliegues cloud (AWS, Azure). Conocimientos complementarios en React.js, Vue.js y desarrollo de aplicaciones de IA con Python (LLMs).',
    'Acostumbrado a entornos ágiles (Scrum), destaco por la comunicación efectiva de conceptos técnicos a negocio, la rápida adaptabilidad y la optimización proactiva del rendimiento y la arquitectura base.',
  ],
  availability: [
    'Abierto a proyectos Full Stack, consultoría y freelance',
    'Trabajo remoto desde Bucaramanga · UTC-5',
  ],
  languages: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Inglés', level: 'B1 (EF SET)' },
  ],

  special: [
    {
      letter: 'S', attribute: 'Fuerza', skill: 'Backend Java', value: 9,
      description: 'Fuerza bruta del lado del servidor. Microservicios en Java con Spring Boot, Spring Security, Spring Data JPA / Hibernate y programación reactiva con WebFlux, siempre bajo arquitectura limpia.',
      tags: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'WebFlux'],
    },
    {
      letter: 'P', attribute: 'Percepción', skill: 'Calidad y testing', value: 8,
      description: 'Detecta los bugs antes de que lleguen al Yermo de producción. Pruebas unitarias y de integración con JUnit 5 y Mockito, Jasmine y Karma en el frontend, TDD y análisis de cobertura con SonarQube.',
      tags: ['JUnit 5', 'Mockito', 'Jasmine', 'Karma', 'SonarQube', 'TDD'],
    },
    {
      letter: 'E', attribute: 'Resistencia', skill: 'Cloud y DevOps', value: 7,
      description: 'Sistemas que aguantan la radiación de producción. Despliegues en AWS y Azure, pipelines CI/CD, contenedores con Docker, diagnóstico de pods en Kubernetes y observabilidad con Grafana y Prometheus.',
      tags: ['AWS', 'Azure Pipelines', 'Docker', 'Kubernetes', 'Grafana'],
    },
    {
      letter: 'C', attribute: 'Carisma', skill: 'Comunicación', value: 8,
      description: 'Traduce decisiones de arquitectura a lenguaje de negocio. Participación activa en ceremonias Scrum, propuestas de mejora al proceso y documentación para que el resto del equipo avance más rápido.',
      tags: ['Scrum', 'Negocio', 'Documentación'],
    },
    {
      letter: 'I', attribute: 'Inteligencia', skill: 'Arquitectura', value: 9,
      description: 'Arquitectura limpia, hexagonal, DDD y principios SOLID. Microservicios desacoplados con mensajería (ActiveMQ, RabbitMQ, Kafka, SQS) e integración con Apache Camel.',
      tags: ['Clean Architecture', 'Hexagonal', 'DDD', 'SOLID', 'Mensajería'],
    },
    {
      letter: 'A', attribute: 'Agilidad', skill: 'Frontend', value: 8,
      description: 'Reflejos rápidos en la interfaz. Aplicaciones empresariales con Angular y TypeScript bajo enfoque de microfrontends, PrimeNG y PrimeFlex, además de React.js y Vue.js.',
      tags: ['Angular', 'TypeScript', 'PrimeNG', 'React', 'Vue'],
    },
    {
      letter: 'L', attribute: 'Suerte', skill: 'IA y LLMs', value: 6,
      description: 'El factor sorpresa. Desarrollo de aplicaciones de IA con Python, integración de APIs de IA y experimentación con modelos de lenguaje (LLMs), incluidos modelos locales.',
      tags: ['Python', 'LLMs', 'APIs de IA', 'Talento Tech'],
    },
  ],

  perks: [
    { id: 'clean-architect', name: 'Arquitecto limpio', rank: 3, maxRank: 3, description: 'Principios SOLID, arquitectura limpia, hexagonal y DDD aplicados en sistemas empresariales reales.' },
    { id: 'bug-hunter', name: 'Cazador de bugs', rank: 3, maxRank: 3, description: 'Incrementó la cobertura de pruebas del proyecto con tests unitarios y de integración, reduciendo regresiones en producción.' },
    { id: 'message-broker', name: 'Mensajero del Yermo', rank: 3, maxRank: 3, description: 'Mensajería asíncrona con ActiveMQ, RabbitMQ, Apache Kafka y AWS SQS con Dead Letter Queues. Servicios desacoplados y resilientes.' },
    { id: 'microfrontends', name: 'Microfrontendista', rank: 2, maxRank: 3, description: 'Diseñó componentes de microfrontend en Angular que mejoraron la escalabilidad y la experiencia de usuario, proponiéndolos de forma proactiva ante un cuello de botella.' },
    { id: 'translator', name: 'Traductor técnico', rank: 2, maxRank: 3, description: 'Comunica decisiones de arquitectura frontend al equipo de producto en lenguaje no técnico.' },
    { id: 'cloud-walker', name: 'Caminante de nubes', rank: 2, maxRank: 3, description: 'Despliegue y soporte en AWS y Azure. Contribuyó a automatizar pipelines CI/CD, reduciendo tiempos de entrega, y documentó el proceso para el equipo.' },
    { id: 'reactive', name: 'Maestro reactivo', rank: 2, maxRank: 3, description: 'Programación reactiva con Spring WebFlux / Project Reactor y RxJS en proyectos del sector financiero y asegurador.' },
    { id: 'pod-medic', name: 'Médico de pods', rank: 1, maxRank: 3, description: 'Revisión de logs, diagnóstico y gestión de pods en Kubernetes; métricas con Grafana y Prometheus.' },
    { id: 'integrator', name: 'Integrador', rank: 1, maxRank: 3, description: 'Flujos de integración y enrutamiento con Apache Camel.' },
    { id: 'ai-tinkerer', name: 'Manitas de IA', rank: 1, maxRank: 3, description: 'Bootcamp de IA (Talento Tech · MinTIC). Aplicaciones con Python y LLMs, integración de APIs de IA y experimentación con modelos locales.' },
    { id: 'cafeomaniac', name: 'Cafeomaníaco', rank: 1, maxRank: 1, description: '+15 % de productividad garantizada con V60 a 92 °C. Ratio 1:15. Sin bugs después del bloom.' },
  ],

  inventory: {
    weapons: [
      {
        id: 'java', name: 'Java · Spring Boot', kind: 'Rifle de combate · Backend', icon: 'java', equipped: true,
        description: 'Arma principal. Microservicios empresariales con Spring Boot bajo arquitectura limpia y SOLID: APIs REST seguras, persistencia con JPA / Hibernate y flujos reactivos con WebFlux.',
        mods: ['Spring Security', 'Spring Data JPA', 'Hibernate', 'WebFlux', 'Microservicios'],
        stats: [{ label: 'Daño', value: '90' }, { label: 'Uso', value: 'Diario' }, { label: 'Campo', value: 'Backend' }],
      },
      {
        id: 'angular', name: 'Angular · TypeScript', kind: 'Pistola láser · Frontend', icon: 'angular', equipped: true,
        description: 'Interfaces empresariales escalables con Angular y TypeScript bajo enfoque de microfrontends, componentes PrimeNG y maquetación con PrimeFlex y SASS.',
        mods: ['PrimeNG', 'PrimeFlex', 'RxJS', 'Microfrontends', 'SASS'],
        stats: [{ label: 'Daño', value: '85' }, { label: 'Uso', value: 'Diario' }, { label: 'Campo', value: 'Frontend' }],
      },
      {
        id: 'react', name: 'React.js', kind: 'Rifle láser · Frontend', icon: 'react',
        description: 'Usado en microfrontends empresariales y en este mismo Pip-Boy (React 19 + TypeScript + Vite).',
        mods: ['Hooks', 'Context API', 'Framer Motion'],
        stats: [{ label: 'Daño', value: '70' }, { label: 'Uso', value: 'Frecuente' }, { label: 'Campo', value: 'Frontend' }],
      },
      {
        id: 'web', name: 'JavaScript · HTML5 · CSS3', kind: 'Pistola 10 mm · Web', icon: 'html',
        description: 'La 10 mm de todo desarrollador web: confiable, ligera y siempre a mano.',
        mods: ['ES6+', 'Bootstrap', 'SASS', 'Responsive'],
        stats: [{ label: 'Daño', value: '80' }, { label: 'Uso', value: 'Diario' }, { label: 'Campo', value: 'Web' }],
      },
      {
        id: 'vue', name: 'Vue.js', kind: 'Pistola de plasma · Frontend', icon: 'vue',
        description: 'Conocimiento complementario para construir interfaces reactivas basadas en componentes.',
        mods: ['Componentes', 'SPA'],
        stats: [{ label: 'Daño', value: '55' }, { label: 'Uso', value: 'Complementario' }, { label: 'Campo', value: 'Frontend' }],
      },
      {
        id: 'python', name: 'Python · LLMs', kind: 'Rifle Gauss · IA', icon: 'python',
        description: 'Desarrollo de aplicaciones de IA con Python: integración de APIs de IA y modelos de lenguaje (LLMs), incluidos modelos locales.',
        mods: ['LLMs', 'APIs de IA', 'Ollama'],
        stats: [{ label: 'Daño', value: '60' }, { label: 'Uso', value: 'Complementario' }, { label: 'Campo', value: 'IA' }],
      },
    ],
    apparel: [
      {
        id: 'junit', name: 'JUnit 5 · Mockito', kind: 'Armadura de combate · Backend', icon: 'shieldCheck', equipped: true,
        description: 'Pruebas unitarias y de integración del backend. Mantiene a raya las regresiones antes de que lleguen a producción.',
        stats: [{ label: 'Res. daño', value: '90' }, { label: 'Protege', value: 'Backend' }],
      },
      {
        id: 'jasmine', name: 'Jasmine · Karma', kind: 'Traje antirradiación · Frontend', icon: 'testTube', equipped: true,
        description: 'Pruebas unitarias de componentes y servicios Angular.',
        stats: [{ label: 'Res. daño', value: '80' }, { label: 'Protege', value: 'Frontend' }],
      },
      {
        id: 'sonar', name: 'SonarQube', kind: 'Casco de combate · Calidad', icon: 'gauge', equipped: true,
        description: 'Análisis de cobertura y calidad estática para que el código entre limpio al Refugio.',
        stats: [{ label: 'Res. daño', value: '75' }, { label: 'Protege', value: 'Todo el código' }],
      },
      {
        id: 'tdd', name: 'TDD', kind: 'Servoarmadura · Metodología', icon: 'shield',
        description: 'Primero la prueba, luego el código. Pesada al principio, imparable después.',
        stats: [{ label: 'Res. daño', value: '85' }, { label: 'Protege', value: 'Diseño' }],
      },
      {
        id: 'parameter-store', name: 'AWS Parameter Store', kind: 'Chaleco blindado · Secretos', icon: 'key',
        description: 'Inyección y gestión de credenciales y configuración sin exponer secretos en el código.',
        stats: [{ label: 'Res. daño', value: '70' }, { label: 'Protege', value: 'Credenciales' }],
      },
    ],
    aid: [
      {
        id: 'scrum', name: 'Scrum', kind: 'Stimpak', icon: 'syringe',
        description: 'Planeación, dailies, revisiones y retrospectivas, proponiendo mejoras al proceso cuando aparecen oportunidades de optimización.',
        stats: [{ label: 'Efecto', value: '+20 sincronía del equipo' }, { label: 'Duración', value: 'Cada sprint' }],
      },
      {
        id: 'solid', name: 'Principios SOLID', kind: 'RadAway', icon: 'pill',
        description: 'Elimina la radiación acumulada en el código legado: responsabilidades claras y dependencias invertidas.',
        stats: [{ label: 'Efecto', value: '-50 deuda técnica' }],
      },
      {
        id: 'ddd', name: 'Domain-Driven Design', kind: 'Mentats', icon: 'brain',
        description: 'Modelado con el dominio del negocio en el centro y un lenguaje común entre producto y desarrollo.',
        stats: [{ label: 'Efecto', value: '+2 INT' }],
      },
      {
        id: 'hexagonal', name: 'Arquitectura hexagonal', kind: 'Buffout', icon: 'pill',
        description: 'Puertos y adaptadores: el dominio aislado de frameworks, bases de datos y brokers.',
        stats: [{ label: 'Efecto', value: '+2 FUE · +1 RES' }],
      },
      {
        id: 'communication', name: 'Comunicación técnica', kind: 'Mentats de uva', icon: 'users',
        description: 'Explica conceptos técnicos a negocio sin perder el rigor. Ideal antes de una reunión con producto.',
        stats: [{ label: 'Efecto', value: '+5 CAR' }],
      },
      {
        id: 'adaptability', name: 'Adaptabilidad', kind: 'Jet', icon: 'zap',
        description: 'Rápida adaptación a nuevos equipos, dominios y tecnologías.',
        stats: [{ label: 'Efecto', value: 'Ralentiza el tiempo' }],
      },
      {
        id: 'coffee', name: 'Café V60', kind: 'Nuka-Cola Quantum', icon: 'coffee',
        description: 'Combustible oficial del Refugio. Café santandereano filtrado a 92 °C. Ver perk CAFEOMANÍACO.',
        stats: [{ label: 'Efecto', value: '+15 % productividad · +1 PER' }],
      },
    ],
    misc: [
      {
        id: 'aws', name: 'AWS', kind: 'Vertibird · Cloud', icon: 'cloud',
        description: 'EC2, S3, API Gateway, RDS, CloudFront, Elastic Beanstalk, SQS y Parameter Store.',
        stats: [{ label: 'Uso', value: 'Despliegue y soporte' }],
      },
      {
        id: 'azure', name: 'Azure Pipelines', kind: 'Cinta transportadora · CI/CD', icon: 'workflow',
        description: 'Pipelines de integración y despliegue continuos, documentados para el resto del equipo.',
        stats: [{ label: 'Uso', value: 'CI/CD' }],
      },
      {
        id: 'docker', name: 'Docker', kind: 'Caja de suministros · Contenedores', icon: 'container',
        description: 'Empaquetado de servicios en contenedores reproducibles.',
        stats: [{ label: 'Uso', value: 'Contenedores' }],
      },
      {
        id: 'k8s', name: 'Kubernetes', kind: 'Llave inglesa · Orquestación', icon: 'network',
        description: 'Revisión de logs, diagnóstico y gestión de pods.',
        stats: [{ label: 'Uso', value: 'Diagnóstico' }],
      },
      {
        id: 'observability', name: 'Grafana · Prometheus', kind: 'Contador Geiger · Observabilidad', icon: 'activity',
        description: 'Métricas y paneles para detectar la radiación antes de que afecte a los usuarios.',
        stats: [{ label: 'Uso', value: 'Monitoreo' }],
      },
      {
        id: 'git', name: 'Git · GitFlow', kind: 'Kit de reparación · Versiones', icon: 'git',
        description: 'Control de versiones con ramas ordenadas y flujos de release predecibles.',
        stats: [{ label: 'Uso', value: 'Diario' }],
      },
      {
        id: 'intellij', name: 'IntelliJ IDEA', kind: 'Banco de trabajo · IDE', icon: 'monitor',
        description: 'Banco de trabajo principal para Java y Spring Boot.',
        stats: [{ label: 'Uso', value: 'Backend' }],
      },
      {
        id: 'vscode', name: 'VS Code', kind: 'Banco de trabajo · Editor', icon: 'code',
        description: 'Editor para frontend, scripts y todo lo demás.',
        stats: [{ label: 'Uso', value: 'Frontend' }],
      },
      {
        id: 'ai-ides', name: 'Kiro IDE · Antigravity IDE', kind: 'Prototipo experimental · IDEs con IA', icon: 'bot',
        description: 'Entornos de desarrollo asistidos por agentes de IA.',
        stats: [{ label: 'Uso', value: 'Exploración' }],
      },
    ],
    holo: [
      {
        id: 'termlink', name: 'Termlink JPSR-OS', kind: 'Holocinta · Programa', icon: 'terminal', action: 'terminal',
        description: 'Terminal RobCo para consultar el expediente con comandos. Atajo: tecla ~ o º.',
        stats: [{ label: 'Formato', value: 'Programa' }],
      },
      {
        id: 'hack', name: 'Hackeo de terminal', kind: 'Holocinta · Juego', icon: 'key', action: 'hack',
        description: 'El clásico minijuego de contraseñas: adivina la palabra en 4 intentos. Hay recompensa.',
        stats: [{ label: 'Formato', value: 'Juego' }],
      },
      {
        id: 'cv', name: 'Expediente JPSR (CV)', kind: 'Holocinta · Documento', icon: 'printer', action: 'download',
        description: 'Mi hoja de vida en PDF, generada a partir de este mismo Pip-Boy. Para imprimirla, usa ⚙ › Imprimir.',
        stats: [{ label: 'Formato', value: 'PDF' }],
      },
    ],
    ammo: [
      { id: 'postgres', name: 'PostgreSQL', kind: 'Munición .308 · Relacional', icon: 'database', qty: 248, description: 'Base de datos relacional principal: modelado, consultas nativas y rendimiento.', stats: [{ label: 'Tipo', value: 'SQL' }] },
      { id: 'mysql', name: 'MySQL', kind: 'Munición 10 mm · Relacional', icon: 'database', qty: 180, description: 'Esquemas relacionales y consultas para aplicaciones empresariales.', stats: [{ label: 'Tipo', value: 'SQL' }] },
      { id: 'sql', name: 'SQL nativo · Stored procedures', kind: 'Cartuchos de escopeta', icon: 'database', qty: 64, description: 'Consultas nativas y procedimientos almacenados cuando el ORM no alcanza.', stats: [{ label: 'Tipo', value: 'SQL' }] },
      { id: 'mongo', name: 'MongoDB', kind: 'Célula de fusión · NoSQL', icon: 'database', qty: 96, description: 'Modelado documental para datos flexibles.', stats: [{ label: 'Tipo', value: 'NoSQL' }] },
      { id: 'activemq', name: 'ActiveMQ', kind: 'Munición 5 mm · Mensajería', icon: 'message', qty: 500, description: 'Colas de mensajería en microservicios Spring Boot.', stats: [{ label: 'Tipo', value: 'Broker' }] },
      { id: 'rabbit', name: 'RabbitMQ', kind: 'Munición 5,56 · Mensajería', icon: 'message', qty: 320, description: 'Flujos de eventos de dominio y desacoplamiento de servicios.', stats: [{ label: 'Tipo', value: 'Broker' }] },
      { id: 'kafka', name: 'Apache Kafka', kind: 'Núcleo de fusión · Streaming', icon: 'message', qty: 42, description: 'Eventos de dominio en streaming.', stats: [{ label: 'Tipo', value: 'Streaming' }] },
      { id: 'sqs', name: 'AWS SQS + DLQ', kind: 'Cartucho de plasma · Colas', icon: 'message', qty: 150, description: 'Gestión de colas y Dead Letter Queues para mensajes que no se pudieron procesar.', stats: [{ label: 'Tipo', value: 'Cola gestionada' }] },
      { id: 'camel', name: 'Apache Camel', kind: 'Púas de ferrocarril · Integración', icon: 'workflow', qty: 77, description: 'Rutas de integración y enrutamiento entre sistemas.', stats: [{ label: 'Tipo', value: 'Integración' }] },
    ],
  },

  quests: [
    {
      id: 'nexos', group: 'main', status: 'active',
      title: 'Nexos Software', org: 'Nexos Software',
      role: 'Analista de Desarrollo Full Stack · Java / Angular',
      period: '09/2023 – Presente', location: 'Medellín, Antioquia (remoto)',
      summary: 'Desarrollo full stack de soluciones distribuidas bajo arquitectura limpia y microservicios para clientes empresariales.',
      stages: [
        {
          heading: 'Asignación actual · Entidad financiera',
          objectives: [
            { text: 'Desarrollar en proyectos core de una entidad financiera del sector banca.', done: false },
          ],
        },
        {
          heading: 'Proyecto Carvajal Tecnología y Servicios',
          objectives: [
            { text: 'Desarrollar microservicios en Java con Spring Boot aplicando arquitectura limpia, principios SOLID y colas de mensajería con ActiveMQ.', done: true },
            { text: 'Construir interfaces escalables con Angular, ReactJS, TypeScript y PrimeNG bajo enfoque de microfrontends.', done: true },
            { text: 'Comunicar decisiones de arquitectura frontend al equipo de producto en lenguaje no técnico.', done: true },
            { text: 'Crear pruebas unitarias con JUnit y Mockito (backend) y Jasmine / Karma (frontend); analizar cobertura con SonarQube.', done: true },
            { text: 'Participar en ceremonias Scrum (planeación, dailies, revisiones y retrospectivas) y proponer mejoras al proceso.', done: true },
            { text: 'Desplegar y dar soporte en la nube: Azure (Azure Pipelines) y AWS (API Gateway, S3, CloudFront).', done: true },
          ],
        },
      ],
      rewards: [
        'Incrementé la cobertura de pruebas con tests unitarios y de integración, mejorando la estabilidad y reduciendo regresiones en producción.',
        'Diseñé componentes de microfrontend en Angular que mejoraron la escalabilidad y la experiencia de usuario, proponiendo la solución de forma proactiva ante un cuello de botella.',
        'Reduje tiempos de entrega contribuyendo a la automatización de pipelines CI/CD en Azure y AWS, y documenté el proceso para el equipo.',
      ],
    },
    {
      id: 'sofka', group: 'main', status: 'done',
      title: 'Sofka Technologies', org: 'Sofka Technologies',
      role: 'Consultor Desarrollador Full Stack',
      period: '02/2022 – 04/2023',
      summary: 'Consultoría full stack para sistemas core de clientes del sector financiero y asegurador.',
      stages: [
        {
          objectives: [
            { text: 'Desarrollar ecosistemas reactivos de baja latencia con Spring WebFlux y Project Reactor.', done: true },
            { text: 'Aplicar Clean Architecture y Domain-Driven Design en sistemas de alta criticidad.', done: true },
            { text: 'Diseñar flujos de eventos de dominio con RabbitMQ y Apache Kafka.', done: true },
            { text: 'Modelar esquemas en bases de datos relacionales (PostgreSQL / MySQL) y NoSQL (MongoDB).', done: true },
          ],
        },
      ],
    },
    {
      id: 'adso', group: 'side', status: 'done',
      title: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)', org: 'SENA',
      period: '09/2023 – 06/2026',
      summary: 'Formación tecnológica en el ciclo de vida completo del software: análisis, diseño de arquitecturas, modelado de bases de datos y construcción de aplicaciones con metodologías ágiles.',
      stages: [
        {
          objectives: [
            { text: 'Obtener el título de Tecnólogo en Análisis y Desarrollo de Software.', done: true },
            { text: 'Obtener la tarjeta profesional expedida por el COPNIA.', done: true },
          ],
        },
      ],
      rewards: ['Tarjeta profesional vigente · COPNIA'],
    },
    {
      id: 'ai-bootcamp', group: 'side', status: 'done',
      title: 'Bootcamp en Inteligencia Artificial', org: 'Talento Tech · MinTIC',
      summary: 'Formación en inteligencia artificial: modelos de lenguaje (LLMs), desarrollo de aplicaciones con Python e integración de APIs de IA.',
      stages: [
        {
          objectives: [
            { text: 'Completar el bootcamp de IA del programa Talento Tech (MinTIC).', done: true },
          ],
        },
      ],
    },
    {
      id: 'sofka-u', group: 'side', status: 'done',
      title: 'Training Desarrollo de Software', org: 'Sofka University',
      period: '11/2021 – 02/2022',
      summary: 'Entrenamiento intensivo bajo el modelo de la Liga de Sofka: Clean Architecture, SOLID, DDD, programación funcional y reactiva con Java y bases de datos NoSQL.',
      stages: [{ objectives: [{ text: 'Graduarse del Sofka University Training Program.', done: true }] }],
    },
    {
      id: 'efset', group: 'side', status: 'done',
      title: 'EF SET English Certificate', org: 'EF Education First',
      period: '2023',
      summary: 'Inglés nivel B1: lectura de documentación técnica y comunicación en equipos de desarrollo.',
      stages: [{ objectives: [{ text: 'Certificar nivel B1 de inglés.', done: true }] }],
    },
    {
      id: 'udemy-spring', group: 'side', status: 'done',
      title: 'Universidad Spring Framework', org: 'Udemy',
      period: '2022',
      summary: 'Ecosistema Spring: Spring Boot, Spring Data JPA, Spring Security y APIs RESTful.',
      stages: [{ objectives: [{ text: 'Completar el curso.', done: true }] }],
    },
    {
      id: 'udemy-web', group: 'side', status: 'done',
      title: 'Universidad Desarrollo Web', org: 'Udemy',
      period: '2022',
      summary: 'Bases de frontend: HTML5, CSS3, JavaScript moderno (ES6+), fundamentos de React y diseño responsive.',
      stages: [{ objectives: [{ text: 'Completar el curso.', done: true }] }],
    },
  ],

  workshops: [
    {
      id: 'pipboy', name: 'Pip-Boy 3000 · este sitio', type: 'Proyecto personal', status: 'En línea',
      description: 'Portafolio interactivo inspirado en la saga Fallout: navegación por teclado, efectos CRT, sonido sintetizado con Web Audio, radio, mapas con datos geográficos reales y una terminal RobCo con minijuego de hackeo.',
      stack: ['React 19', 'TypeScript', 'Vite', 'Framer Motion', 'd3-geo', 'Web Audio API'],
      highlights: ['Bilingüe (ES / EN)', 'Temas de color de la saga', 'CV imprimible generado desde los mismos datos'],
      url: 'https://github.com/JuanPabloSR/pip-boy-website',
    },
    {
      id: 'carvajal', name: 'Plataforma distribuida · Carvajal', type: 'Laboral · Nexos Software', status: 'Completado',
      description: 'Soluciones distribuidas bajo arquitectura limpia: microservicios Spring Boot con mensajería ActiveMQ y microfrontends en Angular y React, desplegados en Azure y AWS.',
      stack: ['Java', 'Spring Boot', 'ActiveMQ', 'Angular', 'React', 'PrimeNG', 'Azure Pipelines', 'AWS'],
      highlights: ['Microfrontends propuestos ante un cuello de botella', 'Mayor cobertura de pruebas', 'Pipelines CI/CD automatizados y documentados'],
    },
    {
      id: 'vera', name: 'Vera Villamizar Abogados', type: 'Freelance', status: 'Completado',
      description: 'Propuesta técnica y comercial, y construcción de la landing page de la firma de abogados.',
      stack: ['Landing page', 'Diseño web', 'Propuesta técnica'],
      highlights: ['Levantamiento de necesidades del cliente', 'Propuesta técnico-comercial', 'Construcción de la landing page'],
    },
    {
      id: 'feco', name: 'Proyecto Feco', type: 'Integración empresarial', status: 'Completado',
      description: 'Implementación de flujos de integración y enrutamiento entre sistemas con Apache Camel.',
      stack: ['Apache Camel', 'Java'],
      highlights: ['Rutas de integración', 'Enrutamiento de mensajes'],
    },
    {
      id: 'ai-lab', name: 'Laboratorio de IA', type: 'Formación · Personal', status: 'En expansión',
      description: 'Aplicaciones con Python y modelos de lenguaje: integración de APIs de IA y experimentación con modelos locales.',
      stack: ['Python', 'LLMs', 'APIs de IA', 'Ollama'],
      highlights: ['Bootcamp de IA · Talento Tech (MinTIC)', 'Prototipos con LLMs locales'],
    },
  ],

  stats: [
    {
      heading: 'General',
      lines: [
        { label: 'Años de experiencia', value: '4+' },
        { label: 'Empresas', value: '2' },
        { label: 'Nubes conquistadas', value: '2 (AWS, Azure)' },
        { label: 'Brokers de mensajería', value: '4' },
        { label: 'Frameworks frontend', value: '3' },
        { label: 'IDEs equipados', value: '4' },
        { label: 'Idiomas', value: 'ES nativo · EN B1' },
      ],
    },
  ],

  waypoints: [
    {
      id: 'bga', name: 'Bucaramanga', coords: [-73.1198, 7.1254], home: true,
      label: 'Base · Ubicación actual',
      description: 'Santander, Colombia. Trabajo remoto en UTC-5.',
    },
    {
      id: 'med', name: 'Medellín', coords: [-75.5636, 6.2518],
      label: 'Nexos Software · Sede',
      description: 'Antioquia, Colombia. Conexión remota desde Bucaramanga.',
    },
  ],

  stations: [
    // Música de cada juego (el tema de color elige cuál); la baliza suena con todos.
    { id: 'dcr', ...STATIONS.dcr, description: 'Fallout 4. Noticias y música desde la Gran Joya Verde.' },
    { id: 'classical', ...STATIONS.classical, description: 'Fallout 4. Música clásica para recorrer la Commonwealth.' },
    { id: 'gnr', ...STATIONS.gnr, description: 'Fallout 3. Tres Perros no está, pero la música sí.' },
    { id: 'enclave', ...STATIONS.enclave, description: 'Fallout 3. Marchas patrióticas en bucle, cortesía del presidente Eden.' },
    { id: 'rnv', ...STATIONS.rnv, description: 'New Vegas. Swing, crooners y country para cruzar el Mojave.' },
    { id: 'mojave', ...STATIONS.mojave, description: 'New Vegas. Las canciones del Mojave, sin locutor.' },
    {
      id: 'sos', name: 'Señal de socorro', freq: '33.3',
      description: 'Baliza en código Morse transmitiendo en bucle desde Bucaramanga. Generada en tiempo real.',
      morse: 'JPSR EN LINEA',
    },
  ],

  skillGroups: [
    { label: 'Backend', items: ['Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'WebFlux (Reactive)', 'Microservicios', 'Apache Camel'] },
    { label: 'Frontend', items: ['Angular', 'TypeScript', 'JavaScript', 'PrimeNG', 'PrimeFlex', 'React.js', 'Vue.js', 'Bootstrap', 'SASS', 'HTML5', 'CSS3'] },
    { label: 'Testing y calidad', items: ['JUnit 5', 'Mockito', 'Jasmine', 'Karma', 'SonarQube', 'TDD'] },
    { label: 'Bases de datos', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL (consultas nativas, stored procedures)'] },
    { label: 'Mensajería', items: ['ActiveMQ', 'RabbitMQ', 'Apache Kafka', 'AWS SQS (DLQ)'] },
    { label: 'Cloud y DevOps', items: ['AWS (EC2, S3, API Gateway, RDS, CloudFront, Elastic Beanstalk, SQS, Parameter Store)', 'Azure Pipelines', 'Docker', 'Kubernetes', 'Grafana', 'Prometheus', 'Git', 'GitFlow'] },
    { label: 'Inteligencia artificial', items: ['Modelos LLM', 'Python', 'Integración de APIs de IA'] },
    { label: 'Metodologías', items: ['Scrum', 'Arquitectura limpia', 'DDD', 'SOLID', 'Arquitectura hexagonal'] },
    { label: 'IDEs', items: ['IntelliJ IDEA', 'VS Code', 'Kiro IDE', 'Antigravity IDE'] },
  ],
};

export default profile;

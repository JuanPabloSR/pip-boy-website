import type { Profile } from './types';
import { RADIO_TRACKS, CONTACT } from './shared';

// English content. Keep ids in sync with profile.es.ts so the current
// selection survives a language switch.

const profile: Profile = {
  ...CONTACT,
  name: 'Juan Pablo Sánchez Rey',
  shortName: 'JPSR',
  title: 'Full Stack Developer',
  headline: 'Java · Spring Boot · Angular · TypeScript',
  location: 'Bucaramanga, Santander, Colombia',
  timezoneLabel: 'UTC-5 (Bogotá)',
  careerStart: '2022-02',

  summary: [
    'Full Stack Developer with 4+ years of experience building scalable enterprise software. Specialized in backend with Java and Spring Boot (clean architecture, microservices, messaging) and frontend with Angular and TypeScript (micro-frontends, PrimeNG).',
    'Proven experience in quality assurance (JUnit, Mockito, Jasmine, Karma, SonarQube) and cloud deployments (AWS, Azure). Complementary knowledge of React.js, Vue.js and AI application development with Python (LLMs).',
    'Used to agile environments (Scrum). I stand out for communicating technical concepts clearly to business stakeholders, adapting quickly and proactively improving performance and core architecture.',
  ],
  availability: [
    'Open to Full Stack projects, consulting and freelance work',
    'Working remotely from Bucaramanga · UTC-5',
  ],
  languages: [
    { name: 'Spanish', level: 'Native' },
    { name: 'English', level: 'B1 (EF SET)' },
  ],

  special: [
    {
      letter: 'S', attribute: 'Strength', skill: 'Java backend', value: 9,
      description: 'Raw server-side power. Java microservices with Spring Boot, Spring Security, Spring Data JPA / Hibernate and reactive programming with WebFlux, always under clean architecture.',
      tags: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'WebFlux'],
    },
    {
      letter: 'P', attribute: 'Perception', skill: 'Quality & testing', value: 8,
      description: 'Spots bugs before they reach the production Wasteland. Unit and integration tests with JUnit 5 and Mockito, Jasmine and Karma on the frontend, TDD and coverage analysis with SonarQube.',
      tags: ['JUnit 5', 'Mockito', 'Jasmine', 'Karma', 'SonarQube', 'TDD'],
    },
    {
      letter: 'E', attribute: 'Endurance', skill: 'Cloud & DevOps', value: 7,
      description: 'Systems that withstand production radiation. Deployments on AWS and Azure, CI/CD pipelines, Docker containers, pod troubleshooting on Kubernetes and observability with Grafana and Prometheus.',
      tags: ['AWS', 'Azure Pipelines', 'Docker', 'Kubernetes', 'Grafana'],
    },
    {
      letter: 'C', attribute: 'Charisma', skill: 'Communication', value: 8,
      description: 'Translates architecture decisions into business language. Active in Scrum ceremonies, proposes process improvements and writes documentation so the rest of the team moves faster.',
      tags: ['Scrum', 'Business', 'Documentation'],
    },
    {
      letter: 'I', attribute: 'Intelligence', skill: 'Architecture', value: 9,
      description: 'Clean and hexagonal architecture, DDD and SOLID principles. Decoupled microservices with messaging (ActiveMQ, RabbitMQ, Kafka, SQS) and integration with Apache Camel.',
      tags: ['Clean Architecture', 'Hexagonal', 'DDD', 'SOLID', 'Messaging'],
    },
    {
      letter: 'A', attribute: 'Agility', skill: 'Frontend', value: 8,
      description: 'Fast reflexes on the UI. Enterprise apps with Angular and TypeScript using a micro-frontend approach, PrimeNG and PrimeFlex, plus React.js and Vue.js.',
      tags: ['Angular', 'TypeScript', 'PrimeNG', 'React', 'Vue'],
    },
    {
      letter: 'L', attribute: 'Luck', skill: 'AI & LLMs', value: 6,
      description: 'The wild card. AI application development with Python, AI API integration and experiments with large language models (LLMs), including local models.',
      tags: ['Python', 'LLMs', 'AI APIs', 'Talento Tech'],
    },
  ],

  perks: [
    { id: 'clean-architect', name: 'Clean Architect', rank: 3, maxRank: 3, description: 'SOLID principles, clean and hexagonal architecture and DDD applied to real enterprise systems.' },
    { id: 'bug-hunter', name: 'Bug Hunter', rank: 3, maxRank: 3, description: 'Raised the project test coverage with unit and integration tests, reducing production regressions.' },
    { id: 'message-broker', name: 'Wasteland Courier', rank: 3, maxRank: 3, description: 'Asynchronous messaging with ActiveMQ, RabbitMQ, Apache Kafka and AWS SQS with Dead Letter Queues. Decoupled, resilient services.' },
    { id: 'microfrontends', name: 'Micro-frontender', rank: 2, maxRank: 3, description: 'Designed Angular micro-frontend components that improved scalability and user experience, proposed proactively to solve a bottleneck.' },
    { id: 'translator', name: 'Tech Translator', rank: 2, maxRank: 3, description: 'Explains frontend architecture decisions to the product team in non-technical language.' },
    { id: 'cloud-walker', name: 'Cloud Walker', rank: 2, maxRank: 3, description: 'Deployment and support on AWS and Azure. Helped automate CI/CD pipelines, cutting delivery times, and documented the process for the team.' },
    { id: 'reactive', name: 'Reactive Master', rank: 2, maxRank: 3, description: 'Reactive programming with Spring WebFlux / Project Reactor and RxJS on financial and insurance projects.' },
    { id: 'pod-medic', name: 'Pod Medic', rank: 1, maxRank: 3, description: 'Log review, troubleshooting and pod management on Kubernetes; metrics with Grafana and Prometheus.' },
    { id: 'integrator', name: 'Integrator', rank: 1, maxRank: 3, description: 'Integration and routing flows with Apache Camel.' },
    { id: 'ai-tinkerer', name: 'AI Tinkerer', rank: 1, maxRank: 3, description: 'AI bootcamp (Talento Tech · MinTIC). Python + LLM apps, AI API integration and experiments with local models.' },
    { id: 'cafeomaniac', name: 'Caffeine Fiend', rank: 1, maxRank: 1, description: '+15% productivity guaranteed with a V60 at 92 °C. 1:15 ratio. No bugs after the bloom.' },
  ],

  inventory: {
    weapons: [
      {
        id: 'java', name: 'Java · Spring Boot', kind: 'Combat rifle · Backend', icon: 'java', equipped: true,
        description: 'Main weapon. Enterprise microservices with Spring Boot under clean architecture and SOLID: secure REST APIs, persistence with JPA / Hibernate and reactive flows with WebFlux.',
        mods: ['Spring Security', 'Spring Data JPA', 'Hibernate', 'WebFlux', 'Microservices'],
        stats: [{ label: 'Damage', value: '90' }, { label: 'Use', value: 'Daily' }, { label: 'Field', value: 'Backend' }],
      },
      {
        id: 'angular', name: 'Angular · TypeScript', kind: 'Laser pistol · Frontend', icon: 'angular', equipped: true,
        description: 'Scalable enterprise UIs with Angular and TypeScript using a micro-frontend approach, PrimeNG components and PrimeFlex / SASS layouts.',
        mods: ['PrimeNG', 'PrimeFlex', 'RxJS', 'Micro-frontends', 'SASS'],
        stats: [{ label: 'Damage', value: '85' }, { label: 'Use', value: 'Daily' }, { label: 'Field', value: 'Frontend' }],
      },
      {
        id: 'react', name: 'React.js', kind: 'Laser rifle · Frontend', icon: 'react',
        description: 'Used in enterprise micro-frontends and in this very Pip-Boy (React 19 + TypeScript + Vite).',
        mods: ['Hooks', 'Context API', 'Framer Motion'],
        stats: [{ label: 'Damage', value: '70' }, { label: 'Use', value: 'Frequent' }, { label: 'Field', value: 'Frontend' }],
      },
      {
        id: 'web', name: 'JavaScript · HTML5 · CSS3', kind: '10mm pistol · Web', icon: 'html',
        description: "Every web developer's 10mm: reliable, light and always at hand.",
        mods: ['ES6+', 'Bootstrap', 'SASS', 'Responsive'],
        stats: [{ label: 'Damage', value: '80' }, { label: 'Use', value: 'Daily' }, { label: 'Field', value: 'Web' }],
      },
      {
        id: 'vue', name: 'Vue.js', kind: 'Plasma pistol · Frontend', icon: 'vue',
        description: 'Complementary knowledge for building reactive, component-based interfaces.',
        mods: ['Components', 'SPA'],
        stats: [{ label: 'Damage', value: '55' }, { label: 'Use', value: 'Complementary' }, { label: 'Field', value: 'Frontend' }],
      },
      {
        id: 'python', name: 'Python · LLMs', kind: 'Gauss rifle · AI', icon: 'python',
        description: 'AI application development with Python: AI API integration and large language models (LLMs), including local models.',
        mods: ['LLMs', 'AI APIs', 'Ollama'],
        stats: [{ label: 'Damage', value: '60' }, { label: 'Use', value: 'Complementary' }, { label: 'Field', value: 'AI' }],
      },
    ],
    apparel: [
      {
        id: 'junit', name: 'JUnit 5 · Mockito', kind: 'Combat armor · Backend', icon: 'shieldCheck', equipped: true,
        description: 'Backend unit and integration tests. Keeps regressions at bay before they reach production.',
        stats: [{ label: 'Damage res.', value: '90' }, { label: 'Protects', value: 'Backend' }],
      },
      {
        id: 'jasmine', name: 'Jasmine · Karma', kind: 'Hazmat suit · Frontend', icon: 'testTube', equipped: true,
        description: 'Unit tests for Angular components and services.',
        stats: [{ label: 'Damage res.', value: '80' }, { label: 'Protects', value: 'Frontend' }],
      },
      {
        id: 'sonar', name: 'SonarQube', kind: 'Combat helmet · Quality', icon: 'gauge', equipped: true,
        description: 'Coverage and static quality analysis so code enters the Vault clean.',
        stats: [{ label: 'Damage res.', value: '75' }, { label: 'Protects', value: 'All the code' }],
      },
      {
        id: 'tdd', name: 'TDD', kind: 'Power armor · Methodology', icon: 'shield',
        description: 'Test first, code second. Heavy at first, unstoppable afterwards.',
        stats: [{ label: 'Damage res.', value: '85' }, { label: 'Protects', value: 'Design' }],
      },
      {
        id: 'parameter-store', name: 'AWS Parameter Store', kind: 'Armored vest · Secrets', icon: 'key',
        description: 'Credential and configuration injection without leaking secrets into the code.',
        stats: [{ label: 'Damage res.', value: '70' }, { label: 'Protects', value: 'Credentials' }],
      },
    ],
    aid: [
      {
        id: 'scrum', name: 'Scrum', kind: 'Stimpak', icon: 'syringe',
        description: 'Planning, dailies, reviews and retrospectives, proposing process improvements whenever there is room to optimize.',
        stats: [{ label: 'Effect', value: '+20 team sync' }, { label: 'Duration', value: 'Every sprint' }],
      },
      {
        id: 'solid', name: 'SOLID principles', kind: 'RadAway', icon: 'pill',
        description: 'Removes radiation built up in legacy code: clear responsibilities and inverted dependencies.',
        stats: [{ label: 'Effect', value: '-50 tech debt' }],
      },
      {
        id: 'ddd', name: 'Domain-Driven Design', kind: 'Mentats', icon: 'brain',
        description: 'Modeling with the business domain at the center and a shared language between product and engineering.',
        stats: [{ label: 'Effect', value: '+2 INT' }],
      },
      {
        id: 'hexagonal', name: 'Hexagonal architecture', kind: 'Buffout', icon: 'pill',
        description: 'Ports and adapters: the domain isolated from frameworks, databases and brokers.',
        stats: [{ label: 'Effect', value: '+2 STR · +1 END' }],
      },
      {
        id: 'communication', name: 'Technical communication', kind: 'Grape Mentats', icon: 'users',
        description: 'Explains technical concepts to the business without losing rigor. Best taken before a product meeting.',
        stats: [{ label: 'Effect', value: '+5 CHA' }],
      },
      {
        id: 'adaptability', name: 'Adaptability', kind: 'Jet', icon: 'zap',
        description: 'Quickly adapts to new teams, domains and technologies.',
        stats: [{ label: 'Effect', value: 'Slows down time' }],
      },
      {
        id: 'coffee', name: 'V60 coffee', kind: 'Nuka-Cola Quantum', icon: 'coffee',
        description: 'Official Vault fuel. Santander coffee brewed at 92 °C. See perk CAFFEINE FIEND.',
        stats: [{ label: 'Effect', value: '+15% productivity · +1 PER' }],
      },
    ],
    misc: [
      {
        id: 'aws', name: 'AWS', kind: 'Vertibird · Cloud', icon: 'cloud',
        description: 'EC2, S3, API Gateway, RDS, CloudFront, Elastic Beanstalk, SQS and Parameter Store.',
        stats: [{ label: 'Use', value: 'Deployment & support' }],
      },
      {
        id: 'azure', name: 'Azure Pipelines', kind: 'Conveyor belt · CI/CD', icon: 'workflow',
        description: 'Continuous integration and delivery pipelines, documented for the rest of the team.',
        stats: [{ label: 'Use', value: 'CI/CD' }],
      },
      {
        id: 'docker', name: 'Docker', kind: 'Supply crate · Containers', icon: 'container',
        description: 'Services packaged in reproducible containers.',
        stats: [{ label: 'Use', value: 'Containers' }],
      },
      {
        id: 'k8s', name: 'Kubernetes', kind: 'Wrench · Orchestration', icon: 'network',
        description: 'Log review, troubleshooting and pod management.',
        stats: [{ label: 'Use', value: 'Troubleshooting' }],
      },
      {
        id: 'observability', name: 'Grafana · Prometheus', kind: 'Geiger counter · Observability', icon: 'activity',
        description: 'Metrics and dashboards to detect radiation before it reaches users.',
        stats: [{ label: 'Use', value: 'Monitoring' }],
      },
      {
        id: 'git', name: 'Git · GitFlow', kind: 'Repair kit · Versioning', icon: 'git',
        description: 'Version control with tidy branches and predictable release flows.',
        stats: [{ label: 'Use', value: 'Daily' }],
      },
      {
        id: 'intellij', name: 'IntelliJ IDEA', kind: 'Workbench · IDE', icon: 'monitor',
        description: 'Main workbench for Java and Spring Boot.',
        stats: [{ label: 'Use', value: 'Backend' }],
      },
      {
        id: 'vscode', name: 'VS Code', kind: 'Workbench · Editor', icon: 'code',
        description: 'Editor for frontend, scripts and everything else.',
        stats: [{ label: 'Use', value: 'Frontend' }],
      },
      {
        id: 'ai-ides', name: 'Kiro IDE · Antigravity IDE', kind: 'Experimental prototype · AI IDEs', icon: 'bot',
        description: 'Development environments assisted by AI agents.',
        stats: [{ label: 'Use', value: 'Exploration' }],
      },
    ],
    holo: [
      {
        id: 'termlink', name: 'Termlink JPSR-OS', kind: 'Holotape · Program', icon: 'terminal', action: 'terminal',
        description: 'RobCo terminal to browse the file with commands. Shortcut: the ~ key.',
        stats: [{ label: 'Format', value: 'Program' }],
      },
      {
        id: 'hack', name: 'Terminal hacking', kind: 'Holotape · Game', icon: 'key', action: 'hack',
        description: 'The classic password minigame: guess the word in 4 attempts. There is a reward.',
        stats: [{ label: 'Format', value: 'Game' }],
      },
      {
        id: 'cv', name: 'JPSR file (résumé)', kind: 'Holotape · Document', icon: 'printer', action: 'download',
        description: 'My résumé as a PDF, generated from this very Pip-Boy. To print it, use ⚙ › Print.',
        stats: [{ label: 'Format', value: 'PDF' }],
      },
    ],
    ammo: [
      { id: 'postgres', name: 'PostgreSQL', kind: '.308 round · Relational', icon: 'database', qty: 248, description: 'Main relational database: modeling, native queries and performance.', stats: [{ label: 'Type', value: 'SQL' }] },
      { id: 'mysql', name: 'MySQL', kind: '10mm round · Relational', icon: 'database', qty: 180, description: 'Relational schemas and queries for enterprise apps.', stats: [{ label: 'Type', value: 'SQL' }] },
      { id: 'sql', name: 'Native SQL · Stored procedures', kind: 'Shotgun shells', icon: 'database', qty: 64, description: 'Native queries and stored procedures for when the ORM is not enough.', stats: [{ label: 'Type', value: 'SQL' }] },
      { id: 'mongo', name: 'MongoDB', kind: 'Fusion cell · NoSQL', icon: 'database', qty: 96, description: 'Document modeling for flexible data.', stats: [{ label: 'Type', value: 'NoSQL' }] },
      { id: 'activemq', name: 'ActiveMQ', kind: '5mm round · Messaging', icon: 'message', qty: 500, description: 'Message queues in Spring Boot microservices.', stats: [{ label: 'Type', value: 'Broker' }] },
      { id: 'rabbit', name: 'RabbitMQ', kind: '5.56 round · Messaging', icon: 'message', qty: 320, description: 'Domain event flows and service decoupling.', stats: [{ label: 'Type', value: 'Broker' }] },
      { id: 'kafka', name: 'Apache Kafka', kind: 'Fusion core · Streaming', icon: 'message', qty: 42, description: 'Streaming domain events.', stats: [{ label: 'Type', value: 'Streaming' }] },
      { id: 'sqs', name: 'AWS SQS + DLQ', kind: 'Plasma cartridge · Queues', icon: 'message', qty: 150, description: 'Queue management and Dead Letter Queues for messages that could not be processed.', stats: [{ label: 'Type', value: 'Managed queue' }] },
      { id: 'camel', name: 'Apache Camel', kind: 'Railroad spikes · Integration', icon: 'workflow', qty: 77, description: 'Integration and routing between systems.', stats: [{ label: 'Type', value: 'Integration' }] },
    ],
  },

  quests: [
    {
      id: 'nexos', group: 'main', status: 'active',
      title: 'Nexos Software', org: 'Nexos Software',
      role: 'Full Stack Development Analyst · Java / Angular',
      period: '09/2023 – Present', location: 'Medellín, Colombia (remote)',
      summary: 'Full stack development of distributed solutions using clean architecture and microservices for enterprise clients.',
      stages: [
        {
          heading: 'Current assignment · Financial institution',
          objectives: [
            { text: 'Build core projects for a financial institution in the banking sector.', done: false },
          ],
        },
        {
          heading: 'Carvajal Tecnología y Servicios project',
          objectives: [
            { text: 'Develop Java microservices with Spring Boot applying clean architecture, SOLID principles and ActiveMQ message queues.', done: true },
            { text: 'Build scalable UIs with Angular, ReactJS, TypeScript and PrimeNG using a micro-frontend approach.', done: true },
            { text: 'Explain frontend architecture decisions to the product team in non-technical language.', done: true },
            { text: 'Write unit tests with JUnit and Mockito (backend) and Jasmine / Karma (frontend); analyze coverage with SonarQube.', done: true },
            { text: 'Take part in Scrum ceremonies (planning, dailies, reviews and retrospectives) and propose process improvements.', done: true },
            { text: 'Deploy and support cloud apps on Azure (Azure Pipelines) and AWS (API Gateway, S3, CloudFront).', done: true },
          ],
        },
      ],
      rewards: [
        'Raised test coverage with unit and integration tests, improving stability and reducing production regressions.',
        'Designed Angular micro-frontend components that improved scalability and user experience, proactively proposing the solution to a bottleneck.',
        'Cut delivery times by helping automate CI/CD pipelines on Azure and AWS, and documented the process for the team.',
      ],
    },
    {
      id: 'sofka', group: 'main', status: 'done',
      title: 'Sofka Technologies', org: 'Sofka Technologies',
      role: 'Full Stack Developer Consultant',
      period: '02/2022 – 04/2023',
      summary: 'Full stack consulting for core systems of financial and insurance clients.',
      stages: [
        {
          objectives: [
            { text: 'Build low-latency reactive systems with Spring WebFlux and Project Reactor.', done: true },
            { text: 'Apply Clean Architecture and Domain-Driven Design to mission-critical systems.', done: true },
            { text: 'Design domain event flows with RabbitMQ and Apache Kafka.', done: true },
            { text: 'Model schemas in relational (PostgreSQL / MySQL) and NoSQL (MongoDB) databases.', done: true },
          ],
        },
      ],
    },
    {
      id: 'adso', group: 'side', status: 'done',
      title: 'Software Analysis and Development Technologist (ADSO)', org: 'SENA',
      period: '09/2023 – 06/2026',
      summary: 'Technology degree covering the full software lifecycle: analysis, architecture design, database modeling and application development with agile methodologies.',
      stages: [
        {
          objectives: [
            { text: 'Earn the Software Analysis and Development Technologist degree.', done: true },
            { text: 'Obtain the professional license issued by COPNIA.', done: true },
          ],
        },
      ],
      rewards: ['Valid professional license · COPNIA'],
    },
    {
      id: 'ai-bootcamp', group: 'side', status: 'done',
      title: 'Artificial Intelligence Bootcamp', org: 'Talento Tech · MinTIC',
      summary: 'Artificial intelligence training: large language models (LLMs), Python application development and AI API integration.',
      stages: [
        {
          objectives: [
            { text: 'Complete the Talento Tech (MinTIC) AI bootcamp.', done: true },
          ],
        },
      ],
    },
    {
      id: 'sofka-u', group: 'side', status: 'done',
      title: 'Software Development Training', org: 'Sofka University',
      period: '11/2021 – 02/2022',
      summary: 'Intensive training under the Sofka League model: Clean Architecture, SOLID, DDD, functional and reactive programming with Java and NoSQL databases.',
      stages: [{ objectives: [{ text: 'Graduate from the Sofka University Training Program.', done: true }] }],
    },
    {
      id: 'efset', group: 'side', status: 'done',
      title: 'EF SET English Certificate', org: 'EF Education First',
      period: '2023',
      summary: 'B1 English: reading technical documentation and communicating within development teams.',
      stages: [{ objectives: [{ text: 'Certify B1 English level.', done: true }] }],
    },
    {
      id: 'udemy-spring', group: 'side', status: 'done',
      title: 'Spring Framework University', org: 'Udemy',
      period: '2022',
      summary: 'Spring ecosystem: Spring Boot, Spring Data JPA, Spring Security and RESTful APIs.',
      stages: [{ objectives: [{ text: 'Complete the course.', done: true }] }],
    },
    {
      id: 'udemy-web', group: 'side', status: 'done',
      title: 'Web Development University', org: 'Udemy',
      period: '2022',
      summary: 'Frontend foundations: HTML5, CSS3, modern JavaScript (ES6+), React basics and responsive design.',
      stages: [{ objectives: [{ text: 'Complete the course.', done: true }] }],
    },
  ],

  workshops: [
    {
      id: 'pipboy', name: 'Pip-Boy 3000 · this site', type: 'Personal project', status: 'Online',
      description: 'Interactive portfolio inspired by the Fallout series: keyboard navigation, CRT effects, Web Audio synthesized sound, radio, maps built from real geographic data and a RobCo terminal with a hacking minigame.',
      stack: ['React 19', 'TypeScript', 'Vite', 'Framer Motion', 'd3-geo', 'Web Audio API'],
      highlights: ['Bilingual (ES / EN)', 'Color themes from the series', 'Printable résumé generated from the same data'],
      url: 'https://github.com/JuanPabloSR/pip-boy-website',
    },
    {
      id: 'carvajal', name: 'Distributed platform · Carvajal', type: 'Work · Nexos Software', status: 'Completed',
      description: 'Distributed solutions under clean architecture: Spring Boot microservices with ActiveMQ messaging and Angular / React micro-frontends, deployed on Azure and AWS.',
      stack: ['Java', 'Spring Boot', 'ActiveMQ', 'Angular', 'React', 'PrimeNG', 'Azure Pipelines', 'AWS'],
      highlights: ['Micro-frontends proposed to solve a bottleneck', 'Higher test coverage', 'Automated, documented CI/CD pipelines'],
    },
    {
      id: 'vera', name: 'Vera Villamizar Abogados', type: 'Freelance', status: 'Completed',
      description: 'Technical and commercial proposal, plus the landing page for the law firm.',
      stack: ['Landing page', 'Web design', 'Technical proposal'],
      highlights: ['Client needs assessment', 'Technical and commercial proposal', 'Landing page build'],
    },
    {
      id: 'feco', name: 'Feco project', type: 'Enterprise integration', status: 'Completed',
      description: 'Integration and routing flows between systems with Apache Camel.',
      stack: ['Apache Camel', 'Java'],
      highlights: ['Integration routes', 'Message routing'],
    },
    {
      id: 'ai-lab', name: 'AI lab', type: 'Training · Personal', status: 'Expanding',
      description: 'Python and language model apps: AI API integration and experiments with local models.',
      stack: ['Python', 'LLMs', 'AI APIs', 'Ollama'],
      highlights: ['AI bootcamp · Talento Tech (MinTIC)', 'Prototypes with local LLMs'],
    },
  ],

  stats: [
    {
      heading: 'General',
      lines: [
        { label: 'Years of experience', value: '4+' },
        { label: 'Companies', value: '2' },
        { label: 'Clouds conquered', value: '2 (AWS, Azure)' },
        { label: 'Message brokers', value: '4' },
        { label: 'Frontend frameworks', value: '3' },
        { label: 'IDEs equipped', value: '4' },
        { label: 'Languages', value: 'ES native · EN B1' },
      ],
    },
  ],

  waypoints: [
    {
      id: 'bga', name: 'Bucaramanga', coords: [-73.1198, 7.1254], home: true,
      label: 'Home base · Current location',
      description: 'Santander, Colombia. Working remotely on UTC-5.',
    },
    {
      id: 'med', name: 'Medellín', coords: [-75.5636, 6.2518],
      label: 'Nexos Software · HQ',
      description: 'Antioquia, Colombia. Remote link from Bucaramanga.',
    },
  ],

  stations: [
    {
      id: 'gnr', name: 'Galaxy News Radio', freq: '87.3',
      description: 'Fallout 3. Three Dog is gone, but the music stayed.',
      tracks: [RADIO_TRACKS.inkSpots],
    },
    {
      id: 'dcr', name: 'Diamond City Radio', freq: '101.7',
      description: 'Fallout 4. News and music from the Great Green Jewel.',
      tracks: [RADIO_TRACKS.civilization, RADIO_TRACKS.anythingGoes],
    },
    {
      id: 'sos', name: 'Distress signal', freq: '33.3',
      description: 'Morse code beacon looping from Bucaramanga. Generated in real time.',
      morse: 'JPSR ONLINE',
    },
  ],

  skillGroups: [
    { label: 'Backend', items: ['Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'WebFlux (Reactive)', 'Microservices', 'Apache Camel'] },
    { label: 'Frontend', items: ['Angular', 'TypeScript', 'JavaScript', 'PrimeNG', 'PrimeFlex', 'React.js', 'Vue.js', 'Bootstrap', 'SASS', 'HTML5', 'CSS3'] },
    { label: 'Testing & quality', items: ['JUnit 5', 'Mockito', 'Jasmine', 'Karma', 'SonarQube', 'TDD'] },
    { label: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL (native queries, stored procedures)'] },
    { label: 'Messaging', items: ['ActiveMQ', 'RabbitMQ', 'Apache Kafka', 'AWS SQS (DLQ)'] },
    { label: 'Cloud & DevOps', items: ['AWS (EC2, S3, API Gateway, RDS, CloudFront, Elastic Beanstalk, SQS, Parameter Store)', 'Azure Pipelines', 'Docker', 'Kubernetes', 'Grafana', 'Prometheus', 'Git', 'GitFlow'] },
    { label: 'Artificial intelligence', items: ['LLMs', 'Python', 'AI API integration'] },
    { label: 'Methodologies', items: ['Scrum', 'Clean architecture', 'DDD', 'SOLID', 'Hexagonal architecture'] },
    { label: 'IDEs', items: ['IntelliJ IDEA', 'VS Code', 'Kiro IDE', 'Antigravity IDE'] },
  ],
};

export default profile;

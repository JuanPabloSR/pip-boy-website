import {
  Activity, Atom, Bot, Brain, Bug, Cloud, Code, Coffee, Container, Database, Disc3, Gauge, GitBranch, Globe,
  Hexagon, Key, MessageSquare, Monitor, Network, Pill, Printer, Radar, Rocket, Scale, Shield, ShieldCheck,
  Sparkles, Syringe, Terminal, TestTube, Triangle, Users, Workflow, Zap, type LucideIcon, type LucideProps,
} from 'lucide-react';
import type { IconName } from '../data/types';

const ICONS: Record<IconName, LucideIcon> = {
  java: Coffee,
  angular: Hexagon,
  react: Atom,
  vue: Triangle,
  js: Code,
  html: Code,
  python: Sparkles,
  shield: Shield,
  shieldCheck: ShieldCheck,
  testTube: TestTube,
  gauge: Gauge,
  bug: Bug,
  syringe: Syringe,
  pill: Pill,
  brain: Brain,
  coffee: Coffee,
  users: Users,
  git: GitBranch,
  zap: Zap,
  monitor: Monitor,
  code: Code,
  terminal: Terminal,
  container: Container,
  cloud: Cloud,
  activity: Activity,
  radar: Radar,
  database: Database,
  message: MessageSquare,
  workflow: Workflow,
  network: Network,
  tape: Disc3,
  printer: Printer,
  key: Key,
  scale: Scale,
  bot: Bot,
  rocket: Rocket,
  globe: Globe,
};

export default function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = ICONS[name];
  // Vue's logo is a "V": flip the triangle.
  const style = name === 'vue' ? { transform: 'rotate(180deg)', ...props.style } : props.style;
  return <Cmp aria-hidden="true" {...props} style={style} />;
}

// Brand marks are not part of lucide anymore, so these two are drawn by hand.
export function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

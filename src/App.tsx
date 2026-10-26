import { lazy, Suspense, useCallback, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import BootScreen from './components/BootScreen';
import PrintCv from './components/PrintCv';
import SettingsPanel from './components/SettingsPanel';
import Shell from './components/Shell';
import { PipTintFilter } from './components/VaultBoy';
import StatTab from './components/tabs/StatTab';
import PipProvider from './state/PipProvider';
import RadioProvider from './state/RadioProvider';
import { usePip } from './state/pip';
import { readStorage, writeStorage } from './utils/storage';

const InvTab = lazy(() => import('./components/tabs/InvTab'));
const DataTab = lazy(() => import('./components/tabs/DataTab'));
const MapTab = lazy(() => import('./components/tabs/MapTab'));
const RadioTab = lazy(() => import('./components/tabs/RadioTab'));
const Terminal = lazy(() => import('./components/terminal/Terminal'));

const BOOTED_KEY = 'pipboy:booted';

// Crawlers and link-preview bots skip the power-on screen so they see the content.
const isBot = () =>
  /googlebot|bingbot|duckduckbot|yandexbot|baiduspider|applebot|linkedinbot|facebookexternalhit|twitterbot|slackbot|discordbot|telegrambot|whatsapp\/|chrome-lighthouse|crawler|spider/i
    .test(navigator.userAgent);

function TabView() {
  const { tab } = usePip();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={tab}
        className="tab-frame"
        initial={{ opacity: 0, filter: 'brightness(1.8) blur(2px)' }}
        animate={{ opacity: 1, filter: 'brightness(1) blur(0px)' }}
        exit={{ opacity: 0, filter: 'brightness(0.4) blur(2px)' }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      >
        <Suspense fallback={<div className="pulse" style={{ padding: '1rem' }}>…</div>}>
          {tab === 'STAT' && <StatTab />}
          {tab === 'INV' && <InvTab />}
          {tab === 'DATA' && <DataTab />}
          {tab === 'MAP' && <MapTab />}
          {tab === 'RADIO' && <RadioTab />}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

/** The Pip-Boy screen; inert (unfocusable, hidden from AT) while a dialog is open. */
function MainScreen() {
  const { overlay } = usePip();
  return (
    <div className="power-on" style={{ height: '100%' }} inert={overlay !== null}>
      <Shell>
        <TabView />
      </Shell>
    </div>
  );
}

function Overlays() {
  const { overlay } = usePip();
  if (overlay === 'settings') return <SettingsPanel />;
  if (overlay === 'terminal' || overlay === 'hack') {
    return (
      <Suspense fallback={null}>
        <Terminal startWithHack={overlay === 'hack'} />
      </Suspense>
    );
  }
  return null;
}

export default function App() {
  const [booted, setBooted] = useState(() => readStorage<boolean>(BOOTED_KEY, 'session') === true || isBot());

  const onBooted = useCallback(() => {
    writeStorage(BOOTED_KEY, true, 'session');
    setBooted(true);
  }, []);
  const reboot = useCallback(() => setBooted(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <PipProvider onReboot={reboot}>
        <PipTintFilter />
        <div className="crt-roll" aria-hidden="true" />
        {booted ? (
          <RadioProvider>
            <MainScreen />
            <Overlays />
          </RadioProvider>
        ) : (
          <BootScreen onDone={onBooted} />
        )}
        <PrintCv />
      </PipProvider>
    </MotionConfig>
  );
}

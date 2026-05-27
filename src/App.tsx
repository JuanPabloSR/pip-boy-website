import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import StatTab from './components/tabs/StatTab';
import InvTab from './components/tabs/InvTab';
import DataTab from './components/tabs/DataTab';
import MapTab from './components/tabs/MapTab';
import RadioTab from './components/tabs/RadioTab';
import BootScreen from './components/BootScreen';
import { soundEffects } from './utils/audio';

export type TabType = 'STAT' | 'INV' | 'DATA' | 'MAP' | 'RADIO';

const TABS: TabType[] = ['STAT', 'INV', 'DATA', 'MAP', 'RADIO'];

/* ── Global Audio Context ── */
export interface AudioState {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playing: boolean;
  setPlaying: (p: boolean | ((prev: boolean) => boolean)) => void;
  currentStation: string;
  setCurrentStation: (src: string) => void;
}

export const AudioCtx = createContext<AudioState | null>(null);
export const useAudio = () => useContext(AudioCtx)!;

function App() {
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('STAT');
  const [playing, setPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }
  }, []);

  // React to play/pause and station changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      if (currentStation && audio.src !== currentStation) {
        audio.src = currentStation;
      }
      if (currentStation) {
        audio.play().catch(() => setPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [playing, currentStation]);

  // Tab navigation
  useEffect(() => {
    if (!booted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const currentIndex = TABS.indexOf(activeTab);
      if (e.key.toLowerCase() === 'q' || e.key === 'ArrowLeft') {
        soundEffects.tabSwitch();
        setActiveTab(TABS[(currentIndex - 1 + TABS.length) % TABS.length]);
      } else if (e.key.toLowerCase() === 'e' || e.key === 'ArrowRight') {
        soundEffects.tabSwitch();
        setActiveTab(TABS[(currentIndex + 1) % TABS.length]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, booted]);

  const renderTab = () => {
    switch (activeTab) {
      case 'STAT': return <StatTab key="STAT" />;
      case 'INV': return <InvTab key="INV" />;
      case 'DATA': return <DataTab key="DATA" />;
      case 'MAP': return <MapTab key="MAP" />;
      case 'RADIO': return <RadioTab key="RADIO" />;
      default: return <StatTab key="STAT" />;
    }
  };

  if (!booted) {
    return <BootScreen onComplete={() => setBooted(true)} />;
  }

  return (
    <AudioCtx.Provider value={{ audioRef, playing, setPlaying, currentStation, setCurrentStation }}>
      <Layout activeTab={activeTab} setActiveTab={(tab) => {
        if (tab !== activeTab) soundEffects.tabSwitch();
        setActiveTab(tab);
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scaleY: 0.9, filter: 'blur(4px) brightness(1.5)' }}
            animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px) brightness(1)' }}
            exit={{ opacity: 0, scaleY: 1.1, filter: 'blur(4px) brightness(0.5)' }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ height: '100%', width: '100%' }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </Layout>
    </AudioCtx.Provider>
  );
}

export default App;

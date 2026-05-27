import { ReactNode } from 'react';
import type { TabType } from '../App';

interface LayoutProps {
  children: ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS: TabType[] = ['STAT', 'INV', 'DATA', 'MAP', 'RADIO'];

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  return (
    <div className="crt-flicker" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 3rem',
      boxSizing: 'border-box',
      userSelect: 'none',
      overflow: 'hidden',
    }}>

      {/* Top Header / Nav */}
      <header style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '4px' }}>
        {/* Gear icon left */}
        <span style={{
          background: '#14F814', color: '#000', padding: '2px 8px', fontSize: '1rem',
          marginRight: '16px', flexShrink: 0
        }}>⚙</span>

        {/* Tabs */}
        <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '3rem' }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === tab ? '#14F814' : 'rgba(20,248,20,0.45)',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '1.4rem',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                padding: '4px 8px',
                borderBottom: activeTab === tab ? '2px solid #14F814' : '2px solid transparent',
                textShadow: activeTab === tab
                  ? '0 0 6px rgba(20,248,20,0.8), 0 0 16px rgba(20,248,20,0.4)'
                  : 'none',
                transition: 'all 0.15s',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => {
                if (activeTab !== tab) (e.target as HTMLElement).style.color = '#14F814';
              }}
              onMouseLeave={e => {
                if (activeTab !== tab) (e.target as HTMLElement).style.color = 'rgba(20,248,20,0.45)';
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Signal icon right */}
        <span style={{
          background: '#14F814', color: '#000', padding: '2px 8px', fontSize: '1rem',
          marginLeft: '16px', flexShrink: 0
        }}>◈</span>
      </header>

      {/* Top divider — glowing line */}
      <div style={{
        width: '100%', height: '2px', background: '#14F814',
        boxShadow: '0 0 10px #14F814, 0 0 20px rgba(20,248,20,0.5)',
        marginBottom: '1.5rem',
      }} />

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {children}
      </main>

      {/* Bottom Metrics Bar */}
      <div style={{
        borderTop: '2px solid #14F814',
        boxShadow: '0 0 10px #14F814, 0 0 20px rgba(20,248,20,0.5)',
        marginTop: '1rem',
        paddingTop: '0.6rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1.1rem',
        letterSpacing: '1px',
      }}>
        <span>HP 115/115</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, maxWidth: '380px', margin: '0 2rem' }}>
          <span>LEVEL 6</span>
          <div style={{
            flex: 1, height: '10px', border: '1px solid #14F814', padding: '1px',
          }}>
            <div style={{
              width: '62%', height: '100%', background: '#14F814',
              boxShadow: '0 0 6px #14F814',
            }} />
          </div>
        </div>

        <span>AP 90/90</span>
      </div>
    </div>
  );
}

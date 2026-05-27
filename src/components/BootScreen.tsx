import { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../utils/audio';

const GREEN = '#14F814';

const BOOT_SEQUENCE = [
  "ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM",
  "COPYRIGHT 2075-2077 ROBCO INDUSTRIES",
  "-Server 1-",
  "Node 3",
  "",
  "64k RAM SYSTEM",
  "38911 BYTES FREE",
  "No ROM BASIC",
  "",
  "System Boot...",
  "Loading Pip-OS v7.1.0.8...",
  "Running Diagnostics:",
  "    CPU: [ OK ]",
  "    RAM: [ OK ]",
  "    NET: [ OK ]",
  "Display initialized.",
  "Boot sequence complete."
];

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    
    // Initial power-on hum
    setTimeout(() => {
      soundEffects.bootHum();
    }, 200);

    const typeChar = () => {
      if (currentLine >= BOOT_SEQUENCE.length) {
        // Quick visual flash before transitioning
        if (containerRef.current) {
          containerRef.current.style.animation = 'pulse-glow 0.2s';
        }
        setTimeout(onComplete, 800);
        return;
      }

      const fullText = BOOT_SEQUENCE[currentLine];
      
      setLines(prev => {
        const newLines = [...prev];
        if (newLines.length <= currentLine) {
          newLines.push('');
        }
        newLines[currentLine] = fullText.substring(0, currentChar + 1);
        return newLines;
      });

      // Rapid telemetry sound
      if (currentChar % 2 === 0 && fullText[currentChar] !== ' ') {
        soundEffects.typewriterClick();
      }

      currentChar++;

      if (currentChar >= fullText.length) {
        currentLine++;
        currentChar = 0;
        // Pause at the end of lines
        let lineDelay = 50;
        if (fullText === "") lineDelay = 10;
        if (fullText.includes("38911")) lineDelay = 400; // iconic pause
        if (fullText.includes("System Boot")) lineDelay = 600;
        if (fullText.includes("[ OK ]")) lineDelay = 150;
        setTimeout(typeChar, lineDelay);
      } else {
        // Very fast typing speed
        setTimeout(typeChar, Math.random() * 10 + 5);
      }
    };

    const startTimeout = setTimeout(typeChar, 800);

    return () => clearTimeout(startTimeout);
  }, [onComplete]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%', 
        padding: '2rem', 
        overflowY: 'hidden', 
        color: GREEN,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '1.4rem', // slightly larger text for FO4 boot
        lineHeight: 1.4,
        textShadow: `0 0 5px ${GREEN}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Starts from top like classic DOS
      }}
    >
      <div>
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {lines.length > 0 && lines.length <= BOOT_SEQUENCE.length && (
          <span style={{ animation: 'flicker 0.8s infinite step-end' }}>_</span>
        )}
      </div>
    </div>
  );
}

import { CSSProperties } from 'react';

interface Props {
  src: string;
  size?: number;
  alt?: string;
  style?: CSSProperties;
}

// Renders a Vault Boy GIF with authentic Pip-Boy CRT screen effects
export default function VaultBoyDisplay({ src, size = 200, alt = 'Vault Boy', style }: Props) {
  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
      {/* Main image with Pip-Boy green monochrome filter */}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          mixBlendMode: 'screen',
          filter: 'sepia(100%) hue-rotate(75deg) saturate(400%) brightness(120%) contrast(130%)',
        }}
      />

      {/* CRT phosphor glow overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(20,248,20,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Scanline overlay on the image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 50%)',
        backgroundSize: '100% 3px',
        pointerEvents: 'none',
        opacity: 0.4,
      }} />

      {/* Edge fade / vignette for "floating on screen" effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

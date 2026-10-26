import type { CSSProperties } from 'react';
import { vaultBoySrc } from '../utils/vaultboy';

interface Props {
  /** Candidate names in priority order, e.g. ['special-s', 'thumbs-up'] */
  name: string | string[];
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

/**
 * Vault Boy animations are stored as white-on-transparent images and tinted
 * with the #pip-tint SVG filter, so they follow whichever screen color is active.
 */
export default function VaultBoy({ name, className = '', style, alt = '' }: Props) {
  const names = Array.isArray(name) ? name : [name];
  return (
    <img
      src={vaultBoySrc(...names)}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`vaultboy ${className}`}
      style={style}
      draggable={false}
      decoding="async"
    />
  );
}

/** Mounted once: flood the image's alpha with the current --pip color. */
export function PipTintFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <filter id="pip-tint" colorInterpolationFilters="sRGB">
        <feFlood style={{ floodColor: 'var(--pip)' }} result="color" />
        <feComposite in="color" in2="SourceGraphic" operator="in" />
      </filter>
    </svg>
  );
}

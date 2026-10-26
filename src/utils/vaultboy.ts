// Every image in src/assets/vaultboy is picked up automatically by name.
// Drop e.g. `special-s.png` there (see scripts/vaultboy_import.py) and the
// S.P.E.C.I.A.L. screen will use it instead of the default animation.
const FILES = import.meta.glob<string>('../assets/vaultboy/*.{png,gif,webp,apng}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(FILES).map(([path, url]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), url]),
);

/** Returns the first animation that exists among the given names. */
export function vaultBoySrc(...names: string[]): string {
  for (const name of names) if (BY_NAME[name]) return BY_NAME[name];
  return BY_NAME['thumbs-up'];
}

import type { ArchiveSource, RadioTrack } from '../data/types';

/** The parts of an archive.org file entry the radio reads. Fields may be strings or lists. */
interface ArchiveFile {
  name: string;
  source?: string;
  original?: string;
  length?: string;
  title?: string | string[];
  creator?: string | string[];
  artist?: string | string[];
}

const MP3 = /\.mp3$/i;
const MIN_SECONDS = 45; // shorter files are stingers and DJ links

const text = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(', ') : v ?? '').trim();

/** archive.org reports lengths either as seconds ("245.3") or as "mm:ss". */
function seconds(length?: string) {
  if (!length) return NaN;
  return length.includes(':') ? length.split(':').reduce((t, part) => t * 60 + Number(part), 0) : Number(length);
}

/** "03 - The Ink Spots - Maybe.mp3" → { artist: "The Ink Spots", title: "Maybe" } */
function fromFileName(path: string) {
  const base = path.replace(/^.*\//, '').replace(MP3, '').replace(/^\d+\s*[-._)]\s*/, '').replace(/_/g, ' ');
  const [first, ...rest] = base.split(' - ');
  return rest.length ? { artist: first, title: rest.join(' - ') } : { artist: '', title: base };
}

export function tracksFromFiles(files: ArchiveFile[], source: ArchiveSource): RadioTrack[] {
  return files
    .filter(f => MP3.test(f.name)
      // archive.org adds low-bitrate copies of MP3 uploads; keep the original
      && !(f.source === 'derivative' && MP3.test(f.original ?? ''))
      && (!source.include || source.include.test(f.name))
      && !source.exclude?.test(f.name)
      && !(seconds(f.length) < MIN_SECONDS))
    .map(f => {
      const parsed = fromFileName(f.name);
      return {
        title: text(f.title) || parsed.title,
        artist: text(f.creator) || text(f.artist) || parsed.artist,
        src: `https://archive.org/download/${source.item}/${f.name.split('/').map(encodeURIComponent).join('/')}`,
      };
    });
}

function shuffle<T>(list: T[]) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

const playlists = new Map<string, Promise<RadioTrack[]>>();

/**
 * Lists a station's songs from the item's public metadata, shuffled like a radio
 * rotation. Cached for the session; a failed lookup is retried the next time.
 */
export function archivePlaylist(source: ArchiveSource): Promise<RadioTrack[]> {
  const key = `${source.item}|${source.include ?? ''}|${source.exclude ?? ''}`;
  let playlist = playlists.get(key);
  if (!playlist) {
    playlist = fetch(`https://archive.org/metadata/${encodeURIComponent(source.item)}`, { signal: AbortSignal.timeout(10_000) })
      .then(res => {
        if (!res.ok) throw new Error(`archive.org answered ${res.status}`);
        return res.json() as Promise<{ files?: ArchiveFile[] }>;
      })
      .then(meta => shuffle(tracksFromFiles(meta.files ?? [], source)));
    playlist.catch(() => playlists.delete(key));
    playlists.set(key, playlist);
  }
  return playlist;
}

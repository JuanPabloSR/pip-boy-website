import type { RadioStation, RadioTrack } from './types';

// Values that are identical in every language.

export const CONTACT = {
  /** Public URL of the deployed site (GitHub Pages). VITE_SITE_URL overrides it at build time. */
  site: 'https://juanpablosr.github.io/pip-boy-website/',
  email: 'juanpablosanchez744@gmail.com',
  linkedin: 'https://www.linkedin.com/in/juan-pablo-sanchez-rey',
  github: 'https://github.com/JuanPabloSR',
};

const GNR_ITEM = 'Fallout_3_galaxy_news_radio-2008';
const GNR = `https://archive.org/download/${GNR_ITEM}/`;

const TRACKS = {
  inkSpots: {
    title: "I Don't Want to Set the World on Fire",
    artist: 'The Ink Spots',
    src: `${GNR}The%20Ink%20Spots%20-%20I%20Don%27t%20Want%20to%20Set%20the%20World%20on%20Fire.mp3`,
  },
  civilization: {
    title: 'Civilization (Bongo, Bongo, Bongo)',
    artist: 'Danny Kaye & The Andrews Sisters',
    src: `${GNR}Danny%20Kaye%20and%20The%20Andrews%20Sisters%20-%20Civilization.mp3`,
  },
  anythingGoes: {
    title: 'Anything Goes',
    artist: 'Cole Porter',
    src: `${GNR}Cole%20Porter%20-%20Anything%20Goes.mp3`,
  },
} satisfies Record<string, RadioTrack>;

/**
 * The language-independent half of each music station, grouped by game. Playlists
 * are read from archive.org in the browser; `tracks` plays if that listing can't be
 * reached. The Vault-Tec and Mk VI themes tune the Fallout 4 stations.
 */
export const STATIONS = {
  dcr: { name: 'Diamond City Radio', freq: '101.7', game: 'fo4', archive: { item: 'Fallout4DiamondCityRadio' }, tracks: [TRACKS.inkSpots] },
  classical: { name: 'Classical Radio', freq: '92.3', game: 'fo4', archive: { item: 'fallout-3-new-vegas-4-music-compilation', include: /classical/i } },
  gnr: { name: 'Galaxy News Radio', freq: '87.3', game: 'fo3', archive: { item: GNR_ITEM }, tracks: [TRACKS.inkSpots, TRACKS.civilization, TRACKS.anythingGoes] },
  enclave: { name: 'Enclave Radio', freq: '107.7', game: 'fo3', archive: { item: 'fallout3_enclave_radio' } },
  rnv: { name: 'Radio New Vegas', freq: '104.2', game: 'nv', archive: { item: 'fallout-new-vegas-the-radio-soundtrack-flac' } },
  // Leaves out the item's station recordings (files named "radio …"); the songs are what Mojave Music Radio plays.
  mojave: { name: 'Mojave Music Radio', freq: '96.9', game: 'nv', archive: { item: 'g.-i.-blues-full-album-vinyl-rip', exclude: /radio/i } },
} satisfies Record<string, Omit<RadioStation, 'id' | 'description'>>;

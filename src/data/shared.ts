import type { RadioTrack } from './types';

// Values that are identical in every language.

export const CONTACT = {
  email: 'juanpablosanchez744@gmail.com',
  linkedin: 'https://www.linkedin.com/in/juan-pablo-sanchez-rey',
  github: 'https://github.com/JuanPabloSR',
};

const ARCHIVE = 'https://archive.org/download/Fallout_3_galaxy_news_radio-2008/';

export const RADIO_TRACKS = {
  inkSpots: {
    title: "I Don't Want to Set the World on Fire",
    artist: 'The Ink Spots',
    src: `${ARCHIVE}The%20Ink%20Spots%20-%20I%20Don%27t%20Want%20to%20Set%20the%20World%20on%20Fire.mp3`,
  },
  civilization: {
    title: 'Civilization (Bongo, Bongo, Bongo)',
    artist: 'Danny Kaye & The Andrews Sisters',
    src: `${ARCHIVE}Danny%20Kaye%20and%20The%20Andrews%20Sisters%20-%20Civilization.mp3`,
  },
  anythingGoes: {
    title: 'Anything Goes',
    artist: 'Cole Porter',
    src: `${ARCHIVE}Cole%20Porter%20-%20Anything%20Goes.mp3`,
  },
} satisfies Record<string, RadioTrack>;

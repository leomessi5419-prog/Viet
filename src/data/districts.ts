import type { District } from '../types';
import { colors } from '../theme/theme';

export const DISTRICTS: District[] = [
  {
    id: 'q1',
    name: 'District 1',
    vietnameseName: 'Quận Một',
    tagline: 'Glass towers, polite smiles, scripted welcomes.',
    mapX: 0.32,
    mapY: 0.42,
    accentColor: colors.neonCyan,
    unlockXp: 0,
  },
  {
    id: 'buivien',
    name: 'Bùi Viện',
    vietnameseName: 'Bùi Viện',
    tagline: 'Backpacker neon, bass through the alleyways, all night.',
    mapX: 0.55,
    mapY: 0.58,
    accentColor: colors.neonPink,
    unlockXp: 40,
  },
  {
    id: 'q3',
    name: 'District 3',
    vietnameseName: 'Quận Ba',
    tagline: 'Hidden alleys, sizzling griddles, sharp-eyed traders.',
    mapX: 0.72,
    mapY: 0.32,
    accentColor: colors.neonJade,
    unlockXp: 100,
  },
];

export const getDistrict = (id: string) => DISTRICTS.find((d) => d.id === id);

import type { Tone } from '../types';

/**
 * Southern Vietnamese tones.
 * Pitch contour is 0 (low) to 100 (high), sampled left-to-right.
 * Note: in Saigon dialect, ngã often merges into hỏi — we still teach both.
 */
export const TONES: Tone[] = [
  {
    id: 'ngang',
    name: 'Ngang',
    diacritic: '',
    exampleSyllable: 'ma',
    exampleMeaning: 'ghost',
    description: 'Level — flat, mid-pitch. Like saying a name calmly.',
    contour: [55, 55, 55, 55, 55],
  },
  {
    id: 'huyen',
    name: 'Huyền',
    diacritic: '̀',
    exampleSyllable: 'mà',
    exampleMeaning: 'but / which',
    description: 'Low falling — starts mid, drops gently downward.',
    contour: [50, 42, 33, 25, 18],
  },
  {
    id: 'sac',
    name: 'Sắc',
    diacritic: '́',
    exampleSyllable: 'má',
    exampleMeaning: 'mother / cheek',
    description: 'High rising — sharp upward jump, like a question lift.',
    contour: [55, 65, 78, 90, 96],
  },
  {
    id: 'hoi',
    name: 'Hỏi',
    diacritic: '̉',
    exampleSyllable: 'mả',
    exampleMeaning: 'tomb',
    description: 'Dipping — falls then rises, like a tiny valley.',
    contour: [55, 38, 30, 45, 60],
  },
  {
    id: 'nga',
    name: 'Ngã',
    diacritic: '̃',
    exampleSyllable: 'mã',
    exampleMeaning: 'horse / code',
    description: 'Broken rising — rises with a glottal break. In Saigon often sounds like hỏi.',
    contour: [55, 40, 70, 85, 92],
  },
  {
    id: 'nang',
    name: 'Nặng',
    diacritic: '̣',
    exampleSyllable: 'mạ',
    exampleMeaning: 'rice seedling',
    description: 'Heavy — short, low, with a glottal stop at the end.',
    contour: [40, 30, 22, 15, 10],
  },
];

import type { Character } from '../types';
import { colors } from '../theme/theme';

export const CHARACTERS: Character[] = [
  // ───────────────────────────────────────────── District 1
  {
    id: 'lan_receptionist',
    name: 'Lan',
    role: 'Hotel Receptionist',
    district: 'q1',
    vibe: 'Soft-spoken, perfectly polished, áo dài with fibre-optic trim.',
    description:
      'Lan greets every guest with the same gentle smile she\'s practiced ten thousand times. She speaks textbook polite Vietnamese — the easiest place to start.',
    voicePitch: 1.18,
    voiceRate: 0.85,
    accentColor: colors.neonCyan,
    portrait: {
      skin: '#f4cfa6',
      hair: '#1a1024',
      accent: colors.neonCyan,
      outfit: '#22e6ff',
      augment: 'antenna',
      silhouette: 'slim',
      emoji: '🌸',
    },
    unlockXp: 0,
    lessons: [
      {
        id: 'lan_checkin',
        title: 'Checking In',
        intro:
          'Arrive at the lobby. Lan bows slightly. Try a polite hello, then check in.',
        xpReward: 20,
        newPhrases: [
          { vi: 'Xin chào', en: 'Hello (polite)' },
          { vi: 'Cảm ơn', en: 'Thank you' },
          { vi: 'Tôi tên là...', en: 'My name is...' },
          { vi: 'Tôi có đặt phòng', en: 'I have a reservation' },
          { vi: 'Phòng số mấy?', en: 'What room number?' },
          { vi: 'Hẹn gặp lại', en: 'See you again' },
        ],
        dialogue: [
          { speaker: 'character', vi: 'Xin chào quý khách, em có thể giúp gì ạ?', en: 'Hello sir/madam, how may I help you?' },
          { speaker: 'you', vi: 'Xin chào. Tôi có đặt phòng.', en: 'Hello. I have a reservation.' },
          { speaker: 'character', vi: 'Dạ, cho em xin tên ạ?', en: 'Yes, may I have your name?' },
          { speaker: 'you', vi: 'Tôi tên là Alex.', en: 'My name is Alex.' },
          { speaker: 'character', vi: 'Dạ, phòng của anh số ba-không-tám.', en: 'Yes, your room is number three-zero-eight.' },
          { speaker: 'you', vi: 'Cảm ơn nhiều.', en: 'Thank you very much.' },
          { speaker: 'character', vi: 'Dạ không có chi. Chúc anh ở vui vẻ ạ.', en: 'You\'re welcome. Enjoy your stay.' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── District 1 (street)
  {
    id: 'ba_tu_banhmi',
    name: 'Bà Tư',
    role: 'Bánh Mì Auntie',
    district: 'q1',
    vibe: 'Warm, fast, calls you "con". Nón lá strung with tiny LEDs.',
    description:
      'Bà Tư\'s cart smells like grilled pork and coriander at 6am sharp. She doesn\'t do English. She does feed you well.',
    voicePitch: 1.05,
    voiceRate: 0.95,
    accentColor: colors.neonGold,
    portrait: {
      skin: '#e6b88a',
      hair: '#0a0612',
      accent: colors.neonGold,
      outfit: '#ff3b5c',
      augment: 'hat',
      silhouette: 'curvy',
      emoji: '🥖',
    },
    unlockXp: 20,
    lessons: [
      {
        id: 'batu_order',
        title: 'Ordering Bánh Mì',
        intro:
          'The cart is busy. Bà Tư barely looks up. Order one, ask how much, pay your respects.',
        xpReward: 25,
        newPhrases: [
          { vi: 'Cho con một ổ bánh mì', en: 'Give me one bánh mì', note: 'con = "child", how you refer to yourself with elders' },
          { vi: 'Bao nhiêu tiền?', en: 'How much?' },
          { vi: 'Cay không?', en: 'Spicy?' },
          { vi: 'Ít cay thôi', en: 'A little spicy' },
          { vi: 'Hai mươi ngàn', en: 'Twenty thousand (đồng)' },
          { vi: 'Ngon quá!', en: 'So delicious!' },
        ],
        dialogue: [
          { speaker: 'character', vi: 'Con ăn gì?', en: 'What\'ll you have, dear?' },
          { speaker: 'you', vi: 'Cho con một ổ bánh mì.', en: 'One bánh mì, please.' },
          { speaker: 'character', vi: 'Cay không con?', en: 'Spicy?' },
          { speaker: 'you', vi: 'Dạ, ít cay thôi.', en: 'Yes, just a little.' },
          { speaker: 'character', vi: 'Hai mươi ngàn nha.', en: 'Twenty thousand.' },
          { speaker: 'you', vi: 'Dạ, cảm ơn bà.', en: 'Yes, thank you auntie.' },
          { speaker: 'character', vi: 'Ăn ngon nha con!', en: 'Eat well, dear!' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── Bùi Viện
  {
    id: 'hung_xeom',
    name: 'Hùng "Sắt"',
    role: 'Xe Ôm Driver',
    district: 'buivien',
    vibe: 'Two-meter cyber-augmented brute. Chrome forearm. Tiny puppy on tank.',
    description:
      'Hùng "Iron" runs the corner of Bùi Viện. His arm is mil-spec, his pricing is not. He likes a customer who can name where they\'re going.',
    voicePitch: 0.78,
    voiceRate: 0.95,
    accentColor: colors.neonRed,
    portrait: {
      skin: '#c9986a',
      hair: '#0a0612',
      accent: colors.neonRed,
      outfit: '#2a0a3f',
      augment: 'visor',
      silhouette: 'hulking',
      emoji: '🏍️',
    },
    unlockXp: 40,
    lessons: [
      {
        id: 'hung_ride',
        title: 'Catching a Ride',
        intro: 'Bùi Viện is a wall of bass. Hùng revs once. Tell him where, then haggle.',
        xpReward: 30,
        newPhrases: [
          { vi: 'Anh chở em đi...', en: 'Take me to... (m. speaker)' },
          { vi: 'Bao nhiêu?', en: 'How much?' },
          { vi: 'Mắc quá', en: 'Too expensive' },
          { vi: 'Bớt chút đi', en: 'Lower it a bit' },
          { vi: 'Đi luôn', en: 'Let\'s go (right now)' },
          { vi: 'Sân bay', en: 'The airport' },
        ],
        dialogue: [
          { speaker: 'character', vi: 'Đi đâu?', en: 'Where to?' },
          { speaker: 'you', vi: 'Anh chở em đi sân bay.', en: 'Take me to the airport.' },
          { speaker: 'character', vi: 'Hai trăm ngàn.', en: 'Two hundred thousand.' },
          { speaker: 'you', vi: 'Mắc quá, bớt chút đi.', en: 'Too much, lower it a bit.' },
          { speaker: 'character', vi: 'Thôi, một trăm rưỡi.', en: 'Fine, one-fifty.' },
          { speaker: 'you', vi: 'Được, đi luôn.', en: 'Okay, let\'s go.' },
          { speaker: 'character', vi: 'Lên đi! Ôm chặt nha.', en: 'Hop on! Hold tight.' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── Bùi Viện (interior)
  {
    id: 'mai_nightclub',
    name: 'Mai',
    role: 'Nightclub Regular',
    district: 'buivien',
    vibe: 'Hologram earrings, neon braid, knows every DJ on the strip.',
    description:
      'Mai is at the bar by 11, on the floor by 12, gone by 3. She talks fast, swaps slang, and tests if you can keep up.',
    voicePitch: 1.22,
    voiceRate: 1.05,
    accentColor: colors.neonPink,
    portrait: {
      skin: '#eac0a0',
      hair: '#ff2ea6',
      accent: colors.neonPink,
      outfit: '#a14bff',
      augment: 'eye',
      silhouette: 'slim',
      emoji: '🍸',
    },
    unlockXp: 70,
    lessons: [
      {
        id: 'mai_drinks',
        title: 'Bar Talk',
        intro: 'The DJ drops a remix of a vọng cổ. Mai waves you over.',
        xpReward: 30,
        newPhrases: [
          { vi: 'Em khỏe không?', en: 'How are you? (to a female peer)' },
          { vi: 'Anh tên gì?', en: 'What\'s your name? (to a male)' },
          { vi: 'Uống gì?', en: 'What are you drinking?' },
          { vi: 'Một ly bia', en: 'One beer' },
          { vi: 'Nhạc hay quá', en: 'Great music' },
          { vi: 'Nhảy không?', en: 'Wanna dance?' },
        ],
        dialogue: [
          { speaker: 'character', vi: 'Ê, anh tên gì?', en: 'Hey, what\'s your name?' },
          { speaker: 'you', vi: 'Anh tên Alex. Em khỏe không?', en: 'I\'m Alex. How are you?' },
          { speaker: 'character', vi: 'Khỏe! Uống gì nè?', en: 'Good! What are you drinking?' },
          { speaker: 'you', vi: 'Một ly bia.', en: 'One beer.' },
          { speaker: 'character', vi: 'Nhạc hay quá ha! Nhảy không?', en: 'Music\'s great huh! Wanna dance?' },
          { speaker: 'you', vi: 'Nhảy chứ!', en: 'Of course!' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── District 3
  {
    id: 'ong_bay_alley',
    name: 'Ông Bảy',
    role: 'Alley Vendor',
    district: 'q3',
    vibe: 'Hủ tiếu apron, optical implant, always looking past you.',
    description:
      'Ông Bảy sells "things". Old radios. New radios. A radio that isn\'t a radio. The price is whatever he can read off your face.',
    voicePitch: 0.82,
    voiceRate: 1.0,
    accentColor: colors.neonViolet,
    portrait: {
      skin: '#d4a574',
      hair: '#a8a8a8',
      accent: colors.neonViolet,
      outfit: '#3df5b0',
      augment: 'eye',
      silhouette: 'tall',
      emoji: '👁️',
    },
    unlockXp: 100,
    lessons: [
      {
        id: 'ongbay_haggle',
        title: 'In the Alley',
        intro: 'Ông Bảy beckons. The price is never the price. Push back.',
        xpReward: 35,
        newPhrases: [
          { vi: 'Cái này là gì?', en: 'What is this?' },
          { vi: 'Đắt quá', en: 'Too expensive (north word, he\'ll get it)' },
          { vi: 'Rẻ hơn được không?', en: 'Can it be cheaper?' },
          { vi: 'Một trăm ngàn', en: 'One hundred thousand' },
          { vi: 'Tôi không cần', en: 'I don\'t need it' },
          { vi: 'Để tôi suy nghĩ', en: 'Let me think about it' },
        ],
        dialogue: [
          { speaker: 'character', vi: 'Lại đây, lại đây. Coi cái này.', en: 'Come here, come here. Look at this.' },
          { speaker: 'you', vi: 'Cái này là gì?', en: 'What is this?' },
          { speaker: 'character', vi: 'Hàng tốt. Năm trăm ngàn thôi.', en: 'Good stuff. Just five hundred thousand.' },
          { speaker: 'you', vi: 'Mắc quá. Rẻ hơn được không?', en: 'Too much. Can it be cheaper?' },
          { speaker: 'character', vi: 'Cho anh hai trăm. Cuối cùng đó.', en: 'For you, two hundred. Final.' },
          { speaker: 'you', vi: 'Để tôi suy nghĩ.', en: 'Let me think.' },
          { speaker: 'character', vi: 'Đi đâu! Một trăm rưỡi, đi!', en: 'Where you going! One-fifty, deal!' },
        ],
      },
    ],
  },
];

export const getCharacter = (id: string) => CHARACTERS.find((c) => c.id === id);

export const charactersInDistrict = (districtId: string) =>
  CHARACTERS.filter((c) => c.district === districtId);

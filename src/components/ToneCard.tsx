import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Line, Defs, LinearGradient as SvgLinear, Stop } from 'react-native-svg';
import { colors, glow, radius, font } from '../theme/theme';
import type { Tone } from '../types';
import { speakVi } from '../utils/tts';

interface Props {
  tone: Tone;
  color: string;
  onPracticed?: (tone: Tone) => void;
}

export const ToneCard: React.FC<Props> = ({ tone, color, onPracticed }) => {
  const w = 220;
  const h = 70;
  const pad = 10;
  const gradId = `tone-grad-${tone.id}`;

  const points = tone.contour.map((v, i) => {
    const x = pad + (i / (tone.contour.length - 1)) * (w - pad * 2);
    const y = pad + (1 - v / 100) * (h - pad * 2);
    return `${x},${y}`;
  });
  const polyline = `M ${points.join(' L ')}`;

  return (
    <Pressable
      onPress={() => {
        speakVi(tone.exampleSyllable);
        onPracticed?.(tone);
      }}
      style={({ pressed }) => [
        styles.card,
        { borderColor: color, ...glow(color, pressed ? 0.9 : 0.5) },
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.syllable, { color }]}>{tone.exampleSyllable}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.toneName}>{tone.name}</Text>
          <Text style={styles.meaning}>"{tone.exampleMeaning}"</Text>
        </View>
      </View>
      <Svg width={w} height={h} style={{ marginTop: 4 }}>
        <Defs>
          <SvgLinear id={gradId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={color} stopOpacity="1" />
          </SvgLinear>
        </Defs>
        {/* Gridlines */}
        <Line x1={pad} y1={pad} x2={w - pad} y2={pad} stroke={colors.bgInset} strokeWidth={0.5} />
        <Line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke={colors.bgInset} strokeWidth={0.5} />
        <Line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={colors.bgInset} strokeWidth={0.5} />
        <Path d={polyline} stroke={`url(#${gradId})`} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={styles.desc}>{tone.description}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgRaised,
    borderRadius: radius.lg,
    borderWidth: 1.4,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  syllable: {
    fontSize: 38,
    fontWeight: '800',
    minWidth: 56,
    textAlign: 'center',
  },
  toneName: {
    ...font.title,
    color: colors.textBright,
  },
  meaning: {
    ...font.body,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  desc: {
    ...font.body,
    color: colors.text,
    marginTop: 4,
  },
});

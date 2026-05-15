import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, glow, radius } from '../theme/theme';

interface Props {
  days: number;
  xp: number;
}

export const StatBar: React.FC<Props> = ({ days, xp }) => (
  <View style={styles.row}>
    <View style={[styles.pill, { borderColor: colors.neonGold, ...glow(colors.neonGold, 0.35) }]}>
      <Text style={[styles.icon]}>⚡</Text>
      <Text style={[styles.value, { color: colors.neonGold }]}>{days}</Text>
      <Text style={styles.label}>day{days === 1 ? '' : 's'}</Text>
    </View>
    <View style={[styles.pill, { borderColor: colors.neonCyan, ...glow(colors.neonCyan, 0.35) }]}>
      <Text style={styles.icon}>◈</Text>
      <Text style={[styles.value, { color: colors.neonCyan }]}>{xp}</Text>
      <Text style={styles.label}>xp</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1.2,
    backgroundColor: colors.bgRaised,
  },
  icon: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { colors, font, spacing, gradients, glow, radius } from '../theme/theme';
import { useProgress, progressApi } from '../state/progressStore';
import { CHARACTERS } from '../data/characters';
import { DISTRICTS } from '../data/districts';
import { TONES } from '../data/tones';
import { NeonButton } from '../components/NeonButton';
import type { RootStackParamList } from '../navigation/AppNavigator';

export const ProfileScreen: React.FC = () => {
  const { state } = useProgress();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  if (!state) return null;

  const totalLessons = CHARACTERS.flatMap((c) => c.lessons).length;
  const totalChars = CHARACTERS.length;

  const handleReset = () => {
    Alert.alert(
      'Reset progress?',
      'You\'ll lose your streak, XP, and all unlocks. The neon never forgets, but the data will.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => progressApi.reset() },
      ],
    );
  };

  return (
    <LinearGradient colors={gradients.saigonSky} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Pressable onPress={() => nav.goBack()} style={styles.back}>
            <Text style={styles.backText}>‹ Home</Text>
          </Pressable>

          <Text style={styles.kicker}>RUNNER PROFILE</Text>
          <Text style={styles.title}>Your Saigon</Text>

          <View style={styles.statsGrid}>
            <Stat label="Streak"     value={`${state.streakDays}`} suffix="days" color={colors.neonGold} />
            <Stat label="XP"         value={`${state.xp}`}        suffix="pts"  color={colors.neonCyan} />
            <Stat label="Districts"  value={`${state.unlockedDistricts.length}/${DISTRICTS.length}`} color={colors.neonViolet} />
            <Stat label="Teachers"   value={`${state.unlockedCharacters.length}/${totalChars}`} color={colors.neonPink} />
            <Stat label="Lessons"    value={`${state.completedLessons.length}/${totalLessons}`} color={colors.neonJade} />
            <Stat label="Tones"      value={`${state.tonesPracticed.length}/${TONES.length}`} color={colors.neonRed} />
          </View>

          <Text style={styles.section}>UNLOCKED TEACHERS</Text>
          <View style={{ gap: spacing.md }}>
            {CHARACTERS.filter((c) => state.unlockedCharacters.includes(c.id)).map((c) => {
              const lessonsDone = c.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => nav.navigate('Character', { characterId: c.id })}
                  style={[styles.charRow, { borderColor: c.accentColor, ...glow(c.accentColor, 0.3) }]}
                >
                  <Text style={[styles.charEmoji, { color: c.accentColor }]}>{c.portrait.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.charName, { color: c.accentColor }]}>{c.name}</Text>
                    <Text style={styles.charRole}>{c.role}</Text>
                  </View>
                  <Text style={styles.charProgress}>{lessonsDone}/{c.lessons.length}</Text>
                </Pressable>
              );
            })}
          </View>

          <NeonButton
            label="Reset Progress"
            color={colors.danger}
            secondary
            onPress={handleReset}
            style={{ marginTop: spacing.xl }}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const Stat: React.FC<{ label: string; value: string; suffix?: string; color: string }> = ({ label, value, suffix, color }) => (
  <View style={[styles.statCard, { borderColor: color, ...glow(color, 0.35) }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    {suffix && <Text style={styles.statSuffix}>{suffix}</Text>}
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  back: {
    marginBottom: spacing.md,
  },
  backText: {
    ...font.subtitle,
    color: colors.textMuted,
  },
  kicker: {
    ...font.small,
    color: colors.neonGold,
    marginBottom: 4,
  },
  title: {
    ...font.display,
    color: colors.textBright,
    textShadowColor: colors.neonGold,
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.bgRaised,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statSuffix: {
    ...font.small,
    color: colors.textMuted,
    marginTop: -2,
  },
  statLabel: {
    ...font.small,
    color: colors.text,
    marginTop: 4,
  },
  section: {
    ...font.small,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  charRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1.4,
    borderRadius: radius.lg,
    backgroundColor: colors.bgRaised,
    gap: spacing.md,
  },
  charEmoji: {
    fontSize: 26,
  },
  charName: {
    ...font.subtitle,
    fontWeight: '800',
  },
  charRole: {
    ...font.body,
    color: colors.textMuted,
  },
  charProgress: {
    ...font.subtitle,
    color: colors.text,
  },
});

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { colors, font, gradients, spacing, radius, glow } from '../theme/theme';
import { DISTRICTS } from '../data/districts';
import { CHARACTERS } from '../data/characters';
import { IsoMap } from '../components/IsoMap';
import { StatBar } from '../components/StreakBadge';
import { NeonButton } from '../components/NeonButton';
import { useProgress, progressApi } from '../state/progressStore';
import type { RootStackParamList } from '../navigation/AppNavigator';

export const HomeScreen: React.FC = () => {
  const { state } = useProgress();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  useEffect(() => {
    progressApi.touchStreak();
  }, []);

  const mapW = width - spacing.xl * 2;
  const mapH = mapW * 0.85;

  if (!state) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: colors.textMuted }}>Booting Saigon...</Text>
      </View>
    );
  }

  const nextChar = CHARACTERS.find(
    (c) => !state.completedLessons.some((l) => c.lessons.find((ll) => ll.id === l)),
  );

  return (
    <LinearGradient colors={gradients.saigonSky} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>SAIGON · 2089</Text>
              <Text style={styles.title}>Tiếng Việt</Text>
            </View>
            <StatBar days={state.streakDays} xp={state.xp} />
          </View>

          <Text style={styles.tagline}>
            Talk your way through the neon. Each street has a teacher.
          </Text>

          <View style={[styles.mapShell, glow(colors.neonViolet, 0.4)]}>
            <IsoMap
              width={mapW}
              height={mapH}
              districts={DISTRICTS}
              unlockedIds={state.unlockedDistricts}
              onSelect={(id) => nav.navigate('District', { districtId: id })}
            />
          </View>

          <View style={styles.row}>
            <NeonButton
              label="Tone Lab"
              color={colors.neonJade}
              onPress={() => nav.navigate('Tones')}
              style={{ flex: 1 }}
            />
            <NeonButton
              label="Progress"
              color={colors.neonGold}
              secondary
              onPress={() => nav.navigate('Profile')}
              style={{ flex: 1 }}
            />
          </View>

          {nextChar && (
            <View style={[styles.suggestion, { borderColor: nextChar.accentColor, ...glow(nextChar.accentColor, 0.5) }]}>
              <Text style={styles.suggLabel}>NEXT TEACHER</Text>
              <Text style={[styles.suggName, { color: nextChar.accentColor }]}>
                {nextChar.portrait.emoji}  {nextChar.name}
              </Text>
              <Text style={styles.suggRole}>{nextChar.role}</Text>
              <Text style={styles.suggDesc}>{nextChar.vibe}</Text>
              {state.unlockedCharacters.includes(nextChar.id) ? (
                <NeonButton
                  label={`Visit ${nextChar.name}`}
                  color={nextChar.accentColor}
                  onPress={() => nav.navigate('Character', { characterId: nextChar.id })}
                  style={{ marginTop: spacing.md }}
                />
              ) : (
                <Text style={styles.lockMsg}>
                  Earn {nextChar.unlockXp - state.xp} more XP to unlock.
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  kicker: {
    ...font.small,
    color: colors.neonPink,
    marginBottom: 4,
  },
  title: {
    ...font.display,
    color: colors.textBright,
    textShadowColor: colors.neonPink,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagline: {
    ...font.body,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  mapShell: {
    borderRadius: radius.lg,
    borderWidth: 1.2,
    borderColor: colors.neonViolet,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  suggestion: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.4,
    backgroundColor: colors.bgRaised,
  },
  suggLabel: {
    ...font.small,
    color: colors.textMuted,
    marginBottom: 6,
  },
  suggName: {
    ...font.title,
    marginBottom: 2,
  },
  suggRole: {
    ...font.subtitle,
    color: colors.text,
    marginBottom: 6,
  },
  suggDesc: {
    ...font.body,
    color: colors.textMuted,
  },
  lockMsg: {
    ...font.body,
    color: colors.neonGold,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
});

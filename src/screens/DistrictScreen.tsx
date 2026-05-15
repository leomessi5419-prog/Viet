import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { colors, font, spacing, gradients, glow } from '../theme/theme';
import { getDistrict } from '../data/districts';
import { charactersInDistrict } from '../data/characters';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { NeonButton } from '../components/NeonButton';
import { useProgress } from '../state/progressStore';
import type { RootStackParamList } from '../navigation/AppNavigator';

export const DistrictScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'District'>>();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const { state } = useProgress();
  const district = getDistrict(route.params.districtId);

  if (!district || !state) return null;

  const unlockedHere = state.unlockedDistricts.includes(district.id);
  const characters = charactersInDistrict(district.id);

  if (!unlockedHere) {
    return (
      <LinearGradient colors={gradients.saigonSky} style={{ flex: 1 }}>
        <SafeAreaView style={styles.lockedShell}>
          <Text style={[styles.kicker, { color: district.accentColor }]}>
            {district.vietnameseName.toUpperCase()}
          </Text>
          <Text style={[styles.lockTitle, { color: district.accentColor, ...glow(district.accentColor, 0.6) }]}>
            🔒  Locked
          </Text>
          <Text style={styles.lockBody}>
            Earn {district.unlockXp} XP to unlock {district.name}. You have {state.xp}.
          </Text>
          <NeonButton label="Back to Map" onPress={() => nav.goBack()} color={district.accentColor} style={{ marginTop: spacing.lg }} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.saigonSky} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Pressable onPress={() => nav.goBack()} style={styles.back}>
            <Text style={styles.backText}>‹ Map</Text>
          </Pressable>

          <Text style={[styles.kicker, { color: district.accentColor }]}>
            {district.name.toUpperCase()}
          </Text>
          <Text style={[styles.title, glow(district.accentColor, 0.7), { textShadowColor: district.accentColor }]}>
            {district.vietnameseName}
          </Text>
          <Text style={styles.tagline}>{district.tagline}</Text>

          <Text style={styles.section}>TEACHERS HERE</Text>

          <View style={styles.charGrid}>
            {characters.map((c) => {
              const unlocked = state.unlockedCharacters.includes(c.id);
              return (
                <Pressable
                  key={c.id}
                  onPress={() => unlocked && nav.navigate('Character', { characterId: c.id })}
                  style={styles.charCard}
                >
                  <CharacterPortrait spec={c.portrait} size={150} name={c.name} locked={!unlocked} />
                  <Text style={styles.charRole}>{c.role}</Text>
                  {!unlocked && (
                    <Text style={styles.charLock}>
                      Unlocks at {c.unlockXp} XP
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

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
    marginBottom: 4,
  },
  title: {
    ...font.display,
    color: colors.textBright,
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagline: {
    ...font.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    marginBottom: spacing.xl,
  },
  section: {
    ...font.small,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  charCard: {
    width: '47%',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  charRole: {
    ...font.body,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  charLock: {
    ...font.small,
    color: colors.neonGold,
    marginTop: 4,
  },
  lockedShell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  lockTitle: {
    ...font.display,
    marginTop: spacing.md,
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  lockBody: {
    ...font.body,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

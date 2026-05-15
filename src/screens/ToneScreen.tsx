import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { colors, font, spacing, gradients } from '../theme/theme';
import { TONES } from '../data/tones';
import { ToneCard } from '../components/ToneCard';
import { progressApi } from '../state/progressStore';
import type { RootStackParamList } from '../navigation/AppNavigator';

const PALETTE = [
  colors.neonCyan,
  colors.neonJade,
  colors.neonGold,
  colors.neonPink,
  colors.neonViolet,
  colors.neonRed,
];

export const ToneScreen: React.FC = () => {
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <LinearGradient colors={gradients.saigonSky} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Pressable onPress={() => nav.goBack()} style={styles.back}>
            <Text style={styles.backText}>‹ Home</Text>
          </Pressable>

          <Text style={[styles.kicker]}>TONE LAB</Text>
          <Text style={styles.title}>The Six Tones</Text>
          <Text style={styles.tagline}>
            Tap a card to hear it. Each tone is a melody — same syllable, very different word.
          </Text>

          <View style={{ marginTop: spacing.xl }}>
            {TONES.map((t, i) => (
              <ToneCard
                key={t.id}
                tone={t}
                color={PALETTE[i % PALETTE.length]}
                onPracticed={(tone) => progressApi.practiceTone(tone.id, 3)}
              />
            ))}
          </View>

          <Text style={styles.footnote}>
            Southern dialect note: in Saigon, the "ngã" tone often blends into "hỏi". Both work in conversation.
          </Text>
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
    color: colors.neonJade,
    marginBottom: 4,
  },
  title: {
    ...font.display,
    color: colors.textBright,
    textShadowColor: colors.neonJade,
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagline: {
    ...font.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 8,
  },
  footnote: {
    ...font.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});

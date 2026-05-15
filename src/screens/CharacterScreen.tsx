import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { colors, font, spacing, radius, gradients, glow } from '../theme/theme';
import { getCharacter } from '../data/characters';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { NeonButton } from '../components/NeonButton';
import { useProgress, progressApi } from '../state/progressStore';
import { speakVi } from '../utils/tts';
import type { RootStackParamList } from '../navigation/AppNavigator';

export const CharacterScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Character'>>();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const { state } = useProgress();
  const character = getCharacter(route.params.characterId);

  useEffect(() => {
    if (character) progressApi.visitCharacter(character.id);
  }, [character?.id]);

  if (!character || !state) return null;

  const { accentColor } = character;

  return (
    <LinearGradient colors={gradients.saigonSky} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Pressable onPress={() => nav.goBack()} style={styles.back}>
            <Text style={styles.backText}>‹ District</Text>
          </Pressable>

          <View style={styles.portraitWrap}>
            <CharacterPortrait spec={character.portrait} size={220} />
          </View>

          <Text style={[styles.kicker, { color: accentColor }]}>{character.role.toUpperCase()}</Text>
          <Text style={[styles.title, { color: accentColor, textShadowColor: accentColor }]}>
            {character.name}
          </Text>

          <Text style={styles.vibe}>{character.vibe}</Text>
          <Text style={styles.desc}>{character.description}</Text>

          <Pressable
            style={[styles.tryVoice, { borderColor: accentColor, ...glow(accentColor, 0.5) }]}
            onPress={() =>
              speakVi('Xin chào, em là ' + character.name, {
                pitch: character.voicePitch,
                rate: character.voiceRate,
              })
            }
          >
            <Text style={[styles.tryVoiceText, { color: accentColor }]}>▶  Hear their voice</Text>
          </Pressable>

          <Text style={styles.section}>LESSONS</Text>
          {character.lessons.map((lesson) => {
            const done = state.completedLessons.includes(lesson.id);
            return (
              <View key={lesson.id} style={[styles.lessonCard, { borderColor: accentColor, ...glow(accentColor, 0.35) }]}>
                <View style={styles.lessonHead}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  {done && <Text style={[styles.done, { color: colors.neonJade }]}>✓ DONE</Text>}
                </View>
                <Text style={styles.lessonIntro}>{lesson.intro}</Text>
                <View style={styles.lessonMeta}>
                  <Text style={styles.metaItem}>📚  {lesson.newPhrases.length} phrases</Text>
                  <Text style={styles.metaItem}>💬  {lesson.dialogue.length} lines</Text>
                  <Text style={[styles.metaItem, { color: accentColor }]}>+{lesson.xpReward} XP</Text>
                </View>
                <NeonButton
                  label={done ? 'Practice Again' : 'Start Lesson'}
                  color={accentColor}
                  onPress={() => nav.navigate('Dialogue', { characterId: character.id, lessonId: lesson.id })}
                  style={{ marginTop: spacing.md }}
                />
              </View>
            );
          })}
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
  portraitWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  kicker: {
    ...font.small,
    marginBottom: 4,
  },
  title: {
    ...font.display,
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  vibe: {
    ...font.subtitle,
    color: colors.text,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  desc: {
    ...font.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  tryVoice: {
    marginTop: spacing.lg,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1.4,
    alignSelf: 'flex-start',
    backgroundColor: colors.bgRaised,
  },
  tryVoiceText: {
    ...font.subtitle,
  },
  section: {
    ...font.small,
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  lessonCard: {
    backgroundColor: colors.bgRaised,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.4,
    marginBottom: spacing.md,
  },
  lessonHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTitle: {
    ...font.title,
    color: colors.textBright,
  },
  done: {
    ...font.small,
    fontWeight: '800',
  },
  lessonIntro: {
    ...font.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  metaItem: {
    ...font.body,
    color: colors.text,
  },
});

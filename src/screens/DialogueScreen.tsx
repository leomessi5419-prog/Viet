import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { colors, font, spacing, radius, gradients, glow } from '../theme/theme';
import { getCharacter } from '../data/characters';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { NeonButton } from '../components/NeonButton';
import { speakVi } from '../utils/tts';
import { progressApi } from '../state/progressStore';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { DialogueLine, Phrase } from '../types';

type Phase = 'intro' | 'phrases' | 'dialogue' | 'quiz' | 'done';

export const DialogueScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Dialogue'>>();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const character = getCharacter(route.params.characterId);
  const lesson = character?.lessons.find((l) => l.id === route.params.lessonId);

  const [phase, setPhase] = useState<Phase>('intro');
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [quizRight, setQuizRight] = useState<boolean | null>(null);

  const quizQuestions = useMemo(() => {
    if (!lesson) return [];
    return buildQuiz(lesson.newPhrases);
  }, [lesson?.id]);

  if (!character || !lesson) return null;
  const { accentColor } = character;

  const speak = (text: string, slow = false) =>
    speakVi(text, {
      pitch: character.voicePitch,
      rate: character.voiceRate,
      slow,
    });

  const finishLesson = async () => {
    await progressApi.completeLesson(lesson.id, lesson.xpReward);
    setPhase('done');
  };

  return (
    <LinearGradient colors={gradients.saigonSky} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => nav.goBack()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View>
            <Text style={[styles.kicker, { color: accentColor }]}>
              {character.name.toUpperCase()} · {character.role.toUpperCase()}
            </Text>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
          </View>
        </View>

        <ProgressDots
          phase={phase}
          dialogueIdx={dialogueIdx}
          quizIdx={quizIdx}
          dialogueLen={lesson.dialogue.length}
          quizLen={quizQuestions.length}
          color={accentColor}
        />

        <ScrollView contentContainerStyle={styles.scroll}>
          {phase === 'intro' && (
            <View style={styles.center}>
              <CharacterPortrait spec={character.portrait} size={170} />
              <Text style={styles.intro}>{lesson.intro}</Text>
            </View>
          )}

          {phase === 'phrases' && (
            <View>
              <Text style={styles.section}>NEW PHRASES</Text>
              {lesson.newPhrases.map((p, i) => (
                <PhraseRow key={i} phrase={p} color={accentColor} onSpeak={speak} />
              ))}
            </View>
          )}

          {phase === 'dialogue' && (
            <DialogueView
              line={lesson.dialogue[dialogueIdx]}
              total={lesson.dialogue.length}
              idx={dialogueIdx}
              character={character}
              onSpeakSlow={() => speak(lesson.dialogue[dialogueIdx].vi, true)}
              onSpeak={() => speak(lesson.dialogue[dialogueIdx].vi)}
            />
          )}

          {phase === 'quiz' && quizQuestions[quizIdx] && (
            <QuizView
              question={quizQuestions[quizIdx]}
              color={accentColor}
              picked={quizPick}
              correctness={quizRight}
              onPick={(i) => {
                if (quizPick !== null) return;
                const correct = i === quizQuestions[quizIdx].correct;
                setQuizPick(i);
                setQuizRight(correct);
                if (correct) {
                  setQuizScore((s) => s + 1);
                  try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
                } else {
                  try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
                }
              }}
              onSpeak={(text) => speak(text)}
            />
          )}

          {phase === 'done' && (
            <View style={styles.center}>
              <Text style={[styles.doneEmoji, glow(accentColor, 0.6)]}>✦</Text>
              <Text style={[styles.doneTitle, { color: accentColor, textShadowColor: accentColor }]}>
                Lesson Complete
              </Text>
              <Text style={styles.doneStats}>
                +{lesson.xpReward} XP · {quizScore}/{quizQuestions.length} quiz
              </Text>
              <Text style={styles.doneNote}>
                {character.name} nods. The neon hums approval.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footer}>
          {phase === 'intro' && (
            <NeonButton label="Learn the Phrases" color={accentColor} onPress={() => setPhase('phrases')} size="lg" />
          )}
          {phase === 'phrases' && (
            <NeonButton label="Start the Conversation" color={accentColor} onPress={() => setPhase('dialogue')} size="lg" />
          )}
          {phase === 'dialogue' && (
            <NeonButton
              label={dialogueIdx === lesson.dialogue.length - 1 ? 'Now Quiz Me' : 'Next Line'}
              color={accentColor}
              size="lg"
              onPress={() => {
                if (dialogueIdx === lesson.dialogue.length - 1) {
                  setPhase('quiz');
                } else {
                  setDialogueIdx((i) => i + 1);
                  setTimeout(() => speak(lesson.dialogue[dialogueIdx + 1].vi), 250);
                }
              }}
            />
          )}
          {phase === 'quiz' && quizPick !== null && (
            <NeonButton
              label={quizIdx === quizQuestions.length - 1 ? 'Finish' : 'Next Question'}
              color={accentColor}
              size="lg"
              onPress={() => {
                if (quizIdx === quizQuestions.length - 1) {
                  finishLesson();
                } else {
                  setQuizIdx((i) => i + 1);
                  setQuizPick(null);
                  setQuizRight(null);
                }
              }}
            />
          )}
          {phase === 'done' && (
            <View style={styles.footerRow}>
              <NeonButton label="Map" secondary color={accentColor} onPress={() => nav.popToTop()} style={{ flex: 1 }} />
              <NeonButton label="More Lessons" color={accentColor} onPress={() => nav.goBack()} style={{ flex: 1 }} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const PhraseRow: React.FC<{ phrase: Phrase; color: string; onSpeak: (t: string) => void }> = ({ phrase, color, onSpeak }) => (
  <Pressable
    onPress={() => onSpeak(phrase.vi)}
    style={({ pressed }) => [
      styles.phraseRow,
      { borderColor: color, ...glow(color, pressed ? 0.7 : 0.3) },
    ]}
  >
    <View style={{ flex: 1 }}>
      <Text style={[styles.phraseVi, { color }]}>{phrase.vi}</Text>
      <Text style={styles.phraseEn}>{phrase.en}</Text>
      {phrase.note && <Text style={styles.phraseNote}>{phrase.note}</Text>}
    </View>
    <Text style={[styles.speakIcon, { color }]}>▶</Text>
  </Pressable>
);

const DialogueView: React.FC<{
  line: DialogueLine;
  total: number;
  idx: number;
  character: ReturnType<typeof getCharacter>;
  onSpeak: () => void;
  onSpeakSlow: () => void;
}> = ({ line, character, onSpeak, onSpeakSlow, idx, total }) => {
  if (!character) return null;
  const isYou = line.speaker === 'you';
  const bubbleColor = isYou ? colors.neonCyan : character.accentColor;

  React.useEffect(() => {
    if (!isYou) {
      setTimeout(onSpeak, 200);
    }
  }, [idx]);

  return (
    <View style={styles.dialogueWrap}>
      <Text style={styles.dialogueCounter}>Line {idx + 1} of {total}</Text>
      <View style={{ alignItems: isYou ? 'flex-end' : 'flex-start' }}>
        {!isYou && (
          <View style={{ marginBottom: 10 }}>
            <CharacterPortrait spec={character.portrait} size={90} />
          </View>
        )}
        <Text style={[styles.speakerLabel, { color: bubbleColor }]}>
          {isYou ? 'YOU' : character.name.toUpperCase()}
        </Text>
        <View style={[styles.bubble, { borderColor: bubbleColor, ...glow(bubbleColor, 0.5) }]}>
          <Text style={[styles.bubbleVi, { color: bubbleColor }]}>{line.vi}</Text>
          <Text style={styles.bubbleEn}>{line.en}</Text>
          {!isYou && (
            <View style={styles.bubbleControls}>
              <Pressable onPress={onSpeak} style={[styles.playBtn, { borderColor: bubbleColor }]}>
                <Text style={[styles.playLabel, { color: bubbleColor }]}>▶ Play</Text>
              </Pressable>
              <Pressable onPress={onSpeakSlow} style={[styles.playBtn, { borderColor: bubbleColor }]}>
                <Text style={[styles.playLabel, { color: bubbleColor }]}>🐢 Slow</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

interface QuizQ {
  prompt: string;
  promptVi?: string;
  options: { text: string; vi?: string }[];
  correct: number;
  speakOnReveal?: string;
}

const QuizView: React.FC<{
  question: QuizQ;
  color: string;
  picked: number | null;
  correctness: boolean | null;
  onPick: (i: number) => void;
  onSpeak: (vi: string) => void;
}> = ({ question, color, picked, correctness, onPick, onSpeak }) => {
  React.useEffect(() => {
    if (question.promptVi) {
      setTimeout(() => onSpeak(question.promptVi!), 200);
    }
  }, [question]);

  return (
    <View>
      <Text style={styles.section}>QUIZ</Text>
      <View style={[styles.quizPrompt, { borderColor: color, ...glow(color, 0.4) }]}>
        <Text style={styles.quizPromptText}>{question.prompt}</Text>
        {question.promptVi && (
          <Pressable onPress={() => onSpeak(question.promptVi!)}>
            <Text style={[styles.quizPromptVi, { color }]}>{question.promptVi}  ▶</Text>
          </Pressable>
        )}
      </View>
      <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
        {question.options.map((opt, i) => {
          const isPick = picked === i;
          const isCorrect = i === question.correct;
          const showRight = picked !== null && isCorrect;
          const showWrong = isPick && correctness === false;
          const borderColor = showRight
            ? colors.success
            : showWrong
              ? colors.danger
              : isPick
                ? color
                : colors.textDim;
          return (
            <Pressable
              key={i}
              disabled={picked !== null}
              onPress={() => {
                onPick(i);
                if (opt.vi) onSpeak(opt.vi);
              }}
              style={[styles.option, { borderColor, ...glow(borderColor, isPick ? 0.6 : 0.15) }]}
            >
              <Text style={[styles.optionText, { color: showRight || showWrong ? borderColor : colors.text }]}>
                {opt.text}
              </Text>
              {opt.vi && <Text style={styles.optionVi}>{opt.vi}</Text>}
            </Pressable>
          );
        })}
      </View>
      {correctness !== null && (
        <Text style={[styles.quizFeedback, { color: correctness ? colors.success : colors.danger }]}>
          {correctness ? '✓ Đúng rồi!  (Correct!)' : '✗ Try again next time. Correct answer highlighted.'}
        </Text>
      )}
    </View>
  );
};

const ProgressDots: React.FC<{
  phase: Phase;
  dialogueIdx: number;
  quizIdx: number;
  dialogueLen: number;
  quizLen: number;
  color: string;
}> = ({ phase, dialogueIdx, quizIdx, dialogueLen, quizLen, color }) => {
  const phases: { id: Phase; label: string }[] = [
    { id: 'intro', label: 'Intro' },
    { id: 'phrases', label: 'Phrases' },
    { id: 'dialogue', label: `Talk ${phase === 'dialogue' ? dialogueIdx + 1 + '/' + dialogueLen : ''}` },
    { id: 'quiz', label: `Quiz ${phase === 'quiz' ? quizIdx + 1 + '/' + quizLen : ''}` },
  ];
  const activeIdx = phases.findIndex((p) => p.id === phase);
  return (
    <View style={styles.dots}>
      {phases.map((p, i) => (
        <View key={p.id} style={styles.dotItem}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: i <= activeIdx ? color : colors.bgInset,
                borderColor: i === activeIdx ? color : 'transparent',
              },
            ]}
          />
          <Text style={[styles.dotLabel, { color: i <= activeIdx ? color : colors.textDim }]}>
            {p.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const buildQuiz = (phrases: Phrase[]): QuizQ[] => {
  const out: QuizQ[] = [];
  // EN -> VI x 2
  for (let i = 0; i < Math.min(2, phrases.length); i++) {
    const correct = phrases[i];
    const distractors = phrases.filter((_, j) => j !== i).slice(0, 3);
    const opts = shuffle([
      { text: correct.vi, vi: correct.vi },
      ...distractors.slice(0, 3).map((p) => ({ text: p.vi, vi: p.vi })),
    ]);
    out.push({
      prompt: `How do you say:  "${correct.en}"?`,
      options: opts,
      correct: opts.findIndex((o) => o.text === correct.vi),
    });
  }
  // VI listen -> EN x 1
  if (phrases.length >= 3) {
    const correct = phrases[2];
    const distractors = phrases.filter((p) => p !== correct).slice(0, 3);
    const opts = shuffle([
      { text: correct.en },
      ...distractors.slice(0, 3).map((p) => ({ text: p.en })),
    ]);
    out.push({
      prompt: 'You hear:',
      promptVi: correct.vi,
      options: opts,
      correct: opts.findIndex((o) => o.text === correct.en),
    });
  }
  return out;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '600',
  },
  kicker: {
    ...font.small,
    marginBottom: 2,
  },
  lessonTitle: {
    ...font.title,
    color: colors.textBright,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dotItem: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  dotLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    flexGrow: 1,
  },
  center: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  intro: {
    ...font.subtitle,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  section: {
    ...font.small,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  phraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgRaised,
    borderWidth: 1.2,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  phraseVi: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  phraseEn: {
    ...font.body,
    color: colors.text,
    marginTop: 2,
  },
  phraseNote: {
    ...font.small,
    color: colors.textMuted,
    marginTop: 4,
    textTransform: 'none',
    letterSpacing: 0,
    fontStyle: 'italic',
  },
  speakIcon: {
    fontSize: 22,
    marginLeft: spacing.md,
  },
  dialogueWrap: {
    paddingVertical: spacing.lg,
  },
  dialogueCounter: {
    ...font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  speakerLabel: {
    ...font.small,
    fontWeight: '800',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '92%',
    backgroundColor: colors.bgRaised,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.4,
  },
  bubbleVi: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  bubbleEn: {
    ...font.body,
    color: colors.text,
    marginTop: 6,
  },
  bubbleControls: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
  },
  playBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 999,
  },
  playLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quizPrompt: {
    backgroundColor: colors.bgRaised,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.4,
  },
  quizPromptText: {
    ...font.subtitle,
    color: colors.textBright,
  },
  quizPromptVi: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  option: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.4,
    backgroundColor: colors.bgRaised,
  },
  optionText: {
    ...font.subtitle,
  },
  optionVi: {
    ...font.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  quizFeedback: {
    ...font.subtitle,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  doneEmoji: {
    fontSize: 80,
    color: colors.neonGold,
    textShadowColor: colors.neonGold,
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 0 },
  },
  doneTitle: {
    ...font.display,
    marginTop: spacing.md,
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
  doneStats: {
    ...font.title,
    color: colors.text,
    marginTop: spacing.md,
  },
  doneNote: {
    ...font.body,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.bgInset,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});

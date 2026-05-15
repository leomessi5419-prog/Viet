import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, glow, font } from '../theme/theme';

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  secondary?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const NeonButton: React.FC<Props> = ({
  label,
  onPress,
  color = colors.neonPink,
  secondary,
  disabled,
  style,
  icon,
  size = 'md',
}) => {
  const handle = () => {
    if (disabled) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    onPress();
  };

  const padV = size === 'lg' ? 18 : size === 'sm' ? 8 : 14;
  const padH = size === 'lg' ? 28 : size === 'sm' ? 14 : 22;

  const inner = (
    <View style={[styles.row, { paddingVertical: padV, paddingHorizontal: padH }]}>
      {icon}
      <Text
        style={[
          styles.label,
          size === 'lg' && { fontSize: 18 },
          size === 'sm' && { fontSize: 13 },
          { color: secondary ? color : colors.textBright },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  if (secondary) {
    return (
      <Pressable
        onPress={handle}
        style={({ pressed }) => [
          styles.shellSecondary,
          { borderColor: color, opacity: disabled ? 0.35 : pressed ? 0.7 : 1 },
          glow(color, 0.4),
          style,
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handle}
      style={({ pressed }) => [
        styles.shell,
        { opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        glow(color, disabled ? 0 : 0.8),
        style,
      ]}
    >
      <LinearGradient
        colors={[color, `${color}aa`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {inner}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  shellSecondary: {
    borderRadius: radius.pill,
    borderWidth: 1.4,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  gradient: {
    borderRadius: radius.pill,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...font.subtitle,
    color: colors.textBright,
  },
});

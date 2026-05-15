import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient as SvgLinear,
  Stop,
  Circle,
  Path,
  Rect,
  G,
  Ellipse,
  Line,
} from 'react-native-svg';
import { colors, glow } from '../theme/theme';
import type { PortraitSpec } from '../types';

interface Props {
  spec: PortraitSpec;
  size?: number;
  name?: string;
  locked?: boolean;
}

/**
 * Procedural cyberpunk portrait. SVG-based, no external image assets.
 * Variations: silhouette, hair, augmentation, accent neon color.
 */
export const CharacterPortrait: React.FC<Props> = ({
  spec,
  size = 180,
  name,
  locked,
}) => {
  const w = size;
  const h = size * 1.2;
  const cx = w / 2;

  // Silhouette dimensions
  const shoulderW = {
    slim: w * 0.62,
    broad: w * 0.86,
    tall: w * 0.66,
    curvy: w * 0.74,
    hulking: w * 0.98,
  }[spec.silhouette];

  const headR = {
    slim: w * 0.18,
    broad: w * 0.2,
    tall: w * 0.17,
    curvy: w * 0.19,
    hulking: w * 0.24,
  }[spec.silhouette];

  const headCy = h * 0.36;
  const shoulderTop = headCy + headR * 1.05;

  return (
    <View style={{ width: w, height: h, alignItems: 'center' }}>
      <View
        style={[
          styles.glowWrap,
          { width: w, height: h, ...glow(spec.accent, locked ? 0 : 0.9) },
        ]}
      >
        <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <Defs>
            <RadialGradient id="bgGlow" cx="50%" cy="35%" r="65%">
              <Stop offset="0%" stopColor={spec.accent} stopOpacity="0.45" />
              <Stop offset="60%" stopColor={spec.accent} stopOpacity="0.08" />
              <Stop offset="100%" stopColor={colors.bgBase} stopOpacity="1" />
            </RadialGradient>
            <SvgLinear id="outfitGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={spec.outfit} stopOpacity="1" />
              <Stop offset="100%" stopColor={spec.accent} stopOpacity="0.7" />
            </SvgLinear>
            <SvgLinear id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={spec.hair} stopOpacity="1" />
              <Stop offset="100%" stopColor={spec.accent} stopOpacity="0.85" />
            </SvgLinear>
          </Defs>

          {/* Background glow disc */}
          <Rect x="0" y="0" width={w} height={h} fill="url(#bgGlow)" rx={16} />

          {/* City silhouette skyline */}
          <G opacity={0.5}>
            {Array.from({ length: 9 }).map((_, i) => {
              const x = (i / 9) * w;
              const bh = 14 + ((i * 13) % 22);
              return (
                <Rect
                  key={i}
                  x={x}
                  y={h - bh - 8}
                  width={w / 11}
                  height={bh}
                  fill={colors.bgRaised}
                />
              );
            })}
            {Array.from({ length: 9 }).map((_, i) => (
              <Circle
                key={`w${i}`}
                cx={(i / 9) * w + w / 22}
                cy={h - 14 - ((i * 7) % 14)}
                r={1.2}
                fill={spec.accent}
                opacity={0.8}
              />
            ))}
          </G>

          {/* Shoulders / outfit */}
          <Path
            d={`M ${cx - shoulderW / 2} ${h}
                Q ${cx - shoulderW / 2} ${shoulderTop + 4}
                  ${cx - shoulderW / 2 + 18} ${shoulderTop}
                L ${cx + shoulderW / 2 - 18} ${shoulderTop}
                Q ${cx + shoulderW / 2} ${shoulderTop + 4}
                  ${cx + shoulderW / 2} ${h} Z`}
            fill="url(#outfitGrad)"
            stroke={spec.accent}
            strokeWidth={1.4}
          />

          {/* Collar neon stitch */}
          <Path
            d={`M ${cx - shoulderW / 2 + 16} ${shoulderTop + 6}
                Q ${cx} ${shoulderTop + 18}
                  ${cx + shoulderW / 2 - 16} ${shoulderTop + 6}`}
            stroke={spec.accent}
            strokeWidth={1.6}
            fill="none"
            opacity={0.9}
          />

          {/* Neck */}
          <Rect
            x={cx - headR * 0.35}
            y={headCy + headR * 0.7}
            width={headR * 0.7}
            height={headR * 0.5}
            fill={spec.skin}
          />

          {/* Head */}
          <Circle cx={cx} cy={headCy} r={headR} fill={spec.skin} />

          {/* Hair — silhouette-aware */}
          {spec.silhouette === 'hulking' ? (
            // shaved with side stripes
            <G>
              <Path
                d={`M ${cx - headR} ${headCy - headR * 0.2}
                    Q ${cx} ${headCy - headR * 1.05}
                      ${cx + headR} ${headCy - headR * 0.2}
                    L ${cx + headR * 0.95} ${headCy - headR * 0.05}
                    Q ${cx} ${headCy - headR * 0.55}
                      ${cx - headR * 0.95} ${headCy - headR * 0.05} Z`}
                fill={spec.hair}
              />
              <Line
                x1={cx - headR * 0.55}
                y1={headCy - headR * 0.55}
                x2={cx - headR * 0.4}
                y2={headCy - headR * 0.1}
                stroke={spec.accent}
                strokeWidth={1.2}
              />
              <Line
                x1={cx + headR * 0.45}
                y1={headCy - headR * 0.55}
                x2={cx + headR * 0.3}
                y2={headCy - headR * 0.1}
                stroke={spec.accent}
                strokeWidth={1.2}
              />
            </G>
          ) : (
            <Path
              d={`M ${cx - headR * 1.05} ${headCy + headR * 0.1}
                  Q ${cx - headR * 1.1} ${headCy - headR * 1.1}
                    ${cx} ${headCy - headR * 1.15}
                  Q ${cx + headR * 1.1} ${headCy - headR * 1.1}
                    ${cx + headR * 1.05} ${headCy + headR * 0.4}
                  L ${cx + headR * 0.85} ${headCy + headR * 0.2}
                  Q ${cx} ${headCy - headR * 0.6}
                    ${cx - headR * 0.85} ${headCy + headR * 0.2} Z`}
              fill="url(#hairGrad)"
            />
          )}

          {/* Eyes — base */}
          <Ellipse
            cx={cx - headR * 0.36}
            cy={headCy + headR * 0.05}
            rx={headR * 0.12}
            ry={headR * 0.07}
            fill={colors.bgDeep}
          />
          <Ellipse
            cx={cx + headR * 0.36}
            cy={headCy + headR * 0.05}
            rx={headR * 0.12}
            ry={headR * 0.07}
            fill={colors.bgDeep}
          />

          {/* Augmentation overlays */}
          {spec.augment === 'visor' && (
            <G>
              <Rect
                x={cx - headR * 0.85}
                y={headCy - headR * 0.05}
                width={headR * 1.7}
                height={headR * 0.32}
                rx={headR * 0.15}
                fill={spec.accent}
                opacity={0.55}
                stroke={spec.accent}
                strokeWidth={1.4}
              />
              <Line
                x1={cx - headR * 0.6}
                y1={headCy + headR * 0.07}
                x2={cx + headR * 0.6}
                y2={headCy + headR * 0.07}
                stroke={colors.textBright}
                strokeWidth={0.9}
                opacity={0.75}
              />
            </G>
          )}
          {spec.augment === 'eye' && (
            <G>
              <Circle
                cx={cx + headR * 0.36}
                cy={headCy + headR * 0.05}
                r={headR * 0.18}
                fill={spec.accent}
                opacity={0.55}
              />
              <Circle
                cx={cx + headR * 0.36}
                cy={headCy + headR * 0.05}
                r={headR * 0.08}
                fill={colors.textBright}
              />
            </G>
          )}
          {spec.augment === 'antenna' && (
            <G>
              <Line
                x1={cx + headR * 0.55}
                y1={headCy - headR * 0.95}
                x2={cx + headR * 0.7}
                y2={headCy - headR * 1.55}
                stroke={spec.accent}
                strokeWidth={1.6}
              />
              <Circle
                cx={cx + headR * 0.7}
                cy={headCy - headR * 1.55}
                r={3}
                fill={spec.accent}
              />
              <Line
                x1={cx - headR * 0.55}
                y1={headCy - headR * 0.95}
                x2={cx - headR * 0.65}
                y2={headCy - headR * 1.4}
                stroke={spec.accent}
                strokeWidth={1.4}
              />
              <Circle
                cx={cx - headR * 0.65}
                cy={headCy - headR * 1.4}
                r={2.4}
                fill={spec.accent}
              />
            </G>
          )}
          {spec.augment === 'hat' && (
            <G>
              {/* Conical nón lá */}
              <Path
                d={`M ${cx - headR * 1.4} ${headCy - headR * 0.4}
                    L ${cx} ${headCy - headR * 1.7}
                    L ${cx + headR * 1.4} ${headCy - headR * 0.4} Z`}
                fill="#d9b56a"
                stroke={spec.accent}
                strokeWidth={1.4}
              />
              {/* LED string */}
              {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
                <Circle
                  key={i}
                  cx={cx - headR * 1.4 + t * headR * 2.8}
                  cy={headCy - headR * 0.4 - 4}
                  r={2}
                  fill={spec.accent}
                  opacity={0.95}
                />
              ))}
            </G>
          )}
          {spec.augment === 'horns' && (
            <G>
              <Path
                d={`M ${cx - headR * 0.5} ${headCy - headR * 0.95}
                    Q ${cx - headR * 0.9} ${headCy - headR * 1.5}
                      ${cx - headR * 0.4} ${headCy - headR * 1.55}`}
                stroke={spec.accent}
                strokeWidth={2.4}
                fill="none"
              />
              <Path
                d={`M ${cx + headR * 0.5} ${headCy - headR * 0.95}
                    Q ${cx + headR * 0.9} ${headCy - headR * 1.5}
                      ${cx + headR * 0.4} ${headCy - headR * 1.55}`}
                stroke={spec.accent}
                strokeWidth={2.4}
                fill="none"
              />
            </G>
          )}
          {spec.augment === 'mask' && (
            <Rect
              x={cx - headR * 0.7}
              y={headCy + headR * 0.2}
              width={headR * 1.4}
              height={headR * 0.55}
              rx={headR * 0.2}
              fill={spec.accent}
              opacity={0.7}
            />
          )}

          {/* Mouth */}
          {spec.augment !== 'mask' && (
            <Path
              d={`M ${cx - headR * 0.18} ${headCy + headR * 0.42}
                  Q ${cx} ${headCy + headR * 0.5}
                    ${cx + headR * 0.18} ${headCy + headR * 0.42}`}
              stroke={colors.bgDeep}
              strokeWidth={1.4}
              fill="none"
            />
          )}

          {/* Cheek neon tattoo flourish */}
          <Path
            d={`M ${cx - headR * 0.9} ${headCy + headR * 0.45}
                Q ${cx - headR * 0.75} ${headCy + headR * 0.55}
                  ${cx - headR * 0.6} ${headCy + headR * 0.4}`}
            stroke={spec.accent}
            strokeWidth={1.2}
            fill="none"
            opacity={0.85}
          />
        </Svg>
      </View>

      {locked && (
        <View style={[styles.lockOverlay, { width: w, height: h }]}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}

      {name && (
        <View style={[styles.nameTag, { borderColor: spec.accent, ...glow(spec.accent, 0.4) }]}>
          <Text style={[styles.nameText, { color: spec.accent }]}>{spec.emoji}  {name}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  glowWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.bgDeep,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(5,3,13,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  lockIcon: {
    fontSize: 38,
  },
  nameTag: {
    marginTop: -10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.2,
    backgroundColor: colors.bgDeep,
  },
  nameText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

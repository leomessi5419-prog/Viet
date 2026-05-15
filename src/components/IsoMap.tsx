import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinear,
  RadialGradient,
  Stop,
  Path,
  Rect,
  Circle,
  G,
  Line,
} from 'react-native-svg';
import { colors, glow, radius } from '../theme/theme';
import type { District } from '../types';

interface Props {
  width: number;
  height: number;
  districts: District[];
  unlockedIds: string[];
  onSelect: (id: string) => void;
}

/**
 * Stylized isometric night-skyline map of Ho Chi Minh City.
 * Districts sit on a tilted grid, rendered as glowing hex nodes.
 * Locked districts are dimmed silhouettes.
 */
export const IsoMap: React.FC<Props> = ({ width, height, districts, unlockedIds, onSelect }) => {
  // Iso projection: tilt the field
  const project = (nx: number, ny: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const tileW = width * 0.32;
    const tileH = height * 0.18;
    const px = cx + (nx - 0.5) * tileW * 2 + (ny - 0.5) * tileW;
    const py = cy + (ny - 0.5) * tileH * 2 - (nx - 0.5) * tileH * 0.6;
    return { x: px, y: py };
  };

  // River — a curved S-shape across the canvas
  const riverPath = (() => {
    const a = project(0.1, 0.92);
    const b = project(0.45, 0.78);
    const c = project(0.7, 0.95);
    const d = project(0.95, 0.7);
    return `M ${a.x} ${a.y} Q ${b.x} ${b.y - 30} ${c.x} ${c.y} Q ${c.x + 40} ${c.y - 20} ${d.x} ${d.y}`;
  })();

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="sky" cx="50%" cy="40%" r="80%">
            <Stop offset="0%" stopColor="#2a0a3f" stopOpacity="1" />
            <Stop offset="60%" stopColor="#10071e" stopOpacity="1" />
            <Stop offset="100%" stopColor="#05030d" stopOpacity="1" />
          </RadialGradient>
          <SvgLinear id="river" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={colors.neonCyan} stopOpacity="0.6" />
            <Stop offset="50%" stopColor={colors.neonViolet} stopOpacity="0.7" />
            <Stop offset="100%" stopColor={colors.neonPink} stopOpacity="0.6" />
          </SvgLinear>
          <SvgLinear id="grid" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.neonViolet} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={colors.neonViolet} stopOpacity="0.02" />
          </SvgLinear>
        </Defs>

        {/* Sky */}
        <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />

        {/* Iso grid */}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = i / 7;
          const a = project(0, t);
          const b = project(1, t);
          return (
            <Line
              key={`g1-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="url(#grid)"
              strokeWidth={0.7}
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = i / 7;
          const a = project(t, 0);
          const b = project(t, 1);
          return (
            <Line
              key={`g2-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="url(#grid)"
              strokeWidth={0.7}
            />
          );
        })}

        {/* Background buildings — scattered iso blocks */}
        {[
          [0.18, 0.25, 22],
          [0.85, 0.2, 28],
          [0.92, 0.55, 18],
          [0.05, 0.55, 14],
          [0.4, 0.15, 20],
          [0.6, 0.85, 16],
        ].map(([nx, ny, hgt], i) => {
          const { x, y } = project(nx as number, ny as number);
          const bw = 22;
          const bh = hgt as number;
          return (
            <G key={`bld-${i}`}>
              {/* top */}
              <Path
                d={`M ${x} ${y - bh}
                    L ${x + bw} ${y - bh - bw * 0.45}
                    L ${x + bw * 2} ${y - bh}
                    L ${x + bw} ${y - bh + bw * 0.45} Z`}
                fill={colors.bgRaised}
                stroke={colors.neonViolet}
                strokeOpacity={0.55}
                strokeWidth={0.7}
              />
              {/* left side */}
              <Path
                d={`M ${x} ${y - bh}
                    L ${x + bw} ${y - bh + bw * 0.45}
                    L ${x + bw} ${y + bw * 0.45}
                    L ${x} ${y} Z`}
                fill="#1a0f2b"
                stroke={colors.neonPink}
                strokeOpacity={0.35}
                strokeWidth={0.7}
              />
              {/* right side */}
              <Path
                d={`M ${x + bw * 2} ${y - bh}
                    L ${x + bw} ${y - bh + bw * 0.45}
                    L ${x + bw} ${y + bw * 0.45}
                    L ${x + bw * 2} ${y} Z`}
                fill="#0f0719"
                stroke={colors.neonCyan}
                strokeOpacity={0.45}
                strokeWidth={0.7}
              />
              {/* window dots */}
              {[0.35, 0.6, 0.85].map((t) => (
                <Circle
                  key={t}
                  cx={x + bw * 1.6}
                  cy={y - bh + bw * 0.45 + t * (bh - bw * 0.5)}
                  r={1.2}
                  fill={i % 2 === 0 ? colors.neonCyan : colors.neonPink}
                  opacity={0.85}
                />
              ))}
            </G>
          );
        })}

        {/* The Saigon River */}
        <Path
          d={riverPath}
          stroke="url(#river)"
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          opacity={0.85}
        />
        <Path
          d={riverPath}
          stroke={colors.neonCyan}
          strokeWidth={1.4}
          fill="none"
          strokeLinecap="round"
          opacity={0.6}
        />

        {/* Connection paths between districts */}
        {districts.map((d, i) => {
          if (i === 0) return null;
          const a = project(districts[i - 1].mapX, districts[i - 1].mapY);
          const b = project(d.mapX, d.mapY);
          const unlocked = unlockedIds.includes(d.id);
          return (
            <Line
              key={`path-${d.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={unlocked ? d.accentColor : colors.bgInset}
              strokeWidth={unlocked ? 2 : 1.2}
              strokeDasharray={unlocked ? '0' : '4 6'}
              opacity={unlocked ? 0.85 : 0.45}
            />
          );
        })}
      </Svg>

      {/* District nodes — overlay so they're tappable */}
      {districts.map((d) => {
        const { x, y } = project(d.mapX, d.mapY);
        const unlocked = unlockedIds.includes(d.id);
        return (
          <Pressable
            key={d.id}
            onPress={() => onSelect(d.id)}
            style={[
              styles.node,
              { left: x - 38, top: y - 38, ...glow(d.accentColor, unlocked ? 0.9 : 0) },
            ]}
          >
            <View
              style={[
                styles.nodeInner,
                {
                  borderColor: unlocked ? d.accentColor : colors.textDim,
                  backgroundColor: colors.bgDeep,
                  opacity: unlocked ? 1 : 0.55,
                },
              ]}
            >
              <Text style={[styles.nodeMark, { color: unlocked ? d.accentColor : colors.textDim }]}>
                {unlocked ? '◉' : '◌'}
              </Text>
            </View>
            <View
              style={[
                styles.nodeLabel,
                {
                  borderColor: unlocked ? d.accentColor : colors.textDim,
                  opacity: unlocked ? 1 : 0.6,
                },
              ]}
            >
              <Text style={[styles.nodeLabelText, { color: unlocked ? d.accentColor : colors.textDim }]}>
                {d.vietnameseName}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgDeep,
  },
  node: {
    position: 'absolute',
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeInner: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeMark: {
    fontSize: 20,
    fontWeight: '800',
  },
  nodeLabel: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: colors.bgDeep,
  },
  nodeLabelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

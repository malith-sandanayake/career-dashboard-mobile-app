import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

interface GoalRingProps {
  minutes: number;
  goalMinutes: number;
  accentColor: string;
  size?: number;
  strokeWidth?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const formatClockMinutes = (value: number) => `${Math.max(0, Math.round(value))}m`;

export const GoalRing: React.FC<GoalRingProps> = ({
  minutes,
  goalMinutes,
  accentColor,
  size = 160,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const percent = goalMinutes > 0 ? Math.min((minutes / goalMinutes) * 100, 100) : 0;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: percent,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [animatedProgress, percent]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}> 
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1A1A1A"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accentColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.percentText}>{Math.round(percent)}%</Text>
        <Text style={styles.minutesText}>
          {formatClockMinutes(minutes)} / {formatClockMinutes(goalMinutes)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  minutesText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },
});

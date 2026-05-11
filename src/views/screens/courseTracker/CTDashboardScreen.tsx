// src/views/screens/courseTracker/CTDashboardScreen.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, differenceInDays, parseISO } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { useCourses } from '../../../context/CourseContext';
import { getCompletionPercent } from '../../../models/Course';
import { getPlatformIcon } from './shared/PlatformIcon';

// ─── Animated SVG ring ────────────────────────────────────────────────────────
interface ProgressRingProps {
  percent: number;
  size: number;
  strokeWidth: number;
  color: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressRing: React.FC<ProgressRingProps> = ({
  percent,
  size,
  strokeWidth,
  color,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: percent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <Svg width={size} height={size}>
      {/* Track */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1A1A1A"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress */}
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
export const CTDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    activeCourses,
    completedCourses,
    courses,
    totalLessonsDone,
    overallProgress,
    upcomingDeadlines,
    streak,
  } = useCourses();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (streak.currentStreak > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [streak.currentStreak]);

  const recentCompleted = completedCourses.slice(-3).reverse();
  const today = new Date();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── STREAK BANNER ─────────────────────────────────────────── */}
      <View style={styles.streakBanner}>
        {streak.currentStreak > 0 ? (
          <View style={styles.streakRow}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <MaterialCommunityIcons name="fire" size={32} color="#FF6B35" />
            </Animated.View>
            <View style={styles.streakText}>
              <Text style={styles.streakDays}>
                {streak.currentStreak} Day Learning Streak
              </Text>
              <Text style={styles.streakSub}>
                Longest: {streak.longestStreak} days
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.streakRow}>
            <Ionicons name="flame-outline" size={32} color="#333333" />
            <Text style={styles.streakZeroText}>
              Start your streak — update a course today
            </Text>
          </View>
        )}
      </View>

      {/* ── STAT ROW ──────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statScroll}
        contentContainerStyle={styles.statRow}
      >
        <StatCard
          icon={<MaterialCommunityIcons name="bookshelf" size={22} color="#9B59F5" />}
          value={courses.length}
          label="Total"
          valueColor="#FFFFFF"
        />
        <StatCard
          icon={<Ionicons name="time" size={22} color="#00FFFF" />}
          value={activeCourses.length}
          label="Active"
          valueColor="#00FFFF"
        />
        <StatCard
          icon={<MaterialCommunityIcons name="check-decagram" size={22} color="#00FF88" />}
          value={completedCourses.length}
          label="Done"
          valueColor="#00FF88"
        />
        <StatCard
          icon={<MaterialCommunityIcons name="counter" size={22} color="#F39C12" />}
          value={totalLessonsDone}
          label="Lessons"
          valueColor="#F39C12"
        />
      </ScrollView>

      {/* ── PROGRESS RING ─────────────────────────────────────────── */}
      <View style={styles.ringContainer}>
        <ProgressRing
          percent={overallProgress}
          size={140}
          strokeWidth={10}
          color="#9B59F5"
        />
        <View style={styles.ringCenter}>
          <Text style={styles.ringPercent}>{overallProgress}%</Text>
        </View>
        <Text style={styles.ringLabel}>avg. across active courses</Text>
      </View>

      {/* ── ACTIVE COURSES ────────────────────────────────────────── */}
      <SectionHeader
        icon={<Ionicons name="time" size={16} color="#00FFFF" />}
        label="IN PROGRESS"
      />
      {activeCourses.length === 0 ? (
        <Text style={styles.emptyText}>No active courses</Text>
      ) : (
        activeCourses.map((course) => {
          const pct = getCompletionPercent(course);
          return (
            <TouchableOpacity
              key={course.id}
              style={styles.courseRow}
              onPress={() =>
                navigation.navigate('CourseDetail', { course })
              }
            >
              <View style={[styles.colorDot, { backgroundColor: course.color }]} />
              <View style={styles.courseRowContent}>
                <View style={styles.courseRowTop}>
                  <Text style={styles.courseRowTitle} numberOfLines={1}>
                    {course.title}
                  </Text>
                  <View style={styles.platformRow}>
                    {getPlatformIcon(course.platform)}
                    <Text style={styles.platformName}>{course.platform}</Text>
                  </View>
                </View>
                <CourseProgressBar
                  percent={pct}
                  color={course.color}
                />
                <View style={styles.courseRowBottom}>
                  <Text style={styles.lessonsText}>
                    {course.completedLessons}/{course.totalLessons} lessons
                  </Text>
                  <Text style={[styles.percentText, { color: course.color }]}>
                    {pct}%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {/* ── DEADLINES ─────────────────────────────────────────────── */}
      <SectionHeader
        icon={<Ionicons name="warning" size={16} color="#FF003C" />}
        label="DEADLINES"
      />
      {upcomingDeadlines.length === 0 ? (
        <Text style={styles.emptyText}>No upcoming deadlines 🎉</Text>
      ) : (
        upcomingDeadlines.map((course) => {
          const daysLeft = differenceInDays(
            parseISO(course.targetEndDate),
            today
          );
          const dayColor =
            daysLeft <= 7
              ? '#FF003C'
              : daysLeft <= 14
              ? '#F39C12'
              : '#CCCCCC';
          return (
            <View key={course.id} style={styles.deadlineRow}>
              <View style={styles.deadlineLeft}>
                <Text style={styles.deadlineTitle} numberOfLines={1}>
                  {course.title}
                </Text>
                <View style={styles.platformRow}>
                  {getPlatformIcon(course.platform)}
                  <Text style={styles.platformName}>{course.platform}</Text>
                </View>
              </View>
              <View style={styles.deadlineRight}>
                <Text style={[styles.daysLeft, { color: dayColor }]}>
                  {daysLeft}d left
                </Text>
                <Text style={styles.deadlineDate}>
                  {format(parseISO(course.targetEndDate), 'dd MMM')}
                </Text>
              </View>
            </View>
          );
        })
      )}

      {/* ── RECENTLY COMPLETED ────────────────────────────────────── */}
      <SectionHeader
        icon={<MaterialCommunityIcons name="check-decagram" size={16} color="#00FF88" />}
        label="COMPLETED"
      />
      {recentCompleted.length === 0 ? (
        <Text style={styles.emptyText}>No completed courses yet</Text>
      ) : (
        recentCompleted.map((course) => (
          <View key={course.id} style={styles.completedRow}>
            <MaterialCommunityIcons
              name="certificate-outline"
              size={20}
              color={course.certificateEarned ? '#F39C12' : '#333333'}
            />
            <View style={styles.completedText}>
              <Text style={styles.completedTitle} numberOfLines={1}>
                {course.title}
              </Text>
              <Text style={styles.completedSub}>
                {course.platform}
                {course.actualEndDate
                  ? ` · ${format(parseISO(course.actualEndDate), 'dd MMM yyyy')}`
                  : ''}
              </Text>
            </View>
          </View>
        ))
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  valueColor: string;
}> = ({ icon, value, label, valueColor }) => (
  <View style={styles.statCard}>
    {icon}
    <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  label: string;
}> = ({ icon, label }) => (
  <View style={styles.sectionHeader}>
    {icon}
    <Text style={styles.sectionLabel}>{label}</Text>
  </View>
);

const CourseProgressBar: React.FC<{ percent: number; color: string }> = ({
  percent,
  color,
}) => {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: percent,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            backgroundColor: color,
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { paddingHorizontal: 16, paddingTop: 16 },

  // Streak
  streakBanner: {
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakText: { flex: 1 },
  streakDays: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  streakSub: { fontSize: 12, color: '#555555', marginTop: 2 },
  streakZeroText: { fontSize: 13, color: '#FF003C', flex: 1 },

  // Stat row
  statScroll: { marginBottom: 16 },
  statRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    width: 100,
    height: 80,
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 11, color: '#555555' },

  // Ring
  ringContainer: { alignItems: 'center', marginVertical: 20, position: 'relative' },
  ringCenter: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  ringPercent: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  ringLabel: { fontSize: 11, color: '#555555', marginTop: 8 },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 10,
  },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#555555', letterSpacing: 1.5 },

  emptyText: { fontSize: 13, color: '#555555', textAlign: 'center', marginVertical: 8 },

  // Course row
  courseRow: {
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: { width: 4, height: 50, borderRadius: 2 },
  courseRowContent: { flex: 1 },
  courseRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseRowTitle: { flex: 1, fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  platformRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  platformName: { fontSize: 11, color: '#555555' },
  progressTrack: { height: 4, backgroundColor: '#1A1A1A', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  courseRowBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  lessonsText: { fontSize: 11, color: '#555555' },
  percentText: { fontSize: 11, fontWeight: '700' },

  // Deadline
  deadlineRow: {
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineLeft: { flex: 1 },
  deadlineTitle: { fontSize: 13, color: '#FFFFFF', marginBottom: 2 },
  deadlineRight: { alignItems: 'flex-end' },
  daysLeft: { fontSize: 13, fontWeight: '700' },
  deadlineDate: { fontSize: 11, color: '#555555', marginTop: 2 },

  // Completed
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  completedText: { flex: 1 },
  completedTitle: { fontSize: 13, color: '#FFFFFF', marginBottom: 2 },
  completedSub: { fontSize: 11, color: '#555555' },
});

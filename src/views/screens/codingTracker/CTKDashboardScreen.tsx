import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useCoding } from '../../../context/CodingContext';
import { GoalRing } from './shared/GoalRing';

export const CTKDashboardScreen: React.FC = () => {
  const {
    streak,
    todayMinutes,
    goalProgress,
    settings,
    topLanguages,
    topProjects,
    weeklyMinutes,
  } = useCoding();

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
  }, [pulseAnim, streak.currentStreak]);

  const totalWeeklyMinutes = weeklyMinutes.reduce((sum, m) => sum + m, 0);
  const totalSessions = 0;
  const totalHours = 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Streak banner */}
      <View style={styles.streakBanner}>
        {streak.currentStreak > 0 ? (
          <View style={styles.streakRow}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <MaterialCommunityIcons name="fire" size={32} color="#00FF88" />
            </Animated.View>
            <View style={styles.streakText}>
              <Text style={styles.streakDays}>{streak.currentStreak} Day Coding Streak</Text>
              <Text style={styles.streakSub}>Longest: {streak.longestStreak} days</Text>
            </View>
          </View>
        ) : (
          <View style={styles.streakRow}>
            <Ionicons name="flame-outline" size={32} color="#333333" />
            <Text style={styles.streakZeroText}>Start a session to begin your streak</Text>
          </View>
        )}
      </View>

      {/* Stat cards row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statRow}
        style={styles.statScroll}
      >
        <StatCard
          icon={<Ionicons name="time" size={22} color="#00FF88" />}
          label="Today"
          value={`${todayMinutes}m`}
        />
        <StatCard
          icon={<Ionicons name="trending-up" size={22} color="#00FFFF" />}
          label="This Week"
          value={`${totalWeeklyMinutes}m`}
        />
        <StatCard
          icon={<MaterialCommunityIcons name="fire" size={22} color="#F39C12" />}
          label="Current"
          value={`${streak.currentStreak}d`}
        />
        <StatCard
          icon={<MaterialCommunityIcons name="star" size={22} color="#9B59F5" />}
          label="Longest"
          value={`${streak.longestStreak}d`}
        />
      </ScrollView>

      {/* Goal ring */}
      <View style={styles.ringSection}>
        <GoalRing
          minutes={todayMinutes}
          goalMinutes={settings.dailyGoalMinutes}
          accentColor="#00FF88"
          size={160}
          strokeWidth={10}
        />
      </View>

      {/* Weekly bar chart */}
      <SectionHeader label="THIS WEEK" />
      <View style={styles.weeklyChart}>
        {weeklyMinutes.map((minutes, index) => {
          const dayLabel = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index];
          const maxMinutes = Math.max(...weeklyMinutes, 120);
          const barHeightPercent = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0;
          return (
            <View key={index} style={styles.barColumn}>
              {minutes > 0 ? (
                <View style={styles.barValue}>
                  <Text style={styles.barValueText}>{minutes}</Text>
                </View>
              ) : null}
              <View
                style={[
                  styles.bar,
                  { height: `${Math.max(barHeightPercent, 2)}%` },
                ]}
              />
              <Text style={styles.barLabel}>{dayLabel}</Text>
            </View>
          );
        })}
      </View>

      {/* Top languages */}
      <SectionHeader label="TOP LANGUAGES" />
      {topLanguages.length === 0 ? (
        <Text style={styles.emptyText}>No data yet</Text>
      ) : (
        topLanguages.map((item, index) => (
          <View key={index} style={styles.languageRow}>
            <Text style={styles.languageName}>{item.name}</Text>
            <View style={styles.languageBarBg}>
              <View
                style={[
                  styles.languageBarFill,
                  { width: `${(item.minutes / Math.max(...topLanguages.map(l => l.minutes), 1)) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.languageValue}>{item.minutes}m</Text>
          </View>
        ))
      )}

      {/* Top projects */}
      <SectionHeader label="TOP PROJECTS" />
      {topProjects.length === 0 ? (
        <Text style={styles.emptyText}>No data yet</Text>
      ) : (
        topProjects.map((item, index) => (
          <View key={index} style={styles.projectRow}>
            <Text style={styles.projectName}>{item.name}</Text>
            <View style={styles.projectBarBg}>
              <View
                style={[
                  styles.projectBarFill,
                  { width: `${(item.minutes / Math.max(...topProjects.map(p => p.minutes), 1)) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.projectValue}>{item.minutes}m</Text>
          </View>
        ))
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    {icon}
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { paddingHorizontal: 16, paddingTop: 16 },

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
  streakDays: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  streakSub: { fontSize: 11, color: '#555555', marginTop: 2 },
  streakZeroText: { fontSize: 12, color: '#333333', flex: 1 },

  statScroll: { marginBottom: 16 },
  statRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    width: 100,
    height: 90,
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: { fontSize: 10, color: '#555555' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#00FF88' },

  ringSection: { alignItems: 'center', marginVertical: 18 },

  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: '100%',
    gap: 6,
  },
  bar: {
    width: '80%',
    backgroundColor: '#00FF88',
    borderRadius: 4,
  },
  barValue: {
    backgroundColor: '#00FF8820',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minHeight: 24,
    justifyContent: 'center',
  },
  barValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00FF88',
    textAlign: 'center',
  },
  barLabel: { fontSize: 11, color: '#555555', fontWeight: '600' },

  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
  },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#555555', letterSpacing: 1.5 },

  emptyText: { fontSize: 12, color: '#555555', textAlign: 'center', marginVertical: 8 },

  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },
  languageName: { width: 80, fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  languageBarBg: { flex: 1, height: 4, backgroundColor: '#1A1A1A', borderRadius: 2, overflow: 'hidden' },
  languageBarFill: { height: '100%', backgroundColor: '#00FF88' },
  languageValue: { width: 50, textAlign: 'right', fontSize: 12, color: '#555555' },

  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },
  projectName: { width: 100, fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  projectBarBg: { flex: 1, height: 4, backgroundColor: '#1A1A1A', borderRadius: 2, overflow: 'hidden' },
  projectBarFill: { height: '100%', backgroundColor: '#9B59F5' },
  projectValue: { width: 50, textAlign: 'right', fontSize: 12, color: '#555555' },
});

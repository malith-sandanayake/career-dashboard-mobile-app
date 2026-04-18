import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGrades } from '../../context/GradeContext';
import { useTheme } from '../../context/ThemeContext';
import { calculateSGPA, getGPAIncludedCreditsCompleted, getTotalGPACredits } from '../../utils/gpaCalculator';
import { BottomNavBar } from '../components/BottomNavBar';
import { CURRICULUM } from '../../data/curriculum';

export const DashboardScreen: React.FC = () => {
  const { cgpa, targetGPA, grades, currentSemester, setCurrentSemester } = useGrades();
  const { colors } = useTheme();

  const completedCredits = getGPAIncludedCreditsCompleted(grades);
  const totalCredits = getTotalGPACredits();
  const sgpa = calculateSGPA(currentSemester, grades);
  const progressPercent = targetGPA > 0 ? Math.min((cgpa / targetGPA) * 100, 100) : 0;

  const semesterModules = CURRICULUM.filter(m => m.semester === currentSemester);
  const semesterCompleted = semesterModules.filter(m => grades[m.code]).length;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerLabel, { color: colors.accent }]}>ACADEMIC COMMAND CENTER</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
        </View>

        {/* CGPA Card */}
        <View style={[styles.cgpaCard, { backgroundColor: colors.surface, borderColor: colors.accentBorder }]}>
          <Text style={[styles.cgpaLabel, { color: colors.textMuted }]}>CUMULATIVE GPA</Text>
          <Text style={[styles.cgpaValue, { color: colors.accent }]}>{cgpa.toFixed(2)}</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: colors.accent }]} />
          </View>
          <Text style={[styles.cgpaTarget, { color: colors.textMuted }]}>Target: {targetGPA.toFixed(1)}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>CREDITS{'\n'}DONE</Text>
            <Text style={[styles.statValue, { color: colors.accent }]}>{completedCredits}</Text>
            <Text style={[styles.statSub, { color: colors.textMuted }]}>of {totalCredits}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>SEM {currentSemester}{'\n'}GPA</Text>
            <Text style={[styles.statValue, { color: colors.accent }]}>{sgpa.toFixed(2)}</Text>
            <Text style={[styles.statSub, { color: colors.textMuted }]}>{semesterCompleted}/{semesterModules.length} done</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>TO{'\n'}TARGET</Text>
            <Text style={[styles.statValue, { color: colors.accent }]}>{Math.round(progressPercent)}%</Text>
            <Text style={[styles.statSub, { color: colors.textMuted }]}>progress</Text>
          </View>
        </View>

        {/* Semester Selector */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SELECT SEMESTER</Text>
        <View style={styles.semesterSelector}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <TouchableOpacity
              key={s}
              style={[
                styles.semesterButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                currentSemester === s && { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}
              onPress={() => setCurrentSemester(s)}
            >
              <Text style={[
                styles.semesterButtonText,
                { color: colors.textMuted },
                currentSemester === s && { color: colors.background },
              ]}>
                S{s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Module List for current semester */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SEMESTER {currentSemester} MODULES</Text>
        {semesterModules.map(m => {
          const grade = grades[m.code];
          return (
            <View key={m.code} style={[styles.moduleRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.moduleInfo}>
                <Text style={[styles.moduleCode, { color: colors.accent }]}>{m.code}</Text>
                <Text style={[styles.moduleName, { color: colors.textSub }]} numberOfLines={1}>{m.name}</Text>
                <Text style={[styles.moduleMeta, { color: colors.textMuted }]}>{m.credits} CR{!m.gpaIncluded ? ' · NO GPA' : ''}</Text>
              </View>
              <View style={[
                styles.gradeBadge,
                grade
                  ? { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }
                  : { backgroundColor: colors.border, borderColor: colors.borderStrong }
              ]}>
                <Text style={[styles.gradeText, { color: grade ? colors.accent : colors.textMuted }]}>
                  {grade || '—'}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.bottomPad} />
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  header: { marginBottom: 20 },
  headerLabel: { fontSize: 9, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  cgpaCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  cgpaLabel: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  cgpaValue: { fontSize: 64, fontWeight: 'bold', lineHeight: 72, marginBottom: 12 },
  progressBar: { width: '100%', height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 2 },
  cgpaTarget: { fontSize: 11, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statLabel: { fontSize: 8, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statSub: { fontSize: 9, marginTop: 2 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  semesterSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  semesterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  semesterButtonText: { fontSize: 12, fontWeight: 'bold' },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  moduleInfo: { flex: 1, marginRight: 12 },
  moduleCode: { fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  moduleName: { fontSize: 12, marginBottom: 2 },
  moduleMeta: { fontSize: 10 },
  gradeBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  gradeText: { fontSize: 13, fontWeight: 'bold' },
  bottomPad: { height: 8 },
});

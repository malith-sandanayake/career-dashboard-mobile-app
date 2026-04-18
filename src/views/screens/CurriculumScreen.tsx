import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CURRICULUM } from '../../data/curriculum';
import { useGrades } from '../../context/GradeContext';
import { useTheme } from '../../context/ThemeContext';
import { GRADELIST, GRADE_POINTS } from '../../utils/gradeScale';
import { BottomNavBar } from '../components/BottomNavBar';

export const CurriculumScreen: React.FC = () => {
  const { grades, updateGrade, predictions } = useGrades();
  const { colors } = useTheme();
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [filterSemester, setFilterSemester] = useState<number | null>(null);

  const displayed = filterSemester
    ? CURRICULUM.filter(c => c.semester === filterSemester)
    : CURRICULUM;

  const toggleExpand = (code: string) => {
    setExpandedCode(prev => (prev === code ? null : code));
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerLabel, { color: colors.accent }]}>ACADEMIC COMMAND CENTER</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Modules</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>{CURRICULUM.length} courses · tap a card to set grade</Text>
        </View>

        {/* Semester Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
          <TouchableOpacity
            style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border },
              filterSemester === null && { backgroundColor: colors.accent, borderColor: colors.accent }]}
            onPress={() => setFilterSemester(null)}
          >
            <Text style={[styles.filterChipText, { color: filterSemester === null ? colors.background : colors.textMuted }]}>
              ALL
            </Text>
          </TouchableOpacity>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border },
                filterSemester === s && { backgroundColor: colors.accent, borderColor: colors.accent }]}
              onPress={() => setFilterSemester(s)}
            >
              <Text style={[styles.filterChipText, { color: filterSemester === s ? colors.background : colors.textMuted }]}>
                SEM {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Module List */}
        {displayed.map((course) => {
          const grade = grades[course.code] || null;
          const prediction = predictions[course.code];
          const isExpanded = expandedCode === course.code;

          return (
            <View key={course.code} style={[styles.courseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>

              {/* Tappable card header */}
              <TouchableOpacity
                style={styles.courseHeader}
                onPress={() => toggleExpand(course.code)}
                activeOpacity={0.7}
              >
                <View style={styles.courseLeft}>
                  <View style={styles.codeRow}>
                    <Text style={[styles.courseCode, { color: colors.accent }]}>{course.code}</Text>
                    {!course.gpaIncluded && (
                      <View style={[styles.noGpaBadge, { backgroundColor: colors.warning + '22', borderColor: colors.warning + '55' }]}>
                        <Text style={[styles.noGpaText, { color: colors.warning }]}>NO GPA</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.courseName, { color: colors.text }]} numberOfLines={isExpanded ? undefined : 2}>
                    {course.name}
                  </Text>
                  <Text style={[styles.courseMeta, { color: colors.textMuted }]}>
                    {course.credits} Credits · Year {course.year} Sem {course.semester}
                  </Text>
                </View>

                {/* Grade / Prediction Badge */}
                <View style={styles.courseRight}>
                  {grade ? (
                    <View style={[styles.gradeChip, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}>
                      <Text style={[styles.gradeChipText, { color: colors.accent }]}>{grade}</Text>
                      <Text style={[styles.gradePoints, { color: colors.accent }]}>{GRADE_POINTS[grade].toFixed(1)}</Text>
                    </View>
                  ) : prediction ? (
                    <View style={[styles.predictionChip, { backgroundColor: colors.warning + '22', borderColor: colors.warning + '55' }]}>
                      <Text style={[styles.predictionLabel, { color: colors.warning }]}>NEED</Text>
                      <Text style={[styles.predictionValue, { color: colors.warning }]}>{prediction}</Text>
                    </View>
                  ) : (
                    <View style={[styles.emptyChip, { backgroundColor: colors.border, borderColor: colors.borderStrong }]}>
                      <Text style={[styles.emptyChipText, { color: colors.textMuted }]}>—</Text>
                    </View>
                  )}
                  <Text style={[styles.expandHint, { color: colors.textMuted }]}>{isExpanded ? '▲' : '▼'}</Text>
                </View>
              </TouchableOpacity>

              {/* Expanded Details */}
              {isExpanded && (
                <View style={[styles.expandedContent, { backgroundColor: colors.surfaceAlt, borderTopColor: colors.border }]}>

                  {/* Aim */}
                  {course.aim && (
                    <View style={styles.detailSection}>
                      <Text style={[styles.detailTitle, { color: colors.accent }]}>AIM</Text>
                      <Text style={[styles.detailText, { color: colors.textSub }]}>{course.aim}</Text>
                    </View>
                  )}

                  {/* Content Topics */}
                  {course.content && course.content.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={[styles.detailTitle, { color: colors.accent }]}>CONTENT</Text>
                      {course.content.map((topic, i) => (
                        <View key={i} style={styles.topicItem}>
                          <Text style={[styles.topicTitle, { color: colors.text }]}>• {topic.title}</Text>
                          {topic.subtopics.map((sub, j) => (
                            <Text key={j} style={[styles.subtopic, { color: colors.textMuted }]}>  › {sub}</Text>
                          ))}
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Assessment */}
                  {course.assessment && course.assessment.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={[styles.detailTitle, { color: colors.accent }]}>ASSESSMENT</Text>
                      {course.assessment.map((item, i) => (
                        <View key={i} style={[styles.assessmentRow, { borderBottomColor: colors.border }]}>
                          <Text style={[styles.assessmentLabel, { color: colors.textSub }]}>{item.label}</Text>
                          <View style={[styles.percentBadge, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}>
                            <Text style={[styles.percentText, { color: colors.accent }]}>{item.percentage}%</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Prerequisites */}
                  {course.preRequisites && (
                    <View style={styles.detailSection}>
                      <Text style={[styles.detailTitle, { color: colors.accent }]}>PRE-REQUISITES</Text>
                      <Text style={[styles.detailText, { color: colors.textSub }]}>{course.preRequisites}</Text>
                    </View>
                  )}

                  {/* Grade Picker */}
                  <View style={[styles.gradePicker, { borderTopColor: colors.border }]}>
                    <Text style={[styles.gradePickerLabel, { color: colors.textMuted }]}>SET GRADE</Text>
                    <View style={styles.gradeGrid}>
                      {GRADELIST.map(g => (
                        <TouchableOpacity
                          key={g}
                          style={[
                            styles.gradeBtn,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            grade === g && { backgroundColor: colors.accent, borderColor: colors.accent },
                          ]}
                          onPress={() => {
                            updateGrade(course.code, grade === g ? null : g);
                          }}
                        >
                          <Text style={[styles.gradeBtnText, { color: grade === g ? colors.background : colors.textSub }]}>
                            {g}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      {grade && (
                        <TouchableOpacity
                          style={[styles.clearBtn, { backgroundColor: colors.danger + '18', borderColor: colors.danger + '55' }]}
                          onPress={() => updateGrade(course.code, null)}
                        >
                          <Text style={[styles.clearBtnText, { color: colors.danger }]}>CLEAR</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                </View>
              )}
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
  header: { marginBottom: 16 },
  headerLabel: { fontSize: 9, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  headerSub: { fontSize: 11, letterSpacing: 0.5 },
  filterRow: { marginBottom: 16 },
  filterContent: { paddingRight: 16 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  courseCard: {
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  courseLeft: { flex: 1, marginRight: 12 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  courseCode: { fontSize: 11, fontWeight: 'bold' },
  noGpaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  noGpaText: { fontSize: 8, fontWeight: 'bold', letterSpacing: 0.5 },
  courseName: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  courseMeta: { fontSize: 10 },
  courseRight: { alignItems: 'center', gap: 6 },
  gradeChip: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeChipText: { fontSize: 15, fontWeight: 'bold' },
  gradePoints: { fontSize: 9 },
  predictionChip: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionLabel: { fontSize: 7, fontWeight: 'bold', letterSpacing: 0.5 },
  predictionValue: { fontSize: 13, fontWeight: 'bold' },
  emptyChip: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChipText: { fontSize: 18 },
  expandHint: { fontSize: 10 },
  expandedContent: {
    borderTopWidth: 1,
    padding: 14,
  },
  detailSection: { marginBottom: 16 },
  detailTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  detailText: { fontSize: 12, lineHeight: 18 },
  topicItem: { marginBottom: 8 },
  topicTitle: { fontSize: 12, fontWeight: '600', marginBottom: 3 },
  subtopic: { fontSize: 11, lineHeight: 17, paddingLeft: 8 },
  assessmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  assessmentLabel: { fontSize: 11, flex: 1, marginRight: 8 },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  percentText: { fontSize: 11, fontWeight: 'bold' },
  gradePicker: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  gradePickerLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  gradeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gradeBtn: {
    width: 44,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  gradeBtnText: { fontSize: 12, fontWeight: 'bold' },
  clearBtn: {
    paddingHorizontal: 12,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  clearBtnText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  bottomPad: { height: 8 },
});

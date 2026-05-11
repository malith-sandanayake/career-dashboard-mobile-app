// src/views/screens/courseTracker/CTSkillsScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, FlatList, Linking,
} from 'react-native';
import Svg, { G, Path, Circle as SvgCircle, Text as SvgText } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useCourses } from '../../../context/CourseContext';
import { LearningCategory, Course } from '../../../models/Course';

// ─── Category config ──────────────────────────────────────────────────────────
type CatConfig = { icon: string; lib: 'mci' | 'ion'; color: string };
const CAT_CONFIG: Record<LearningCategory | 'Other', CatConfig> = {
  'Cybersecurity':      { icon: 'shield-lock',       lib: 'mci', color: '#FF003C' },
  'AI/ML':              { icon: 'brain',              lib: 'mci', color: '#9B59F5' },
  'Web Development':    { icon: 'web',                lib: 'mci', color: '#00FFFF' },
  'Mobile Development': { icon: 'cellphone',          lib: 'mci', color: '#00FF88' },
  'Cloud/DevOps':       { icon: 'cloud-upload',       lib: 'mci', color: '#3498DB' },
  'Data Engineering':   { icon: 'database',           lib: 'mci', color: '#F39C12' },
  'Embedded/IoT':       { icon: 'chip',               lib: 'mci', color: '#E74C3C' },
  'Algorithms/DSA':     { icon: 'graph-outline',      lib: 'mci', color: '#1ABC9C' },
  'Networking':         { icon: 'lan',                lib: 'mci', color: '#1BA0D7' },
  'Other':              { icon: 'ellipsis-horizontal', lib: 'ion', color: '#555555' },
};

const CatIcon: React.FC<{ cat: LearningCategory; size?: number }> = ({ cat, size = 18 }) => {
  const cfg = CAT_CONFIG[cat] ?? CAT_CONFIG['Other'];
  return cfg.lib === 'mci'
    ? <MaterialCommunityIcons name={cfg.icon as any} size={size} color={cfg.color} />
    : <Ionicons name={cfg.icon as any} size={size} color={cfg.color} />;
};

// ─── Donut chart ──────────────────────────────────────────────────────────────
const DONUT_COLORS = [
  '#FF003C','#9B59F5','#00FFFF','#00FF88','#F39C12',
  '#3498DB','#E91E63','#FF9800','#1ABC9C','#E74C3C',
];

interface DonutSlice { category: LearningCategory; count: number; color: string }

const DonutChart: React.FC<{ slices: DonutSlice[]; total: number }> = ({ slices, total }) => {
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const paths = slices.map((s, i) => {
    const fraction = s.count / total;
    const dash = fraction * circumference;
    const offset = circumference - cumulative * circumference;
    cumulative += fraction;
    return { ...s, dash, offset };
  });

  return (
    <Svg width={size} height={size}>
      {paths.map((p, i) => (
        <SvgCircle
          key={i}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={p.color} strokeWidth={strokeWidth}
          strokeDasharray={`${p.dash} ${circumference - p.dash}`}
          strokeDashoffset={p.offset}
          rotation="-90" origin={`${size / 2}, ${size / 2}`}
        />
      ))}
      <SvgText
        x={size / 2} y={size / 2 - 6}
        fill="#FFFFFF" fontSize={22} fontWeight="700" textAnchor="middle"
      >
        {total}
      </SvgText>
      <SvgText
        x={size / 2} y={size / 2 + 16}
        fill="#555555" fontSize={10} textAnchor="middle"
      >
        courses
      </SvgText>
    </Svg>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
export const CTSkillsScreen: React.FC = () => {
  const { courses, allSkills, allLanguages, certificatesEarned } = useCourses();
  const [skillDetailSkill, setSkillDetailSkill] = useState<string | null>(null);

  const totalCourses = Math.max(courses.length, 1);
  const earnedSkillsCount = allSkills.filter(s => s.earnedInCompleted).length;
  const langsCount = allLanguages.length;

  // Group skills by category
  const skillsByCategory = React.useMemo(() => {
    const map = new Map<LearningCategory, typeof allSkills>();
    for (const s of allSkills) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return map;
  }, [allSkills]);

  // Donut slices
  const donutSlices: DonutSlice[] = React.useMemo(() => {
    const map = new Map<LearningCategory, number>();
    for (const c of courses) {
      map.set(c.category, (map.get(c.category) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([cat, count], i) => ({
      category: cat, count, color: DONUT_COLORS[i % DONUT_COLORS.length],
    }));
  }, [courses]);

  // Skills for selected skill chip
  const skillCourses: Course[] = skillDetailSkill
    ? courses.filter(c => c.skillsGained.includes(skillDetailSkill))
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Summary pills */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryPill}>
          <MaterialCommunityIcons name="brain" size={16} color="#9B59F5" />
          <Text style={styles.summaryText}>{earnedSkillsCount} skills earned</Text>
        </View>
        <View style={[styles.summaryPill, styles.summaryPillCyan]}>
          <MaterialCommunityIcons name="code-tags" size={16} color="#00FFFF" />
          <Text style={[styles.summaryText, styles.summaryTextCyan]}>{langsCount} languages</Text>
        </View>
      </View>

      {/* ── LANGUAGES & TOOLS ──────────────────────────────────────── */}
      <SectionHeader icon={<MaterialCommunityIcons name="code-tags" size={18} color="#00FFFF" />} label="LANGUAGES & TOOLS" />
      {allLanguages.length === 0 ? (
        <Text style={styles.emptyText}>No languages tracked yet</Text>
      ) : allLanguages.map(lang => (
        <View key={lang.name} style={styles.langRow}>
          <MaterialCommunityIcons name="code-tags" size={16} color="#00FFFF" />
          <View style={styles.langInfo}>
            <View style={styles.langNameRow}>
              <Text style={styles.langName}>{lang.name}</Text>
              {lang.isMastered
                ? <View style={styles.masteredChip}><Text style={styles.masteredText}>Mastered</Text></View>
                : lang.isLearning
                  ? <View style={styles.learningChip}><Text style={styles.learningText}>Learning</Text></View>
                  : null}
            </View>
            <View style={styles.usageBar}>
              <View style={[styles.usageFill, { width: `${Math.min((lang.usageCount / totalCourses) * 100, 100)}%` }]} />
            </View>
            <Text style={styles.usageCount}>{lang.usageCount} course(s)</Text>
          </View>
        </View>
      ))}

      {/* ── SKILLS ─────────────────────────────────────────────────── */}
      <SectionHeader icon={<MaterialCommunityIcons name="brain" size={18} color="#9B59F5" />} label="SKILLS" />
      {allSkills.length === 0 ? (
        <Text style={styles.emptyText}>No skills tracked yet</Text>
      ) : Array.from(skillsByCategory.entries()).map(([cat, skills]) => (
        <View key={cat} style={styles.skillGroup}>
          <View style={styles.catHeader}>
            <CatIcon cat={cat} size={16} />
            <Text style={styles.catLabel}>{cat.toUpperCase()}</Text>
          </View>
          <View style={styles.skillChipWrap}>
            {skills.map(s => (
              <TouchableOpacity
                key={s.name}
                style={[
                  styles.skillChip,
                  s.earnedInCompleted ? styles.skillChipEarned : styles.skillChipInProgress,
                ]}
                onPress={() => setSkillDetailSkill(s.name)}
              >
                {s.earnedInCompleted
                  ? <Ionicons name="checkmark-circle" size={12} color="#000000" />
                  : <Ionicons name="time-outline" size={12} color="#9B59F5" />}
                <Text style={[
                  styles.skillChipText,
                  s.earnedInCompleted ? styles.skillChipTextEarned : styles.skillChipTextInProgress,
                ]}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* ── CATEGORY DONUT ─────────────────────────────────────────── */}
      {donutSlices.length > 0 && (
        <>
          <SectionHeader icon={<MaterialCommunityIcons name="chart-donut" size={18} color="#9B59F5" />} label="LEARNING BREAKDOWN" />
          <View style={styles.donutContainer}>
            <DonutChart slices={donutSlices} total={courses.length} />
          </View>
          <View style={styles.legendGrid}>
            {donutSlices.map(s => (
              <View key={s.category} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                <Text style={styles.legendLabel}>{s.category}</Text>
                <View style={styles.legendBadge}>
                  <Text style={styles.legendCount}>{s.count}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ── CERTIFICATES ───────────────────────────────────────────── */}
      <SectionHeader icon={<MaterialCommunityIcons name="certificate" size={18} color="#F39C12" />} label="CERTIFICATES" />
      {certificatesEarned.length === 0 ? (
        <View style={styles.certEmpty}>
          <MaterialCommunityIcons name="certificate-outline" size={48} color="#1A1A1A" />
          <Text style={styles.certEmptyTitle}>No certificates yet</Text>
          <Text style={styles.certEmptySub}>Complete a course to earn one</Text>
        </View>
      ) : (
        <View style={styles.certGrid}>
          {certificatesEarned.map(c => (
            <View key={c.id} style={styles.certCard}>
              <MaterialCommunityIcons name="certificate-outline" size={28} color="#F39C12" />
              <Text style={styles.certTitle} numberOfLines={2}>{c.title}</Text>
              <Text style={styles.certPlatform}>{c.platform}</Text>
              {c.actualEndDate && (
                <Text style={styles.certDate}>{format(parseISO(c.actualEndDate), 'dd MMM yyyy')}</Text>
              )}
              {c.certificateUrl && (
                <TouchableOpacity onPress={() => Linking.openURL(c.certificateUrl!)}>
                  <Ionicons name="open-outline" size={16} color="#F39C12" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />

      {/* Skill detail modal */}
      <Modal
        visible={!!skillDetailSkill}
        transparent
        animationType="slide"
        onRequestClose={() => setSkillDetailSkill(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{skillDetailSkill}</Text>
            <Text style={styles.modalSubtitle}>Courses teaching this skill</Text>
            {skillCourses.map(c => (
              <View key={c.id} style={styles.modalCourseRow}>
                <View style={[styles.modalDot, { backgroundColor: c.color }]} />
                <View>
                  <Text style={styles.modalCourseName}>{c.title}</Text>
                  <Text style={styles.modalCourseStatus}>{c.status}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setSkillDetailSkill(null)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const SectionHeader: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <View style={styles.sectionHeader}>
    {icon}
    <Text style={styles.sectionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  summaryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#9B59F520', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
  },
  summaryPillCyan: { backgroundColor: '#00FFFF20' },
  summaryText: { fontSize: 13, color: '#9B59F5', fontWeight: '600' },
  summaryTextCyan: { color: '#00FFFF' },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 24, marginBottom: 12,
  },
  sectionLabel: { fontSize: 12, color: '#555555', fontWeight: '700', letterSpacing: 1.5 },
  emptyText: { fontSize: 13, color: '#555555', textAlign: 'center', marginVertical: 8 },
  langRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#0D0D0D', borderRadius: 10, padding: 12, marginBottom: 6,
  },
  langInfo: { flex: 1 },
  langNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  langName: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  masteredChip: { backgroundColor: '#00FF8820', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  masteredText: { fontSize: 11, color: '#00FF88', fontWeight: '600' },
  learningChip: { backgroundColor: '#00FFFF20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  learningText: { fontSize: 11, color: '#00FFFF', fontWeight: '600' },
  usageBar: { height: 3, backgroundColor: '#1A1A1A', borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  usageFill: { height: '100%', backgroundColor: '#00FFFF', borderRadius: 2 },
  usageCount: { fontSize: 11, color: '#333333' },
  skillGroup: { marginBottom: 16 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  catLabel: { fontSize: 12, color: '#555555', fontWeight: '700', letterSpacing: 1 },
  skillChipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  skillChipEarned: { backgroundColor: '#00FFFF' },
  skillChipInProgress: { borderWidth: 1, borderColor: '#9B59F5', backgroundColor: 'transparent' },
  skillChipText: { fontSize: 12, fontWeight: '600' },
  skillChipTextEarned: { color: '#000000' },
  skillChipTextInProgress: { color: '#9B59F5' },
  donutContainer: { alignItems: 'center', marginVertical: 8 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '48%' },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { flex: 1, fontSize: 12, color: '#CCCCCC' },
  legendBadge: { backgroundColor: '#1A1A1A', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  legendCount: { fontSize: 11, color: '#555555', fontWeight: '700' },
  certEmpty: { alignItems: 'center', gap: 8, marginVertical: 16 },
  certEmptyTitle: { fontSize: 14, color: '#333333', fontWeight: '600' },
  certEmptySub: { fontSize: 12, color: '#555555' },
  certGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  certCard: {
    width: '47%', backgroundColor: '#0D0D0D', borderRadius: 12,
    padding: 14, gap: 6, alignItems: 'flex-start',
  },
  certTitle: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  certPlatform: { fontSize: 11, color: '#555555' },
  certDate: { fontSize: 11, color: '#333333' },
  modalOverlay: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#0D0D0D', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24,
  },
  modalTitle: { fontSize: 18, color: '#FFFFFF', fontWeight: '700', marginBottom: 4 },
  modalSubtitle: { fontSize: 12, color: '#555555', marginBottom: 16 },
  modalCourseRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  modalDot: { width: 8, height: 8, borderRadius: 4 },
  modalCourseName: { fontSize: 14, color: '#FFFFFF' },
  modalCourseStatus: { fontSize: 11, color: '#555555' },
  modalClose: {
    marginTop: 16, backgroundColor: '#1A1A1A', borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  modalCloseText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});

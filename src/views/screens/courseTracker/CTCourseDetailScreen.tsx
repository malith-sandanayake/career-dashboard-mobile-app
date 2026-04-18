// src/views/screens/courseTracker/CTCourseDetailScreen.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Linking, Animated,
} from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCourses } from '../../../context/CourseContext';
import { Course, getCompletionPercent } from '../../../models/Course';
import { CTAddEditCourseModal } from './CTAddEditCourseModal';
import { getPlatformIcon } from './shared/PlatformIcon';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DetailRing: React.FC<{ percent: number; color: string }> = ({ percent, color }) => {
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: percent, duration: 1000, useNativeDriver: false }).start();
  }, [percent]);

  const offset = progress.interpolate({ inputRange: [0, 100], outputRange: [circumference, 0] });

  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#1A1A1A" strokeWidth={strokeWidth} fill="none" />
      <AnimatedCircle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" rotation="-90" origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
};

export const CTCourseDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const course: Course = route.params?.course;
  const { updateProgress, markCompleted, deleteCourse, courses } = useCourses();
  const [editVisible, setEditVisible] = useState(false);
  const [lessonInput, setLessonInput] = useState(String(course?.completedLessons ?? 0));

  // Always read live course from context
  const liveCourse = courses.find(c => c.id === course?.id) ?? course;
  const pct = getCompletionPercent(liveCourse);
  const today = new Date();

  const handleProgressChange = (val: number) => {
    const clamped = Math.max(0, Math.min(val, liveCourse.totalLessons));
    setLessonInput(String(clamped));
    updateProgress(liveCourse.id, clamped);
  };

  const handleDelete = () => {
    Alert.alert('Delete Course', `Delete "${liveCourse.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          deleteCourse(liveCourse.id);
          navigation.goBack();
        }
      },
    ]);
  };

  if (!liveCourse) return null;

  const daysRemaining = liveCourse.status === 'InProgress'
    ? differenceInDays(parseISO(liveCourse.targetEndDate), today)
    : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header card */}
        <View style={styles.headerCard}>
          <View style={[styles.headerAccent, { backgroundColor: liveCourse.color }]} />
          <View style={styles.headerInfo}>
            <Text style={styles.courseTitle}>{liveCourse.title}</Text>
            <View style={styles.platformRow}>
              {getPlatformIcon(liveCourse.platform, 14)}
              <Text style={styles.platformName}>{liveCourse.platform}</Text>
              {liveCourse.instructor ? (
                <Text style={styles.instructor}> · {liveCourse.instructor}</Text>
              ) : null}
            </View>
            <View style={styles.statusChip}>
              <Text style={styles.statusText}>{liveCourse.status}</Text>
            </View>
          </View>
        </View>

        {/* Progress ring */}
        <View style={styles.ringSection}>
          <View style={styles.ringWrapper}>
            <DetailRing percent={pct} color={liveCourse.color} />
            <View style={styles.ringCenter}>
              <Text style={styles.ringPercent}>{pct}%</Text>
            </View>
          </View>
          <Text style={styles.lessonCount}>
            {liveCourse.completedLessons} of {liveCourse.totalLessons} lessons
          </Text>
        </View>

        {/* Progress update panel */}
        <View style={styles.updatePanel}>
          <View style={styles.updateHeader}>
            <Ionicons name="add-circle-outline" size={16} color="#555555" />
            <Text style={styles.updateLabel}>UPDATE PROGRESS</Text>
          </View>
          <View style={styles.updateControls}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => handleProgressChange(liveCourse.completedLessons - 1)}
            >
              <Ionicons name="remove" size={20} color="#FF003C" />
            </TouchableOpacity>
            <TextInput
              style={styles.lessonInput}
              value={lessonInput}
              onChangeText={v => setLessonInput(v)}
              onBlur={() => {
                const n = parseInt(lessonInput, 10);
                if (!isNaN(n)) handleProgressChange(n);
                else setLessonInput(String(liveCourse.completedLessons));
              }}
              keyboardType="numeric"
              textAlign="center"
            />
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => handleProgressChange(liveCourse.completedLessons + 1)}
            >
              <Ionicons name="add" size={20} color="#00FF88" />
            </TouchableOpacity>
          </View>
          <View style={styles.quickBtns}>
            {[5, 10, 25].map(n => (
              <TouchableOpacity
                key={n}
                style={styles.quickBtn}
                onPress={() => handleProgressChange(liveCourse.completedLessons + n)}
              >
                <Text style={styles.quickBtnText}>+{n} lessons</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Complete banner */}
        {liveCourse.completedLessons >= liveCourse.totalLessons && liveCourse.status !== 'Completed' && (
          <View style={styles.completeBanner}>
            <MaterialCommunityIcons name="party-popper" size={20} color="#00FF88" />
            <Text style={styles.completeBannerText}>Course complete! Mark as finished?</Text>
            <TouchableOpacity
              style={styles.markCompleteBtn}
              onPress={() => markCompleted(liveCourse.id)}
            >
              <Text style={styles.markCompleteBtnText}>Mark Completed</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metaSection}>
          <MetaRow icon={<Ionicons name="calendar-outline" size={16} color="#555555" />}
            text={`Started: ${format(parseISO(liveCourse.startDate), 'dd MMM yyyy')}`} />
          <View style={styles.metaRowWrap}>
            <MetaRow icon={<Ionicons name="flag-outline" size={16} color="#555555" />}
              text={`Target: ${format(parseISO(liveCourse.targetEndDate), 'dd MMM yyyy')}`} />
            {daysRemaining !== null && (
              <View style={[styles.daysBadge, { backgroundColor: daysRemaining <= 7 ? '#FF003C20' : '#F39C1220' }]}>
                <Text style={[styles.daysBadgeText, { color: daysRemaining <= 7 ? '#FF003C' : '#F39C12' }]}>
                  {daysRemaining}d left
                </Text>
              </View>
            )}
          </View>
          {liveCourse.actualEndDate && (
            <MetaRow icon={<Ionicons name="checkmark-circle-outline" size={16} color="#00FF88" />}
              text={`Completed: ${format(parseISO(liveCourse.actualEndDate), 'dd MMM yyyy')}`} />
          )}
          <View style={styles.metaRowWrap}>
            <MetaRow
              icon={<MaterialCommunityIcons name="certificate-outline" size={16}
                color={liveCourse.certificateEarned ? '#F39C12' : '#333333'} />}
              text={liveCourse.certificateEarned ? 'Certificate earned' : 'No certificate'}
              textColor={liveCourse.certificateEarned ? '#F39C12' : '#333333'}
            />
            {liveCourse.certificateEarned && liveCourse.certificateUrl && (
              <TouchableOpacity onPress={() => Linking.openURL(liveCourse.certificateUrl!)}>
                <Ionicons name="open-outline" size={16} color="#F39C12" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Skills */}
        {liveCourse.skillsGained.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="brain" size={16} color="#9B59F5" />
              <Text style={styles.sectionTitle}>Skills Gained</Text>
            </View>
            <View style={styles.chipWrap}>
              {liveCourse.skillsGained.map(s => (
                <View key={s} style={styles.skillChip}>
                  <Ionicons name="checkmark-circle" size={12} color="#9B59F5" />
                  <Text style={styles.skillChipText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {liveCourse.languagesUsed.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="code-tags" size={16} color="#00FFFF" />
              <Text style={styles.sectionTitle}>Languages & Tools</Text>
            </View>
            <View style={styles.chipWrap}>
              {liveCourse.languagesUsed.map(l => (
                <View key={l} style={styles.langChip}>
                  <MaterialCommunityIcons name="code-tags" size={12} color="#00FFFF" />
                  <Text style={styles.langChipText}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        {liveCourse.notes ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={16} color="#555555" />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{liveCourse.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.actionsSection}>
          {liveCourse.url ? (
            <TouchableOpacity
              style={styles.urlBtn}
              onPress={() => Linking.openURL(liveCourse.url!)}
            >
              <Ionicons name="open-outline" size={18} color="#FFFFFF" />
              <Text style={styles.urlBtnText}>Open Course</Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditVisible(true)}>
              <Ionicons name="pencil-outline" size={18} color="#9B59F5" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color="#FF003C" />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <CTAddEditCourseModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        editingCourse={liveCourse}
      />
    </View>
  );
};

const MetaRow: React.FC<{ icon: React.ReactNode; text: string; textColor?: string }> = ({
  icon, text, textColor = '#CCCCCC',
}) => (
  <View style={styles.metaRow}>
    {icon}
    <Text style={[styles.metaText, { color: textColor }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16 },
  headerCard: {
    backgroundColor: '#0D0D0D', borderRadius: 16, padding: 20,
    flexDirection: 'row', overflow: 'hidden',
  },
  headerAccent: { width: 4, borderRadius: 2, marginRight: 12 },
  headerInfo: { flex: 1 },
  courseTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  platformRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  platformName: { fontSize: 12, color: '#555555' },
  instructor: { fontSize: 12, color: '#333333' },
  statusChip: {
    alignSelf: 'flex-start', backgroundColor: '#9B59F520',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
  },
  statusText: { fontSize: 12, color: '#9B59F5', fontWeight: '600' },
  ringSection: { alignItems: 'center', marginVertical: 24 },
  ringWrapper: { position: 'relative' },
  ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  ringPercent: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
  lessonCount: { fontSize: 13, color: '#555555', marginTop: 10 },
  updatePanel: { backgroundColor: '#0D0D0D', borderRadius: 12, padding: 16, marginBottom: 16 },
  updateHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  updateLabel: { fontSize: 12, color: '#555555', fontWeight: '700', letterSpacing: 1 },
  updateControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 },
  controlBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
  },
  lessonInput: {
    width: 64, height: 48, backgroundColor: '#1A1A1A',
    borderRadius: 8, color: '#FFFFFF', fontSize: 18, fontWeight: '700',
    textAlign: 'center',
  },
  quickBtns: { flexDirection: 'row', gap: 8, marginTop: 12, justifyContent: 'center' },
  quickBtn: { backgroundColor: '#1A1A1A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  quickBtnText: { fontSize: 12, color: '#9B59F5', fontWeight: '700' },
  completeBanner: {
    backgroundColor: '#00FF8810', borderRadius: 12, padding: 16,
    marginBottom: 16, gap: 8,
  },
  completeBannerText: { fontSize: 14, color: '#00FF88', fontWeight: '600' },
  markCompleteBtn: { backgroundColor: '#00FF88', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  markCompleteBtnText: { fontSize: 14, fontWeight: '700', color: '#000000' },
  metaSection: { backgroundColor: '#0D0D0D', borderRadius: 12, padding: 16, marginBottom: 16, gap: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaRowWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 14 },
  daysBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  daysBadgeText: { fontSize: 11, fontWeight: '700' },
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#9B59F520', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  skillChipText: { fontSize: 12, color: '#9B59F5' },
  langChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#00FFFF20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  langChipText: { fontSize: 12, color: '#00FFFF' },
  notesBox: { backgroundColor: '#0D0D0D', borderRadius: 8, padding: 12 },
  notesText: { fontSize: 13, color: '#CCCCCC', lineHeight: 20 },
  actionsSection: { gap: 12, marginBottom: 16 },
  urlBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#0D0D0D', borderWidth: 1, borderColor: '#1A1A1A',
    borderRadius: 12, paddingVertical: 14,
  },
  urlBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 12 },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#0D0D0D', borderWidth: 1, borderColor: '#9B59F540',
    borderRadius: 12, paddingVertical: 12,
  },
  editBtnText: { color: '#9B59F5', fontSize: 14, fontWeight: '600' },
  deleteBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#FF003C10', borderWidth: 1, borderColor: '#FF003C40',
    borderRadius: 12, paddingVertical: 12,
  },
  deleteBtnText: { color: '#FF003C', fontSize: 14, fontWeight: '600' },
});

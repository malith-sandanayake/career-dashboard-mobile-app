// src/views/screens/courseTracker/CTAddEditCourseModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Switch, Alert, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { Course, CourseCategory, CourseStatus, LearningCategory } from '../../../models/Course';
import { useCourses } from '../../../context/CourseContext';
import { getPlatformIcon } from './shared/PlatformIcon';

const PLATFORMS: CourseCategory[] = [
  'Udemy','Coursera','YouTube','Google','Cisco','AWS','Microsoft','CompTIA','Other Certification','Other Online',
];

const CATEGORIES: LearningCategory[] = [
  'Cybersecurity','AI/ML','Web Development','Mobile Development',
  'Cloud/DevOps','Data Engineering','Embedded/IoT','Algorithms/DSA','Networking','Other',
];

const STATUSES: CourseStatus[] = ['NotStarted','InProgress','Completed','Paused'];

const COLORS = [
  '#00FFFF','#9B59F5','#00FF88','#FF003C','#F39C12',
  '#3498DB','#E91E63','#FF9800','#1ABC9C','#E74C3C',
];

interface Props {
  visible: boolean;
  onClose: () => void;
  editingCourse?: Course | null;
}

type FormState = {
  title: string;
  platform: CourseCategory;
  instructor: string;
  url: string;
  category: LearningCategory;
  totalLessons: string;
  completedLessons: string;
  startDate: Date;
  targetEndDate: Date;
  actualEndDate: Date | null;
  status: CourseStatus;
  skillInput: string;
  skillsGained: string[];
  langInput: string;
  languagesUsed: string[];
  certificateEarned: boolean;
  certificateUrl: string;
  color: string;
  notes: string;
};

const defaultForm = (): FormState => ({
  title: '',
  platform: 'Udemy',
  instructor: '',
  url: '',
  category: 'Other',
  totalLessons: '',
  completedLessons: '0',
  startDate: new Date(),
  targetEndDate: new Date(Date.now() + 30 * 86400000),
  actualEndDate: null,
  status: 'NotStarted',
  skillInput: '',
  skillsGained: [],
  langInput: '',
  languagesUsed: [],
  certificateEarned: false,
  certificateUrl: '',
  color: '#9B59F5',
  notes: '',
});

export const CTAddEditCourseModal: React.FC<Props> = ({ visible, onClose, editingCourse }) => {
  const { addCourse, updateCourse } = useCourses();
  const [form, setForm] = useState<FormState>(defaultForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showActualEndPicker, setShowActualEndPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editingCourse) {
        setForm({
          title: editingCourse.title,
          platform: editingCourse.platform,
          instructor: editingCourse.instructor ?? '',
          url: editingCourse.url ?? '',
          category: editingCourse.category,
          totalLessons: String(editingCourse.totalLessons),
          completedLessons: String(editingCourse.completedLessons),
          startDate: parseISO(editingCourse.startDate),
          targetEndDate: parseISO(editingCourse.targetEndDate),
          actualEndDate: editingCourse.actualEndDate ? parseISO(editingCourse.actualEndDate) : null,
          status: editingCourse.status,
          skillInput: '',
          skillsGained: [...editingCourse.skillsGained],
          langInput: '',
          languagesUsed: [...editingCourse.languagesUsed],
          certificateEarned: editingCourse.certificateEarned,
          certificateUrl: editingCourse.certificateUrl ?? '',
          color: editingCourse.color,
          notes: editingCourse.notes ?? '',
        });
      } else {
        setForm(defaultForm());
      }
      setErrors({});
    }
  }, [visible, editingCourse]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.totalLessons || isNaN(Number(form.totalLessons)) || Number(form.totalLessons) < 1)
      e.totalLessons = 'Must be ≥ 1';
    if (isNaN(Number(form.completedLessons)) || Number(form.completedLessons) < 0)
      e.completedLessons = 'Must be ≥ 0';
    if (form.targetEndDate <= form.startDate) e.targetEndDate = 'Must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const total = Number(form.totalLessons);
    const completed = Math.min(Number(form.completedLessons), total);
    const data: Omit<Course, 'id' | 'createdAt' | 'lastProgressUpdate'> = {
      title: form.title.trim(),
      platform: form.platform,
      instructor: form.instructor.trim() || undefined,
      url: form.url.trim() || undefined,
      category: form.category,
      totalLessons: total,
      completedLessons: completed,
      startDate: format(form.startDate, 'yyyy-MM-dd'),
      targetEndDate: format(form.targetEndDate, 'yyyy-MM-dd'),
      actualEndDate: form.status === 'Completed' && form.actualEndDate
        ? format(form.actualEndDate, 'yyyy-MM-dd') : null,
      status: form.status,
      skillsGained: form.skillsGained,
      languagesUsed: form.languagesUsed,
      certificateEarned: form.certificateEarned,
      certificateUrl: form.certificateEarned ? form.certificateUrl.trim() : undefined,
      color: form.color,
      notes: form.notes.trim() || undefined,
    };
    if (editingCourse) {
      updateCourse(editingCourse.id, data);
    } else {
      addCourse(data);
    }
    onClose();
  };

  const pct = form.totalLessons && Number(form.totalLessons) > 0
    ? Math.round((Number(form.completedLessons) / Number(form.totalLessons)) * 100)
    : 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.sheetTitle}>{editingCourse ? 'Edit Course' : 'Add Course'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#555555" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>

            {/* 1. Title */}
            <Label text="Course Title *" />
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="e.g. Google Cybersecurity Certificate"
              placeholderTextColor="#333333"
              value={form.title}
              onChangeText={v => set('title', v)}
            />
            {errors.title && <ErrText text={errors.title} />}

            {/* 2. Platform */}
            <Label text="Platform *" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              <View style={styles.chipRow}>
                {PLATFORMS.map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.chip, form.platform === p && styles.chipActive]}
                    onPress={() => set('platform', p)}
                  >
                    {getPlatformIcon(p, 12)}
                    <Text style={[styles.chipText, form.platform === p && styles.chipTextActive]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* 3. Instructor */}
            <Label text="Instructor" />
            <TextInput
              style={styles.input}
              placeholder="e.g. Angela Yu"
              placeholderTextColor="#333333"
              value={form.instructor}
              onChangeText={v => set('instructor', v)}
            />

            {/* 4. URL */}
            <Label text="Course URL" />
            <TextInput
              style={styles.input}
              placeholder="https://..."
              placeholderTextColor="#333333"
              value={form.url}
              onChangeText={v => set('url', v)}
              keyboardType="url"
              autoCapitalize="none"
            />

            {/* 5. Category */}
            <Label text="Category *" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              <View style={styles.chipRow}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, form.category === c && styles.chipActive]}
                    onPress={() => set('category', c)}
                  >
                    <Text style={[styles.chipText, form.category === c && styles.chipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* 6+7. Lessons */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Label text="Total Lessons *" />
                <TextInput
                  style={[styles.input, errors.totalLessons && styles.inputError]}
                  placeholder="e.g. 40"
                  placeholderTextColor="#333333"
                  value={form.totalLessons}
                  onChangeText={v => set('totalLessons', v)}
                  keyboardType="numeric"
                />
                {errors.totalLessons && <ErrText text={errors.totalLessons} />}
              </View>
              <View style={{ flex: 1 }}>
                <Label text="Completed *" />
                <TextInput
                  style={[styles.input, errors.completedLessons && styles.inputError]}
                  placeholder="e.g. 0"
                  placeholderTextColor="#333333"
                  value={form.completedLessons}
                  onChangeText={v => set('completedLessons', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Text style={styles.pctHint}>= {pct}% complete</Text>

            {/* 8. Start Date */}
            <Label text="Start Date *" />
            <TouchableOpacity style={styles.dateRow} onPress={() => setShowStartPicker(true)}>
              <Ionicons name="calendar" size={16} color="#9B59F5" />
              <Text style={styles.dateText}>{format(form.startDate, 'dd MMM yyyy')}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={form.startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, d) => { setShowStartPicker(false); if (d) set('startDate', d); }}
              />
            )}

            {/* 9. Target End Date */}
            <Label text="Target End Date *" />
            <TouchableOpacity
              style={[styles.dateRow, errors.targetEndDate && styles.inputError]}
              onPress={() => setShowEndPicker(true)}
            >
              <Ionicons name="calendar" size={16} color="#9B59F5" />
              <Text style={styles.dateText}>{format(form.targetEndDate, 'dd MMM yyyy')}</Text>
            </TouchableOpacity>
            {errors.targetEndDate && <ErrText text={errors.targetEndDate} />}
            {showEndPicker && (
              <DateTimePicker
                value={form.targetEndDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, d) => { setShowEndPicker(false); if (d) set('targetEndDate', d); }}
              />
            )}

            {/* 10. Status */}
            <Label text="Status *" />
            <View style={styles.segmented}>
              {STATUSES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.segment, form.status === s && styles.segmentActive]}
                  onPress={() => set('status', s)}
                >
                  <Text style={[styles.segmentText, form.status === s && styles.segmentTextActive]}>
                    {s === 'NotStarted' ? 'N/S' : s === 'InProgress' ? 'Active' : s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {form.status === 'Completed' && (
              <>
                <Label text="Actual End Date" />
                <TouchableOpacity style={styles.dateRow} onPress={() => setShowActualEndPicker(true)}>
                  <Ionicons name="calendar" size={16} color="#00FF88" />
                  <Text style={styles.dateText}>
                    {form.actualEndDate ? format(form.actualEndDate, 'dd MMM yyyy') : 'Select date'}
                  </Text>
                </TouchableOpacity>
                {showActualEndPicker && (
                  <DateTimePicker
                    value={form.actualEndDate ?? new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, d) => { setShowActualEndPicker(false); if (d) set('actualEndDate', d); }}
                  />
                )}
              </>
            )}

            {/* 11. Skills */}
            <Label text="Skills Gained" />
            <View style={styles.tagInputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Add a skill..."
                placeholderTextColor="#333333"
                value={form.skillInput}
                onChangeText={v => set('skillInput', v)}
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => {
                  const s = form.skillInput.trim();
                  if (s && !form.skillsGained.includes(s)) {
                    set('skillsGained', [...form.skillsGained, s]);
                  }
                  set('skillInput', '');
                }}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagWrap}>
              {form.skillsGained.map(sk => (
                <TouchableOpacity
                  key={sk}
                  style={styles.tag}
                  onPress={() => set('skillsGained', form.skillsGained.filter(x => x !== sk))}
                >
                  <Text style={styles.tagText}>{sk}</Text>
                  <Ionicons name="close" size={10} color="#9B59F5" />
                </TouchableOpacity>
              ))}
            </View>

            {/* 12. Languages */}
            <Label text="Languages / Tools" />
            <View style={styles.tagInputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Add a language or tool..."
                placeholderTextColor="#333333"
                value={form.langInput}
                onChangeText={v => set('langInput', v)}
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => {
                  const l = form.langInput.trim();
                  if (l && !form.languagesUsed.includes(l)) {
                    set('languagesUsed', [...form.languagesUsed, l]);
                  }
                  set('langInput', '');
                }}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagWrap}>
              {form.languagesUsed.map(l => (
                <TouchableOpacity
                  key={l}
                  style={[styles.tag, { borderColor: '#00FFFF44' }]}
                  onPress={() => set('languagesUsed', form.languagesUsed.filter(x => x !== l))}
                >
                  <Text style={[styles.tagText, { color: '#00FFFF' }]}>{l}</Text>
                  <Ionicons name="close" size={10} color="#00FFFF" />
                </TouchableOpacity>
              ))}
            </View>

            {/* 13. Certificate */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Certificate Earned</Text>
              <Switch
                value={form.certificateEarned}
                onValueChange={v => set('certificateEarned', v)}
                trackColor={{ false: '#1A1A1A', true: '#F39C12' }}
                thumbColor={form.certificateEarned ? '#FFFFFF' : '#555555'}
              />
            </View>
            {form.certificateEarned && (
              <>
                <Label text="Certificate URL" />
                <TextInput
                  style={styles.input}
                  placeholder="https://..."
                  placeholderTextColor="#333333"
                  value={form.certificateUrl}
                  onChangeText={v => set('certificateUrl', v)}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </>
            )}

            {/* 14. Color */}
            <Label text="Calendar Color" />
            <View style={styles.colorRow}>
              {COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c },
                    form.color === c && styles.colorCircleSelected,
                  ]}
                  onPress={() => set('color', c)}
                />
              ))}
            </View>

            {/* 15. Notes */}
            <Label text="Notes" />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any notes about this course..."
              placeholderTextColor="#333333"
              value={form.notes}
              onChangeText={v => set('notes', v.slice(0, 500))}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{form.notes.length} / 500</Text>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const Label: React.FC<{ text: string }> = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);
const ErrText: React.FC<{ text: string }> = ({ text }) => (
  <Text style={styles.errText}>{text}</Text>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#0D0D0D', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '92%',
  },
  handle: {
    width: 40, height: 4, backgroundColor: '#333333', borderRadius: 2,
    alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  formContent: { paddingHorizontal: 20 },
  label: { fontSize: 12, color: '#555555', marginBottom: 6, marginTop: 14, fontWeight: '600', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#1A1A1A', borderRadius: 8, padding: 12,
    color: '#FFFFFF', fontSize: 14, borderWidth: 1, borderColor: '#2A2A2A',
  },
  inputError: { borderColor: '#FF003C' },
  errText: { fontSize: 11, color: '#FF003C', marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  pctHint: { fontSize: 12, color: '#9B59F5', marginTop: 6 },
  dateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#1A1A1A', borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  dateText: { color: '#FFFFFF', fontSize: 14 },
  segmented: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 10, overflow: 'hidden' },
  segment: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  segmentActive: { backgroundColor: '#9B59F5' },
  segmentText: { fontSize: 11, color: '#555555', fontWeight: '600' },
  segmentTextActive: { color: '#000000' },
  chipScroll: { marginBottom: 4 },
  chipRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A',
  },
  chipActive: { backgroundColor: '#9B59F5', borderColor: '#9B59F5' },
  chipText: { fontSize: 11, color: '#555555' },
  chipTextActive: { color: '#000000', fontWeight: '700' },
  tagInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addBtn: { backgroundColor: '#9B59F520', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 },
  addBtnText: { color: '#9B59F5', fontWeight: '700', fontSize: 13 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: '#9B59F544', backgroundColor: '#9B59F510',
  },
  tagText: { fontSize: 12, color: '#9B59F5' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  switchLabel: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  colorCircle: { width: 28, height: 28, borderRadius: 14 },
  colorCircleSelected: { borderWidth: 2, borderColor: '#FFFFFF', transform: [{ scale: 1.1 }] },
  textArea: { minHeight: 80, paddingTop: 12 },
  charCount: { fontSize: 11, color: '#333333', textAlign: 'right', marginTop: 4 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  cancelText: { color: '#555555', fontSize: 14, fontWeight: '600' },
  saveBtn: { flex: 2, backgroundColor: '#9B59F5', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

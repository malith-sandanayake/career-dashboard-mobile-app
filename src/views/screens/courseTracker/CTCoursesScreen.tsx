// src/views/screens/courseTracker/CTCoursesScreen.tsx

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActionSheetIOS, Alert, Platform, Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCourses } from '../../../context/CourseContext';
import { Course, CourseStatus, getCompletionPercent } from '../../../models/Course';
import { CTAddEditCourseModal } from './CTAddEditCourseModal';
import { getPlatformIcon } from './shared/PlatformIcon';

const FILTERS: Array<CourseStatus | 'All'> = ['All', 'InProgress', 'Completed', 'Paused', 'NotStarted'];
const ITEM_HEIGHT = 138;

const StatusChip: React.FC<{ status: CourseStatus }> = ({ status }) => {
  const cfg: Record<CourseStatus, { icon: string; label: string; color: string }> = {
    InProgress:  { icon: 'time-outline',           label: 'Active',    color: '#00FFFF' },
    Completed:   { icon: 'checkmark-circle',        label: 'Done',      color: '#00FF88' },
    Paused:      { icon: 'pause-circle-outline',    label: 'Paused',    color: '#F39C12' },
    NotStarted:  { icon: 'ellipse-outline',         label: 'Not Started', color: '#555555' },
  };
  const { icon, label, color } = cfg[status];
  return (
    <View style={[styles.statusChip, { backgroundColor: color + '26' }]}>
      <Ionicons name={icon as any} size={14} color={color} />
      <Text style={[styles.statusChipText, { color }]}>{label}</Text>
    </View>
  );
};

const CourseProgressBar: React.FC<{ percent: number; color: string }> = ({ percent, color }) => {
  const width = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(width, { toValue: percent, duration: 600, useNativeDriver: false }).start();
  }, [percent]);
  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[styles.progressFill, {
          backgroundColor: color,
          width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
        }]}
      />
    </View>
  );
};

export const CTCoursesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { courses, deleteCourse, updateCourse, markCompleted } = useCourses();
  const [filter, setFilter] = useState<CourseStatus | 'All'>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const fabRotate = useRef(new Animated.Value(0)).current;

  const filtered = filter === 'All' ? courses : courses.filter(c => c.status === filter);

  const openAdd = () => {
    setEditingCourse(null);
    Animated.timing(fabRotate, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setModalVisible(true);
  };

  const closeModal = () => {
    Animated.timing(fabRotate, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    setModalVisible(false);
    setEditingCourse(null);
  };

  const handleLongPress = useCallback((course: Course) => {
    const options = ['Edit', 'Mark Complete', 'Mark Paused', 'Delete', 'Cancel'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, destructiveButtonIndex: 3, cancelButtonIndex: 4 },
        idx => {
          if (idx === 0) { setEditingCourse(course); setModalVisible(true); }
          else if (idx === 1) markCompleted(course.id);
          else if (idx === 2) updateCourse(course.id, { status: 'Paused' });
          else if (idx === 3) {
            Alert.alert('Delete', `Delete "${course.title}"?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deleteCourse(course.id) },
            ]);
          }
        }
      );
    } else {
      Alert.alert(course.title, undefined, [
        { text: 'Edit', onPress: () => { setEditingCourse(course); setModalVisible(true); } },
        { text: 'Mark Complete', onPress: () => markCompleted(course.id) },
        { text: 'Mark Paused', onPress: () => updateCourse(course.id, { status: 'Paused' }) },
        { text: 'Delete', style: 'destructive', onPress: () =>
          Alert.alert('Delete', `Delete "${course.title}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteCourse(course.id) },
          ])
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }, [deleteCourse, markCompleted, updateCourse]);

  const renderItem = useCallback(({ item }: { item: Course }) => {
    const pct = getCompletionPercent(item);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CourseDetail', { course: item })}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={400}
      >
        <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardRow1}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <StatusChip status={item.status} />
          </View>
          <View style={styles.cardRow2}>
            {getPlatformIcon(item.platform)}
            <Text style={styles.platformText}>{item.platform}</Text>
            {item.instructor ? <Text style={styles.instructorText}> · {item.instructor}</Text> : null}
          </View>
          <CourseProgressBar percent={pct} color={item.color} />
          <View style={styles.cardRow4}>
            <View style={styles.lessonRow}>
              <Ionicons name="book-outline" size={11} color="#555555" />
              <Text style={styles.lessonText}>{item.completedLessons}/{item.totalLessons} lessons</Text>
            </View>
            <Text style={[styles.pctText, { color: item.color }]}>{pct}%</Text>
          </View>
          <View style={styles.cardRow5}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <View style={styles.dateRange}>
              <Ionicons name="calendar-outline" size={10} color="#333333" />
              <Text style={styles.dateRangeText}>
                {item.startDate.slice(5).replace('-', '/')} → {item.targetEndDate.slice(0, 7)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation, handleLongPress]);

  const fabRotateDeg = fabRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <View style={styles.container}>
      {/* Header + filters */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY COURSES</Text>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                {f === 'All' ? 'All' : f === 'InProgress' ? 'In Progress'
                  : f === 'NotStarted' ? 'Not Started' : f}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Course list */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="book-open-variant" size={64} color="#1A1A1A" />
          <Text style={styles.emptyTitle}>No courses here yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to add your first course</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openAdd} activeOpacity={0.8}>
        <Animated.View style={{ transform: [{ rotate: fabRotateDeg }] }}>
          <Ionicons name="add-circle" size={60} color="#9B59F5" />
        </Animated.View>
      </TouchableOpacity>

      <CTAddEditCourseModal
        visible={modalVisible}
        onClose={closeModal}
        editingCourse={editingCourse}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  filterScroll: { marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#0D0D0D', borderWidth: 1, borderColor: '#1A1A1A', marginRight: 8,
  },
  filterChipActive: { backgroundColor: '#9B59F5', borderColor: '#9B59F5' },
  filterChipText: { fontSize: 13, color: '#555555', fontWeight: '600' },
  filterChipTextActive: { color: '#000000' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    height: ITEM_HEIGHT, backgroundColor: '#0D0D0D', borderRadius: 12,
    marginBottom: 8, overflow: 'hidden', flexDirection: 'row',
  },
  cardAccent: { width: 4 },
  cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardRow1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { flex: 1, fontSize: 14, color: '#FFFFFF', fontWeight: '600', marginRight: 8 },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  statusChipText: { fontSize: 11, fontWeight: '600' },
  cardRow2: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  platformText: { fontSize: 11, color: '#555555' },
  instructorText: { fontSize: 11, color: '#333333' },
  progressTrack: { height: 4, backgroundColor: '#1A1A1A', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  cardRow4: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonText: { fontSize: 11, color: '#555555' },
  pctText: { fontSize: 11, fontWeight: '700' },
  cardRow5: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryText: { fontSize: 10, color: '#333333' },
  dateRange: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dateRangeText: { fontSize: 10, color: '#333333' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 16, color: '#333333', fontWeight: '600' },
  emptySubtitle: { fontSize: 13, color: '#555555' },
  fab: { position: 'absolute', bottom: 24, right: 24 },
});

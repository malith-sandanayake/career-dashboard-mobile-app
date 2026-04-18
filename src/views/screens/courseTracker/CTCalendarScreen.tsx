// src/views/screens/courseTracker/CTCalendarScreen.tsx

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import Svg, { Rect, Line, Text as SvgText, Circle } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCourses } from '../../../context/CourseContext';
import { Course, getCompletionPercent } from '../../../models/Course';
import { useCalendar, ZoomLevel } from '../../../viewmodels/useCalendar';

const ZOOM_OPTIONS: ZoomLevel[] = ['1 Mo', '3 Mo', '6 Mo', '1 Yr'];
const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 40;
const LABEL_WIDTH = 120;

export const CTCalendarScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { courses } = useCourses();
  const [zoom, setZoom] = useState<ZoomLevel>('3 Mo');
  const layout = useCalendar(courses, zoom);
  const progressAnims = useRef<Animated.Value[]>([]);
  const didAnimate = useRef(false);

  // Init animated values
  if (progressAnims.current.length !== courses.length) {
    progressAnims.current = courses.map((_, i) =>
      progressAnims.current[i] ?? new Animated.Value(0)
    );
  }

  const runAnimations = useCallback(() => {
    if (didAnimate.current) return;
    didAnimate.current = true;
    courses.forEach((c, i) => {
      const pct = getCompletionPercent(c);
      Animated.timing(progressAnims.current[i], {
        toValue: pct / 100,
        duration: 600,
        delay: i * 80,
        useNativeDriver: false,
      }).start();
    });
  }, [courses]);

  if (courses.length === 0) {
    return (
      <View style={styles.empty}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={64} color="#1A1A1A" />
        <Text style={styles.emptyTitle}>Add courses to see your timeline</Text>
      </View>
    );
  }

  const totalSvgHeight = courses.length * ROW_HEIGHT + 20;

  return (
    <View style={styles.container}>
      {/* Zoom control */}
      <View style={styles.zoomBar}>
        {ZOOM_OPTIONS.map(z => (
          <TouchableOpacity
            key={z}
            style={[styles.zoomBtn, zoom === z && styles.zoomBtnActive]}
            onPress={() => { setZoom(z); didAnimate.current = false; }}
          >
            <Text style={[styles.zoomText, zoom === z && styles.zoomTextActive]}>{z}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.chartArea}>
        {/* Left sticky labels */}
        <View style={styles.labelCol}>
          <View style={styles.labelHeader}>
            <Text style={styles.labelHeaderText}>COURSE</Text>
          </View>
          {courses.map(c => (
            <TouchableOpacity
              key={c.id}
              style={styles.labelRow}
              onPress={() => navigation.navigate('CourseDetail', { course: c })}
            >
              <View style={[styles.labelDot, { backgroundColor: c.color }]} />
              <Text style={styles.labelText} numberOfLines={2}>{c.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Scrollable timeline */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          onLayout={runAnimations}
          style={styles.timelineScroll}
        >
          <View>
            {/* Month header */}
            <View style={[styles.timelineHeader, { width: Math.max(layout.timelineWidth, 300) }]}>
              {layout.monthLabels.map((m, i) => (
                <Text
                  key={i}
                  style={[styles.monthLabel, { left: m.x + 4 }]}
                  numberOfLines={1}
                >
                  {m.label}
                </Text>
              ))}
            </View>

            {/* SVG timeline */}
            <Svg width={Math.max(layout.timelineWidth, 300)} height={totalSvgHeight}>
              {/* Grid lines */}
              {layout.monthLabels.map((m, i) => (
                <Line
                  key={i}
                  x1={m.x} y1={0} x2={m.x} y2={totalSvgHeight}
                  stroke="#0D0D0D" strokeWidth={0.5}
                />
              ))}

              {/* Course bars */}
              {courses.map((c, idx) => {
                const bx = layout.barX(c);
                const bw = layout.barWidth(c);
                const by = idx * ROW_HEIGHT + 12;
                const pct = getCompletionPercent(c);
                const isOverdue = new Date() > new Date(c.targetEndDate) && c.status !== 'Completed';

                return (
                  <React.Fragment key={c.id}>
                    {/* Track */}
                    <Rect x={bx} y={by} width={bw} height={28} fill="#0D0D0D" rx={6} />
                    {/* Progress fill — static based on pct since SVG animation is complex */}
                    <Rect
                      x={bx} y={by}
                      width={Math.max((bw * pct) / 100, pct > 0 ? 8 : 0)}
                      height={28} fill={c.color} rx={6}
                    />
                    {/* Outline */}
                    <Rect
                      x={bx} y={by} width={bw} height={28} fill="none"
                      stroke={isOverdue ? '#FF003C' : c.color}
                      strokeWidth={isOverdue ? 2 : 1} rx={6}
                    />
                    {/* Label */}
                    {bw > 60 && (
                      <SvgText
                        x={bx + bw / 2} y={by + 18}
                        fill="#000000" fontSize={9}
                        textAnchor="middle"
                      >
                        {c.completedLessons}/{c.totalLessons}
                      </SvgText>
                    )}
                    {/* Completion marker */}
                    {c.status === 'Completed' && (
                      <>
                        <Circle cx={bx + bw} cy={by + 14} r={8} fill="#00FF88" />
                        <SvgText x={bx + bw} y={by + 19} fill="#000000" fontSize={10} textAnchor="middle">✓</SvgText>
                      </>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Today line */}
              {layout.todayX >= 0 && layout.todayX <= layout.timelineWidth && (
                <>
                  <Line
                    x1={layout.todayX} y1={0}
                    x2={layout.todayX} y2={totalSvgHeight}
                    stroke="#00FFFF" strokeWidth={1}
                    strokeDasharray="4 2"
                  />
                  <SvgText
                    x={layout.todayX + 4} y={14}
                    fill="#00FFFF" fontSize={9}
                  >
                    NOW
                  </SvgText>
                </>
              )}
            </Svg>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 16, color: '#333333', fontWeight: '600' },
  zoomBar: {
    flexDirection: 'row', backgroundColor: '#0D0D0D',
    margin: 16, borderRadius: 10, overflow: 'hidden',
  },
  zoomBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  zoomBtnActive: { backgroundColor: '#9B59F5' },
  zoomText: { fontSize: 12, color: '#555555', fontWeight: '700' },
  zoomTextActive: { color: '#FFFFFF' },
  chartArea: { flex: 1, flexDirection: 'row' },
  labelCol: { width: LABEL_WIDTH, backgroundColor: '#000000' },
  labelHeader: {
    height: HEADER_HEIGHT, justifyContent: 'flex-end', paddingBottom: 8,
    paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  labelHeaderText: { fontSize: 10, color: '#333333', fontWeight: '700', letterSpacing: 1 },
  labelRow: {
    height: ROW_HEIGHT, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#0D0D0D', gap: 6,
  },
  labelDot: { width: 6, height: 6, borderRadius: 3 },
  labelText: { flex: 1, fontSize: 10, color: '#CCCCCC', lineHeight: 14 },
  timelineScroll: { flex: 1 },
  timelineHeader: {
    height: HEADER_HEIGHT, position: 'relative',
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  monthLabel: {
    position: 'absolute', bottom: 8,
    fontSize: 10, color: '#555555', fontWeight: '700',
  },
});

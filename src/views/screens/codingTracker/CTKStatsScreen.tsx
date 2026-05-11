import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, addDays, subWeeks } from 'date-fns';
import { useCoding } from '../../../context/CodingContext';

const HEATMAP_COLORS = ['#1A1A1A', '#064e3b', '#065f46', '#059669', '#00FF88'];
const HEATMAP_CELL_SIZE = 12;
const HEATMAP_GAP = 2;
const HEATMAP_WEEKS = 12;

export const CTKStatsScreen: React.FC = () => {
  const { dailyLogs, sessions, topLanguages, topProjects } = useCoding();
  const { width: screenWidth } = useWindowDimensions();
  const [hoverCell, setHoverCell] = React.useState<string | null>(null);

  const totalHours = useMemo(
    () => Math.round(sessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60),
    [sessions]
  );

  const totalSessions = sessions.length;
  const languagesCount = Array.from(new Set(sessions.map((s) => s.language))).length;

  const allLanguagesTotal = useMemo(() => {
    const map = new Map<string, number>();
    for (const session of sessions) {
      map.set(session.language, (map.get(session.language) ?? 0) + session.durationMinutes);
    }
    return Array.from(map.entries())
      .map(([name, minutes]) => ({ name, minutes }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [sessions]);

  const allProjectsTotal = useMemo(() => {
    const map = new Map<string, number>();
    for (const session of sessions) {
      map.set(session.project, (map.get(session.project) ?? 0) + session.durationMinutes);
    }
    return Array.from(map.entries())
      .map(([name, minutes]) => ({ name, minutes }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [sessions]);

  const heatmapData = useMemo(() => {
    const startDate = subWeeks(new Date(), HEATMAP_WEEKS);
    const cells: Array<{ date: string; minutes: number; color: string }> = [];

    for (let i = 0; i < HEATMAP_WEEKS * 7; i += 1) {
      const date = format(addDays(startDate, i), 'yyyy-MM-dd');
      const log = dailyLogs[date];
      const minutes = log?.totalMinutes ?? 0;

      let colorIndex = 0;
      if (minutes > 90) {
        colorIndex = 4;
      } else if (minutes > 60) {
        colorIndex = 3;
      } else if (minutes > 30) {
        colorIndex = 2;
      } else if (minutes > 0) {
        colorIndex = 1;
      }

      cells.push({
        date,
        minutes,
        color: HEATMAP_COLORS[colorIndex],
      });
    }

    return cells;
  }, [dailyLogs]);

  const heatmapWidth = HEATMAP_WEEKS * (HEATMAP_CELL_SIZE + HEATMAP_GAP) + HEATMAP_GAP;

  const allLanguagesTotalMinutes = Math.max(...allLanguagesTotal.map((l) => l.minutes), 1);
  const allProjectsTotalMinutes = Math.max(...allProjectsTotal.map((p) => p.minutes), 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CODING TRACKER</Text>
        <Text style={styles.title}>Stats</Text>
        <Text style={styles.subtitle}>All-time insights and patterns.</Text>
      </View>

      {/* Summary pills */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryPill}>
          <Ionicons name="time" size={16} color="#00FF88" />
          <View>
            <Text style={styles.summaryValue}>{totalHours}h</Text>
            <Text style={styles.summaryLabel}>Total Hours</Text>
          </View>
        </View>
        <View style={styles.summaryPill}>
          <MaterialCommunityIcons name="code-tags" size={16} color="#00FFFF" />
          <View>
            <Text style={styles.summaryValue}>{totalSessions}</Text>
            <Text style={styles.summaryLabel}>Sessions</Text>
          </View>
        </View>
        <View style={styles.summaryPill}>
          <MaterialCommunityIcons name="file-code-outline" size={16} color="#9B59F5" />
          <View>
            <Text style={styles.summaryValue}>{languagesCount}</Text>
            <Text style={styles.summaryLabel}>Languages</Text>
          </View>
        </View>
      </View>

      {/* Heatmap */}
      <SectionHeader label="ACTIVITY" icon={<Ionicons name="calendar" size={16} color="#00FF88" />} />
      <View style={styles.heatmapContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Svg width={heatmapWidth} height={100}>
            {heatmapData.map((cell, index) => {
              const week = Math.floor(index / 7);
              const dayOfWeek = index % 7;
              const x = week * (HEATMAP_CELL_SIZE + HEATMAP_GAP) + HEATMAP_GAP;
              const y = dayOfWeek * (HEATMAP_CELL_SIZE + HEATMAP_GAP) + HEATMAP_GAP;

              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={HEATMAP_CELL_SIZE}
                  height={HEATMAP_CELL_SIZE}
                  fill={cell.color}
                  rx={2}
                  onPress={() => setHoverCell(cell.date)}
                />
              );
            })}
          </Svg>
        </ScrollView>
        <Text style={styles.heatmapLegend}>Intensity: 0m · 1–29m · 30–59m · 60–89m · 90m+</Text>
      </View>

      {/* Languages breakdown */}
      <SectionHeader label="LANGUAGES" icon={<MaterialCommunityIcons name="code-tags" size={16} color="#00FF88" />} />
      {allLanguagesTotal.length === 0 ? (
        <Text style={styles.emptyText}>No data yet</Text>
      ) : (
        allLanguagesTotal.map((item, index) => {
          const barWidth = (item.minutes / allLanguagesTotalMinutes) * 100;
          const percent = Math.round((item.minutes / (totalHours * 60)) * 100);
          return (
            <View key={index} style={styles.breakdownRow}>
              <Text style={styles.breakdownName}>{item.name}</Text>
              <View style={styles.breakdownBarBg}>
                <View
                  style={[
                    styles.breakdownBarFill,
                    { width: `${barWidth}%`, backgroundColor: '#00FF88' },
                  ]}
                />
              </View>
              <Text style={styles.breakdownPercent}>{percent}%</Text>
            </View>
          );
        })
      )}

      {/* Projects breakdown */}
      <SectionHeader label="PROJECTS" icon={<MaterialCommunityIcons name="folder-outline" size={16} color="#00FF88" />} />
      {allProjectsTotal.length === 0 ? (
        <Text style={styles.emptyText}>No data yet</Text>
      ) : (
        allProjectsTotal.map((item, index) => {
          const barWidth = (item.minutes / allProjectsTotalMinutes) * 100;
          const percent = Math.round((item.minutes / (totalHours * 60)) * 100);
          return (
            <View key={index} style={styles.breakdownRow}>
              <Text style={styles.breakdownName}>{item.name}</Text>
              <View style={styles.breakdownBarBg}>
                <View
                  style={[
                    styles.breakdownBarFill,
                    { width: `${barWidth}%`, backgroundColor: '#9B59F5' },
                  ]}
                />
              </View>
              <Text style={styles.breakdownPercent}>{percent}%</Text>
            </View>
          );
        })
      )}

      <View style={{ height: 32 }} />

      {/* Hover tooltip modal */}
      <Modal
        visible={!!hoverCell}
        transparent
        animationType="fade"
        onRequestClose={() => setHoverCell(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setHoverCell(null)}
        >
          {hoverCell ? (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipDate}>
                {format(new Date(hoverCell + 'T00:00:00'), 'EEE, MMM dd')}
              </Text>
              <Text style={styles.tooltipMinutes}>
                {dailyLogs[hoverCell]?.totalMinutes ?? 0} minutes
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const SectionHeader: React.FC<{ label: string; icon?: React.ReactNode }> = ({ label, icon }) => (
  <View style={styles.sectionHeader}>
    {icon}
    <Text style={styles.sectionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16 },

  hero: { marginBottom: 18 },
  eyebrow: { fontSize: 9, fontWeight: '700', letterSpacing: 3, color: '#00FF88', marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { marginTop: 4, fontSize: 13, color: '#555555' },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  summaryPill: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryValue: { fontSize: 16, fontWeight: '700', color: '#00FF88' },
  summaryLabel: { fontSize: 10, color: '#555555', marginTop: 2 },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#555555', letterSpacing: 1.5 },

  heatmapContainer: {
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  heatmapLegend: {
    fontSize: 9,
    color: '#555555',
    textAlign: 'center',
    marginTop: 10,
  },

  emptyText: { fontSize: 12, color: '#555555', textAlign: 'center', marginVertical: 8 },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },
  breakdownName: { width: 100, fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  breakdownBarBg: { flex: 1, height: 6, backgroundColor: '#1A1A1A', borderRadius: 3, overflow: 'hidden' },
  breakdownBarFill: { height: '100%' },
  breakdownPercent: { width: 40, textAlign: 'right', fontSize: 11, fontWeight: '700', color: '#555555' },

  modalOverlay: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'center', alignItems: 'center' },
  tooltip: {
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  tooltipDate: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  tooltipMinutes: { fontSize: 11, color: '#00FF88', marginTop: 4 },
});

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCoding } from '../../../context/CodingContext';
import { GoalRing } from './shared/GoalRing';

const PRESET_LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'C',
  'C++',
  'Java',
  'Bash',
  'SQL',
  'HTML/CSS',
  'Other',
];

const formatElapsedTime = (elapsedMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
};

export const CTKTimerScreen: React.FC = () => {
  const {
    isTimerRunning,
    timerStartTime,
    currentLanguage,
    currentProject,
    setCurrentLanguage,
    setCurrentProject,
    startTimer,
    stopTimer,
    todayMinutes,
    goalProgress,
    settings,
    allLanguages,
    allProjects,
  } = useCoding();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isTimerRunning || !timerStartTime) {
      setNow(Date.now());
      return undefined;
    }

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timerStartTime]);

  const elapsedMs = isTimerRunning && timerStartTime ? now - timerStartTime.getTime() : 0;
  const elapsedLabel = formatElapsedTime(elapsedMs);

  const languageOptions = useMemo(() => {
    return Array.from(new Set([...PRESET_LANGUAGES, ...allLanguages]));
  }, [allLanguages]);

  const projectOptions = useMemo(() => {
    const values = [...allProjects];
    if (currentProject.trim()) {
      values.unshift(currentProject.trim());
    }
    return Array.from(new Set(values.filter(Boolean)));
  }, [allProjects, currentProject]);

  const handleStartStop = () => {
    if (isTimerRunning) {
      void stopTimer();
      return;
    }
    startTimer(currentLanguage, currentProject);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CODING TRACKER</Text>
        <Text style={styles.title}>Timer</Text>
        <Text style={styles.subtitle}>Track sessions by language and project.</Text>
      </View>

      <View style={styles.timerCard}>
        <Text style={[styles.timerValue, !isTimerRunning && styles.timerValueIdle, isTimerRunning && styles.timerValueActive]}>
          {elapsedLabel}
        </Text>
        <Text style={styles.timerHint}>{isTimerRunning ? 'Session running' : 'Timer stopped'}</Text>

        <View style={styles.goalWrap}>
          <GoalRing
            minutes={todayMinutes}
            goalMinutes={settings.dailyGoalMinutes}
            accentColor="#00FF88"
            size={176}
            strokeWidth={10}
          />
        </View>

        {goalProgress >= 100 ? (
          <View style={styles.goalMetBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#000000" />
            <Text style={styles.goalMetText}>Daily goal met</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Language</Text>
          <Text style={styles.sectionMeta}>Tap to switch</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {languageOptions.map((language) => (
            <TouchableOpacity
              key={language}
              style={[
                styles.chip,
                currentLanguage === language && styles.chipActive,
              ]}
              onPress={() => setCurrentLanguage(language)}
            >
              <Text style={[styles.chipText, currentLanguage === language && styles.chipTextActive]}>
                {language}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Project</Text>
          <Text style={styles.sectionMeta}>Chip or type a name</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {projectOptions.map((project) => (
            <TouchableOpacity
              key={project}
              style={[
                styles.chip,
                currentProject === project && styles.chipActivePurple,
              ]}
              onPress={() => setCurrentProject(project)}
            >
              <Text style={[styles.chipText, currentProject === project && styles.chipTextActive]}>
                {project}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput
          value={currentProject}
          onChangeText={setCurrentProject}
          placeholder="Add custom project"
          placeholderTextColor="#555555"
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.actionButton, isTimerRunning ? styles.stopButton : styles.startButton]}
        onPress={handleStartStop}
      >
        <MaterialCommunityIcons
          name={isTimerRunning ? 'stop-circle-outline' : 'play-circle-outline'}
          size={22}
          color={isTimerRunning ? '#FFFFFF' : '#000000'}
        />
        <Text style={[styles.actionText, isTimerRunning ? styles.stopText : styles.startText]}>
          {isTimerRunning ? 'STOP' : 'START'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 16,
  },
  hero: {
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#00FF88',
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#555555',
  },
  timerCard: {
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  timerValue: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timerValueActive: {
    color: '#00FF88',
  },
  timerValueIdle: {
    color: '#555555',
  },
  timerHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#555555',
  },
  goalWrap: {
    marginTop: 20,
  },
  goalMetBanner: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00FF8820',
    borderColor: '#00FF88',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  goalMetText: {
    color: '#00FF88',
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionMeta: {
    fontSize: 11,
    color: '#555555',
  },
  chipRow: {
    gap: 8,
    paddingRight: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: '#00FF88',
    borderColor: '#00FF88',
  },
  chipActivePurple: {
    backgroundColor: '#9B59F5',
    borderColor: '#9B59F5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
  },
  chipTextActive: {
    color: '#000000',
  },
  input: {
    marginTop: 10,
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 999,
    paddingVertical: 16,
  },
  startButton: {
    backgroundColor: '#00FF88',
  },
  stopButton: {
    backgroundColor: '#FF003C',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  startText: {
    color: '#000000',
  },
  stopText: {
    color: '#FFFFFF',
  },
});

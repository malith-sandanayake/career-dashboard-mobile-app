import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useCoding } from '../../../context/CodingContext';

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins}m`;
  }
  return `${hours}h ${mins}m`;
};

export const CTKHistoryScreen: React.FC = () => {
  const { recentSessions, deleteSession } = useCoding();

  const handleDelete = useCallback(
    (id: string, language: string, project: string) => {
      Alert.alert(
        'Delete Session',
        `Delete ${language} session on ${project}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteSession(id);
            },
          },
        ]
      );
    },
    [deleteSession]
  );

  const renderItem = useCallback(
    ({ item }: { item: typeof recentSessions[number] }) => {
      const sessionDate = format(parseISO(item.startedAt), 'dd MMM · HH:mm');
      return (
        <TouchableOpacity
          style={styles.row}
          onLongPress={() => handleDelete(item.id, item.language, item.project)}
        >
          <View style={[styles.languageChip, { backgroundColor: '#9B59F520' }]}>
            <Text style={styles.languageChipText}>{item.language.slice(0, 3)}</Text>
          </View>
          <View style={styles.rowContent}>
            <View style={styles.rowTop}>
              <Text style={styles.projectText}>{item.project}</Text>
              <Text style={styles.durationText}>{formatDuration(item.durationMinutes)}</Text>
            </View>
            <Text style={styles.dateText}>{sessionDate}</Text>
            {item.notes ? (
              <Text style={styles.notesText} numberOfLines={1}>
                {item.notes}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    },
    [handleDelete]
  );

  return (
    <View style={styles.container}>
      {recentSessions.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="ghost-outline" size={48} color="#1A1A1A" />
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptySubtitle}>Start the timer to log your first session</Text>
        </View>
      ) : (
        <FlatList
          data={recentSessions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  listContent: { paddingHorizontal: 16, paddingVertical: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  languageChip: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9B59F5',
  },
  rowContent: { flex: 1 },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  projectText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  durationText: { fontSize: 12, fontWeight: '700', color: '#00FF88' },
  dateText: { fontSize: 11, color: '#555555', marginTop: 2 },
  notesText: { fontSize: 11, color: '#333333', marginTop: 4, fontStyle: 'italic' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: { fontSize: 16, color: '#333333', fontWeight: '600' },
  emptySubtitle: { fontSize: 12, color: '#555555', textAlign: 'center', maxWidth: 220 },
});

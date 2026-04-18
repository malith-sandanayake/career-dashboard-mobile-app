import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useGrades } from '../../context/GradeContext';
import { useTheme } from '../../context/ThemeContext';
import { BottomNavBar } from '../components/BottomNavBar';

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { targetGPA, setTargetGPA, resetAll } = useGrades();
  const { theme, colors, toggleTheme } = useTheme();
  const [newTarget, setNewTarget] = useState(targetGPA.toString());

  const handleUpdateTarget = () => {
    const target = parseFloat(newTarget);
    if (!isNaN(target) && target > 0 && target <= 4.0) {
      setTargetGPA(target);
      Alert.alert('Updated', `Target GPA set to ${target.toFixed(1)}`);
    } else {
      Alert.alert('Invalid', 'Please enter a value between 0 and 4.0');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Grades',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => resetAll(), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerLabel, { color: colors.accent }]}>ACADEMIC COMMAND CENTER</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>PROFILE</Text>
          <View style={[styles.userRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}>
              <Text style={[styles.avatarText, { color: colors.accent }]}>
                {user?.displayName ? user.displayName[0].toUpperCase() : '?'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.displayName || (user?.isAnonymous ? 'Anonymous User' : 'User')}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>
                {user?.email || (user?.isAnonymous ? 'Guest Session' : 'No email')}
              </Text>
              <Text style={[styles.userId, { color: colors.textMuted }]}>
                UID: {user?.uid?.slice(0, 12)}...
              </Text>
            </View>
          </View>
        </View>

        {/* Target GPA Section */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>TARGET GPA</Text>
          <Text style={[styles.currentValue, { color: colors.accent }]}>Current: {targetGPA.toFixed(1)}</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              value={newTarget}
              onChangeText={setNewTarget}
              keyboardType="decimal-pad"
              placeholder="0.0 – 4.0"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.accent }]}
              onPress={handleUpdateTarget}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>UPDATE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Toggle */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APPEARANCE</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Theme</Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                {theme === 'dark' ? 'Dark mode active' : 'Light mode active'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.themeToggle, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}
              onPress={toggleTheme}
            >
              <Text style={[styles.themeToggleText, { color: colors.accent }]}>
                {theme === 'dark' ? '☀ LIGHT' : '☾ DARK'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>DANGER ZONE</Text>
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: colors.danger + '18', borderColor: colors.danger + '44' }]}
            onPress={handleReset}
          >
            <Text style={[styles.dangerButtonText, { color: colors.danger }]}>RESET ALL GRADES</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={logout}
        >
          <Text style={[styles.logoutButtonText, { color: colors.textSub }]}>LOGOUT</Text>
        </TouchableOpacity>

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
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  userEmail: { fontSize: 11, marginBottom: 2 },
  userId: { fontSize: 10 },
  currentValue: { fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  inputGroup: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  buttonText: { fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
  settingDesc: { fontSize: 11 },
  themeToggle: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeToggleText: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  dangerButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  dangerButtonText: { fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  logoutButton: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  logoutButtonText: { fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  bottomPad: { height: 8 },
});

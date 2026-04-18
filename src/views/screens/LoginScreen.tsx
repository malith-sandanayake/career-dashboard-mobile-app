import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const LoginScreen: React.FC = () => {
  const { loginAnonymously, loading } = useAuth();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>

        <Text style={[styles.eyebrow, { color: colors.accent }]}>ACADEMIC COMMAND CENTER</Text>
        <Text style={[styles.title, { color: colors.text }]}>INIT</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Biometric Linkage Required</Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.accentBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.textSub }]}>SYSTEM STATUS</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.statusText, { color: colors.textSub }]}>Firebase connected</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.statusText, { color: colors.textSub }]}>Anonymous auth enabled</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.textMuted }]} />
            <Text style={[styles.statusText, { color: colors.textMuted }]}>Awaiting login...</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={loginAnonymously}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.background }]}>ACCESS TERMINAL</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.footer, { color: colors.textMuted }]}>
          Optimized for Galaxy A55 · Career Dashboard
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  divider: { width: '100%', height: 1, marginBottom: 24 },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 28,
    gap: 10,
  },
  cardTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12 },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: { fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 },
  footer: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
});

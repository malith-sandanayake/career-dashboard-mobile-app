import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

const TABS = [
  { name: 'Dashboard', label: 'DASHBOARD', icon: '⬡' },
  { name: 'Curriculum', label: 'MODULES', icon: '☰' },
  { name: 'Settings', label: 'SETTINGS', icon: '⚙' },
];

export const BottomNavBar: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.navBg, borderTopColor: colors.navBorder }]}>
      {TABS.map((tab) => {
        const isActive = route.name === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Text style={[styles.icon, { color: isActive ? colors.accent : colors.textMuted }]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, { color: isActive ? colors.accent : colors.textMuted }]}>
              {tab.label}
            </Text>
            {isActive && <View style={[styles.indicator, { backgroundColor: colors.accent }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 24,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
    position: 'relative',
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2,
    borderRadius: 1,
  },
});

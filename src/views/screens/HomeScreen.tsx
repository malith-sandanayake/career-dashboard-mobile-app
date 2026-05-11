// src/views/screens/HomeScreen.tsx

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCourses } from '../../context/CourseContext';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { activeCourses } = useCourses();

  const gpaScale = useRef(new Animated.Value(1)).current;
  const ctScale = useRef(new Animated.Value(1)).current;

  const animatePress = (anim: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 0.97, useNativeDriver: true, speed: 30 }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start(() => callback());
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.container}>
        {/* Top title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>ENGINEER OS</Text>
          <Text style={styles.subtitle}>Select your module</Text>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>

          {/* GPA Module Card */}
          <Animated.View style={{ transform: [{ scale: gpaScale }] }}>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.card, styles.cyanAccent]}
              onPress={() => animatePress(gpaScale, () => navigation.navigate('GPAModule'))}
            >
              <View style={[styles.accentBar, { backgroundColor: '#00FFFF' }]} />
              <View style={styles.cardInner}>
                <MaterialCommunityIcons name="school" size={32} color="#00FFFF" />
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>GPA Command Center</Text>
                  <Text style={styles.cardSub}>
                    CGPA tracker · Prediction engine · Curriculum
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#333333" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Course Tracker Card */}
          <Animated.View style={{ transform: [{ scale: ctScale }] }}>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.card, styles.purpleAccent]}
              onPress={() => animatePress(ctScale, () => navigation.navigate('CourseTracker'))}
            >
              <View style={[styles.accentBar, { backgroundColor: '#9B59F5' }]} />
              <View style={styles.cardInner}>
                <MaterialCommunityIcons name="rocket-launch" size={32} color="#9B59F5" />
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Course Tracker</Text>
                  <Text style={styles.cardSub}>
                    Courses · Skills · Languages · Calendar
                  </Text>
                  <View style={styles.activeRow}>
                    <Ionicons name="time" size={12} color="#00FFFF" />
                    <Text style={styles.activeText}>
                      {activeCourses.length} active course{activeCourses.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#333333" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>UoP E23 · e23347</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  titleSection: {
    marginTop: 48,
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginTop: 6,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cyanAccent: {},
  purpleAccent: {},
  accentBar: {
    width: 4,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  cardSub: {
    fontSize: 12,
    color: '#555555',
    marginTop: 4,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  activeText: {
    fontSize: 11,
    color: '#00FFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    fontSize: 11,
    color: '#2A2A2A',
  },
});

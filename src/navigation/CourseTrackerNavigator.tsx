// src/navigation/CourseTrackerNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CTDashboardScreen } from '../views/screens/courseTracker/CTDashboardScreen';
import { CTCoursesScreen } from '../views/screens/courseTracker/CTCoursesScreen';
import { CTCalendarScreen } from '../views/screens/courseTracker/CTCalendarScreen';
import { CTSkillsScreen } from '../views/screens/courseTracker/CTSkillsScreen';
import { CTCourseDetailScreen } from '../views/screens/courseTracker/CTCourseDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Back button shared helper ─────────────────────────────────────────────────
const BackToHome: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginLeft: 16 }}>
      <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────
const CTTabNavigator: React.FC = () => {
  const navigation = useNavigation<any>();

  const tabScreenOptions = {
    headerStyle: { backgroundColor: '#000000' },
    headerTitleStyle: { fontWeight: '700' as const, fontSize: 16, color: '#9B59F5' },
    headerLeft: () => <BackToHome />,
    tabBarStyle: { backgroundColor: '#000000', borderTopColor: '#1A1A1A' },
    tabBarActiveTintColor: '#9B59F5',
    tabBarInactiveTintColor: '#555555',
  };

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="CTDashboard"
        component={CTDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CTCourses"
        component={CTCoursesScreen}
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CTCalendar"
        component={CTCalendarScreen}
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CTSkills"
        component={CTSkillsScreen}
        options={{
          title: 'Skills',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lightning-bolt" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ─── Root Course Tracker Stack ────────────────────────────────────────────────
export const CourseTrackerNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CTTabs" component={CTTabNavigator} />
      <Stack.Screen
        name="CourseDetail"
        component={CTCourseDetailScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#000000' },
          headerTitleStyle: { fontWeight: '700' as const, fontSize: 16, color: '#9B59F5' },
          headerTitle: 'Course Detail',
          headerTintColor: '#9B59F5',
          headerBackTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};

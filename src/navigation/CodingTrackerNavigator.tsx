import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { CTKTimerScreen } from '../views/screens/codingTracker/CTKTimerScreen';
import { CTKDashboardScreen } from '../views/screens/codingTracker/CTKDashboardScreen';
import { CTKHistoryScreen } from '../views/screens/codingTracker/CTKHistoryScreen';
import { CTKStatsScreen } from '../views/screens/codingTracker/CTKStatsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BackToHome: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginLeft: 16 }}>
      <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const CTKTabNavigator: React.FC = () => {
  const tabScreenOptions = {
    headerStyle: { backgroundColor: '#000000' },
    headerTitleStyle: { fontWeight: '700' as const, fontSize: 16, color: '#00FF88' },
    headerLeft: () => <BackToHome />,
    tabBarStyle: { backgroundColor: '#000000', borderTopColor: '#1A1A1A' },
    tabBarActiveTintColor: '#00FF88',
    tabBarInactiveTintColor: '#555555',
  };

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="CTKTimer"
        component={CTKTimerScreen}
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, size }) => <Ionicons name="timer-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CTKDashboard"
        component={CTKDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CTKHistory"
        component={CTKHistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CTKStats"
        component={CTKStatsScreen}
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const CodingTrackerNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CTKTabs" component={CTKTabNavigator} />
    </Stack.Navigator>
  );
};

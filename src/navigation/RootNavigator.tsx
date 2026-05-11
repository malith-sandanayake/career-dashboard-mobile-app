// src/navigation/RootNavigator.tsx
// Root stack navigator: Home → GPAModule or CourseTracker

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Screens
import { HomeScreen } from '../views/screens/HomeScreen';
import { LoginScreen } from '../views/screens/LoginScreen';
import { DashboardScreen } from '../views/screens/DashboardScreen';
import { CurriculumScreen } from '../views/screens/CurriculumScreen';
import { SettingsScreen } from '../views/screens/SettingsScreen';
import { CourseTrackerNavigator } from './CourseTrackerNavigator';

const Stack = createNativeStackNavigator();

/** GPA Module stack — requires Firebase Auth */
const GPAStackNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00FFFF" />
      </View>
    );
  }

  const InnerStack = createNativeStackNavigator();
  return (
    <InnerStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <InnerStack.Screen name="GPADashboard" component={DashboardScreen} />
          <InnerStack.Screen name="Curriculum" component={CurriculumScreen} />
          <InnerStack.Screen name="Settings" component={SettingsScreen} />
        </>
      ) : (
        <InnerStack.Screen name="Login" component={LoginScreen} />
      )}
    </InnerStack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GPAModule" component={GPAStackNavigator} />
        <Stack.Screen name="CourseTracker" component={CourseTrackerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

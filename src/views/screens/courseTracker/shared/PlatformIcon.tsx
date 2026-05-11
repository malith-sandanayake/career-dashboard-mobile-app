// src/views/screens/courseTracker/shared/PlatformIcon.tsx

import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CourseCategory } from '../../../../models/Course';

export function getPlatformIcon(platform: CourseCategory, size = 14): React.ReactNode {
  switch (platform) {
    case 'Udemy':
      return <MaterialCommunityIcons name="school-outline" size={size} color="#A435F0" />;
    case 'Coursera':
      return <MaterialCommunityIcons name="certificate-outline" size={size} color="#0056D2" />;
    case 'YouTube':
      return <MaterialCommunityIcons name="youtube" size={size} color="#FF0000" />;
    case 'Google':
      return <MaterialCommunityIcons name="google" size={size} color="#4285F4" />;
    case 'Cisco':
      return <MaterialCommunityIcons name="network" size={size} color="#1BA0D7" />;
    case 'AWS':
      return <MaterialCommunityIcons name="aws" size={size} color="#FF9900" />;
    case 'Microsoft':
      return <MaterialCommunityIcons name="microsoft" size={size} color="#00A4EF" />;
    case 'CompTIA':
      return <MaterialCommunityIcons name="shield-check" size={size} color="#C8202F" />;
    case 'Other Certification':
      return <MaterialCommunityIcons name="certificate" size={size} color="#AAAAAA" />;
    case 'Other Online':
      return <Ionicons name="globe-outline" size={size} color="#AAAAAA" />;
    default:
      return <Ionicons name="globe-outline" size={size} color="#555555" />;
  }
}

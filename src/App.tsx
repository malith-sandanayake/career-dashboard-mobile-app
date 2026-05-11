/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider } from './context/AuthContext';
import { GradeProvider } from './context/GradeContext';
import { ThemeProvider } from './context/ThemeContext';
import { CourseProvider } from './context/CourseContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GradeProvider>
          <CourseProvider>
            <RootNavigator />
          </CourseProvider>
        </GradeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

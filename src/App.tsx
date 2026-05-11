/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider } from './context/AuthContext';
import { GradeProvider } from './context/GradeContext';
import { ThemeProvider } from './context/ThemeContext';
import { CourseProvider } from './context/CourseContext';
import { CodingProvider } from './context/CodingContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GradeProvider>
          <CourseProvider>
            <CodingProvider>
              <RootNavigator />
            </CodingProvider>
          </CourseProvider>
        </GradeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

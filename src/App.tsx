/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider } from './context/AuthContext';
import { GradeProvider } from './context/GradeContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GradeProvider>
          <AppNavigator />
        </GradeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

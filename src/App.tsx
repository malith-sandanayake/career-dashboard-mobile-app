/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider } from './context/AuthContext';
import { GradeProvider } from './context/GradeContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <GradeProvider>
        <AppNavigator />
      </GradeProvider>
    </AuthProvider>
  );
}

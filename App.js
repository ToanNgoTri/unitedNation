import React from 'react';
// import { SafeAreaView } from 'react-native';
import MigrationScreen from './screens/MigrationScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    // <SafeAreaView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <MigrationScreen />
      </SafeAreaProvider>
    // </SafeAreaView>
  );
}

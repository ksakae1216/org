import auth from '@react-native-firebase/auth';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '../navigation/AppNavigator';

export function App() {
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      console.log('Auth state changed:', user);
    });

    return subscriber;
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

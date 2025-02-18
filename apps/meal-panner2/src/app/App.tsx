import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { enableNetwork, getFirestore } from '@react-native-firebase/firestore';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '../navigation/AppNavigator';

export function App() {
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore(auth.app, 'meal-planner-db');

        await enableNetwork(db);
      } catch (error) {
        console.error('Failed to initialize Firestore:', error);
      }
    };

    initializeFirebase();

    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, (user: FirebaseAuthTypes.User | null) => {
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

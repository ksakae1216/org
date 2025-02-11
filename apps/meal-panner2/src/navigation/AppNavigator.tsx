import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthScreen } from '../screens/AuthScreen';
import { ChildScreen } from '../screens/ChildScreen';
import { ParentScreen } from '../screens/ParentScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
        />
        <Stack.Screen
          name="Child"
          component={ChildScreen}
          options={{
            title: '明日のご飯について教えてください',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Parent"
          component={ParentScreen}
          options={{
            title: '食事予定確認',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

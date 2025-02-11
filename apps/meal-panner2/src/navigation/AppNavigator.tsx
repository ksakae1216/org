import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthScreen } from '../screens/AuthScreen';
import { CookScreen } from '../screens/CookScreen';
import { EaterScreen } from '../screens/EaterScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Eater"
          component={EaterScreen}
          options={{ title: '食べる人' }}
        />
        <Stack.Screen
          name="Cook"
          component={CookScreen}
          options={{ title: '作る人' }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'ログイン' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

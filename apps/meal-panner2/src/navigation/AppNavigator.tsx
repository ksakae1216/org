import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ChildScreen } from '../screens/ChildScreen';
import { ParentScreen } from '../screens/ParentScreen';

export type RootStackParamList = {
  Child: undefined;
  Parent: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Child">
        <Stack.Screen
          name="Child"
          component={ChildScreen}
          options={{ title: '明日のご飯について教えてください' }}
        />
        <Stack.Screen
          name="Parent"
          component={ParentScreen}
          options={{ title: '食事予定確認' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

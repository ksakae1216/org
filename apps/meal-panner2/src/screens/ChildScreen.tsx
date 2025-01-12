import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Switch, Text, useTheme } from 'react-native-paper';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Child'>;

export const ChildScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);

  const handleSubmit = () => {
    // TODO: データを保存する処理を実装
    console.log({ breakfast, lunch, dinner });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mealContainer}>
        <Text variant="titleLarge" style={styles.mealTitle}>朝ご飯</Text>
        <Switch
          value={breakfast}
          onValueChange={setBreakfast}
          color={theme.colors.primary}
        />
        <Text style={styles.status}>{breakfast ? '要る' : '要らない'}</Text>
      </View>

      <View style={styles.mealContainer}>
        <Text variant="titleLarge" style={styles.mealTitle}>昼ご飯</Text>
        <Switch
          value={lunch}
          onValueChange={setLunch}
          color={theme.colors.primary}
        />
        <Text style={styles.status}>{lunch ? '要る' : '要らない'}</Text>
      </View>

      <View style={styles.mealContainer}>
        <Text variant="titleLarge" style={styles.mealTitle}>夜ご飯</Text>
        <Switch
          value={dinner}
          onValueChange={setDinner}
          color={theme.colors.primary}
        />
        <Text style={styles.status}>{dinner ? '要る' : '要らない'}</Text>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        送信
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Parent')}
        style={styles.parentButton}
      >
        親用画面へ
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  mealContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  mealTitle: {
    marginBottom: 8,
  },
  status: {
    marginTop: 8,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 32,
    padding: 8,
  },
  parentButton: {
    marginTop: 16,
  },
});

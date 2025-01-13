import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Card, Text, useTheme } from 'react-native-paper';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Parent'>;

export const ParentScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  // TODO: 実際のデータを取得する処理を実装
  const mockData = {
    breakfast: true,
    lunch: false,
    dinner: true,
  };

  const renderMealStatus = (meal: string, status: boolean) => (
    <View style={styles.mealStatus}>
      <Text variant="titleMedium">{meal}:</Text>
      <Text
        style={[
          styles.statusText,
          { color: status ? theme.colors.primary : theme.colors.error },
        ]}
      >
        {status ? '要る' : '要らない'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <CalendarStrip
        style={styles.calendar}
        calendarColor="#ffffff"
        calendarHeaderStyle={styles.calendarHeader}
        dateNumberStyle={styles.dateNumber}
        dateNameStyle={styles.dateName}
        highlightDateNumberStyle={styles.highlightDate}
        highlightDateNameStyle={styles.highlightDate}
        disabledDateNameStyle={styles.disabledDate}
        disabledDateNumberStyle={styles.disabledDate}
        iconContainer={{ flex: 0.1 }}
      />

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            明日の食事予定
          </Text>
          {renderMealStatus('朝ご飯', mockData.breakfast)}
          {renderMealStatus('昼ご飯', mockData.lunch)}
          {renderMealStatus('夜ご飯', mockData.dinner)}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    height: 100,
    paddingTop: 20,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: '#000',
  },
  dateNumber: {
    color: '#000',
  },
  dateName: {
    color: '#000',
  },
  highlightDate: {
    color: '#000',
  },
  disabledDate: {
    color: '#ccc',
  },
  card: {
    margin: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  mealStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  statusText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

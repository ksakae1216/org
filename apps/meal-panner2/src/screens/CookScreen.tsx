import auth from '@react-native-firebase/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Cook'>;

export const CookScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  // TODO: 実際のデータを取得する処理を実装
  const mockData = {
    breakfast: true,
    lunch: false,
    dinner: true,
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
      <Text variant="headlineMedium" style={styles.title}>
        食事予定確認
      </Text>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        ログアウト
      </Button>

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
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    marginTop: 16,
    padding: 8,
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

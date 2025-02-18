import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Button, Switch, Text, useTheme } from 'react-native-paper';
import type { Group, User } from '../types/auth';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Eater'>;

interface MealStatus {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export const EaterScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [group, setGroup] = useState<Group | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          navigation.replace('Auth');
          return;
        }

        // ユーザー情報を取得
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data() as User;

        if (!userData.groupId) {
          // TODO: グループに所属していない場合の処理
          return;
        }

        // グループ情報を取得
        const groupDoc = await firestore().collection('groups').doc(userData.groupId).get();
        const groupData = { id: groupDoc.id, ...groupDoc.data() } as Group;
        setGroup(groupData);

        // 選択された日付の食事予定を取得
        const dateString = selectedDate.toISOString().split('T')[0];
        const mealStatusDoc = await firestore()
          .collection('mealStatus')
          .doc(`${currentUser.uid}_${dateString}`)
          .get();

        if (mealStatusDoc.exists) {
          const status = mealStatusDoc.data() as MealStatus;
          setBreakfast(status.breakfast);
          setLunch(status.lunch);
          setDinner(status.dinner);
        } else {
          setBreakfast(false);
          setLunch(false);
          setDinner(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [navigation, selectedDate]);

  const handleDateSelected = (date: moment.Moment) => {
    setSelectedDate(date.toDate());
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      const dateString = selectedDate.toISOString().split('T')[0];
      await firestore()
        .collection('mealStatus')
        .doc(`${currentUser.uid}_${dateString}`)
        .set({
          breakfast,
          lunch,
          dinner,
          userId: currentUser.uid,
          date: dateString,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      // TODO: 保存成功のフィードバックを表示
    } catch (error) {
      console.error('Error saving meal status:', error);
      // TODO: エラー時のフィードバックを表示
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {group?.name || '食事予定登録'}
        </Text>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          ログアウト
        </Button>
      </View>

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
        selectedDate={selectedDate}
        onDateSelected={handleDateSelected}
      />

      <Text variant="titleLarge" style={styles.sectionTitle}>
        {selectedDate.toLocaleDateString('ja-JP')}の食事予定
      </Text>

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
        loading={isSaving}
        disabled={isSaving}
      >
        保存
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  calendar: {
    height: 100,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 16,
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
  sectionTitle: {
    marginBottom: 24,
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
  logoutButton: {
    marginLeft: 16,
  },
});

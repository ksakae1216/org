import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import type { Group, User } from '../types/auth';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Cook'>;

interface MealStatus {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface GroupMember {
  id: string;
  displayName: string;
  mealStatus: MealStatus;
}

export const CookScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadGroupData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigation.replace('Auth');
          return;
        }

        const db = getFirestore(auth.app, 'meal-planner-db');
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data() as User;
        console.log('User Data:', userData);

        if (!userData.groupId) {
          console.log('No group ID found');
          return;
        }

        // グループ情報を取得
        const groupRef = doc(db, 'groups', userData.groupId);
        const groupDoc = await groupRef.get();
        const groupData = { id: groupDoc.id, ...groupDoc.data() } as Group;
        console.log('Group Data:', groupData);

        if (!groupData.code) {
          console.log('No group code found');
        }

        setGroup(groupData);

        // グループメンバー（食べる人）の情報を取得
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          where('groupId', '==', userData.groupId),
          where('role', '==', 'eater')
        );
        const membersSnapshot = await getDocs(q);

        const memberPromises = membersSnapshot.docs.map(async (docSnapshot) => {
          const memberData = docSnapshot.data() as User;

          // 選択された日付の食事予定を取得
          const dateString = selectedDate.toISOString().split('T')[0];
          const mealStatusRef = doc(db, 'mealStatus', `${docSnapshot.id}_${dateString}`);
          const mealStatusDoc = await getDoc(mealStatusRef);

          const mealStatus = mealStatusDoc.data() as MealStatus || {
            breakfast: false,
            lunch: false,
            dinner: false,
          };

          return {
            id: docSnapshot.id,
            displayName: memberData.displayName || 'Unknown',
            mealStatus,
          };
        });

        const membersData = await Promise.all(memberPromises);
        setMembers(membersData);
      } catch (error) {
        console.error('Error loading group data:', error);
        Alert.alert(
          'エラー',
          'データの読み込みに失敗しました。しばらく待ってから再度お試しください。',
          [{ text: 'OK' }]
        );
      }
    };

    loadGroupData();
  }, [navigation, selectedDate]);

  const handleLogout = async () => {
    try {
      await getAuth().signOut();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDateSelected = (date: moment.Moment) => {
    setSelectedDate(date.toDate());
  };

  const renderMemberStatus = (member: GroupMember) => (
    <Card style={styles.memberCard} key={member.id}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.memberName}>
          {member.displayName}
        </Text>
        <View style={styles.mealStatusContainer}>
          {renderMealStatus('朝ご飯', member.mealStatus.breakfast)}
          {renderMealStatus('昼ご飯', member.mealStatus.lunch)}
          {renderMealStatus('夜ご飯', member.mealStatus.dinner)}
        </View>
      </Card.Content>
    </Card>
  );

  const renderMealStatus = (meal: string, status: boolean) => (
    <View style={styles.mealStatus}>
      <Text variant="bodyMedium">{meal}:</Text>
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
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            {group?.name || '食事予定確認'}
          </Text>
          {group?.code && (
            <View style={styles.groupCodeContainer}>
              <Text variant="bodyMedium" style={styles.groupCode}>
                グループコード: {group.code}
              </Text>
              <Text variant="bodySmall" style={styles.groupCodeHint}>
                ※このコードを食べる人に共有してください
              </Text>
            </View>
          )}
        </View>
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

      {members.map(renderMemberStatus)}

      {members.length === 0 && (
        <Text style={styles.noMembers}>
          グループメンバーがいません
        </Text>
      )}
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
  titleContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  logoutButton: {
    marginLeft: 16,
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
    marginBottom: 16,
  },
  memberCard: {
    marginBottom: 16,
  },
  memberName: {
    marginBottom: 8,
  },
  mealStatusContainer: {
    marginLeft: 16,
  },
  mealStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  statusText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  noMembers: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  },
  groupCodeContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  groupCode: {
    color: '#666',
    fontSize: 14,
  },
  groupCodeHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
});

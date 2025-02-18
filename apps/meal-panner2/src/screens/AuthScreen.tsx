import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, limit, query, setDoc, updateDoc, where } from '@react-native-firebase/firestore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import type { UserRole } from '../types/auth';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;


const getErrorMessage = (error: any): string => {
  if (error.code === 'firestore/unavailable') {
    return 'サービスに接続できません。しばらく待ってから再度お試しください。';
  }
  if (error.code === 'auth/invalid-email') {
    return 'メールアドレスの形式が正しくありません。';
  }
  if (error.code === 'auth/wrong-password') {
    return 'パスワードが間違っています。';
  }
  if (error.code === 'auth/user-not-found') {
    return 'アカウントが見つかりません。';
  }
  if (error.code === 'auth/email-already-in-use') {
    return 'このメールアドレスは既に使用されています。';
  }
  return error.message || 'エラーが発生しました。しばらく待ってから再度お試しください。';
};

export const AuthScreen = ({ navigation }: Props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('eater');
  const [groupCode, setGroupCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getUserData = async (uid: string): Promise<any> => {
    const auth = getAuth();
    const db = getFirestore(auth.app, 'meal-planner-db');
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      return null;
    }
  };

  const handleAuth = async () => {
    try {
      setError('');
      setIsLoading(true);
      const auth = getAuth();
      const db = getFirestore(auth.app, 'meal-planner-db');

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = await getUserData(userCredential.user.uid);

        if (userData?.role === 'cook') {
          navigation.replace('Cook');
        } else {
          navigation.replace('Eater');
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        let groupId = '';
        let newGroupCode = '';

        if (groupCode) {
          // 既存のグループに参加
          const groupsRef = collection(db, 'groups');
          const q = query(groupsRef, where('code', '==', groupCode), limit(1));
          const groupSnapshot = await getDocs(q);

          if (groupSnapshot.empty) {
            throw new Error('指定されたグループが見つかりません');
          }

          groupId = groupSnapshot.docs[0].id;
          const groupRef = doc(db, 'groups', groupId);

          // ユーザーデータを作成
          const userData = {
            role,
            email,
            displayName,
            groupId,
          };

          const userRef = doc(db, 'users', uid);
          await setDoc(userRef, userData);

          // グループのメンバーリストを更新
          if (role === 'cook') {
            await updateDoc(groupRef, {
              cookIds: arrayUnion(uid)
            });
          } else {
            await updateDoc(groupRef, {
              eaterIds: arrayUnion(uid)
            });
          }
        } else {
          newGroupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          const simpleGroupData = {
            name: `${displayName}のグループ`,
            code: newGroupCode,
            cookIds: [uid],
            eaterIds: [],
          };

          const groupDocRef = await addDoc(collection(db, 'groups'), simpleGroupData);
          groupId = groupDocRef.id;

          const userData = {
            role,
            email,
            displayName,
            groupId: groupDocRef.id,
          };

          const userRef = doc(db, 'users', uid);
          await setDoc(userRef, userData);

          // グループ作成時にグループコードを表示
          Alert.alert(
            'グループを作成しました',
            `グループコード: ${newGroupCode}\n\nこのコードを食べる人に共有してください。`,
            [{ text: 'OK', onPress: () => {
              if (role === 'cook') {
                navigation.replace('Cook');
              } else {
                navigation.replace('Eater');
              }
            }}]
          );
          return; // Alertのコールバックでナビゲーションを処理するため、ここで終了
        }

        if (role === 'cook') {
          navigation.replace('Cook');
        } else {
          navigation.replace('Eater');
        }
      }


    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'cook', label: '作る人' },
    { value: 'eater', label: '食べる人' },
  ];

  // グループコードの入力をクリアする
  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
    if (value === 'cook') {
      setGroupCode('');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {isLogin ? 'ログイン' : '新規登録'}
      </Text>

      <TextInput
        label="メールアドレス"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {!isLogin && (
        <>
          <TextInput
            label="表示名"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
          />

          <SegmentedButtons
            value={role}
            onValueChange={handleRoleChange}
            buttons={roleOptions}
            style={styles.roleSelector}
          />

          <TextInput
            label="グループコード"
            value={groupCode}
            onChangeText={setGroupCode}
            autoCapitalize="characters"
            style={styles.input}
            disabled={role === 'cook'}
            placeholder={role === 'cook' ? '作る人は入力不要です' : '参加したいグループコードを入力'}
          />
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleAuth}
        style={styles.button}
        loading={isLoading}
        disabled={isLoading}
      >
        {isLogin ? 'ログイン' : '新規登録'}
      </Button>

      <Button
        mode="text"
        onPress={() => setIsLogin(!isLogin)}
        style={styles.switchButton}
      >
        {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
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
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  roleSelector: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    padding: 8,
  },
  switchButton: {
    marginTop: 16,
  },
});

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import type { UserRole } from '../types/auth';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export const AuthScreen = ({ navigation }: Props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('eater');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      setError('');
      if (isLogin) {
        // ログイン処理
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        // Firestoreからユーザーのrole情報を取得
        const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();
        const userData = userDoc.data();

        if (userData?.role === 'cook') {
          navigation.replace('Cook');
        } else {
          navigation.replace('Eater');
        }
      } else {
        // 新規登録処理
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        // Firestoreにユーザー情報を保存
        await firestore().collection('users').doc(userCredential.user.uid).set({
          role,
          email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

        if (role === 'cook') {
          navigation.replace('Cook');
        } else {
          navigation.replace('Eater');
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const roleOptions = [
    { value: 'cook', label: '作る人' },
    { value: 'eater', label: '食べる人' },
  ];

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
        <SegmentedButtons
          value={role}
          onValueChange={value => setRole(value as UserRole)}
          buttons={roleOptions}
          style={styles.roleSelector}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleAuth}
        style={styles.button}
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

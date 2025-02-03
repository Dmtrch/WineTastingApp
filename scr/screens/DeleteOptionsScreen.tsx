import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  Alert, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types'; // Adjust the path as necessary
import { WineRecord } from '../models/WineRecord';
import { loadRecords, saveRecords } from '../utils/Storage';

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const navigation = useNavigation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await saveRecords([]);
      Alert.alert('Успех', 'Все записи успешно удалены');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить записи');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      'Подтверждение удаления',
      'Вы уверены, что хотите удалить все записи? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: handleDeleteAll },
      ]
    );
  };

  const navigateToSelectRecords = () => {
    navigation.navigate('SelectRecordsToDelete');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Удаление записей</Text>

      {/* Удалить все записи */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Удалить все записи</Text>
        <Text style={styles.description}>
          Это действие удалит все записи и связанные с ними фотографии.
        </Text>
        <Button
          title={isDeleting ? 'Удаление...' : 'Удалить всё'}
          onPress={confirmDeleteAll}
          color="#e74c3c"
          disabled={isDeleting}
        />
      </View>

      {/* Выбрать записи для удаления */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Выбрать записи для удаления</Text>
        <Text style={styles.description}>
          Выберите конкретные записи, которые хотите удалить.
        </Text>
        <Button
          title="Выбрать записи"
          onPress={navigateToSelectRecords}
          color="#f39c12"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
});

export default DeleteOptionsScreen;
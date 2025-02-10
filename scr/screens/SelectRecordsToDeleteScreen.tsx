import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Button, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { loadRecords, saveRecords } from '../utils/Storage';
import { WineRecord } from '../models/WineRecord';

const SelectRecordsToDeleteScreen: React.FC = () => {
  const [records, setRecords] = useState<WineRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const loadedRecords = await loadRecords();
        if (loadedRecords) {
          setRecords(loadedRecords);
        } else {
          Alert.alert("Ошибка", "Не удалось загрузить записи");
        }
      } catch (error) {
        Alert.alert("Ошибка", "Произошла ошибка при загрузке записей");
      }
    };
    fetchRecords();
  }, []);

  // Функция переключения выбранного состояния для записи
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Функция удаления выбранных записей
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      Alert.alert("Информация", "Выберите записи для удаления");
      return;
    }
    // Фильтруем записи, исключая выбранные
    const newRecords = records.filter(record => !selectedIds.includes(record.id));
    try {
      await saveRecords(newRecords);
      // После успешного удаления загружаем обновлённый список записей
      const updatedRecords = await loadRecords();
      setRecords(updatedRecords || []);
      setSelectedIds([]);
      Alert.alert("Успех", "Выбранные записи удалены");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось удалить выбранные записи");
    }
  };

  const renderItem = ({ item }: { item: WineRecord }) => (
    <TouchableOpacity 
      style={[
        styles.item, 
        selectedIds.includes(item.id) && styles.selectedItem
      ]}
      onPress={() => toggleSelection(item.id)}
    >
      <Text style={styles.itemText}>{item.wineName} ({item.wineryName})</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выбор записей для удаления</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Button 
        title="Удалить выбранные" 
        onPress={handleDeleteSelected} 
        color="#e74c3c" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: '#fdd',
    borderColor: '#e74c3c',
  },
  itemText: {
    fontSize: 16,
  },
});

export default SelectRecordsToDeleteScreen;
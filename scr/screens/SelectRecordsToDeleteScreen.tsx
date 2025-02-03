import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WineRecord } from '../models/WineRecord';
import { loadRecords, saveRecords } from '../utils/Storage';

const SelectRecordsToDeleteScreen: React.FC = () => {
  const navigation = useNavigation();
  const [records, setRecords] = useState<WineRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const loadedRecords = await loadRecords();
      setRecords(loadedRecords);
    };
    fetchRecords();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    const updatedRecords = records.filter(record => !selectedRecords.includes(record.wineName));
    await saveRecords(updatedRecords);
    Alert.alert('Успех', 'Выбранные записи удалены');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={item => item.wineName}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              selectedRecords.includes(item.wineName) && styles.selectedItem
            ]}
            onPress={() => toggleSelection(item.wineName)}>
            <Text style={styles.itemText}>{item.wineName}</Text>
            <Text style={styles.itemSubtext}>{item.wineryName}</Text>
          </TouchableOpacity>
        )}
      />

      <Button
        title={`Удалить выбранные (${selectedRecords.length})`}
        onPress={handleDeleteSelected}
        disabled={selectedRecords.length === 0}
        color="#e74c3c"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  selectedItem: {
    backgroundColor: '#f8d7da',
  },
  itemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  itemSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default SelectRecordsToDeleteScreen;
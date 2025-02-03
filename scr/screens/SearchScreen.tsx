import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Picker,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WineRecord } from '../models/WineRecord';
import { loadRecords } from '../utils/Storage';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchCriteria, setSearchCriteria] = useState<Partial<WineRecord>>({});
  const [sortBy, setSortBy] = useState<'wineryName' | 'wineName' | 'harvestYear'>('wineryName');
  const [allRecords, setAllRecords] = useState<WineRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<WineRecord[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      const records = await loadRecords();
      setAllRecords(records);
      setFilteredRecords(records);
    };
    initializeData();
  }, []);

  const handleSearch = () => {
    const results = allRecords.filter(record => {
      return Object.entries(searchCriteria).every(([key, value]) => {
        if (!value) return true;
        
        const recordValue = getNestedValue(record, key);
        return String(recordValue).toLowerCase().includes(String(value).toLowerCase());
      });
    }).sort((a, b) => {
      if (sortBy === 'harvestYear') return b[sortBy] - a[sortBy];
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });
    
    setFilteredRecords(results);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const updateCriteria = (field: string, value: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const navigateToDetail = (item: WineRecord) => {
    navigation.navigate('RecordDetail', { record: item });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Секция критериев поиска */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Критерии поиска</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Название винодельни"
          onChangeText={t => updateCriteria('wineryName', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Название вина"
          onChangeText={t => updateCriteria('wineName', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Год урожая"
          keyboardType="numeric"
          onChangeText={t => updateCriteria('harvestYear', t)}
        />

        {/* Аналогичные TextInput для остальных 25 полей */}
        {/* Пример для нескольких полей: */}
        
        <TextInput
          style={styles.input}
          placeholder="Винодел"
          onChangeText={t => updateCriteria('winemaker', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Страна"
          onChangeText={t => updateCriteria('country', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Сахар (%)"
          keyboardType="numeric"
          onChangeText={t => updateCriteria('sugarContent', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Тип вина"
          onChangeText={t => updateCriteria('wineType', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Цвет (заметки)"
          onChangeText={t => updateCriteria('tastingNotes.colorNotes', t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Дата потребления"
          onChangeText={t => updateCriteria('tastingNotes.consumptionDate', t)}
        />
      </View>

      {/* Секция сортировки */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Сортировка</Text>
        <Picker
          selectedValue={sortBy}
          onValueChange={(itemValue) => setSortBy(itemValue)}>
          <Picker.Item label="По винодельне" value="wineryName" />
          <Picker.Item label="По названию вина" value="wineName" />
          <Picker.Item label="По году урожая" value="harvestYear" />
        </Picker>
      </View>

      {/* Кнопка поиска */}
      <Button title="Найти" onPress={handleSearch} color="#2ecc71" />

      {/* Результаты поиска */}
      <View style={styles.resultsSection}>
        <Text style={styles.resultsTitle}>Найдено записей: {filteredRecords.length}</Text>
        
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => `${item.wineName}-${Date.now()}`}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.resultItem}
              onPress={() => navigateToDetail(item)}>
              <Text style={styles.itemTitle}>{item.wineryName}</Text>
              <Text style={styles.itemSubtitle}>{item.wineName}</Text>
              <Text style={styles.itemDetails}>
                {item.harvestYear} | {item.wineType} | {item.country}
              </Text>
            </TouchableOpacity>
          )}
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
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  resultsSection: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  itemDetails: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
});

export default SearchScreen;
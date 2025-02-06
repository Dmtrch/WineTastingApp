import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WineRecord } from '../models/WineRecord';
import { loadRecords } from '../utils/Storage';

// Определяем параметры навигации для стека поиска
export type SearchStackParamList = {
  Search: undefined;
  RecordDetail: { recordId: string };
};

type NavigationProps = StackNavigationProp<SearchStackParamList, 'Search'>;

// Расширяем тип WineRecord, добавляя обязательное свойство id
interface WineRecordWithId extends WineRecord {
  id: string;
}

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [searchCriteria, setSearchCriteria] = useState<Partial<WineRecord>>({});
  const [sortBy, setSortBy] = useState<'wineryName' | 'wineName' | 'harvestYear'>('wineryName');
  const [allRecords, setAllRecords] = useState<WineRecordWithId[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<WineRecordWithId[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Приводим полученные записи к типу WineRecordWithId
        const records = await loadRecords() as WineRecordWithId[];
        setAllRecords(records);
        setFilteredRecords(records);
      } catch (error) {
        Alert.alert("Ошибка", "Не удалось загрузить записи");
      }
    };
    initializeData();
  }, []);

  const handleSearch = () => {
    const results = allRecords.filter(record => {
      return Object.entries(searchCriteria).every(([key, value]) => {
        if (!value) return true;
        const recordValue = getNestedValue(record, key);
        return recordValue && String(recordValue).toLowerCase().includes(String(value).toLowerCase());
      });
    }).sort((a, b) => {
      if (sortBy === 'harvestYear') {
        return Number(b[sortBy]) - Number(a[sortBy]);
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });
    setFilteredRecords(results);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
  };

  const updateCriteria = (field: string, value: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const navigateToDetail = (record: WineRecordWithId) => {
    navigation.navigate('RecordDetail', { recordId: record.id });
  };

  const navigateToMainMenu = () => {
    // Пытаемся обратиться к родительскому навигатору для перехода на "Home"
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Home');
    } else {
      // Если родительского навигатора нет, пробуем напрямую
      navigation.navigate('Home' as any);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Кнопка возврата к главному меню */}
      <View style={styles.topButtons}>
        <Button title="В главное меню" onPress={navigateToMainMenu} />
      </View>

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
          onValueChange={(itemValue: 'wineryName' | 'wineName' | 'harvestYear') => setSortBy(itemValue)}>
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
          keyExtractor={(item, index) => item.id || `${item.wineName}-${index}`}
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
  },
  topButtons: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  resultsSection: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemDetails: {
    fontSize: 12,
    color: '#999',
  },
});

export default SearchScreen;
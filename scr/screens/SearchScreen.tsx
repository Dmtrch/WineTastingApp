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
  Alert,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WineRecord } from '../models/WineRecord';
import { loadRecords } from '../utils/Storage';

// Параметры навигации для стека поиска
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
        const records = (await loadRecords()) as WineRecordWithId[];
        setAllRecords(records);
        setFilteredRecords(records);
      } catch (error) {
        Alert.alert("Ошибка", "Не удалось загрузить записи");
      }
    };
    initializeData();
  }, []);

  // Функция для получения вложенного значения по пути
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  };

  // Обновление критериев поиска
  const updateCriteria = (field: string, value: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Поиск происходит по нажатию кнопки "Искать"
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

  // Переход к детальному просмотру записи
  const navigateToDetail = (record: WineRecordWithId) => {
    navigation.navigate('RecordDetail', { recordId: record.id });
  };

  // Переход в главное меню (как реализовано в TastingScreen)
  const navigateToMainMenu = () => {
    navigation.navigate("Home" as any);
  };

  // Массив из 28 параметров для поиска
  const searchParameters = [
    { key: 'wineryName', label: 'Название винодельни' },
    { key: 'wineName', label: 'Название вина' },
    { key: 'harvestYear', label: 'Год урожая' },
    { key: 'winemaker', label: 'Винодел' },
    { key: 'country', label: 'Страна' },
    { key: 'sugarContent', label: 'Сахар (%)' },
    { key: 'wineType', label: 'Тип вина' },
    { key: 'tastingNotes.colorNotes', label: 'Цвет (заметки)' },
    { key: 'tastingNotes.consumptionDate', label: 'Дата потребления' },
    { key: 'tastingNotes.aroma', label: 'Аромат' },
    { key: 'tastingNotes.taste', label: 'Вкус' },
    { key: 'tastingNotes.body', label: 'Тело' },
    { key: 'tastingNotes.finish', label: 'Послевкусие' },
    { key: 'tastingNotes.acidity', label: 'Кислотность' },
    { key: 'tastingNotes.tannins', label: 'Танины' },
    { key: 'tastingNotes.balance', label: 'Баланс' },
    { key: 'tastingNotes.intensity', label: 'Интенсивность' },
    { key: 'tastingNotes.complexity', label: 'Сложность' },
    { key: 'rating', label: 'Оценка' },
    { key: 'price', label: 'Цена' },
    { key: 'vintage', label: 'Винтаж' },
    { key: 'region', label: 'Регион' },
    { key: 'grapeVariety', label: 'Сорт винограда' },
    { key: 'fermentation', label: 'Ферментация' },
    { key: 'oak', label: 'Дуб' },
    { key: 'alcoholContent', label: 'Содержание алкоголя' },
    { key: 'acidityLevel', label: 'Уровень кислотности' },
    { key: 'sweetness', label: 'Сладость' },
  ];

  const renderSearchParameter = (param: { key: string; label: string }) => (
    <View key={param.key} style={styles.parameterRow}>
      <Text style={styles.parameterLabel}>{param.label}:</Text>
      <TextInput
        style={styles.parameterInput}
        placeholder={param.label}
        onChangeText={text => updateCriteria(param.key, text)}
        value={searchCriteria[param.key] as string || ''}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Верхняя часть для ввода параметров */}
      <View style={styles.topSection}>
        <ScrollView contentContainerStyle={styles.parametersContainer}>
          <Text style={styles.headerTitle}>Поиск записей</Text>
          {searchParameters.map(renderSearchParameter)}
          {/* Секция сортировки */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Сортировка</Text>
            <Picker
              selectedValue={sortBy}
              onValueChange={(itemValue: 'wineryName' | 'wineName' | 'harvestYear') => setSortBy(itemValue)}
            >
              <Picker.Item label="По винодельне" value="wineryName" />
              <Picker.Item label="По названию вина" value="wineName" />
              <Picker.Item label="По году урожая" value="harvestYear" />
            </Picker>
          </View>
        </ScrollView>
      </View>

      {/* Средний ряд с кнопками */}
      <View style={styles.buttonRow}>
        <Button title="Искать" onPress={handleSearch} color="#2ecc71" />
        <Button title="В главное меню" onPress={navigateToMainMenu} />
      </View>

      {/* Нижняя часть для отображения результатов */}
      <View style={styles.bottomSection}>
        <Text style={styles.resultsTitle}>Найдено записей: {filteredRecords.length}</Text>
        <FlatList
          data={filteredRecords}
          keyExtractor={(item, index) => item.id || `${item.wineName}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => navigateToDetail(item)}>
              <Text style={styles.itemTitle}>{item.wineryName}</Text>
              <Text style={styles.itemSubtitle}>{item.wineName}</Text>
              <Text style={styles.itemDetails}>
                {item.harvestYear} | {item.wineType} | {item.country}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.5,
    padding: 5,
    backgroundColor: '#f8f9fa',
  },
  bottomSection: {
    flex: 0.5,
    padding: 5,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  parametersContainer: {
    paddingBottom: 10,
  },
  parameterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  parameterLabel: {
    width: 150,
    fontSize: 14,
  },
  parameterInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  section: {
    marginTop: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
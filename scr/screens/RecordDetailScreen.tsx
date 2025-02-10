import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Alert 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SearchStackParamList } from '../navigation/AppNavigator';
import { loadRecords } from '../utils/Storage';
import { WineRecord } from '../models/WineRecord';

// Определяем тип параметров маршрута для экрана детального просмотра
type RecordDetailRouteProp = RouteProp<SearchStackParamList, 'RecordDetail'>;

const RecordDetailScreen: React.FC = () => {
  const route = useRoute<RecordDetailRouteProp>();
  const navigation = useNavigation();
  const { recordId } = route.params;

  const [records, setRecords] = useState<WineRecord[] | null>(null);
  const [record, setRecord] = useState<WineRecord | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const loadedRecords = await loadRecords();
        if (loadedRecords) {
          setRecords(loadedRecords);
          const found = loadedRecords.find(r => r.id === recordId);
          if (found) {
            setRecord(found);
          } else {
            Alert.alert("Ошибка", "Запись не найдена");
          }
        } else {
          Alert.alert("Ошибка", "Не удалось загрузить записи");
        }
      } catch (error) {
        Alert.alert("Ошибка", "Произошла ошибка при загрузке записи");
      }
    };
    fetchRecords();
  }, [recordId]);

  // Функция для безопасного доступа к вложенным данным
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
  };

  // Массив параметров для детального отображения (28 параметров)
  const detailParameters = [
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

  if (!record) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Запись не найдена или загружается...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Детальный просмотр записи</Text>

      {/* Отображение миниатюр фотографий, если они есть */}
      {record.photos && Array.isArray(record.photos) && record.photos.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.photosContainer}
        >
          {record.photos.map((uri: string, index: number) => (
            <Image key={index} source={{ uri }} style={styles.thumbnail} />
          ))}
        </ScrollView>
      )}

      {/* Вывод всех 28 параметров */}
      {detailParameters.map(param => (
        <View key={param.key} style={styles.detailRow}>
          <Text style={styles.label}>{param.label}:</Text>
          <Text style={styles.value}>{getNestedValue(record, param.key)}</Text>
        </View>
      ))}

      <Button title="Назад" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  photosContainer: {
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 4,
  },
  detailRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});

export default RecordDetailScreen;
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { WineRecord } from '../models/WineRecord';

type RootStackParamList = {
  RecordDetail: {
    records: WineRecord[];
    currentIndex: number;
  };
};

const RecordDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'RecordDetail'>>();
  const { records, currentIndex } = route.params;
  const [currentRecordIndex, setCurrentRecordIndex] = React.useState(currentIndex);

  const currentRecord = records[currentRecordIndex];

  const handlePrevious = () => {
    if (currentRecordIndex > 0) {
      setCurrentRecordIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentRecordIndex < records.length - 1) {
      setCurrentRecordIndex(prev => prev + 1);
    }
  };

  const renderField = (label: string, value: string | number) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  );

  const renderPhoto = (uri: string | null, label: string) => (
    <View style={styles.photoContainer}>
      <Text style={styles.photoLabel}>{label}</Text>
      {uri ? (
        <Image source={{ uri }} style={styles.photo} />
      ) : (
        <Text style={styles.noPhoto}>Нет фото</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Основная информация */}
      <View style={styles.section}>
        {renderField('Название винодельни', currentRecord.wineryName)}
        {renderField('Название вина', currentRecord.wineName)}
        {renderField('Год урожая', currentRecord.harvestYear)}
        {renderField('Год розлива', currentRecord.bottlingYear)}
        {renderField('Винодел', currentRecord.winemaker)}
        {renderField('Собственник', currentRecord.owner)}
        {renderField('Страна', currentRecord.country)}
        {renderField('Регион', currentRecord.region)}
        {renderField('Сахар (%)', currentRecord.sugarContent)}
        {renderField('Спирт (%)', currentRecord.alcoholContent)}
        {renderField('Тип вина', currentRecord.wineType)}
        {renderField('Вид вина', currentRecord.wineCategory)}
        {renderField('Цвет вина', currentRecord.wineColor)}
        {renderField('Цена', currentRecord.price)}
      </View>

      {/* Дегустационные заметки */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Дегустационные заметки</Text>
        {renderField('Цвет', currentRecord.tastingNotes.colorNotes)}
        {renderField('Плотность', currentRecord.tastingNotes.density)}
        {renderField('Первый нос', currentRecord.tastingNotes.firstNose)}
        {renderField('Аромат после аэрации', currentRecord.tastingNotes.aromaAfterAeration)}
        {renderField('Вкус', currentRecord.tastingNotes.taste)}
        {renderField('Танины', currentRecord.tastingNotes.tannins)}
        {renderField('Кислотность', currentRecord.tastingNotes.acidity)}
        {renderField('Сладость', currentRecord.tastingNotes.sweetness)}
        {renderField('Баланс', currentRecord.tastingNotes.balance)}
        {renderField('Ассоциации', currentRecord.tastingNotes.associations)}
        {renderField('Дата потребления', currentRecord.tastingNotes.consumptionDate)}
      </View>

      {/* Фотографии */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Фотографии</Text>
        {renderPhoto(currentRecord.photos.bottlePhoto, 'Бутылка')}
        {renderPhoto(currentRecord.photos.labelPhoto, 'Этикетка')}
        {renderPhoto(currentRecord.photos.backLabelPhoto, 'Контрэтикетка')}
        {renderPhoto(currentRecord.photos.plaquePhoto, 'Плакетка')}
      </View>

      {/* Навигация между записями */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handlePrevious}
          disabled={currentRecordIndex === 0}>
          <Text style={[styles.navText, currentRecordIndex === 0 && styles.disabled]}>
            ← Предыдущая
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handleNext}
          disabled={currentRecordIndex === records.length - 1}>
          <Text style={[styles.navText, currentRecordIndex === records.length - 1 && styles.disabled]}>
            Следующая →
          </Text>
        </TouchableOpacity>
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
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    width: '40%',
  },
  value: {
    fontSize: 14,
    color: '#2c3e50',
    width: '60%',
    textAlign: 'right',
  },
  photoContainer: {
    marginBottom: 16,
  },
  photoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  noPhoto: {
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    padding: 12,
  },
  navText: {
    color: '#3498db',
    fontSize: 14,
  },
  disabled: {
    color: '#bdc3c7',
  },
});

export default RecordDetailScreen;

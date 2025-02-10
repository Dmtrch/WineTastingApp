import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert, 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { WineRecord, WineType, WineCategory, WineColor } from '../models/WineRecord';
import { saveRecords, loadRecords } from '../utils/Storage';
import { savePhotosToAlbum } from '../utils/PhotoManager';

const TastingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [grapeVariety, setGrapeVariety] = useState({ name: '', percentage: 0 });
  
  const [record, setRecord] = useState<WineRecord>({
    wineryName: '',
    wineName: '',
    harvestYear: '',
    bottlingYear: '',
    grapeVarieties: [],
    winemaker: '',
    owner: '',
    country: '',
    region: '',
    sugarContent: '',
    alcoholContent: '',
    wineType: 'dry',
    wineCategory: 'still',
    wineColor: 'red',
    price: '',
    tastingNotes: {
      colorNotes: '',
      density: '',
      firstNose: '',
      aromaAfterAeration: '',
      taste: '',
      tannins: '',
      acidity: '',
      sweetness: '',
      balance: '',
      associations: '',
      consumptionDate: '',
    },
    personalVerdict: {
      verdict: 'mine',
      take: false,
      other: '',
    },
    photos: {
      bottlePhoto: null,
      labelPhoto: null,
      backLabelPhoto: null,
      plaquePhoto: null,
    },
  });

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert('Требуются разрешения для работы с камерой и галереей');
      }
    })();
  }, []);

  // Регион: Все 28 полей ввода
  const updateField = (field: string, value: any) => {
    setRecord(prev => ({ ...prev, [field]: value }));
  };

  const updateTastingNotes = (field: string, value: string) => {
    setRecord(prev => ({
      ...prev,
      tastingNotes: { ...prev.tastingNotes, [field]: value }
    }));
  };

  const updateVerdict = (field: string, value: string | boolean) => {
    setRecord(prev => ({
      ...prev,
      personalVerdict: { ...prev.personalVerdict, [field]: value }
    }));
  };

  const addGrapeVariety = () => {
    if (grapeVariety.name && grapeVariety.percentage > 0) {
      setRecord(prev => ({
        ...prev,
        grapeVarieties: [...prev.grapeVarieties, grapeVariety]
      }));
      setGrapeVariety({ name: '', percentage: 0 });
    }
  };

  const handleTakePhoto = async (type: keyof typeof record.photos) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setRecord(prev => ({
        ...prev,
        photos: { ...prev.photos, [type]: uri }
      }));
      await savePhotosToAlbum([uri]);
    }
  };

  const handleSelectPhoto = async (type: keyof typeof record.photos) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setRecord(prev => ({
        ...prev,
        photos: { ...prev.photos, [type]: uri }
      }));
    }
  };

  const handleSave = async () => {
    try {
      const totalPercentage = record.grapeVarieties.reduce((sum, item) => sum + item.percentage, 0);
      if (totalPercentage > 100) {
        Alert.alert('Ошибка', 'Сумма процентов сортов винограда не может превышать 100%');
        return;
      }

      const existingRecords = await loadRecords();
      const newRecords = [...existingRecords, record];
      await saveRecords(newRecords);
      
      Alert.alert('Сохранено', 'Запись успешно добавлена');
      setRecord({
        ...record,
        wineryName: '',
        wineName: '',
        grapeVarieties: [],
        photos: { bottlePhoto: null, labelPhoto: null, backLabelPhoto: null, plaquePhoto: null }
      });
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить запись');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Основная информация */}
      <Text style={styles.sectionHeader}>Основная информация</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Название винодельни"
        value={record.wineryName}
        onChangeText={t => updateField('wineryName', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Название вина"
        value={record.wineName}
        onChangeText={t => updateField('wineName', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Год урожая"
        value={String(record.harvestYear)}
        onChangeText={t => updateField('harvestYear', Number(t))}
      />

      <TextInput
        style={styles.input}
        placeholder="Год розлива"
        value={String(record.bottlingYear)}
        onChangeText={t => updateField('bottlingYear', Number(t))}
      />

      <View style={styles.grapeSection}>
        <Text style={styles.subHeader}>Сорта винограда (%)</Text>
        <TextInput
          style={styles.smallInput}
          placeholder="Сорт"
          value={grapeVariety.name}
          onChangeText={t => setGrapeVariety(prev => ({ ...prev, name: t }))}
        />
        <TextInput
          style={styles.smallInput}
          placeholder="Процент"
          keyboardType="numeric"
          value={String(grapeVariety.percentage)}
          onChangeText={t => setGrapeVariety(prev => ({ ...prev, percentage: Number(t) }))}
        />
        <Button title="Добавить сорт" onPress={addGrapeVariety} />
        {record.grapeVarieties.map((item, index) => (
          <Text key={index}>{item.name} - {item.percentage}%</Text>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Винодел"
        value={record.winemaker}
        onChangeText={t => updateField('winemaker', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Собственник"
        value={record.owner}
        onChangeText={t => updateField('owner', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Страна"
        value={record.country}
        onChangeText={t => updateField('country', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Регион"
        value={record.region}
        onChangeText={t => updateField('region', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Сахар (%)"
        value={String(record.sugarContent)}
        onChangeText={t => updateField('sugarContent', Number(t))}
      />

      <TextInput
        style={styles.input}
        placeholder="Спирт (%)"
        value={String(record.alcoholContent)}
        onChangeText={t => updateField('alcoholContent', Number(t))}
      />

      <View style={styles.pickerContainer}>
        <Text>Вид вина:</Text>
        <Picker
          selectedValue={record.wineType}
          onValueChange={v => updateField('wineType', v)}>
          <Picker.Item label="Сухое" value="dry" />
          <Picker.Item label="Полусухое" value="semi-dry" />
          <Picker.Item label="Полусладкое" value="semi-sweet" />
          <Picker.Item label="Сладкое" value="sweet" />
          <Picker.Item label="Десертное" value="dessert" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text>Тип вина:</Text>
        <Picker
          selectedValue={record.wineCategory}
          onValueChange={v => updateField('wineCategory', v)}>
          <Picker.Item label="Тихое" value="still" />
          <Picker.Item label="Игристое" value="sparkling" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text>Цвет вина:</Text>
        <Picker
          selectedValue={record.wineColor}
          onValueChange={v => updateField('wineColor', v)}>
          <Picker.Item label="Красное" value="red" />
          <Picker.Item label="Белое" value="white" />
          <Picker.Item label="Розовое" value="rose" />
          <Picker.Item label="Оранж" value="orange" />
          <Picker.Item label="Глу-глу" value="glou-glou" />
          <Picker.Item label="Другое" value="other" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Цена"
        value={String(record.price)}
        onChangeText={t => updateField('price', Number(t))}
      />

      {/* Дегустация */}
      <Text style={styles.sectionHeader}>Дегустационные заметки</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Цвет (заметки)"
        value={record.tastingNotes.colorNotes}
        onChangeText={t => updateTastingNotes('colorNotes', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Плотность"
        value={record.tastingNotes.density}
        onChangeText={t => updateTastingNotes('density', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Первый нос (без аэрации)"
        value={record.tastingNotes.firstNose}
        onChangeText={t => updateTastingNotes('firstNose', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Аромат после аэрации"
        value={record.tastingNotes.aromaAfterAeration}
        onChangeText={t => updateTastingNotes('aromaAfterAeration', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Вкус (спиртуозность)"
        value={record.tastingNotes.taste}
        onChangeText={t => updateTastingNotes('taste', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Танины"
        value={record.tastingNotes.tannins}
        onChangeText={t => updateTastingNotes('tannins', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Кислотность"
        value={record.tastingNotes.acidity}
        onChangeText={t => updateTastingNotes('acidity', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Сладость"
        value={record.tastingNotes.sweetness}
        onChangeText={t => updateTastingNotes('sweetness', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Баланс"
        value={record.tastingNotes.balance}
        onChangeText={t => updateTastingNotes('balance', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Ассоциации"
        value={record.tastingNotes.associations}
        onChangeText={t => updateTastingNotes('associations', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Дата потребления"
        value={record.tastingNotes.consumptionDate}
        onChangeText={t => updateTastingNotes('consumptionDate', t)}
      />

      {/* Личный вердикт */}
      <Text style={styles.sectionHeader}>Личный вердикт</Text>
      
      <View style={styles.pickerContainer}>
        <Text>Моё/Не моё:</Text>
        <Picker
          selectedValue={record.personalVerdict.verdict}
          onValueChange={v => updateVerdict('verdict', v)}>
          <Picker.Item label="Моё" value="mine" />
          <Picker.Item label="Не моё" value="not-mine" />
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text>Брать:</Text>
        <Button
          title={record.personalVerdict.take ? "Да" : "Нет"}
          onPress={() => updateVerdict('take', !record.personalVerdict.take)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Прочее"
        value={record.personalVerdict.other}
        onChangeText={t => updateVerdict('other', t)}
      />

      {/* Фотографии */}
      <Text style={styles.sectionHeader}>Фотографии</Text>
      
      {Object.entries(record.photos).map(([type, uri]) => (
        <View key={type} style={styles.photoSection}>
          <Text style={styles.photoLabel}>
            {type.replace('Photo', '').replace(/([A-Z])/g, ' $1').trim()}
          </Text>
          <View style={styles.photoButtons}>
            <Button title="Сделать фото" onPress={() => handleTakePhoto(type as any)} />
            <Button title="Выбрать" onPress={() => handleSelectPhoto(type as any)} />
          </View>
          {uri && <Image source={{ uri }} style={styles.thumbnail} />}
        </View>
      ))}

      <Button title="Сохранить запись" onPress={handleSave} color="#2ecc71" />
      <Button title="К поиску" 
        onPress={() => navigation.navigate('Search' as never)} 
        color="#3498db" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#f8f9fa',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  smallInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    backgroundColor: 'white',
  },
  grapeSection: {
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 15,
    padding: 5,
    backgroundColor: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 10,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default TastingScreen;
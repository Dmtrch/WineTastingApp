import React, { useState } from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WineRecord } from '../models/WineRecord';
import { loadRecords } from '../utils/Storage';

const DataTransferScreen: React.FC = () => {
  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const records = await loadRecords();
      const jsonString = JSON.stringify(records);
      const fileUri = FileSystem.documentDirectory + 'wine_records_export.json';

      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Экспорт данных',
      });

      Alert.alert('Успех', 'Данные успешно экспортированы');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось экспортировать данные');
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Экспорт и импорт данных</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Экспорт всех данных</Text>
        <Text style={styles.description}>
          Создаст JSON-файл со всеми записями и фотографиями.
        </Text>
        <Button
          title={exporting ? 'Экспортируется...' : 'Экспортировать всё'}
          onPress={handleExportAll}
          disabled={exporting}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Экспорт выбранных записей</Text>
        <Text style={styles.description}>
          Выберите записи для экспорта в отдельный файл.
        </Text>
        <Button
          title="Выбрать записи"
          onPress={() => Alert.alert('В разработке', 'Функция в разработке')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Импорт данных</Text>
        <Text style={styles.description}>
          Загрузите JSON-файл для восстановления записей.
        </Text>
        <Button
          title="Импортировать"
          onPress={() => Alert.alert('В разработке', 'Функция в разработке')}
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

export default DataTransferScreen;
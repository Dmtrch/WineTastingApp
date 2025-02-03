import * as FileSystem from 'expo-file-system';
import { WineRecord } from '../models/WineRecord';

const FILE_NAME = 'wineData.json';
const FILE_PATH = `${FileSystem.documentDirectory}${FILE_NAME}`;

export const saveRecords = async (records: WineRecord[]) => {
  try {
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(records));
  } catch (error) {
    console.error('Ошибка сохранения:', error);
  }
};

export const loadRecords = async (): Promise<WineRecord[]> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);
    if (!fileInfo.exists) return [];
    
    const content = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(content);
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return [];
  }
};
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export const savePhotosToAlbum = async (photos: string[]) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Требуется разрешение на доступ к галерее');
    return;
  }

  const album = await MediaLibrary.getAlbumAsync('WineNote');
  if (!album) {
    await MediaLibrary.createAlbumAsync('WineNote', photos[0], false);
  }

  for (const uri of photos) {
    await MediaLibrary.saveToLibraryAsync(uri);
  }
};
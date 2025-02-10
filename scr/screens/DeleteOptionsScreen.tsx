import React, { useState } from "react";
import { 
  View, 
  Text, 
  Button, 
  Alert, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DeleteOptionsStackParamList } from "../navigation/AppNavigator"; // Проверьте корректность пути
import { saveRecords } from "../utils/Storage";

type NavigationProp = StackNavigationProp<DeleteOptionsStackParamList, "DeleteOptions">;

const DeleteOptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isDeleting, setIsDeleting] = useState(false);

  // Функция для возврата на главное меню
  const navigateToMainMenu = () => {
    // Переходим напрямую на маршрут "Home"
    navigation.navigate("Home" as any);
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await saveRecords([]);
      Alert.alert("Успех", "Все записи успешно удалены");
      // После успешного удаления переходим на главное меню
      navigateToMainMenu();
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось удалить записи");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      "Подтверждение удаления",
      "Вы уверены, что хотите удалить все записи? Это действие нельзя отменить.",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", style: "destructive", onPress: handleDeleteAll },
      ]
    );
  };

  const navigateToSelectRecords = () => {
    navigation.navigate("SelectRecordsToDelete");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок окна */}
      <Text style={styles.title}>Удаление записей</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Удалить все записи</Text>
        <Text style={styles.description}>
          Это действие удалит все записи и связанные с ними фотографии.
        </Text>
        <Button
          title={isDeleting ? "Удаление..." : "Удалить всё"}
          onPress={confirmDeleteAll}
          color="#e74c3c"
          disabled={isDeleting}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Выбрать записи для удаления</Text>
        <Text style={styles.description}>
          Выберите конкретные записи, которые хотите удалить.
        </Text>
        <Button
          title="Выбрать записи"
          onPress={navigateToSelectRecords}
          color="#f39c12"
        />
      </View>

      {/* Кнопка возврата на главное меню расположена в нижней части экрана */}
      <View style={styles.bottomButton}>
        <Button title="В главное меню" onPress={navigateToMainMenu} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 50,       // Отступ сверху для размещения ниже "челки"
    marginBottom: 20,
    textAlign: "center", // Центрирование текста по горизонтали
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 16,
  },
  bottomButton: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default DeleteOptionsScreen;
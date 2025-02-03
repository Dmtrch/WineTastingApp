import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator"; 

type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Дегустационные записи</Text>

      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={[styles.button, styles.blueButton]}
        onPress={() => navigation.navigate("SearchStack")}
      >
        <Text style={styles.buttonText}>Поиск вина</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.greenButton]}
        onPress={() => navigation.navigate("Tasting")}
      >
        <Text style={styles.buttonText}>Дегустация</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.orangeButton]}
        onPress={() => navigation.navigate("DataTransfer")}
      >
        <Text style={styles.buttonText}>Экспорт и импорт данных</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.redButton]}
        onPress={() => navigation.navigate("DeleteOptionsStack")}
      >
        <Text style={styles.buttonText}>Удаление</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  blueButton: {
    backgroundColor: "#4285F4",
  },
  greenButton: {
    backgroundColor: "#34A853",
  },
  orangeButton: {
    backgroundColor: "#FBBC05",
  },
  redButton: {
    backgroundColor: "#EA4335",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
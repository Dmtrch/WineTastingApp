import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import RecordDetailScreen from "../screens/RecordDetailScreen";
import TastingScreen from "../screens/TastingScreen";
import DataTransferScreen from "../screens/DataTransferScreen";
import DeleteOptionsScreen from "../screens/DeleteOptionsScreen";
import SelectRecordsToDeleteScreen from "../screens/SelectRecordsToDeleteScreen";

// Основной стек навигации
export type RootStackParamList = {
  Home: undefined;
  SearchStack: undefined;
  Tasting: undefined;
  DataTransfer: undefined;
  DeleteOptionsStack: undefined;
};

// Стек для `SearchScreen`
export type SearchStackParamList = {
  Search: undefined;
  RecordDetail: { recordId: string };
};

// Стек для `DeleteOptionsScreen`
export type DeleteOptionsStackParamList = {
  DeleteOptions: undefined;
  SelectRecordsToDelete: undefined;
};

// Создаём стеки
const RootStack = createStackNavigator<RootStackParamList>();
const SearchStack = createStackNavigator<SearchStackParamList>();
const DeleteOptionsStack = createStackNavigator<DeleteOptionsStackParamList>();

// Навигатор для `SearchScreen`
const SearchNavigator = () => {
  return (
    <SearchStack.Navigator initialRouteName="Search" id={undefined}>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="RecordDetail" component={RecordDetailScreen} />
    </SearchStack.Navigator>
  );
};

// Навигатор для `DeleteOptionsScreen`
const DeleteOptionsNavigator = () => {
  return (
    <DeleteOptionsStack.Navigator initialRouteName="DeleteOptions" id={undefined}>
      <DeleteOptionsStack.Screen name="DeleteOptions" component={DeleteOptionsScreen} />
      <DeleteOptionsStack.Screen name="SelectRecordsToDelete" component={SelectRecordsToDeleteScreen} />
    </DeleteOptionsStack.Navigator>
  );
};

// Основной навигатор
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home" id={undefined}>
        <RootStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="SearchStack" component={SearchNavigator} options={{ headerShown: false }} />
        <RootStack.Screen name="Tasting" component={TastingScreen} />
        <RootStack.Screen name="DataTransfer" component={DataTransferScreen} />
        <RootStack.Screen name="DeleteOptionsStack" component={DeleteOptionsNavigator} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
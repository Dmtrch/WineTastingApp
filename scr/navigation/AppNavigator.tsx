import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
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
  SelectRecordsToDelete: undefined;
};

// Типы для стека поиска
export type SearchStackParamList = {
  Search: undefined;
  RecordDetail: { recordId: string };
};

const RootStack = createStackNavigator<RootStackParamList>();
const SearchStack = createStackNavigator<SearchStackParamList>();

// Вложённый навигатор для поиска
const SearchNavigator = () => {
  return (
    <SearchStack.Navigator initialRouteName="Search">
      <SearchStack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ headerShown: false }}
      />
      <SearchStack.Screen 
        name="RecordDetail" 
        component={RecordDetailScreen} 
      />
    </SearchStack.Navigator>
  );
};

// Основной навигатор приложения
const AppNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Home">
      <RootStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <RootStack.Screen 
        name="SearchStack" 
        component={SearchNavigator} 
        options={{ headerShown: false }}
      />
      <RootStack.Screen 
        name="Tasting" 
        component={TastingScreen}
      />
      <RootStack.Screen 
        name="DataTransfer" 
        component={DataTransferScreen}
      />
      <RootStack.Screen 
        name="DeleteOptionsStack" 
        component={DeleteOptionsScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SelectRecordsToDelete"
        component={SelectRecordsToDeleteScreen}
      />
    </RootStack.Navigator>
  );
};

export default AppNavigator;
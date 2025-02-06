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

const RootStack = createStackNavigator<RootStackParamList>();

// Подчинённые навигаторы
const AppNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Home" id={undefined}>
      <RootStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <RootStack.Screen 
        name="SearchStack" 
        component={SearchScreen} 
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
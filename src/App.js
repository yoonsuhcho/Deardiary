// App.js
import React, { useState } from "react";
import Calendar from "./Calendar";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { CalendarProvider } from "./CalendarProvider";
import indexScreen from "./index";
import WeekPage from "./WeekPage";
import TodayPage from "./TodayPage";
import Diary from "./Diary";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <CalendarProvider>
        <Stack.Navigator>
          <Stack.Screen name="home" component={indexScreen}
          options={{ headerTransparent: true }} />
          <Stack.Screen name="week" component={WeekPage} 
          options={{ headerTransparent: true }}/>
          <Stack.Screen name="today" component={TodayPage}
          options={{ headerTransparent: true }} />
          <Stack.Screen name="diary" component={Diary} 
          options={{ headerTransparent: true }}/>
          <Stack.Screen name="calendar" component={Calendar} />
        </Stack.Navigator>
      </CalendarProvider>
    </NavigationContainer>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen'; 
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import ChronoQuizScreen from '../screens/ChronoQuizScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RankingScreen from '../screens/RankingScreen';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CategorySelectionScreen" component={CategorySelectionScreen} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        <Stack.Screen name="ChronoQuizScreen" component={ChronoQuizScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="RankingScreen" component={RankingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




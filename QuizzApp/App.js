import React from 'react';
import './config/firebase';
import RootNavigation from './navigation';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

export default function App() {
  return (
    <RootNavigation />
  );
};

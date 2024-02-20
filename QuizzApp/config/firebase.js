// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Constants from "expo-constants";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmYt4os9zvq9cdm9jDcWSxoieDc66GOII",
    authDomain: "conflictapp-371e3.firebaseapp.com",
    projectId: "conflictapp-371e3",
    storageBucket: "conflictapp-371e3.appspot.com",
    messagingSenderId: "873078351596",
    appId: "1:873078351596:web:b57ee6f89f20a7a24427c9"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Configuration de Firebase Auth avec AsyncStorage pour la persistance
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export function useAuthentication() {
  const [user, setUser] = useState('');

  useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(undefined);
    });

    return () => {
      unsubscribeFromAuthStatusChanged(); // Assurez-vous de désinscrire lorsque le composant est démonté.
    };
  }, []);

  return { user };
}
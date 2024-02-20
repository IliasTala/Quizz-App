import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";  // Importez les fonctions nécessaires de Firestore
import { useAuthentication } from '../utils/hooks/useAuthentication';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const auth = getAuth();

const ProfileScreen = () => {
  const { user } = useAuthentication();
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [highScore, setHighScore] = useState(0);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, "users", user.uid);
        const userDocData = await getDoc(userDoc);

        if (userDocData.exists()) {
          setUsername(userDocData.data().name);
          setHighScore(userDocData.data().highScore || 0);
        } else {
          console.log("No such document!");
        }
      }
    }

    fetchUserData();
  }, [user]);

  const handleUsernameChange = async () => {
    if (user && newUsername) {
      const db = getFirestore();

      // Query pour verifier si le username existe deja
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('name', '==', newUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If username existe deja, affichez une alerte
        Alert.alert('Error', 'This username is already taken.');
      } else {
        // else username n'est pas pris, mettez à jour le profil de l'utilisateur
        const userDoc = doc(db, "users", user.uid);

        await updateDoc(userDoc, {
          name: newUsername
        });

        setUsername(newUsername);
        setNewUsername('');  // Clear the input field
      }
    }
  };

  return (
    
    <View className="flex-1 bg-gray-900 p-5 items-center justify-center">
      <View className="absolute left-5 top-5 mt-10">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5Icon name="arrow-left" size={25} color="white" />
          </TouchableOpacity>
        </View>
      <View className="bg-gray-800 p-5 rounded-lg items-center w-full max-w-md">
        <Image source={require('../assets/profile.png')} className="w-36 h-36 mb-5" />

        {user && (
          <>
            <Text className="text-2xl text-white mb-2">Welcome, {username} !</Text>
            <View className="border-b border-gray-700 w-full my-4"></View>
            <Text className="text-lg text-gray-400">Highest score in Chrono Mode :</Text>
            <Text className="text-xl text-white mb-5">{highScore}</Text>
            <TextInput 
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username"
              placeholderTextColor="gray"
              className="bg-gray-700 text-white p-2 rounded mb-2 w-full"
            />
            <TouchableOpacity onPress={handleUsernameChange} className="bg-blue-500 p-2 rounded">
              <Text className="text-white">Change</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default ProfileScreen;

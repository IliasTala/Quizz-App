import React, { useState, useEffect, useCallback  } from 'react';
import { View, Text, Image, TouchableOpacity, LogBox } from 'react-native';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthentication();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState(''); 
  const [highScore, setHighScore] = useState(0);
  
  const handleSignOut = () => {
    signOut(auth);
  };

  const navigateToProfile = () => {
    navigation.navigate('ProfileScreen'); 
  };

  const navigateToRanking = () => {
    navigation.navigate('RankingScreen');
  }
  

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        if(user) {
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
      };

      fetchUserData();
    }, [user])
  );
  useEffect(() => {
    const fetchUserData = async () => {
      if(user) {
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

  return (
    <View className=" flex-1 bg-gray-900 p-5">
      <View className="mt-10 flex-1 items-center mb-5">
        <Image source={require('../assets/logo.png')} className="w-36 h-36 mb-5" />
      </View>

      <View className="mt-10 absolute top-40 left-5">
        <TouchableOpacity onPress={navigateToRanking}>
          <FontAwesome5Icon name="trophy" size={50} color="white" />
        </TouchableOpacity>
      </View>

      <View className=" mt-10 absolute top-5 right-5">
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <FontAwesome5Icon name="user-circle" size={50} color="white" />
        </TouchableOpacity>

        {dropdownVisible && (
          <View className="mt-12 bg-gray-800 rounded-md p-2">
            <TouchableOpacity
              onPress={navigateToProfile}
              className="bg-blue-500 py-2 px-4 rounded-md mb-2">
              <Text className="text-white text-center text-lg">Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignOut}
              className="bg-red-500 py-2 px-4 rounded-md">
              <Text className="text-white text-center text-lg">Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {user && (
        <>
          <Text className="mt-10 text-2xl mb-5 text-center text-white">Welcome, {username} !</Text>
        </>
      )}
      
      <View className="flex-1 mt-10">
        <View className="flex-row justify-center mt-10">
          {/* Mode Classique */}
          <View className="m-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('CategorySelectionScreen')}
              className="bg-blue-500 p-5 rounded-md">
              <FontAwesome5Icon name="book" size={40} color="white" />
              <Text className="text-white text-center mt-2"> Classic Mode</Text>
            </TouchableOpacity>
          </View>

          {/* Mode Chrono */}
          <View className="m-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('ChronoQuizScreen')}
              className="bg-purple-500 p-5 rounded-md">
              <FontAwesome5Icon name="clock" size={40} color="white" />
              <Text className="text-white text-center mt-2"> Chrono Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

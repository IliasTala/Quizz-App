import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 


const auth = getAuth();

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  
  const createAccount = async () => {
    if (email === '' || password === '' || username === '' || password !== confirmPassword) {
      setValidationMessage('Required fields missing or passwords do not match');
    } else {
      const db = getFirestore();

      // Vérification if username exist
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('name', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setValidationMessage('This username is already taken.');
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          await setDoc(doc(db, "users", user.uid), {
            name: username,
            score: 0,
          });

          navigation.navigate('Sign In');
        } catch (error) {
          setValidationMessage(error.message);
        }
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <View className="items-center mb-10">
        <Image 
          source={require('../assets/logo.png')} 
          className="w-36 h-36" 
        />
      </View>
      
      <View className="flex-1 justify-center">
        <Input
          placeholder='Username'
          placeholderTextColor="#164e63"
          inputStyle={{ color: 'white', borderBottomWidth: 2, borderBottomColor: '#164e63' }}
          containerStyle={{ marginBottom: 10 }}
          value={username}
          onChangeText={(text) => setUsername(text)}
          leftIcon={<Icon name='user' size={16} color="#164e63" />}
        />
        <Input
          placeholder='Email'
          placeholderTextColor="#164e63"
          inputStyle={{ color: 'white', borderBottomWidth: 2, borderBottomColor: '#164e63' }}
          containerStyle={{ marginBottom: 10 }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          leftIcon={<Icon name='envelope' size={16} color="#164e63" />}
        />
        <Input
          placeholder='Password'
          placeholderTextColor="#164e63"
          inputStyle={{ color: 'white', borderBottomWidth: 2, borderBottomColor: '#164e63' }}
          containerStyle={{ marginBottom: 10 }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          leftIcon={<Icon name='key' size={16} color="#164e63" />}
        />
        <Input
          placeholder='Confirm Password'
          placeholderTextColor="#164e63"
          inputStyle={{ color: 'white', borderBottomWidth: 2, borderBottomColor: '#164e63' }}
          containerStyle={{ marginBottom: 10 }}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry
          leftIcon={<Icon name='key' size={16} color="#164e63" />}
        />
        <Text className="text-red-500 mb-5">{validationMessage}</Text>
        <Button 
          title='Sign Up' 
          buttonStyle={{ backgroundColor: '#164e63', borderRadius: 50 }} 
          titleStyle={{ color: 'white' }}
          onPress={createAccount} 
        />
      </View>   
    </View>
  );
};

export default SignUpScreen;

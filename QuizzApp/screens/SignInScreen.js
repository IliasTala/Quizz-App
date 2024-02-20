import React, { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  async function login() {
    if (email === '' || password === '') {
      setValidationMessage('Required fields missing');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setValidationMessage(error.message);
    }
  }

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
        <Text className="text-red-500 mb-5">{validationMessage}</Text>
        <Button 
          title='Log In' 
          buttonStyle={{ backgroundColor: '#164e63', borderRadius: 50, marginBottom: 200 }}  
          titleStyle={{ color: 'white' }}
          onPress={login} 
        />
        <Button 
          title='Create new account' 
          buttonStyle={{ backgroundColor: '#164e63', borderRadius: 50 }} 
          titleStyle={{ color: 'white' }}
          onPress={() => navigation.navigate('Sign Up')}
        />
      </View>
    </View>
  );
};

export default SignInScreen;

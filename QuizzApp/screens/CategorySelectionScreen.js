import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';


const CategorySelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryMapping = {
    'Geography': 'Geography',
    'Video Games': 'Entertainment: Video Games',
    'Books': 'Entertainment: Books',
    'Music': 'Entertainment: Music',
    'Television': 'Entertainment: Television',
    'Japanese Anime & Manga': 'Entertainment: Japanese Anime &amp; Manga',
    'Science & Nature': 'Science &amp; Nature',
    'Sports': 'Sports',
    'General Knowledge': 'General Knowledge',
  };
  
  const handleCategorySelection = (category) => {
    setSelectedCategory(categoryMapping[category]);
    navigation.navigate('QuizScreen', { category: categoryMapping[category] });
  };

  const categories = Object.keys(categoryMapping);

  return (
    <View className="flex-1 bg-gray-900 pt-5">
      <View className="w-full flex-row items-center justify-center p-5">
        <View className="absolute left-5 top-5 mt-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5Icon name="arrow-left" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/logo.png')}
          className="w-40 h-40"
        />
      </View>
      
      <Text className="text-white text-center text-lg mb-5">Select a Category:</Text>
      <ScrollView className="w-full">
        <View className="flex-row flex-wrap justify-center p-2">
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className="bg-blue-500 m-2 p-6 rounded-full w-40 h-40 flex items-center justify-center"
              onPress={() => handleCategorySelection(category)}
            >
              <Text className="text-white text-center">{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default CategorySelectionScreen;

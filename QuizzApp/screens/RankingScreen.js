import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';


const RankingScreen = () => {
  const [rankingData, setRankingData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const q = query(collection(db, "users"), orderBy("highScore", "desc"));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setRankingData(users);
    };

    fetchData();
  }, []);

  const renderItem = ({ item, index }) => {
    let medalStyle = '';
    let medalIcon = '';
    let showRankNumber = true;
    let scoreColor = 'text-yellow-500';  
  
    switch (index) {
      case 0:
        medalStyle = 'bg-yellow-400';
        medalIcon = 'award'; 
        showRankNumber = false; 
        scoreColor = 'text-black-500'; 
        break;
      case 1:
        medalStyle = 'bg-gray-400';
        medalIcon = 'award';
        showRankNumber = false;
        scoreColor = 'text-black-500'; 
        break;
      case 2:
        medalStyle = 'bg-orange-500';
        medalIcon = 'award';
        showRankNumber = false;
        scoreColor = 'text-black-500'; 
        break;
      default:
        medalStyle = 'bg-gray-900';
    }
  
    return (
      <View className={`my-2 px-4 py-3 rounded flex-row items-center mr-4 ml-4 ${medalStyle} text-white`}>
        {index < 3 && (
          <FontAwesome5Icon name={medalIcon} size={25} color="white" className="mr-4" />
        )}
        {showRankNumber && (
          <Text className="text-lg font-bold text-green-400 mr-4">{index + 1}.</Text>
        )}
        <Text className="flex-1 text-lg text-white ml-2">{item.name}</Text>
        <Text className={`ml-auto text-lg font-bold ${scoreColor}`}>{item.highScore}</Text>
      </View>
    );
  };
  
  return (
    <View className="flex-1 pt-20 bg-gray-800">
      <View className="absolute left-5 top-5 mt-12">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5Icon name="arrow-left" size={25} color="white" />
        </TouchableOpacity>
      </View>
      <View className="items-center mb-5">
        <Image source={require('../assets/ranking.png')} className="w-20 h-20" />
        <Text className="text-2xl font-bold text-white">Ranking</Text>
      </View>

      <FlatList
        data={rankingData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default RankingScreen;

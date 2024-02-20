import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, LogBox } from 'react-native';
import he from 'he';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthentication } from '../utils/hooks/useAuthentication'; // Assurez-vous de l'importer correctement
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';


LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

const ProgressBar = ({ progress }) => (
  <View className="h-5 bg-gray-300 rounded-lg overflow-hidden my-5">
    <View className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
  </View>
);

const ChronoQuizScreen = () => {
  const { user } = useAuthentication(); 
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const navigation = useNavigation();
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    loadQuestions();
    if (user) {
      const fetchUserData = async () => {
        const db = getFirestore();
        const userDoc = doc(db, 'users', user.uid);
        const userDocData = await getDoc(userDoc);

        if (userDocData.exists()) {
          setHighestScore(userDocData.data().highScore || 0);
        }
      };

      fetchUserData();
    }
  }, [user]); 

  useEffect(() => {
    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);

    if (timeLeft === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
      const data = await response.json();
      const questionsWithShuffledAnswers = data.results.map(q => ({
        ...q,
        shuffledAnswers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      }));
      setQuestions((prevQuestions) => [...prevQuestions, ...questionsWithShuffledAnswers]);
      setLoading(false);
    } catch (error) {
    //  console.error('Error fetching quiz data:', error);
    }
  };
  const updateScoreInFirestore = async (newScore) => {
    const db = getFirestore();
    const scoreDoc = doc(db, 'users', user.uid);

    await updateDoc(scoreDoc, {
      highScore: newScore,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(10);
    } else {
      console.log('Quiz finished, reloading questions!');
      loadQuestions();
    }
  };


  const handleAnswer = (isCorrect, answer) => {
    setSelectedAnswer(answer);
    
    setTimeout(() => {
      if (isCorrect) {
        let points = 0;
        if (question.difficulty === 'easy') {
          points = 1;
        } else if (question.difficulty === 'medium') {
          points = 2;
        } else if (question.difficulty === 'hard') {
          points = 3;
        }
        
        const newScore = score + points;
        setScore(newScore);
        if (newScore > highestScore) {
          setHighestScore(newScore);
          updateScoreInFirestore(newScore);
        }
      }

      setSelectedAnswer(null); 
      handleNextQuestion();
    }, 800); 
};


  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const question = questions[currentQuestion];

  if (!question) {
    return (
      <View className="flex-1 items-center bg-gray-900 justify-center">
        <Image source={require('../assets/loading.gif')} className="w-20 h-20" />
      </View>
    );
  }

  if (!question || loading || questions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Image source={require('../assets/loading.gif')} className="w-20 h-20" />
      </View>
    );
  }

  
  return (
    <ScrollView className="flex-1 bg-gray-900 p-5">
      <View className="mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5Icon name="arrow-left" size={25} color="white" />
        </TouchableOpacity>
      </View>
        {/* Score Section */}
    <View className="mt-10 mb-5 flex-row justify-between items-center">
        <View className="flex-row bg-gray-800 p-3 rounded-lg shadow-lg items-center">
            <FontAwesome5Icon name="star" size={20} color="white" />
            <Text className="text-lg font-bold text-white ml-2 mr-2">Score:</Text>
            <View className="p-2 bg-blue-600 rounded-full">
                <Text className="text-lg font-bold text-white">{score}</Text>
            </View>
        </View>

        <View className="flex-row bg-gray-800 p-3 rounded-lg shadow-lg items-center">
            <FontAwesome5Icon name="trophy" size={20} color="gold" />
            <Text className="text-lg font-bold text-white ml-2 mr-2">Highest Score:</Text>
            <View className="p-2 bg-green-600 rounded-full">
                <Text className="text-lg font-bold text-white">{highestScore}</Text>
            </View>
        </View>
    </View>

        {/* Questions Section */}
        {loading ? (
            <View className="flex-1 items-center justify-center bg-gray-900">
                <Image source={require('../assets/loading.gif')} className="w-20 h-20" />
            </View>
        ) : (
            <View className="p-5 bg-gray-800 rounded-lg shadow-lg mb-5">
                <Text className="text-2xl font-bold text-white mb-3">Question {currentQuestion + 1}:</Text>
                <Text className="text-lg text-white mb-3">{he.decode(question.question)}</Text>
                <Text className="text-base text-gray-400 mb-5">Difficulty: {question.difficulty}</Text>

                <ProgressBar progress={(timeLeft / 10) * 100} />
                <Text className="text-center text-lg font-bold text-white mb-5">{timeLeft} seconds left</Text>

                {question.shuffledAnswers.map((answer, index) => {
                    const isCorrect = answer === question.correct_answer;
                    let buttonStyle = "py-3 px-5 my-1 bg-blue-600 rounded-lg";

                    if (selectedAnswer) {
                        buttonStyle = isCorrect
                            ? "py-3 px-5 my-1 bg-green-600 rounded-lg"
                            : "py-3 px-5 my-1 bg-red-600 rounded-lg";
                    }

                    return (
                        <TouchableOpacity
                            className={buttonStyle}
                            key={index}
                            onPress={() => !selectedAnswer && handleAnswer(isCorrect, answer)}
                            disabled={!!selectedAnswer}
                        >
                            <Text className="text-white text-center">{he.decode(answer)}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )}
    </ScrollView>
);

};

export default ChronoQuizScreen;
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import he from 'he'; // pour décoder les caracteres speciaux
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const QuizScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedCategory = route.params?.category;
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const isMounted = useRef(true);
  const { category } = route.params;
  const [loading, setLoading] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [answeredIncorrectly, setAnsweredIncorrectly] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [loadingNext, setLoadingNext] = useState(false);
  const [buttonAnim] = useState(new Animated.Value(0));


  const startAnimation = () => {
    Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
    }).start();
};


useEffect(() => {
    if (questions.length > 0 && questions[currentQuestion]) {
        const current = questions[currentQuestion];
        const allAnswers = [...current.incorrect_answers, current.correct_answer];
        setShuffledAnswers(shuffleArray(allAnswers));
    }
}, [currentQuestion, questions]);


  useEffect(() => {
    // Reload la liste des questions lorsque la cate change
    setAnsweredQuestions([]);
    loadQuestions();
  }, [category]);

 const loadQuestions = async () => {
  setLoading(true);

  try {
    const response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
    const data = await response.json();

    if (isMounted.current && data.results) {
      const questionsData = data.results;
      const filteredQuestions = questionsData.filter(
        (question) => question.category === selectedCategory
      );

      if (filteredQuestions.length === 0) {
        console.log("No questions found for the category. Trying again...");
        setTimeout(() => {
          loadQuestions(); // Relancer la fonction après un court delay
        }, 3000); // Attendre 3 secondes avant de réessayer
      } else {
        setQuestions(filteredQuestions);
        setCurrentQuestion(0);
      }
    }
  } catch (error) {
    console.error('Error fetching quiz data:', error);
  } finally {
    setLoading(false);
  }
};

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const loadMoreQuestions = async () => {
  while (true) {
    setLoading(true);

    try {
      const response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
      const data = await response.json();
      if (isMounted.current && data.results) {
        const questionsData = data.results;

        const filteredQuestions = questionsData.filter(
          (question) => question.category === selectedCategory
        );

        if (filteredQuestions.length > 0) {
          const newQuestions = [...questions, ...filteredQuestions];
          setQuestions(newQuestions);
          setCurrentQuestion(questions.length);
          setIsAnswered(false);
          setLoading(false);
          break; 
        }
      }
    } catch (error) {
      console.error('Error fetching more quiz data:', error);
      setLoading(false);
      break; 
    }
  }
};

const handleNextQuestion = async () => {
  const nextQuestion = currentQuestion + 1;

  if (nextQuestion >= questions.length) {
    setLoadingNext(true); // Activer/Desactiver le chargement pour le prochain ensemble de questions
    await loadMoreQuestions();
    setLoadingNext(false); 
  } else {
    setCurrentQuestion(nextQuestion);
    resetStateForNewQuestion();
  }
};


const resetStateForNewQuestion = () => {
  setAnsweredCorrectly(false);
  setAnsweredIncorrectly(false);
  setIsAnswered(false);
  setCorrectAnswerIndex(null);
};

const calculatePoints = (difficulty) => {
  const points = { easy: 1, medium: 2, hard: 3 };
  return points[difficulty] || 0;
};

  const handleAnswer = (isCorrect, difficulty) => {
    setIsAnswered(true);
  if (isCorrect) {
    setScore(score + calculatePoints(difficulty));
    } else {
      const correctIndex = questions[currentQuestion].incorrect_answers.indexOf(
        questions[currentQuestion].correct_answer
      );
      setCorrectAnswerIndex(correctIndex);
    }
  };


if (currentQuestion >= questions.length) {
  // Toutes les questions ont été répondues, vous pouvez afficher le logo ici
  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
    <Image source={require('../assets/loading.gif')} className="w-20 h-20" />
    </View>
  );
}
if (loading || questions.length === 0) {
  // Affiche l'image de loading quand les questions sont en chargemment
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
    {/* Section du score */}
    <View className="bg-gray-800 p-5 rounded-lg shadow-lg mt-10 mb-5 flex-row justify-between items-center">
      <Text className="text-2xl font-bold text-white">Score</Text>
      <View className="p-3 bg-blue-600 rounded-full">
        <Text className="text-2xl font-bold text-white">{score}</Text>
      </View>
    </View>

    {/* Section de la question */}
    <View className="mt-5 p-5 bg-gray-800 rounded-lg shadow-lg mb-5">
      <Text className="text-2xl font-bold text-white mb-3">Question {currentQuestion + 1}:</Text>
      <Text className="text-lg text-white mb-3">
        {questions[currentQuestion] ? he.decode(questions[currentQuestion].question) : ''}
      </Text>

      <Text className="text-base text-gray-400 mb-5">
        Difficulty: {questions[currentQuestion] ? questions[currentQuestion].difficulty : ''}
      </Text>

      {/* Réponses */}
      {shuffledAnswers.map((answer, index) => (
        <TouchableOpacity 
          className={`py-3 px-5 my-1 rounded-lg ${isAnswered ? (answer === questions[currentQuestion].correct_answer ? 'bg-green-600' : 'bg-red-600') : 'bg-blue-600'}`}
          key={index}
          onPress={() => handleAnswer(answer === questions[currentQuestion].correct_answer, questions[currentQuestion].difficulty)}
          disabled={isAnswered}
        >
          <Text className="text-white text-center">{he.decode(answer)}</Text>              
        </TouchableOpacity>
      ))}
      
      {/* Bouton Suivant avec marge augmentée */}
      <TouchableOpacity 
          className={`py-2 px-4 mt-5 rounded-lg ${isAnswered && !loadingNext ? 'bg-blue-600' : 'bg-gray-600'}`} 
          onPress={() => {
            startAnimation();
            handleNextQuestion(); 
        }}
          disabled={!isAnswered || loadingNext}
        >
          {loadingNext ? (
            <Text className="text-white text-center">Loading...</Text>
          ) : (
            <Text className="text-white text-center">Next</Text>
          )}
        </TouchableOpacity>

    </View>
  </ScrollView>
);
};

export default QuizScreen;
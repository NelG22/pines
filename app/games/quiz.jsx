import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { client, databases } from '../../lib/appwrite'

const quizQuestions = [
    {
        question: "What is the location of Burnham Park?",
        options: ["Cebu City", "Baguio City", "Davao City", "Manila"],
        correctAnswer: 1
    },
    {
        question: "Who was Burnham Park named after?",
        options: ["William Howard Taft", "Daniel Burnham", "Manuel L. Quezon", "Ferdinand Marcos"],
        correctAnswer: 1
    },
    {
        question: "What feature is at the center of Burnham Park?",
        options: ["A historical museum", "A man-made lake", "A large amphitheater", "A botanical garden"],
        correctAnswer: 1
    },
    {
        question: "Which activity is most popular at Burnham Park's lake?",
        options: ["Kayaking", "Fishing", "Boating", "Swimming"],
        correctAnswer: 2
    },
    {
        question: "What type of plants can be found in Burnham Park's Rose Garden?",
        options: ["Orchids", "Tulips", "Roses", "Sunflowers"],
        correctAnswer: 2
    },
    {
        question: "Which of the following events is frequently held at Burnham Park?",
        options: ["Panagbenga Flower Festival", "MassKara Festival", "Sinulog Festival", "Ati-Atihan Festival"],
        correctAnswer: 0
    },
    {
        question: "What recreational activity can visitors enjoy at Burnham Park's skating rink?",
        options: ["Roller skating", "Ice skating", "Skateboarding", "Cycling"],
        correctAnswer: 0
    },
    {
        question: "Which part of Burnham Park is designed for picnics and family gatherings?",
        options: ["The Orchidarium", "The Picnic Grove", "The Children's Park", "The Melvin Jones Grandstand"],
        correctAnswer: 1
    },
    {
        question: "What can visitors find at the Melvin Jones Grandstand in Burnham Park?",
        options: ["A monument dedicated to Daniel Burnham", "A venue for concerts and parades", "A playground for children", "A food market"],
        correctAnswer: 1
    },
    {
        question: "What makes Burnham Park a notable tourist destination in the Philippines?",
        options: ["Its historical landmarks", "Its cool climate and lush greenery", "Its beachside location", "Its cultural heritage sites"],
        correctAnswer: 1
    }
];

const Quiz = () => {
    const { user } = useGlobalContext();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const handleAnswerClick = async (selectedOption) => {
        const isCorrect = selectedOption === quizQuestions[currentQuestion].correctAnswer;
        
        if (isCorrect) {
            setScore(score + 2); // 2 points per correct answer
        }const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizQuestions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            // Quiz finished, show score
            setShowScore(true);
            try {
                // Update score in Appwrite
                // Create a new document in the 'quiz_scores' collection
                // with the user's ID, username, score, and current timestamp
                // The document ID is generated automatically by Appwrite
                await databases.createDocument(
                    config.databaseId,
                    config.quiz_scoresId,
                    'unique()',
                    {
                        user_id: user.$id,
                        username: user.username,
                        score: score,
                        timestamp: new Date().toISOString()
                    }
                );
            } catch (error) {
                console.error('Error saving score:', error);
                Alert.alert('Error', 'Failed to save your score');
            }
        }
    };

    if (showScore) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.scoreSection}>
                    <Text style={styles.scoreText}>Quiz Complete!</Text>
                    <Text style={styles.scoreText}>Your score: {score} out of 20</Text>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push('/games/leaderboard')}
                    >
                        <Text style={styles.buttonText}>View Leaderboard</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.quizContainer}>
                <View style={styles.questionSection}>
                    <Text style={styles.questionCount}>
                        Question {currentQuestion + 1}/{quizQuestions.length}
                    </Text>
                    <Text style={styles.questionText}>
                        {quizQuestions[currentQuestion].question}
                    </Text>
                </View>

                <View style={styles.answerSection}>
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.answerButton}
                            onPress={() => handleAnswerClick(index)}
                        >
                            <Text style={styles.answerText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    quizContainer: {
        flex: 1,
        padding: 16,
    },
    questionSection: {
        marginBottom: 24,
    },
    questionCount: {
        fontSize: 16,
        color: '#9ca3af',
        marginBottom: 8,
    },
    questionText: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    answerSection: {
        gap: 12,
    },
    answerButton: {
        backgroundColor: '#1f2937',
        padding: 16,
        borderRadius: 8,
    },
    answerText: {
        color: '#ffffff',
        fontSize: 16,
    },
    scoreSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    scoreText: {
        fontSize: 24,
        color: '#ffffff',
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 8,
        marginTop: 24,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Quiz;
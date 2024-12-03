import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'

const Games = () => {
    const { user } = useGlobalContext();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Games</Text>
                <Text style={styles.username}>{user?.username}</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.push('/games/quiz')}
                >
                    <Text style={styles.buttonText}>Take Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.push('/games/leaderboard')}
                >
                    <Text style={styles.buttonText}>Leaderboard</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    username: {
        fontSize: 18,
        color: '#ffffff',
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        gap: 16,
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Games;
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Query } from 'react-native-appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { client, databases } from '../../lib/appwrite'
import { config } from '../../lib/appwrite'

const Leaderboard = () => {
    const { user } = useGlobalContext();
    const [scores, setScores] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchScores = async () => {
        try {
            const response = await databases.listDocuments(
                config.databaseId,
                config.quiz_scoresId,
                [
                    Query.orderDesc('score'),
                    Query.limit(10)
                ]
            );

            setScores(response.documents);
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    };

    useEffect(() => {
        fetchScores();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchScores();
        setRefreshing(false);
    };

    const renderItem = ({ item, index }) => (
        <View style={[
            styles.scoreItem,
            item.user_id === user.$id && styles.currentUserScore
        ]}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.score}>{item.score}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Top Players</Text>
            <FlatList
                data={scores}
                renderItem={renderItem}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#ffffff"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No scores yet. Be the first to play!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    title: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    listContainer: {
        padding: 16,
    },
    scoreItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f2937',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    currentUserScore: {
        backgroundColor: '#374151',
        borderWidth: 1,
        borderColor: '#2563eb',
    },
    rank: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        width: 40,
    },
    username: {
        color: '#ffffff',
        fontSize: 16,
        flex: 1,
    },
    score: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Leaderboard;
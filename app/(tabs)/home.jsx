import { View, Text, FlatList, StyleSheet, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPost, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

function Home() {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();

    const { data: posts, refetch } = useAppwrite(getAllPost);
    const { data: latestPosts } = useAppwrite(getLatestPosts);

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = async () => {
        setRefreshing(true);
        //re call posts -> if any new videos appeared
        await refetch();
        setRefreshing(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard
                        video={item}
                    />
                )}

                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>
                                Welcome Back,
                            </Text>
                            <Text style={styles.username}>
                                {user?.username}
                            </Text>
                        </View>
                        <View style={styles.logoContainer}>
                            <Image
                                source={images.logoSmall}
                                style={styles.logo}
                                resizeMode='contain'
                            />
                        </View>
                        <SearchInput />
                        <View style={styles.trendingContainer}>
                            <Text style={styles.trendingTitle}>
                                Latest Videos
                            </Text>
                            <Trending
                                posts={latestPosts ?? []}
                            />
                        </View>
                    </View>
                )}

                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="Upload your own videos"
                    />
                )}
                refreshControl={<RefreshControl
                    refreshing={refreshing} onRefresh={onRefresh}
                />}
                contentContainerStyle={styles.listContainer}
            />
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
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    username: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logo: {
        width: 36,
        height: 40,
    },
    trendingContainer: {
        marginBottom: 16,
    },
    trendingTitle: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});

export default Home;
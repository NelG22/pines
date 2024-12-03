import React from 'react';
import { Stack } from 'expo-router';

const GamesLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="quiz"
                options={{
                    headerTitle: "Burnham Park Quiz",
                    headerStyle: {
                        backgroundColor: '#000000',
                    },
                    headerTintColor: '#ffffff',
                }}
            />
            <Stack.Screen
                name="leaderboard"
                options={{
                    headerTitle: "Leaderboard",
                    headerStyle: {
                        backgroundColor: '#000000',
                    },
                    headerTintColor: '#ffffff',
                }}
            />
        </Stack>
    );
};

export default GamesLayout;
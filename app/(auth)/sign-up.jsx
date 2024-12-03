import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import CustomButton from '../../components/CustomButton';

const SignUp = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Validate form fields
        if (!form.email || !form.password || !form.username) {
            return Alert.alert('Error', 'Please fill in all fields');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            return Alert.alert('Error', 'Please enter a valid email address');
        }

        // Validate password length
        if (form.password.length < 8) {
            return Alert.alert('Error', 'Password must be at least 8 characters long');
        }

        setLoading(true);
        try {
            await createUser(form.email, form.password, form.username);
            Alert.alert(
                'Success',
                'Account created successfully! Please sign in.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/sign-in')
                    }
                ]
            );
        } catch (error) {
            console.error('Sign up error:', error);
            Alert.alert(
                'Sign Up Failed',
                error.message || 'Failed to create account. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#666666"
                    value={form.username}
                    onChangeText={(text) => setForm({ ...form, username: text })}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666666"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666666"
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })}
                    secureTextEntry
                />

                <CustomButton
                    title={loading ? 'Creating account...' : 'Sign Up'}
                    handlePress={handleSubmit}
                    isLoading={loading}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Link href="/sign-in" style={styles.link}>
                        Sign In
                    </Link>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        padding: 16,
    },
    formContainer: {
        width: '100%',
    },
    title: {
        fontSize: 32,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333333',
        color: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    footerText: {
        color: '#ffffff',
        fontSize: 16,
    },
    link: {
        color: '#4a9eff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignUp
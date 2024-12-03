import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Video, ResizeMode } from 'expo-av'
import { icons } from '../../constants'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const Create = () => {
    const { user, isLoading } = useGlobalContext();

    const [uploading, setUploading] = useState(false)

    const [form, setForm] = useState({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
    })

    const openPicker = async (selectType) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (selectType === "image") {
                setForm({
                    ...form,
                    thumbnail: result.assets[0],
                });
            }

            if (selectType === "video") {
                setForm({
                    ...form,
                    video: result.assets[0],
                });
            }
        }
    }
    const submit = async () => {
        if (isLoading) {
            return Alert.alert("Please wait", "Still checking authentication status");
        }

        if (!user) {
            router.push("/sign-in");
            return Alert.alert("Error", "Please sign in to upload a video");
        }

        console.log('Current user object:', JSON.stringify(user, null, 2));

        if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
            return Alert.alert("Error", "Please provide all fields");
        }

        if (!user.email) {
            console.log('Email not found in user object');
            return Alert.alert("Error", "User email not found");
        }

        setUploading(true);
        try {
            const videoData = {
                title: form.title,
                thumbnail: form.thumbnail,
                video: form.video,
                prompt: form.prompt,
                accountId: user.accountId || user.$id,
                email: user.email,
                creator: {
                    username: user.username,
                    avatar: user.avatar,
                    accountId: user.accountId || user.$id,
                    email: user.email
                }
            };

            console.log('Video data being sent:', JSON.stringify(videoData, null, 2));
            await createVideo(videoData);

            Alert.alert("Success", "Post uploaded successfully");
            router.push("/home");
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setForm({
                title: "",
                video: null,
                thumbnail: null,
                prompt: "",
            });
            setUploading(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <Text className="text-2xl text-white font-psemibold">
                    Upload Video
                </Text>
                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Make a good title"
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />
                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium " >
                        Upload Video
                    </Text>
                    <TouchableOpacity onPress={() => openPicker("video")}>
                        {form.video ? (
                            <Video
                                source={{ uri: form.video.uri }}
                                className="w-full h-64 rounded-2xl"
                                resizeMode={ResizeMode.COVER}
                            />
                        ) : (
                            <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                                    <Image
                                        source={icons.upload}
                                        resizeMode='contain'
                                        className="w-1/2 h-1/2"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium " >
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("image")}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                resizeMode='cover'
                                className="w-full h-64 rounded-2xl"
                            />
                        ) : (
                            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center flex-row space-x-25 items-center border-2 border-black-200">
                                <Image
                                    source={icons.upload}
                                    resizeMode='contain'
                                    className="w-5 h-5"
                                />
                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                </View>

                <FormField
                    title="Description"
                    value={form.prompt}
                    placeholder="The place that you went to"
                    handleChangeText={(e) => setForm({ ...form, prompt: e })}
                    otherStyles="mt-7"
                />

                <CustomButton
                    title="Submit & Publish"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Create
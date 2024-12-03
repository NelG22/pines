import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

const App = () => {
    const {isLoading, isLoggedIn} = useGlobalContext();
    
    if(!isLoading && isLoggedIn) return <Redirect href='/home' />
    
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{height: '100%'}}>
                <View className="w-full justify-center items-center h-full px-4">
                    <Image 
                        source={images.logo}
                        className="w-[100px] h-[70px]"
                        resizeMode='contain'
                    />
                    <Image
                        source={images.cards}
                        className="max-w-[380px] w-full h-[300px]"
                    />

                    <View className="relative mt-5">
                        <Text className="text-3xl text-white font-bold text-center">
                            Explore the beauty of {' '}
                            <Text className="text-secondary-200">
                                Baguio City
                            </Text>
                        </Text>
                        <Image
                        source={images.path}
                        className="w-[100px] h-[15px] absolute -bottom-3"
                        resizeMode='contain'
                        />
                    </View>
                    <Text
                    className="text-sm font-pregular text-gray-100 mt-7 text-center"
                    >
                        The Summer Capital of the Philippines
                    </Text>
                    <CustomButton 
                        title="Continue with Email"
                        handlePress={() => router.push('/sign-in')}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>
            <StatusBar
            backgroundColor='#161622'
            style='light'
            />

        </SafeAreaView>
    );
}

export default App;

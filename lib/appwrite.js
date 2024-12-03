import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.uhmuhm.pines',
    projectId: '674e851800110274b471',
    databaseId: '674e8558003517319848',
    userCollectionId: '674e85780029993ada9a',
    videoCollectionId: '674e8583001b6bdc6d3f',
    storageId: '674e8787002cf4b65f1f'

}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

// Init of React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try {
        // Create the account first
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Failed to create account');

        const avatarUrl = avatars.getInitials(username);

        // Sign in to get the session
        await signIn(email, password);

        // Create the user document in the database
        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        );

        console.log('Created user document:', newUser);
        return newUser;
    } catch (error) {
        console.log('Error creating user:', error);
        throw error;
    }
}

// Helper function to create user document if it doesn't exist
export const ensureUserDocument = async (account) => {
    try {
        // Check if user document exists
        const existingUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', account.$id)]
        );

        if (existingUser.documents.length === 0) {
            // Create new user document
            const avatarUrl = avatars.getInitials(account.name);
            const newUser = await databases.createDocument(
                databaseId,
                userCollectionId,
                ID.unique(),
                {
                    accountId: account.$id,
                    email: account.email,
                    username: account.name,
                    avatar: avatarUrl
                }
            );
            console.log('Created missing user document:', newUser);
            return newUser;
        }

        return existingUser.documents[0];
    } catch (error) {
        console.log('Error ensuring user document:', error);
        throw error;
    }
}

export const getCurrentUser = async () => {
    try {
        // First check if we have a valid session
        let session;
        try {
            session = await account.getSession('current');
            console.log('Current session:', session);
        } catch (error) {
            console.log('Session error:', error.message);
            return null;
        }

        if (!session) {
            console.log('No session found');
            return null;
        }

        try {
            const currentAccount = await account.get();
            console.log('Current account:', currentAccount);

            if (!currentAccount) {
                console.log('No account found');
                return null;
            }

            // Ensure user document exists
            return await ensureUserDocument(currentAccount);
        } catch (error) {
            console.log('Error in user lookup:', error.message);
            throw error;
        }
    } catch (error) {
        console.log('Fatal error in getCurrentUser:', error.message);
        throw error;
    }
}

export const signIn = async (email, password) => {
    try {
        let session;
        try {
            session = await account.getSession('current');
        } catch {
            // If no current session exists, create a new one
            session = await account.createEmailPasswordSession(
                email,
                password
            );
        }
        return session;
    } catch (error) {
        throw new Error(error.message || 'Failed to sign in');
    }
}

export const getAllPost = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]

        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)], Query.orderDesc('$createdAt')
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}


export const signOut = async () => {
    try {
        // Delete the current session
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.log('Sign out error:', error);
        throw error;
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(storageId,
                fileId, 2000, 2000, "top", 100);
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form) => {
    try {
        if (!form.email) {
            console.log('Email is missing from form data');
            throw new Error('Email is required but not provided');
        }

        console.log('Uploading files...');
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        console.log('Files uploaded successfully');
        console.log('Creating video document with data:', {
            title: form.title,
            accountId: form.accountId,
            email: form.email,
            creator: form.creator
        });

        if (!form.accountId) {
            throw new Error('accountId is required but not provided');
        }

        const documentData = {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            accountId: form.accountId,
            email: form.email,
            creator: form.creator
        };

        console.log('Final document data:', JSON.stringify(documentData, null, 2));

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            documentData
        );

        console.log('Video document created successfully:', newPost);
        return newPost;
    } catch (error) {
        console.log('Error creating video:', error);
        throw error;
    }
}
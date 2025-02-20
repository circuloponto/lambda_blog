import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('YOUR_APPWRITE_ENDPOINT') // Your API Endpoint
    .setProject('YOUR_PROJECT_ID'); // Your project ID

export const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = 'YOUR_DATABASE_ID';
const COLLECTION_ID = 'YOUR_COLLECTION_ID';
const BUCKET_ID = 'YOUR_BUCKET_ID';

export const appwriteService = {
    // Posts
    createPost: async (post) => {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                post.slug,
                post
            );
        } catch (error) {
            console.error('Appwrite service :: createPost :: error', error);
            throw error;
        }
    },

    updatePost: async (slug, post) => {
        try {
            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                slug,
                post
            );
        } catch (error) {
            console.error('Appwrite service :: updatePost :: error', error);
            throw error;
        }
    },

    deletePost: async (slug) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, slug);
            return true;
        } catch (error) {
            console.error('Appwrite service :: deletePost :: error', error);
            throw error;
        }
    },

    getPost: async (slug) => {
        try {
            return await databases.getDocument(DATABASE_ID, COLLECTION_ID, slug);
        } catch (error) {
            console.error('Appwrite service :: getPost :: error', error);
            throw error;
        }
    },

    getPosts: async () => {
        try {
            return await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        } catch (error) {
            console.error('Appwrite service :: getPosts :: error', error);
            throw error;
        }
    },

    // File Upload
    uploadFile: async (file) => {
        try {
            return await storage.createFile(BUCKET_ID, file.name, file);
        } catch (error) {
            console.error('Appwrite service :: uploadFile :: error', error);
            throw error;
        }
    },

    deleteFile: async (fileId) => {
        try {
            await storage.deleteFile(BUCKET_ID, fileId);
            return true;
        } catch (error) {
            console.error('Appwrite service :: deleteFile :: error', error);
            throw error;
        }
    },

    getFilePreview: (fileId) => {
        return storage.getFilePreview(BUCKET_ID, fileId);
    }
};

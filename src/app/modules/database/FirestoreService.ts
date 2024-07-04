// app/modules/database/FirestoreService.ts
import { admin } from '../../../config/firebaseAdminConfig';
import { IDatabaseService } from './IDatabaseService';

const firestore = admin.firestore();

class FirestoreService implements IDatabaseService {
    private static instance: FirestoreService;
    private isConnected = false;

    private constructor() { }

    static getInstance(): FirestoreService {
        if (!FirestoreService.instance) {
            FirestoreService.instance = new FirestoreService();
        }
        return FirestoreService.instance;
    }

    async connect(): Promise<void> {
        // Firestore connection is handled by Firebase Admin SDK initialization
        this.isConnected = true;
    }

    async disconnect(): Promise<void> {
        // Firestore doesn't require a manual disconnection
    }

    async ensureConnection(): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
    }
}

export default FirestoreService.getInstance();

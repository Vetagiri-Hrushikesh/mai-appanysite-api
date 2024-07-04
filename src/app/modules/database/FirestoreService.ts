import { admin } from '../../../config/firebaseAdminConfig';
import { IDatabaseService } from './IDatabaseService';

const firestore = admin.firestore();

export class FirestoreService implements IDatabaseService {
    async connect(): Promise<void> {
        // Firestore connection is handled by Firebase Admin SDK initialization
    }

    async disconnect(): Promise<void> {
        // Firestore doesn't require a manual disconnection
    }

    async getUserByEmail(email: string): Promise<any> {
        const userSnapshot = await firestore.collection('users').where('email', '==', email).get();
        return userSnapshot.empty ? null : userSnapshot.docs[0].data();
    }

    async createUser(user: any): Promise<void> {
        await firestore.collection('users').add(user);
    }

    async updateUserPassword(userId: string, newPassword: string): Promise<void> {
        const userRef = firestore.collection('users').doc(userId);
        await userRef.update({ password: newPassword });
    }
}

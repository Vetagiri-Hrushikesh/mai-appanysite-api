// app/modules/user/FirestoreUserService.ts
import { admin } from '../../../../../config/firebaseAdminConfig';
import FirestoreService from '../../../database/FirestoreService';

const firestore = admin.firestore();

class FirestoreUserService {
    private dbService = FirestoreService;

    async getUserByEmail(email: string): Promise<any> {
        await this.dbService.ensureConnection();
        const userSnapshot = await firestore.collection('users').where('email', '==', email).get();
        return userSnapshot.empty ? null : userSnapshot.docs[0].data();
    }

    async createUser(user: any): Promise<void> {
        await this.dbService.ensureConnection();
        await firestore.collection('users').add(user);
    }

    async updateUserPassword(userId: string, newPassword: string): Promise<void> {
        await this.dbService.ensureConnection();
        const userRef = firestore.collection('users').doc(userId);
        await userRef.update({ password: newPassword });
    }
}

export default new FirestoreUserService();

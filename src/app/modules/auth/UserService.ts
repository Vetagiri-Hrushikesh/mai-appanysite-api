// app/modules/user/UserService.ts
import MongoDBService from '../database/MongoDBService';
import UserModel from '../user/user.model';

class UserService {
    private dbService = MongoDBService;

    async getUserByEmail(email: string): Promise<any> {
        return this.dbService.getUserByEmail(email);
    }

    async createUser(user: any): Promise<void> {
        return this.dbService.createUser(user);
    }
    
    async updateUserPassword(userId: string, newPassword: string): Promise<void> {
        return this.dbService.updateUserPassword(userId, newPassword);
    }
}

export default new UserService();

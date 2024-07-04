// app/modules/user/UserService.ts
import MongoDBService from '../../../database/MongoDBService';
import UserModel from '../../models/user.model';
import { IUserService } from '../IUserService';

class UserService implements IUserService {
    private dbService = MongoDBService;

    async getUserByEmail(email: string): Promise<any> {
        await this.dbService.ensureConnection();
        return UserModel.findOne({ email });
    }

    async createUser(user: any): Promise<void> {
        await this.dbService.ensureConnection();
        await UserModel.create(user);
    }
    
    async updateUserPassword(userId: string, newPassword: string): Promise<void> {
        await this.dbService.ensureConnection();
        await UserModel.findByIdAndUpdate(userId, { password: newPassword });
    }
}

export default new UserService();

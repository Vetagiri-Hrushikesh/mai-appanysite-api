// app/modules/user/IUserService.ts
export interface IUserService {
    getUserByEmail(email: string): Promise<any>;
    createUser(user: any): Promise<void>;
    updateUserPassword(userId: string, newPassword: string): Promise<void>;
}

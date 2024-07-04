// app/modules/database/IDatabaseService.ts
export interface IDatabaseService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getUserByEmail(email: string): Promise<any>;
    createUser(user: any): Promise<void>;
    updateUserPassword(userId: string, newPassword: string): Promise<void>;
}

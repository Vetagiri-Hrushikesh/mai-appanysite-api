// app/modules/auth/AuthServiceFactory.ts
import { IAuthService } from './IAuthService';
import { FirebaseAuthService } from './firebase/FirebaseAuthService';
import { JwtAuthService } from './jwt/JwtAuthService';
import { IDatabaseService } from '../../database/IDatabaseService';
import { DatabaseServiceFactory } from '../../user/services/DatabaseServiceFactory';

interface AuthServiceFactoryParams {
    authType: string;
    dbType: string;
}

export class AuthServiceFactory {
    static getAuthService(params: AuthServiceFactoryParams): IAuthService {
        const { authType, dbType } = params;
        const databaseService: IDatabaseService = DatabaseServiceFactory.getDatabaseService(dbType);

        switch (authType) {
            case 'firebase':
                return new FirebaseAuthService();
            case 'jwt':
            default:
                return new JwtAuthService();
        }
    }
}

// app/modules/auth/AuthServiceFactory.ts
import { IAuthService } from './IAuthService';
import { FirebaseAuthService } from './FirebaseAuthService';
import { JwtAuthService } from './JwtAuthService';
import { IDatabaseService } from '../database/IDatabaseService';
import { DatabaseServiceFactory } from '../database/DatabaseServiceFactory';

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
                return new FirebaseAuthService(databaseService);
            case 'jwt':
            default:
                return new JwtAuthService(databaseService);
        }
    }
}

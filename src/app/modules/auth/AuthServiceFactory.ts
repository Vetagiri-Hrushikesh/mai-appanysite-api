// app/modules/auth/AuthServiceFactory.ts
import { FirebaseAuthService } from './FirebaseAuthService';
import { IAuthService } from './IAuthService';
import { JwtAuthService } from './JwtAuthService';

export class AuthServiceFactory {
    static getAuthService(authType: string): IAuthService {
        switch (authType) {
            case 'firebase':
                return new FirebaseAuthService();
            case 'jwt':
            default:
                return new JwtAuthService();
        }
    }
}


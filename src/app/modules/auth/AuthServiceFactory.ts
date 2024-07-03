// app/modules/auth/AuthServiceFactory.ts
import { IAuthService } from './IAuthService';
import { JwtAuthService } from './JwtAuthService';
// import { FirebaseAuthService } from './FirebaseAuthService';

export class AuthServiceFactory {
    static getAuthService(authType: string): IAuthService {
        switch (authType) {
            case 'jwt':
            default:
                return new JwtAuthService();
        }
    }
}


// app/modules/auth/IAuthService.ts
import { Response, Request } from 'express';

export interface IAuthService {
    login(email: string, password: string): Promise<any>;
    signup(username: string, email: string, password: string, phone: string, role: string): Promise<any>;
    forgotPassword(email: string): Promise<any>;
    resetPassword(token: string, newPassword: string): Promise<any>;
    verifyToken(token: string): Promise<any>;
    generateToken(payload: any): string;
    sendToken(res: Response, token: string): Response;
    isAuthenticate(token: string): Promise<any>;
    resetPasswordForm(req: Request, res: Response): Promise<void>;
}

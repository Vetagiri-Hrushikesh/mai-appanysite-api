// app/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthServiceFactory } from './AuthServiceFactory';
import { IAuthService } from './IAuthService';
import response from '../../../helper/response';

export default class AuthController {
    private getAuthService(authType: string): IAuthService {
        return AuthServiceFactory.getAuthService(authType);
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { email, password, authType } = req.body;
        const authService = this.getAuthService(authType);
        const result = await authService.login(email, password);
        if (result.success) {
            return authService.sendToken(res, result.token);
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }

    async signup(req: Request, res: Response): Promise<Response> {
        const { username, email, password, phone, role, authType } = req.body;
        const authService = this.getAuthService(authType);
        const result = await authService.signup(username, email, password, phone, role);
        if (result.success) {
            return res.status(201).json(response.single(true, 'User registered successfully', null));
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<Response> {
        const { email, authType } = req.body;
        const authService = this.getAuthService(authType);
        const result = await authService.forgotPassword(email);
        if (result.success) {
            return res.json(response.single(true, result.message, null));
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }

    async resetPasswordForm(req: Request, res: Response): Promise<void> {
        const authService = this.getAuthService('jwt');
        await authService.resetPasswordForm(req, res);
    }

    async resetPassword(req: Request, res: Response): Promise<Response> {
        console.log('Received request to reset password');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        
        const { token, password } = req.body;
        console.log('Extracted Token:', token);
        console.log('Extracted Password:', password);
    
        if (!token || !password) {
            return res.status(400).json(response.error(false, 'Token and new password are required'));
        }
    
        const authService = this.getAuthService('jwt');
        const result = await authService.resetPassword(token, password);
        if (result.success) {
            return res.json(response.single(true, result.message, null));
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }
    
    
    async isAuthenticate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const token = req.headers['x-auth-token'] as string;
        const authService = this.getAuthService('jwt');
        const result = await authService.isAuthenticate(token);
        if (result.success) {
            req.auth = result.user;
            next();
        } else {
            return res.status(401).json(response.error(false, result.message));
        }
    }

    isUser(req: Request, res: Response, next: NextFunction): void {
        if (req.auth!.role === 'user' || req.auth!.role === 'admin') {
            next();
        } else {
            res.status(403).json(response.error(false, 'You are not authorized', null));
        }
    }

    isAdmin(req: Request, res: Response, next: NextFunction): void {
        if (req.auth!.role === 'admin') {
            next();
        } else {
            res.status(403).json(response.error(false, 'You are not authorized', null));
        }
    }
}

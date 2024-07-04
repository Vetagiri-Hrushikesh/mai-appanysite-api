// app/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthServiceFactory } from './AuthServiceFactory';
import { IAuthService } from './IAuthService';
import response from '../../../helper/response';

export default class AuthController {
    private getAuthService(authType: string, dbType: string): IAuthService {

        return AuthServiceFactory.getAuthService({ authType, dbType });
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { email, password, authType, dbType } = req.body;
        const authService = this.getAuthService(authType, dbType);
        const result = await authService.login(email, password);
        if (result.success) {
            return authService.sendToken(res, result.token);
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }

    async signup(req: Request, res: Response): Promise<Response> {
        const { username, email, password, phone, role, authType, dbType } = req.body;
        const authService = this.getAuthService(authType, dbType);
        const result = await authService.signup(username, email, password, phone, role, authType);
        if (result.success) {
            return res.status(201).json(response.single(true, 'User registered successfully', null));
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const token = req.header('x-auth-token');
        const { authType, dbType } = req.body;
        
        if (!token) {
            return res.status(400).json(response.error(false, 'Token is required'));
        }

        const authService = this.getAuthService(authType, dbType);
        const result = await authService.logout(token);

        if (result.success) {
            return res.json(response.single(true, result.message, null));
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }

    
    async forgotPassword(req: Request, res: Response): Promise<Response> {
        const { email, authType, dbType } = req.body;
        const authService = this.getAuthService(authType, dbType);
        const result = await authService.forgotPassword(email, authType, dbType);
        if (result.success) {
            return res.json(response.single(true, result.message, null));
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }

    async resetPasswordForm(req: Request, res: Response): Promise<void> {
        const authService = this.getAuthService('jwt', 'mongodb');
        await authService.resetPasswordForm(req, res);
    }
    async resetPassword(req: Request, res: Response): Promise<Response> {
        const { token, password, authType, dbType } = req.body;
        if (!token || !password) {
            return res.status(400).json(response.error(false, 'Token and new password are required'));
        }
        const authService = this.getAuthService(authType, dbType);
        const result = await authService.resetPassword(token, password);
        if (result.success) {
            return res.json(response.single(true, result.message, null));
        } else {
            return res.status(400).json(response.error(false, result.message));
        }
    }
    

    async isAuthenticate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const token = req.headers['x-auth-token'] as string;
        const { authType, dbType } = req.body;
        const authService = this.getAuthService(authType, dbType);
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

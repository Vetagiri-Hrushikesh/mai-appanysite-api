// app/modules/auth/JwtAuthService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../../config/config.json';
import { IAuthService } from './IAuthService';
import { IDatabaseService } from '../database/IDatabaseService';
import { Response, Request } from 'express';
import response from '../../../helper/response';
import { sendEmail } from './emailService';

const secretKey: string = config.development.JWTsecret;
const saltRounds: number = 10;

interface TokenPayload {
    id: string;
    username: string;
    email: string;
    role: string;
}

export class JwtAuthService implements IAuthService {
    private dbService: IDatabaseService;

    constructor(dbService: IDatabaseService) {
        this.dbService = dbService;
    }

    async login(email: string, password: string): Promise<any> {
        const user = await this.dbService.getUserByEmail(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = this.generateToken({ id: user._id, email: user.email, role: user.role });
            return { success: true, token };
        }
        return { success: false, message: 'Invalid email or password' };
    }

    async signup(username: string, email: string, password: string, phone: string, role: string, authType: string): Promise<any> {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        await this.dbService.createUser({ username, email, password: hashedPassword, phone, role, authType });
        return { success: true, message: 'User registered successfully' };
    }

    async logout(token: string): Promise<any> {
        return { success: true, message: 'Logged out successfully' };
    }

    async forgotPassword(email: string): Promise<any> {
        const user = await this.dbService.getUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const token = this.generateToken({ id: user._id, email: user.email, role: user.role });
        const resetLink = `http://${config.development.server.host}:${config.development.server.port}/api/auth/reset-password-form?token=${token}&authType=jwt&dbType=mongodb`;
    
        const emailResponse = await sendEmail(
            user.email,
            'Password Reset Request',
            `You requested a password reset. Click the link to reset your password: ${resetLink}`
        );
    
        if (emailResponse.success) {
            return { success: true, message: 'Password reset email sent' };
        } else {
            return { success: false, message: emailResponse.message, error: emailResponse.error };
        }
    }
    
    async resetPasswordForm(req: Request, res: Response): Promise<void> {
        const token = req.query.token as string;
        const authType = req.query.authType || 'jwt'; // Hardcoding default values
        const dbType = req.query.dbType || 'mongodb'; // Hardcoding default values
        res.send(`
            <form id="resetPasswordForm">
                <input type="hidden" name="token" value="${token}" />
                <input type="hidden" name="authType" value="${authType}" />
                <input type="hidden" name="dbType" value="${dbType}" />
                <label for="password">New Password:</label>
                <input type="password" name="password" id="password" required />
                <button type="submit">Reset Password</button>
            </form>
            <script>
                document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
                    event.preventDefault();
                    
                    const form = event.target;
                    const token = form.querySelector('input[name="token"]').value;
                    const authType = form.querySelector('input[name="authType"]').value;
                    const dbType = form.querySelector('input[name="dbType"]').value;
                    const password = form.querySelector('input[name="password"]').value;
    
                    const response = await fetch('/api/auth/reset-password', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ token, password, authType, dbType })
                    });
    
                    const result = await response.json();
                    alert(result.message);
                });
            </script>
        `);
    }
    
    async resetPassword(token: string, newPassword: string): Promise<any> {
        const decoded = jwt.verify(token, secretKey) as any;
        const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
        await this.dbService.updateUserPassword(decoded.id, hashedPassword);
        return { success: true, message: 'Password reset successfully' };
    }

    async verifyToken(token: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, secretKey) as any;
            return { success: true, user: decoded };
        } catch (error) {
            return { success: false, message: 'Invalid token' };
        }
    }

    generateToken(payload: any): string {
        return jwt.sign(payload, secretKey, {
            expiresIn: '30 days',
        });
    }

    sendToken(res: Response, token: string): Response {
        res.setHeader('x-auth-token', token);
        return res.json(response.single(true, 'Enjoy your token!', { token }));
    }

    async isAuthenticate(token: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, secretKey) as TokenPayload;
            const user = await this.dbService.getUserByEmail(decoded.email);
            if (user) {
                return { success: true, user: decoded };
            } else {
                return { success: false, message: 'Failed to authenticate user' };
            }
        } catch (error) {
            return { success: false, message: 'Invalid token' };
        }
    }
}

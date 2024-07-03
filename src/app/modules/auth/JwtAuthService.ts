import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../user/user.model';
import config from '../../../config/config.json';
import { IAuthService } from './IAuthService';
import AuthValidation from './auth.validation';
import { Response, Request } from 'express';
import response from '../../../helper/response';
import { sendEmail } from './emailService'; // Import the sendEmail function

const secretKey: string = config.development.JWTsecret;
const saltRounds: number = 10;

interface TokenPayload {
    id: string;
    username: string;
    email: string;
    role: string;
}

export class JwtAuthService implements IAuthService {
    private authValidation: AuthValidation;

    constructor() {
        this.authValidation = new AuthValidation();
    }

    async login(email: string, password: string): Promise<any> {
        const result = await this.authValidation.checkUser({ email });
        if (result.success) {
            const matched = await bcrypt.compare(password, result.data.password);
            if (matched) {
                const token = this.generateToken({ id: result.data._id, email: result.data.email, role: result.data.role });
                return { success: true, token };
            }
            return { success: false, message: 'Invalid email or password' };
        }
        return { success: false, message: result.message };
    }

    async signup(username: string, email: string, password: string, phone: string, role: string): Promise<any> {
        const checkEmail = await this.authValidation.checkEmailExistOrNot(email);
        if (!checkEmail.success) {
            return { success: false, message: checkEmail.message };
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new UserModel({ username, email, password: hashedPassword, phone, role });
        await newUser.save();
        return { success: true, message: 'User registered successfully' };
    }

    async forgotPassword(email: string): Promise<any> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const token = this.generateToken({ id: user._id, email: user.email, role: user.role });
        const resetLink = `http://${config.development.server.host}:${config.development.server.port}/api/auth/reset-password-form?token=${token}`;

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
        res.send(`
            <form id="resetPasswordForm">
                <input type="hidden" name="token" value="${token}" />
                <label for="password">New Password:</label>
                <input type="password" name="password" id="password" required />
                <button type="submit">Reset Password</button>
            </form>
            <script>
                document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
                    event.preventDefault();
                    
                    const form = event.target;
                    const token = form.querySelector('input[name="token"]').value;
                    const password = form.querySelector('input[name="password"]').value;
    
                    console.log('Token:', token);
                    console.log('Password:', password);
    
                    const response = await fetch('/api/auth/reset-password', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ token, password })
                    });
    
                    const result = await response.json();
                    alert(result.message);
                });
            </script>
        `);
    }
    
    async resetPassword(token: string, password: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, secretKey) as any;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await UserModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });
            return { success: true, message: 'Password reset successfully' };
        } catch (e) {
            return { success: false, message: 'Invalid token or token expired' };
        }
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
            const user = await UserModel.findOne({ _id: decoded.id });
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

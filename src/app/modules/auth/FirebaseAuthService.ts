import { IAuthService } from './IAuthService';
import { IDatabaseService } from '../database/IDatabaseService';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword, User } from 'firebase/auth';
import { auth as firebaseAuth } from '../../../config/firebase';
import { admin as firebaseAdmin } from '../../../config/firebaseAdminConfig';
import { Response, Request } from 'express';

export class FirebaseAuthService implements IAuthService {
    private dbService: IDatabaseService;

    constructor(dbService: IDatabaseService) {
        this.dbService = dbService;
    }

    async login(email: string, password: string): Promise<any> {
        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();
            return { success: true, token, user };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async signup(username: string, email: string, password: string, phone: string, role: string, authType: string): Promise<any> {
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            await this.dbService.createUser({ username, email, password, phone, role, authType });
            return { success: true, message: 'User registered successfully', user };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async logout(token: string): Promise<any> {
        try {
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);
            await firebaseAdmin.auth().revokeRefreshTokens(decodedToken.uid);
            return { success: true, message: 'Logged out successfully' };
        } catch (error: any) {
            return { success: false, message: 'Failed to log out' };
        }
    }

    async forgotPassword(email: string): Promise<any> {
        try {
            await sendPasswordResetEmail(firebaseAuth, email);
            return { success: true, message: 'Password reset email sent' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<any> {
        try {
            const user: User | null = firebaseAuth.currentUser;
            if (user) {
                await updatePassword(user, newPassword);
                return { success: true, message: 'Password reset successfully' };
            }
            return { success: false, message: 'No user is signed in' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async verifyToken(token: string): Promise<any> {
        try {
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
            return { success: true, user: decodedToken };
        } catch (error: any) {
            return { success: false, message: 'Invalid token' };
        }
    }

    generateToken(payload: any): string {
        throw new Error("Method not implemented.");
    }

    sendToken(res: Response, token: string): Response<any> {
        res.setHeader('x-auth-token', token);
        return res.json({ success: true, message: 'Enjoy your token!', token });
    }

    async isAuthenticate(token: string): Promise<any> {
        try {
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
            return { success: true, user: decodedToken };
        } catch (error: any) {
            return { success: false, message: 'Invalid token' };
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
}

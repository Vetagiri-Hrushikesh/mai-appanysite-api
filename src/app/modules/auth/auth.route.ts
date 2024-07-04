// app/modules/auth/auth.route.ts
import express, { Request, Response, NextFunction, Router } from 'express';
import AuthValidation from './auth.validation';
import AuthController from './auth.controller';

const router: Router = express.Router();
const authController = new AuthController();

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Signup a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.route('/signup').post(
    AuthValidation.signupValidation,
    (req: Request, res: Response, next: NextFunction) => authController.signup(req, res)
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.route('/login').post(
    AuthValidation.loginValidation,
    (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next)
);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.route('/forgot-password').post(
    AuthValidation.forgotPasswordValidation,
    (req: Request, res: Response) => authController.forgotPassword(req, res)
);

/**
 * @openapi
 * /api/auth/reset-password-form:
 *   get:
 *     summary: Display reset password form
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Password reset form displayed
 */
router.route('/reset-password-form').get(
    (req: Request, res: Response) => authController.resetPasswordForm(req, res)
);

/**
 * @openapi
 * /api/auth/reset-password:
 *   put:
 *     summary: Reset user password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 */
router.route('/reset-password').put(
    AuthValidation.resetPasswordValidation,
    (req: Request, res: Response) => authController.resetPassword(req, res)
);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

export default router;

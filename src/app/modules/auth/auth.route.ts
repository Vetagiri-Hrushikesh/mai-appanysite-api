// app/modules/auth/auth.route.ts
import express, { Request, Response, NextFunction, Router } from 'express';
import AuthValidation from './auth.validation';
import AuthController from './auth.controller';

const router: Router = express.Router();
const authController = new AuthController();

router.route('/signup').post(
    AuthValidation.signupValidation,
    (req: Request, res: Response, next: NextFunction) => authController.signup(req, res)
);

router.route('/login').post(
    AuthValidation.loginValidation,
    (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next)
);

router.route('/forgot-password').post(
    AuthValidation.forgotPasswordValidation,
    (req: Request, res: Response) => authController.forgotPassword(req, res)
);

router.route('/reset-password-form').get(
    (req: Request, res: Response) => authController.resetPasswordForm(req, res)
);

router.route('/reset-password').put(
    AuthValidation.resetPasswordValidation,
    (req: Request, res: Response) => authController.resetPassword(req, res)
);

export default router;

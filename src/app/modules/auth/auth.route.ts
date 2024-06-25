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
    (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next),
    (req: Request, res: Response, next: NextFunction) => authController.prepareToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => authController.generateToken(req, res, next),
    (req: Request, res: Response) => authController.sendToken(req, res)
);

router.route('/forgot-password').post(
    (req: Request, res: Response) => authController.forgotPassword(req, res)
);

router.route('/reset-password').post(
    (req: Request, res: Response) => authController.resetPassword(req, res)
);

export default router;

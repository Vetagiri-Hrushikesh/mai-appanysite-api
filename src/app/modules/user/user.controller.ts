// app/modules/user/user.controller.ts
import { Request, Response } from 'express';
import response from '../../../helper/response';
import UserLib from './user.lib';
import { IUser } from './user.model';

class UserController {
    static async addUser(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.body;
            const userData = await UserLib.addUser(user);
            if (userData.success) {
                return res.status(201).json(response.single(true, 'New User Created', userData.data));
            }
            return res.status(200).json(response.error(false, userData.message));
        } catch (e: any) {
            return res.status(500).json(response.error(false, 'An error occurred', e.message));
        }
    }

    static async changePassword(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.auth!;
            const { oldPassword, newPassword } = req.body;
            const user = await UserLib.changePassword(id, oldPassword, newPassword);
            if (user.success) {
                return res.status(200).json(response.single(true, 'Password changed successfully', user.data));
            }
            return res.status(200).json(response.error(false, user.message));
        } catch (e: any) {
            return res.status(500).json(response.error(false, 'An error occurred', e.message));
        }
    }

    static async updateProfile(req: Request, res: Response): Promise<Response> {
        try {
            const updateObject = req.body;
            const data = await UserLib.updateProfile(req.auth!.id, updateObject);
            return res.status(200).json(response.single(true, 'Profile updated successfully', data));
        } catch (e: any) {
            return res.status(500).json(response.error(false, 'An error occurred', e.message));
        }
    }

    static async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.auth!;
            const data = await UserLib.getProfile(id) as IUser;
            return res.status(200).json(response.single(true, `Welcome ${data.username}`, data));
        } catch (e: any) {
            return res.status(500).json(response.error(false, 'An error occurred', e.message));
        }
    }

    static async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await UserLib.getUsers();
            return res.status(200).json(response.single(true, 'Users fetched successfully', users));
        } catch (e: any) {
            return res.status(500).json(response.error(false, 'An error occurred', e.message));
        }
    }

    static async removeUser(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            await UserLib.removeUser(userId);
            return res.status(200).json(response.single(true, 'User removed successfully', 'User removed successfully'));
        } catch (e: any) {
            return res.status(500).json(response.error(false, 'An error occurred', e.message));
        }
    }
}

export default UserController;

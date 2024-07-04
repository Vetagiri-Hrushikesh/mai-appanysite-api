import { Schema, model, Document ,Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IUser extends Document {
    userId: string;
    username: string;
    email: string;
    password: string;
    authType: string;
    inviteCode?:string;
    phone?: string;
    address?: string;
    role: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    photoUrl?: string;
    lastLogin?: Date;
    isActive?: boolean;
    workspaces: {
        workspaceId: string;
        workspaceName:string;
    }[];
    apps: {
        appType: string;
        appId: string;
        appName: string;
    }[];
    settingsId?: Schema.Types.ObjectId;
    providerId?: Schema.Types.ObjectId;
    invitedBy?: Schema.Types.ObjectId;
    isDefaultUser?: boolean;
    profileCompleted?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    verificationToken?: string;
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
    jobTitle?: string;
    department?: string;
    preferences?: {
        notificationsEnabled: boolean;
        theme: string;
    };
    failedLoginAttempts?: number;
    lockUntil?: Date;
    metadata?: {
        lastPasswordChange?: Date;
        signupSource?: string;
    };
}

const userSchema = new Schema<IUser>({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: uuidv4,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    authType: {
        type: String,
        required: true,
        enum: ['jwt', 'firebase']
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'MANAGER', 'DEVELOPER', 'QUALITY ASSURANCE', 'MARKETING ANALYST', 'CONTENT MANAGER'],
        default: 'ADMIN',
        required:true
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    photoUrl: {
        type: String,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
       workspaces: [{
        workspaceId: { type: String, ref: 'Workspace', index: true },
        workspaceName: { type: String }
}],
    apps: [{
        appId: { type: String, ref: 'App', index: true },
        appName: { type: String },
        appType: { type: String }
    }],

    settingsId: {
        type: Schema.Types.ObjectId,
        ref: 'Setting',
        index: true,
    },
    providerId: {
        type: Schema.Types.ObjectId,
        ref: 'Provider',
        index: true,
    },
    inviteCode:
    {
        type:String
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        default: null,
    },
    isDefaultUser: {
        type: Boolean,
        default: false,
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    jobTitle: {
        type: String,
    },
    department: {
        type: String,
    },
    preferences: {
        notificationsEnabled: {
            type: Boolean,
            default: true,
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light',
        },
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
    },
    metadata: {
        lastPasswordChange: {
            type: Date,
        },
        signupSource: {
            type: String,
        },
    },
}, { timestamps: true });

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
export type { IUser };

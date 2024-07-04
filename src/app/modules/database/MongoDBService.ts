// app/modules/database/MongoDBService.ts
import mongoose from 'mongoose';
import { IDatabaseService } from './IDatabaseService';
import connectDatabase from '../../../config/database';

class MongoDBService implements IDatabaseService {
    private static instance: MongoDBService;
    private isConnected = false;

    private constructor() { }

    static getInstance(): MongoDBService {
        if (!MongoDBService.instance) {
            MongoDBService.instance = new MongoDBService();
        }
        return MongoDBService.instance;
    }

    async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('Already connected to MongoDB');
            return;
        }

        try {
            await connectDatabase();
            this.isConnected = true;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            this.isConnected = false;
            setTimeout(() => this.connect(), 5000);
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            console.log('Not connected to MongoDB');
            return;
        }

        await mongoose.disconnect();
        this.isConnected = false;
        console.log('Disconnected from MongoDB');
    }

    async ensureConnection(): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
    }
}

export default MongoDBService.getInstance();

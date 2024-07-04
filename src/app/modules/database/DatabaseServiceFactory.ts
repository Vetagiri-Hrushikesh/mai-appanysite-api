// app/modules/database/DatabaseServiceFactory.ts
import { IDatabaseService } from './IDatabaseService';
import MongoDBService from './MongoDBService';
import { FirestoreService } from './FirestoreService';

export class DatabaseServiceFactory {
    static getDatabaseService(dbType: string): IDatabaseService {
        switch (dbType) {
            case 'mongodb':
                return MongoDBService;
            case 'firestore':
                return new FirestoreService();
            default:
                throw new Error('Invalid database type');
        }
    }
}

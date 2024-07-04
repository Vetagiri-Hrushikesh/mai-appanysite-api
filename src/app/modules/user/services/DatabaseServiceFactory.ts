// app/modules/database/DatabaseServiceFactory.ts
import { IDatabaseService } from '../../database/IDatabaseService';
import MongoDBService from '../../database/MongoDBService';
import FirestoreService from '../../database/FirestoreService';

export class DatabaseServiceFactory {
    static getDatabaseService(dbType: string): IDatabaseService {
        switch (dbType) {
            case 'mongodb':
                return MongoDBService;
            case 'firestore':
                return FirestoreService;
            default:
                throw new Error('Invalid database type');
        }
    }
}

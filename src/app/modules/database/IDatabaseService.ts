// app/modules/database/IDatabaseService.ts
export interface IDatabaseService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    ensureConnection(): Promise<void>;
}
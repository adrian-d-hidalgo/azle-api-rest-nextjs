import { DatabaseInterface } from './database';

declare global {
    namespace Express {
        interface Request {
            database: DatabaseInterface;
        }
    }
}

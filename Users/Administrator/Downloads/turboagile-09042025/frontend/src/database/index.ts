// Database factory - Switch between InMemory and MySQL
import { CONFIG } from '../../config.js';
import { InMemoryDatabase, DatabaseInterface } from './InMemoryDB';
import { MySQLDatabase } from './MySQLDB';

export function createDatabase(): DatabaseInterface {
    // Switch database based on config
    if (CONFIG.DATABASE_TYPE === 'mysql') {
        return new MySQLDatabase(CONFIG.MYSQL_CONFIG);
    }
    
    // Default to in-memory
    return new InMemoryDatabase();
}

export { DatabaseInterface } from './InMemoryDB';
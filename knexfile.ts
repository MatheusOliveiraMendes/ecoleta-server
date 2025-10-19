import path from 'path';
import { Knex } from 'knex';

const defaultDatabaseFile = path.resolve(process.cwd(), 'src', 'database', 'database.sqlite');
const databaseFile = process.env.DATABASE_FILE || defaultDatabaseFile;

const sourceDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

const config: Knex.Config = {
    client: 'sqlite3',
    connection: {
        filename: databaseFile,
    },
    migrations: {
        directory: path.resolve(process.cwd(), sourceDir, 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(process.cwd(), sourceDir, 'database', 'seeds')
    },
    useNullAsDefault: true,
};

module.exports = config;

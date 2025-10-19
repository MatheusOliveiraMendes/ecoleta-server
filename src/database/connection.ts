import knex from 'knex';
import path from 'path';

const databaseFile = process.env.DATABASE_FILE || path.resolve(process.cwd(), 'src', 'database', 'database.sqlite');

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: databaseFile,
    },
    useNullAsDefault: true,
});

export default connection;

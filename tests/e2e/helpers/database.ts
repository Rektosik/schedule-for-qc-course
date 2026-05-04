import { Client } from 'pg';

export class DbHelper {
    private client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/appdb'
        });
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.end();
    }

    async deleteGroupByTitle(title: string) {
        await this.client.query('DELETE FROM groups WHERE title = $1', [title]);
    }

    async checkGroupExists(title: string): Promise<boolean> {
        const res = await this.client.query('SELECT * FROM groups WHERE title = $1', [title]);
        return (res.rowCount ?? 0) > 0;
    }
}
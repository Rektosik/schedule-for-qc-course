
import axios from 'axios';
import { Client } from 'pg';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    validateStatus: () => true
});

const dbClient = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/schedule_db'
});

describe('Room API CRUD Tests (Variant 8)', () => {
    let createdRoomId = null;
    let roomName = `TestRoom-${Date.now()}`;

    beforeAll(async () => {
        await dbClient.connect().catch(() => console.log('DB connection failed (expected if no local DB)'));
    });

    afterAll(async () => {
        await dbClient.end();
    });

    it('POST /rooms - should create a new room', async () => {
        const response = await apiClient.post('/rooms', { name: roomName, capacity: 30 });
        expect([200, 201]).toContain(response.status);
        createdRoomId = response.data.id;
    });

    it('DB Check - should verify room exists in database', async () => {
        if (!createdRoomId) return;
        const res = await dbClient.query('SELECT * FROM rooms WHERE id = $1', [createdRoomId]);
        expect(res.rows.length).toBe(1);
        expect(res.rows[0].name).toBe(roomName);
    });

    it('GET /rooms/{id} - should get the created room', async () => {
        const response = await apiClient.get(`/rooms/${createdRoomId}`);
        expect(response.status).toBe(200);
    });

    it('GET /rooms - should return a list of rooms', async () => {
        const response = await apiClient.get('/rooms');
        expect(Array.isArray(response.data)).toBeTruthy();
    });

    it('PUT /rooms/{id} - should update the room', async () => {
        const response = await apiClient.put(`/rooms/${createdRoomId}`, { name: `${roomName}-Upd`, capacity: 50 });
        expect(response.status).toBe(200);
    });

    it('POST /rooms - should return 400 for invalid capacity', async () => {
        const response = await apiClient.post('/rooms', { capacity: "TEXT" });
        expect(response.status).toBe(400);
    });

    it('GET /rooms/{id} - should return 404 for non-existing ID', async () => {
        const response = await apiClient.get('/rooms/999999');
        expect(response.status).toBe(404);
    });

    it('DELETE /rooms/{id} - should delete the room', async () => {
        const response = await apiClient.delete(`/rooms/${createdRoomId}`);
        expect([200, 204]).toContain(response.status);
    });

    it('GET /rooms/{id} - should return 404 after deletion', async () => {
        const response = await apiClient.get(`/rooms/${createdRoomId}`);
        expect(response.status).toBe(404);
    });
});
const axios = require('axios');
const { getToken, authHeader, BASE_URL } = require('./helpers/auth');
const { queryOne, closePool } = require('./helpers/db');

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.response.use(
  res => res,
  err => err.response ? err.response : Promise.reject(err)
);

describe('Room API — CRUD (Task 2.1)', () => {
  let token;
  let createdRoomId;
  const timestamp = Date.now();
  const roomName = `TestRoom_${timestamp}`;
  const updatedName = `Updated_${timestamp}`;

  beforeAll(async () => {
    token = await getToken();
  });

  afterAll(async () => {
    await closePool();
  });

  describe('GET /rooms', () => {
    test('повертає масив кімнат зі статусом 200', async () => {
      const res = await api.get('/rooms', { headers: authHeader(token) });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    test('кожен елемент має поля id, name, disable, type', async () => {
      const res = await api.get('/rooms', { headers: authHeader(token) });

      if (res.data.length > 0) {
        const room = res.data[0];
        expect(room).toHaveProperty('id');
        expect(room).toHaveProperty('name');
        expect(room).toHaveProperty('disable');
        expect(room).toHaveProperty('type');
      }
    });
  });

  describe('POST /rooms', () => {
    test('створює кімнату і повертає 201 з id', async () => {
      const res = await api.post(
        '/rooms',
        { name: roomName, disable: false, type: { id: 1 } },
        { headers: authHeader(token) }
      );

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.name).toBe(roomName);
      expect(res.data.disable).toBe(false);

      createdRoomId = res.data.id;
    });

    test('(негативний) порожня назва повертає 400', async () => {
      const res = await api.post(
        '/rooms',
        { name: '', disable: false, type: { id: 1 } },
        { headers: authHeader(token) }
      );

      expect(res.status).toBe(400);
    });

    test('(негативний) відсутній обов\'язковий type повертає 400', async () => {
      const res = await api.post(
        '/rooms',
        { name: `NoType_${Date.now()}`, disable: false },
        { headers: authHeader(token) }
      );

      expect(res.status).toBe(400);
    });
  });

  describe('GET /rooms/:id', () => {
    test('повертає кімнату за ID зі статусом 200', async () => {
      const res = await api.get(`/rooms/${createdRoomId}`, {
        headers: authHeader(token),
      });

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(createdRoomId);
      expect(res.data.name).toBe(roomName);
    });

    test('(негативний) неіснуючий ID повертає 404', async () => {
      const res = await api.get('/rooms/999999', { headers: authHeader(token) });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /rooms/:id', () => {
    test('оновлює назву кімнати і повертає 200', async () => {
      const res = await api.patch(
        `/rooms/${createdRoomId}`,
        { name: updatedName, disable: false, type: { id: 1 } },
        { headers: authHeader(token) }
      );

      expect(res.status).toBe(200);
      expect(res.data.name).toBe(updatedName);
      expect(res.data.id).toBe(createdRoomId);
    });

    test('GET після PATCH повертає оновлену назву', async () => {
      const res = await api.get(`/rooms/${createdRoomId}`, {
        headers: authHeader(token),
      });

      expect(res.status).toBe(200);
      expect(res.data.name).toBe(updatedName);
    });
  });

  describe('Перевірка даних у БД після PATCH (Task 2.3)', () => {
    test('дані в БД збігаються з відповіддю API', async () => {
      const row = await queryOne(
        'SELECT id, name, disable FROM rooms WHERE id = $1',
        [createdRoomId]
      );

      expect(row).not.toBeNull();
      expect(row.name).toBe(updatedName);
      expect(row.disable).toBe(false);
    });
  });

  describe('DELETE /rooms/:id', () => {
    test('видаляє кімнату і повертає 200 або 204', async () => {
      const res = await api.delete(`/rooms/${createdRoomId}`, {
        headers: authHeader(token),
      });

      expect([200, 204]).toContain(res.status);
    });

    test('після DELETE — GET повертає 404', async () => {
      const res = await api.get(`/rooms/${createdRoomId}`, {
        headers: authHeader(token),
      });

      expect(res.status).toBe(404);
    });

    test('після DELETE — в БД запис відсутній', async () => {
      const row = await queryOne(
        'SELECT id FROM rooms WHERE id = $1',
        [createdRoomId]
      );

      expect(row).toBeNull();
    });
  });
});
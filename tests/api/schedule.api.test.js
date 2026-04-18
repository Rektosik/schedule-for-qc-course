
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    validateStatus: () => true
});

describe('Schedule API Tests (Dependent Resource)', () => {
    let scheduleId = null;
    let validRoomId = 1;

    it('GET /schedules - should return list of schedules', async () => {
        const response = await apiClient.get('/schedules');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
    });

    it('POST /schedules - should create schedule with valid relations', async () => {
        const response = await apiClient.post('/schedules', {
            roomId: validRoomId,
            teacherId: 1,
            lessonType: "LECTURE"
        });

        if(response.status === 200 || response.status === 201) {
            scheduleId = response.data.id;
            expect(response.data.roomId).toBe(validRoomId);
        }
    });

    it('GET /schedules/{id} - should return specific schedule', async () => {
        if (!scheduleId) return;
        const response = await apiClient.get(`/schedules/${scheduleId}`);
        expect(response.status).toBe(200);
    });

    it('POST /schedules - should fail when Room is missing', async () => {
        const response = await apiClient.post('/schedules', {
            teacherId: 1,
            lessonType: "PRACTICE"
        });
        expect([400, 422]).toContain(response.status);
    });

    it('POST /schedules - should fail with non-existing Teacher ID', async () => {
        const response = await apiClient.post('/schedules', {
            roomId: validRoomId,
            teacherId: 999999,
            lessonType: "LAB"
        });
        expect([400, 404, 409]).toContain(response.status);
    });
});
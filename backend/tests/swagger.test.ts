import request from 'supertest';
import app from '../src/app';

describe('Swagger Documentation Endpoints', () => {
  it('GET /api-docs/ should serve the Swagger UI HTML page', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });

  it('GET /api-docs.json should serve the OpenAPI JSON spec', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openapi', '3.0.0');
    expect(res.body).toHaveProperty('info');
    expect(res.body.info).toHaveProperty('title', 'Car Dealership Inventory System API');
  });
});

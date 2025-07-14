import request from 'supertest';
import app from '../index'; // You may need to export your Express app instance

describe('API Endpoints', () => {
  let token: string;

  it('should login and get a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should reject invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'wrong' });
    expect(res.status).toBe(400);
  });

  it('should get contact settings (public)', async () => {
    const res = await request(app).get('/api/contact-settings');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('phoneNumber');
  });

  it('should update contact settings (auth required)', async () => {
    const res = await request(app)
      .put('/api/contact-settings')
      .set('Authorization', `Bearer ${token}`)
      .send({ phoneNumber: '123', whatsappNumber: '123', emailAddress: 'a@b.com' });
    expect(res.status).toBe(200);
    expect(res.body.phoneNumber).toBe('123');
  });

  it('should reject update without auth', async () => {
    const res = await request(app)
      .put('/api/contact-settings')
      .send({ phoneNumber: '123', whatsappNumber: '123', emailAddress: 'a@b.com' });
    expect(res.status).toBe(401);
  });
});
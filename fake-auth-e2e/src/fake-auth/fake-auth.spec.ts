import axios from 'axios';

describe('post /api/login', () => {
  it('should return a token and status 201', async () => {
    const res = await axios.post(`/api/login`,{
  "username": "test",
  "password": "test"
});

    expect(res.status).toBe(201);
    
  });
});

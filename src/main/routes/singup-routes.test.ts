import request from 'supertest'
import app from '../config/app'

describe('SingUp Routes', () => {
    test('should return an account on success ', async () => {
        
        await request(app)
            .post('/api/signup')
            .send({
                name: 'weslley',
                email: 'weslley@email.com',
                password:'123',
                passwordConfirmation:'123'
            })
            .expect(200)
    })
})

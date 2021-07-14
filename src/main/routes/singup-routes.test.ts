import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/mongodb/helpers/mongo-helper'

describe('SingUp Routes', () => {
    beforeAll(async () => {
        console.log(process.env.MONGO_URL)
        await MongoHelper.connect(process.env.MONGO_URL)
    })
    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
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

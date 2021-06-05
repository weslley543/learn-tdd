import { SignUpController } from './singup'
import { MissingParamError } from '../errors/missingParamError';

describe('SingUp Controller', () =>{
    test('Should be return 400 if no name is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("name"))
    })
     test('Should be return 400 if no name is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })
    test('Should be return 400 if no name is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'any_name',
                email:'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })
     test('Should be return 400 if no name is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'any_name',
                email:'any_email@mail.com',
                password: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })
})
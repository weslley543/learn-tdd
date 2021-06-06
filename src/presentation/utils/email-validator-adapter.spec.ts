import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

describe("Email Validator Adapter", () => {
    test('should return false if validator returns false', () =>{
        const sut = new EmailValidatorAdapter();
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email@mail.com')
        expect (isValid).toBe(false)
    })
    test('should return false if validator returns false', () =>{
        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid('invalid_email@mail.com');
        expect (isValid).toBe(true)
    })
    test('should call validator with correct email', () =>{
        const sut = new EmailValidatorAdapter();
        const isSpyMail = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@mail.com');
        expect (isSpyMail).toHaveBeenCalledWith('any_email@mail.com')
    })
})
import { SignUpController } from './singup'
import { MissingParamError, ServerError, InvalidParamError } from '../../errors'
import { EmailValidator, AccountModel, AddAccountModel, AddAccount } from './singup.protocols'


const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator  {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub();
}

const makeAddAcount = (): AddAccount => {
    class AddAccountStub implements AddAccount  {
        add(account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id:'valid_id',
                name:'valid_name',
                email:'valid_email@mail.com',
                password: 'valid_password'
            }
            return fakeAccount
        }
    }
    return new AddAccountStub();
}

interface SutTypes {
    sut : SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
    
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAcount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
    
}

describe('SingUp Controller', () =>{
    test('Should be return 400 if no name is provided', () => {
        const { sut }= makeSut();
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
    test('Should be return 400 if no email is provided', () => {
        const { sut } = makeSut();
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
    test('Should be return 400 if no password is provided', () => {
        const { sut } = makeSut();
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
    test('Should be return 400 if no passwordConfirmation is provided', () => {
        const { sut } = makeSut();
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
    test('Should be return 400 if no passwordConfirmation fails', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalidPassword'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })
    test('Should be return 400 if invalid email is provided', () => {
        const { sut, emailValidatorStub } = makeSut();
        
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'any_name',
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
    test('Should call email validator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut();
        
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any_name',
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
       
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
    test('Should be return 500 if email validator throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(()=>{
            throw new Error()
        })
       
        const httpRequest = {
            body: {
                name: 'any_name',
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should call addAccount with correct values', () => {
        const { sut, addAccountStub } = makeSut();
        
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: 'any_name',
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
       
        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email:'any_email@mail.com',
            password: 'any_password',
        })
    })
    test('Should be return 500 if add account throws', () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(()=>{
            throw new Error()
        })
       
        const httpRequest = {
            body: {
                name: 'any_name',
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

     test('Should be return 400 if no password is provided', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'valid_name',
                email:'valid_email@mail.com',
                password: 'valid_password',
                passwordConfirmation: 'valid_password'
                
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email:'valid_email@mail.com',
            password:'valid_password'
        })
    })

})
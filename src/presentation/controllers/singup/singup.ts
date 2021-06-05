import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount } from './singup.protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helper/httpHelper'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount){
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    handle (httpRequest: HttpRequest): HttpResponse {
       try{
            const requiredFileds = ['name', 'email', 'password', 'passwordConfirmation'];
            for (const field of requiredFileds) {
                if(!httpRequest.body[field]){
                    return badRequest(new MissingParamError(field))
                }
            }
            const isValid = this.emailValidator.isValid(httpRequest.body.email);
            const { name, email, password, passwordConfirmation } = httpRequest.body
            if(password !== passwordConfirmation){
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
            if(!isValid){
                return badRequest(new InvalidParamError('email'))
            }

            this.addAccount.add({
                name,
                email,
                password
            })

        }catch(error){
           return serverError()
        }
    }
}
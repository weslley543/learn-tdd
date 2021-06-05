import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helper/httpHelper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalidParamError'
export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator){
        this.emailValidator = emailValidator
    }

    handle (httpRequest: HttpRequest): HttpResponse {
        const requiredFileds = ['name', 'email', 'password', 'passwordConfirmation'];
        for (const field of requiredFileds) {
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }
        const isValid = this.emailValidator.isValid(httpRequest.body.email);
        if(!isValid){
            return badRequest(new InvalidParamError('email'))
        }
    }
}
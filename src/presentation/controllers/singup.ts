import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helper/httpHelper'
import { Controller } from '../protocols/controller'
export class SignUpController implements Controller {
    handle (httpRequest: HttpRequest): HttpResponse {
        const requiredFileds = ['name', 'email', 'password', 'passwordConfirmation'];
        for (const field of requiredFileds) {
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }
    }
}
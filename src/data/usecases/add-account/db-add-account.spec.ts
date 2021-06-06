import { DbAddAccount } from './db-add-account'
import { Encrypter, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'




const makeEncrypter = (): Encrypter =>{
     class EncrypterStub  implements Encrypter{
            async encrypt(value: string): Promise<string>{
                return new Promise(resolve => resolve('hashed_password'))
            }
        }
    return new EncrypterStub ()
}

const makeAddAccountRepository = (): AddAccountRepository =>{
     class AddAccountRepositoryStub implements AddAccountRepository {
            async add(account: AddAccountModel): Promise<AccountModel>{
                const fakeAccount = {
                    id:'valid_id',
                    name: 'valid_name',
                    email: 'valid_mail@mail.com',
                    password: 'hashed_password'
                }
                return new Promise(resolve => resolve(fakeAccount))
            }
        }
    return new AddAccountRepositoryStub()
}
interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
        const encrypterStub = makeEncrypter()
        const addAccountRepositoryStub = makeAddAccountRepository()
        const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
        return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DbAccount Usecase', () => {
    test('should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const ecryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        await sut.add(accountData)
        expect(ecryptSpy).toHaveBeenCalledWith('valid_password')
    })
    test('should throw if encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        const promise = sut.add(accountData)
        expect(promise).rejects.toThrow()
    })
    test('should call add account repository', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'hashed_password'
        })
    })
    test('should throw if addAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        const promise = sut.add(accountData)
        expect(promise).rejects.toThrow()
    })
    test('should return account on success', async () => {
        const { sut } = makeSut()
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        const account = await sut.add(accountData)
        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
             email: 'valid_mail@mail.com',
            password: 'hashed_password'
        })
    })
})
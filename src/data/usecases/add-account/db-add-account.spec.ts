import { DbAddAccount } from './db-add-account'

describe('DbAccount Usecase', () => {
    test('should call encrypter with correct password', async () => {
        class EncrypterStub {
            async encrypt(value: string): Promise<string>{
                return new Promise(resolve => resolve('hashed_password'))
            }
        }
        
        const encrypterStub = new EncrypterStub()
        const sut = new DbAddAccount(encrypterStub)
        const ecryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password'
        }
        
        await sut.add(accountData)
        expect(ecryptSpy).toHaveBeenCalledWith('valid_password')
    })
})
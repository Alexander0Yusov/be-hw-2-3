import { MongoMemoryServer } from 'mongodb-memory-server';
import { nodemailerService } from '../../5-auth/adapters/nodemailer.service';
import { authService } from '../../5-auth/domain/auth.service';
import { testSeeder } from './test.seeder';
import { ResultStatus } from '../../core/result/resultCode';
import { db } from '../../db/mongo.db';

describe('AUTH-INTEGRATION', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await db.run(mongoServer.getUri());
  });

  beforeEach(async () => {
    await db.drop();
  });

  afterAll(async () => {
    await db.drop();
    await db.stop();
  });

  afterAll((done) => done());

  describe('User Registration', () => {
    //  nodemailerService.sendEmail = emailServiceMock.sendEmail;

    nodemailerService.sendEmail = jest
      .fn()
      .mockImplementation((email: string, code: string, template: (code: string) => string) => Promise.resolve(true));

    const registerUserUseCase = authService.registerUser;

    it('should register user with correct data', async () => {
      const { login, pass, email } = testSeeder.createUserDto();

      const result = await registerUserUseCase(login, pass, email);

      expect(result.status).toBe(ResultStatus.Success);

      expect(nodemailerService.sendEmail).toHaveBeenCalled();
      expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('should not register user twice', async () => {
      const { login, pass, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, pass, email });

      const result = await registerUserUseCase(login, pass, email);

      expect(result.status).toBe(ResultStatus.BadRequest);
      //collection.countDoc().toBe(1)
    });
  });

  // it('should create user; POST /auth/registration', async () => {
  //   await request(app)
  //     .post(AUTH_PATH + '/registration')
  //     .send({
  //       login: 'yusovsky2',
  //       email: `yusovsky2@gmail.com`,
  //       password: 'qwerty123',
  //     })
  //     .expect(HttpStatus.Created);

  //   await request(app)
  //     .post(AUTH_PATH + '/registration-confirmation')
  //     .send({ code: '' })
  //     .expect(HttpStatus.Ok);
  // });
});

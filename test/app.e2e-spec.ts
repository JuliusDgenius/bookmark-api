import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto/edit-user.dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    pactum.request.setBaseUrl('http://localhost:3333')
  });

  afterAll(() => {
    app.close();
  },);
  

  describe('Auth', () => {
    const dto: AuthDto = {
        email: 'ibejulius1@gmail.com',
        password: '123',
      }

    describe('Signup', () => {
      it('Should throw error if email is empty', () => {
        return pactum.spec()
        .post('/auth/signup')
        .withBody({ password: dto.password })
        .expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        return pactum.spec()
        .post('/auth/signup')
        .withBody({ email: dto.email })
        .expectStatus(400);
      });

      it('Should throw error if no body', () => {
        return pactum.spec()
        .post('/auth/signup')
        .expectStatus(400);
      });

      it('Should Signup', () => {
        return pactum.spec().post('/auth/signup')
        .withBody(dto).expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('Should throw error if email is empty', () => {
        return pactum.spec()
        .post('/auth/signin')
        .withBody({ password: dto.password })
        .expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        return pactum.spec()
        .post('/auth/signin')
        .withBody({ email: dto.email })
        .expectStatus(400);
      });

      it('Should throw error if no body', () => {
        return pactum.spec()
        .post('/auth/signin')
        .expectStatus(400);
      });

      it('Should Signin', () => {
        return pactum.spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('userAt', 'access_token');
      });
    });
  });

  describe('Users', () => {
    describe('Get user', () => {
      it('Should get current user', () => {
        return pactum.spec()
        .get('/users/me')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      
       it('Should edit user', () => {
        const dto: EditUserDto = {
        firstName: 'Julius',
        lastName: 'Ibe',
        email: 'juliusdgeniusdev@gmail.com'
      }

        return pactum.spec()
        .patch('/users')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody(dto)
        .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200)
        .expectBody([]);
      });
    });

    describe('create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: "First Bookmark",
        description: "This is my first bookmark",
        link: "https://www.youtube.com/watch?v=GHTA143_b-s&t=7273s",
      }

      it('Should get bookmarks', () => {
        return pactum
        .spec()
        .post('/bookmarks')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody(dto)
        .expectStatus(201)
        .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200)
        .expectJsonLength(1);
      });
    });

    describe('Get bookmark by Id', () => {
      it('Should get bookmarks by id', () => {
        return pactum
        .spec()
        .get('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200)
        .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by Id', () => {
      const dto: EditBookmarkDto = {
        title: 'NestJs Course for Beginners - Create a REST API',
        description: 'Learn NestJs by building a CRUD REST API with end-to-end tests using modern web development techniques. NestJs is a rapidly growing node js framework that helps build scalable and maintainable backend applications. In this course, we build a bookmarks API from scratch using nestJs, docker, postgres, passport js, prisma, pactum and dotenv.'};

      it('Should edit bookmarks', () => {
        return pactum
        .spec()
        .patch('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.title)
        .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark by Id', () => {

      it('Should delete bookmarks', () => {
        return pactum
        .spec()
        .delete('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(204);
      });

      it('Should get empty bookmarks', () => {
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200)
        .expectJsonLength(0);
      });
    });
  });
});


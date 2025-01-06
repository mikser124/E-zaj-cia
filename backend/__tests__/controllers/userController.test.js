const request = require('supertest');
const { sequelize, Category } = require('../../models');
const app = require('../../server');
const path = require('path');
const fs = require('fs');

describe('User Controller - API Integration Tests', () => {
  let user;
  let token;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        imie: 'Jan',
        nazwisko: 'Kowalski',
        email: 'jan.kowalski@pollub.edu.pl',
        haslo: 'tajnehaslo',
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'jan.kowalski@pollub.edu.pl',
        haslo: 'tajnehaslo',
      });

    user = loginResponse.body;
    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /user/:id', () => {
    it('should return user data', async () => {
      const response = await request(app)
        .get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('imie', 'Jan');
      expect(response.body).toHaveProperty('nazwisko', 'Kowalski');
      expect(response.body).toHaveProperty('email', 'jan.kowalski@pollub.edu.pl');
    });

    it('should return 404 when user does not exist', async () => {
      const response = await request(app)
        .get('/user/9999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Użytkownik nie znaleziony.');
    });
  });

  describe('GET /user', () => {
    it('should return a list of users', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('PUT /user/:id', () => {
    it('should update user data', async () => {
      const response = await request(app)
        .put(`/user/${user.id}`)
        .send({ opis: 'Nowy opis użytkownika' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profil użytkownika został pomyślnie zaktualizowany.');
    });

    it('should return 403 when user tries to edit another user\'s profile', async () => {
      const response = await request(app)
        .put(`/user/2`)
        .send({ opis: 'Zmiana opisu innego użytkownika' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Nie masz uprawnień do edycji tego profilu.');
    });
  });

  describe('PUT /user/:id/update-description', () => {
    it('should update user description', async () => {
      const response = await request(app)
        .put(`/user/${user.id}/update-description`)
        .send({ opis: 'Nowy opis użytkownika' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Opis zaktualizowany');
    });
  });

  describe('POST /user/:id/update-photo', () => {
    it('should update profile photo', async () => {
      const photoPath = path.join(__dirname, 'test-photo.jpg');

      if (!fs.existsSync(photoPath)) {
        fs.writeFileSync(photoPath, 'testowe dane zdjęcia');
      }

      const response = await request(app)
        .post(`/user/${user.id}/update-photo`)
        .attach('photo', photoPath)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Zdjęcie profilowe użytkownika zaktualizowane.');

      fs.unlinkSync(photoPath);
    });

    it('should return 400 when no file is uploaded', async () => {
      const response = await request(app)
        .post(`/user/${user.id}/update-photo`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Brak pliku do przesłania.');
    });
  });

  describe('POST /user/:id/update-banner', () => {
    it('should update user banner', async () => {
      const bannerPath = path.join(__dirname, './test-banner.jpg');

      if (!fs.existsSync(bannerPath)) {
        fs.writeFileSync(bannerPath, 'testowe dane banera');
      }

      const response = await request(app)
        .post(`/user/${user.id}/update-banner`)
        .attach('banner', bannerPath)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Baner użytkownika zaktualizowany.');

      fs.unlinkSync(bannerPath);
    });

    it('should return 400 when no file is uploaded', async () => {
      const response = await request(app)
        .post(`/user/${user.id}/update-banner`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Brak pliku do przesłania.');
    });
  });

  describe('POST /user/:id/records', () => {
    it('should add a new record to the database', async () => {
      const category = await Category.create({ nazwa: 'Muzyka' });

      const response = await request(app)
        .post(`/user/${user.id}/records`)
        .send({
          title: 'Nowe nagranie',
          description: 'Opis nagrania',
          url: 'http://example.com/nagranie',
          kategoria_id: category.id
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Nagranie zostało dodane do profilu użytkownika.');
    });
  });
});

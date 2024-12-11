const UserController = require('../../controllers/userController');
const { User, Record, Category } = require('../../models');
const fs = require('fs');
const path = require('path');

jest.mock('../../models'); 

describe('UserController', () => {
  let userMock;
  let userId;
  let req;
  let res;

  beforeEach(() => {
    userMock = {
      id: 1,
      imie: 'Jan',
      nazwisko: 'Kowalski',
      email: 'jan.kowalski@example.com',
      typ_uzytkownika: 'basic',
      rola: 'user',
      liczba_polubien: 10,
      liczba_punktow: 15,
      photo: null,
      banner: null,
      opis: null,
      update: jest.fn().mockResolvedValue([1]) 
    };

    userId = userMock.id;

    req = {
      user: { id: userId }, 
      params: { id: userId },
      body: {},
      files: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    User.findByPk.mockResolvedValue(userMock);
    Record.findAll.mockResolvedValue([]); 
    Category.findByPk.mockResolvedValue({ id: 1, name: 'Music' });
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('getUserProfile', () => {
    it('should return user profile successfully', async () => {
      await UserController.getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        imie: 'Jan',
        nazwisko: 'Kowalski',
        email: 'jan.kowalski@example.com',
      }));
    });

    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null); 

      await UserController.getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Użytkownik nie znaleziony.' });
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      req.body.opis = 'Nowy opis użytkownika';

      await UserController.updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profil użytkownika został pomyślnie zaktualizowany.' });
    });

    it('should return 403 if user tries to edit another profile', async () => {
      req.params.id = '999'; 

      await UserController.updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nie masz uprawnień do edycji tego profilu.' });
    });
  });

  describe('updatePhoto', () => {
    it('should update user photo successfully', async () => {
      req.files.photo = { name: 'photo.jpg', mv: jest.fn().mockImplementation(cb => cb()) };
      
      const photoPath = 'uploads/photos/1-123456-photo.jpg';
      const uploadFileMock = jest.fn().mockResolvedValue(photoPath);
      UserController.__set__('uploadFile', uploadFileMock); 

      await UserController.updatePhoto(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Zdjęcie profilowe użytkownika zaktualizowane.', photo: photoPath });
    });

    it('should return 400 if no photo is provided', async () => {
      req.files = {}; 

      await UserController.updatePhoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Brak pliku do przesłania.' });
    });

    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null);

      await UserController.updatePhoto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Użytkownik nie znaleziony.' });
    });
  });

  describe('addRecord', () => {
    it('should add a new record successfully', async () => {
      req.body = { title: 'New Record', description: 'Some description', url: 'http://url.com', kategoria_id: 1 };

      await UserController.addRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nagranie zostało dodane do profilu użytkownika.', url: 'http://url.com' });
    });

    it('should return 404 if category not found', async () => {
      Category.findByPk.mockResolvedValue(null);

      await UserController.addRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Kategoria o podanym ID nie istnieje.' });
    });
  });
});

const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.INTEGER,  
      primaryKey: true,         
      autoIncrement: true,      
      allowNull: false,         
    },
    imie: { type: DataTypes.STRING, allowNull: false },
    nazwisko: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    haslo: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING },  
    banner: { type: DataTypes.STRING },
    opis: { type: DataTypes.STRING },
    typ_uzytkownika: { type: DataTypes.STRING, defaultValue: 'student' },
    liczba_polubien: { type: DataTypes.INTEGER, defaultValue: 0 },
    liczba_punktow: { type: DataTypes.INTEGER, defaultValue: 0 },
    klucz: { type: DataTypes.STRING, allowNull: true, unique: true, defaultValue: uuidv4 },
    rola: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Początkujący',
      get() {
        if (this.typ_uzytkownika === 'prowadzacy') {
          return 'Ekspert'; 
        }
        const punkty = this.liczba_punktow || 0;
        if (punkty <= 300) return 'Początkujący';
        if (punkty <= 700) return 'Praktyk';
        return 'Ekspert';
      }
    }
  }, {
    tableName: 'uzytkownik',
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.Record, { foreignKey: 'uzytkownik_id' });
    User.hasMany(models.Comment, { foreignKey: 'uzytkownik_id' });
    User.hasMany(models.Like, { foreignKey: 'uzytkownik_id', onDelete: 'cascade' });
    User.hasMany(models.Live, { foreignKey: 'uzytkownik_id' });

    User.hasMany(models.Points, { as: 'receivedPoints', foreignKey: 'uzytkownik_id' });
    User.hasMany(models.Points, { as: 'givenPoints', foreignKey: 'prowadzacy_id' });
   
    User.hasMany(models.Message, { foreignKey: 'from_id' });
    User.hasMany(models.Message, { foreignKey: 'to_id' });
  };

  return User;
};

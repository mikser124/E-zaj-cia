const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    imie: { type: DataTypes.STRING, allowNull: false },
    nazwisko: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    haslo: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING },
    banner: { type: DataTypes.STRING },
    opis: { type: DataTypes.STRING },
    typ_uzytkownika: { type: DataTypes.STRING, defaultValue: 'student' },
  }, {
    tableName: 'uzytkownik',
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.Record, { foreignKey: 'uzytkownik_id' });
    User.hasMany(models.Comment, { foreignKey: 'uzytkownik_id' });
  };

  return User;
};

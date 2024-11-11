const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Record = sequelize.define('Record', {
    tytul: { type: DataTypes.STRING, allowNull: false },
    opis: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING, allowNull: false },
    data_nagrania: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    liczba_polubien: { type: DataTypes.INTEGER, defaultValue: 0 },
    uzytkownik_id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'nagranie',
    timestamps: false,
  });

  Record.associate = (models) => {
    Record.belongsTo(models.User, { foreignKey: 'uzytkownik_id' });
    Record.hasMany(models.Comment, { foreignKey: 'nagranie_id', onDelete: 'cascade' });
  };

  return Record;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Live = sequelize.define('Live', {
    tytul: { type: DataTypes.STRING, allowNull: false },
    data_rozpoczecia: { type: DataTypes.DATE, allowNull: false, },
    data_zakonczenia: { type: DataTypes.DATE, allowNull: true, },
    uzytkownik_id: { type: DataTypes.INTEGER, allowNull: false },
    kategoria_id: { type: DataTypes.INTEGER,
      references: {
        model: 'Kategoria',
        key: 'id',
      },
      allowNull: true, 
    },
  }, {
    tableName: 'transmisja',
    timestamps: false,
  });

  Live.associate = (models) => {
    Live.belongsTo(models.User, { foreignKey: 'uzytkownik_id' });
    Live.belongsTo(models.Category, { foreignKey: 'kategoria_id', allowNull: true });
  };

  return Live;
};

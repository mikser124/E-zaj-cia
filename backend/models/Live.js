const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Live = sequelize.define('Live', {
    tytul: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    data_rozpoczecia: { 
      type: DataTypes.DATE, 
      allowNull: false, 
    },
    data_zakonczenia: { 
      type: DataTypes.DATE, 
      allowNull: false, 
    },
    uzytkownik_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    klucz: { 
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'transmisja',
    timestamps: false,
  });

  Live.associate = (models) => {
    Live.belongsTo(models.User, { foreignKey: 'uzytkownik_id' });
  };

  return Live;
};

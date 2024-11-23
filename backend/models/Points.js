const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Points = sequelize.define('Points', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      uzytkownik_id: { 
        type: DataTypes.UUID,
        allowNull: false,
      },
      prowadzacy_id: { 
        type: DataTypes.UUID, 
        allowNull: false,
      },
      liczba_punktow: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
      },
      data_przyznania: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  
        allowNull: false,
      }
    }, {
      tableName: 'punkty',
      timestamps: false,  
    });
  
    Points.associate = (models) => {
      Points.belongsTo(models.User, { as: 'student', foreignKey: 'uzytkownik_id' });
      Points.belongsTo(models.User, { as: 'prowadzacy', foreignKey: 'prowadzacy_id' });
    };
  
    return Points;
  };
  
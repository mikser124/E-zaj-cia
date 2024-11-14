module.exports = (sequelize) => {
    const Like = sequelize.define('Like', {}, {
      tableName: 'polubienie',
      timestamps: false,
    });
  
    Like.associate = (models) => {
      Like.belongsTo(models.User, { foreignKey: 'uzytkownik_id' });
      Like.belongsTo(models.Record, { foreignKey: 'nagranie_id' });
    };
  
    return Like;
  };
  
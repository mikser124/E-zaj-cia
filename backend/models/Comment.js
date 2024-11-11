const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    tresc: { type: DataTypes.STRING, allowNull: false },
    data_komentarza: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    uzytkownik_id: { type: DataTypes.INTEGER, allowNull: false },
    nagranie_id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'komentarz',
    timestamps: false,
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'uzytkownik_id' });
    Comment.belongsTo(models.Record, { foreignKey: 'nagranie_id' });
  };

  return Comment;
};

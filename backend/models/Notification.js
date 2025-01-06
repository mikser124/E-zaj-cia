const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    user_id: { type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: 'uzytkownik', 
        key: 'id',
      }, },
    message_id: { type: DataTypes.INTEGER, allowNull: true,
      references: {
        model: 'wiadomosc',
        key: 'id',
      }, },
    content: { type: DataTypes.STRING, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'powiadomienie', 
    timestamps: true, 
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'user_id' });
    Notification.belongsTo(models.Message, { foreignKey: 'message_id', as: 'message' });
  };

  return Notification;
};

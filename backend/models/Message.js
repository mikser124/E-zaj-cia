const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    from_id: { type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: 'uzytkownik', 
        key: 'id',
      }, },
    to_id: { type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: 'uzytkownik',
        key: 'id',
      }, },
    content: { type: DataTypes.TEXT, allowNull: false, },
    read: { type: DataTypes.BOOLEAN, defaultValue: false, },
  }, {
    tableName: 'wiadomosc', 
    timestamps: true, 
   
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'from_id', as: 'sender' });
    Message.belongsTo(models.User, { foreignKey: 'to_id', as: 'receiver' });
    
    Message.hasMany(models.Notification, { foreignKey: 'message_id' });
  };

  return Message;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    nazwa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'kategoria',
    timestamps: false,
  });

  Category.associate = (models) => {
    Category.hasMany(models.Record, { foreignKey: 'kategoria_id', onDelete: 'SET NULL' });
    Category.hasMany(models.Live, { foreignKey: 'kategoria_id', onDelete: 'SET NULL' });
  };

  return Category;
};

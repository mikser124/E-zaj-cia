const { Category } = require('../models');

exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Błąd podczas pobierania kategorii:', error);
      res.status(500).json({ message: 'Błąd podczas pobierania kategorii' });
    }
  };
  
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Kategoria nie znaleziona' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Błąd podczas pobierania kategorii:', error);
    res.status(500).json({ message: 'Błąd podczas pobierania kategorii' });
  }
};

exports.createCategory = async (req, res) => {
  const { nazwa } = req.body;

  try {
    const newCategory = await Category.create({ nazwa });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Błąd podczas dodawania kategorii:', error);
    res.status(500).json({ message: 'Błąd podczas dodawania kategorii' });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nazwa } = req.body;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Kategoria nie znaleziona' });
    }

    category.nazwa = nazwa;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error('Błąd podczas aktualizacji kategorii:', error);
    res.status(500).json({ message: 'Błąd podczas aktualizacji kategorii' });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Kategoria nie znaleziona' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Kategoria usunięta pomyślnie' });
  } catch (error) {
    console.error('Błąd podczas usuwania kategorii:', error);
    res.status(500).json({ message: 'Błąd podczas usuwania kategorii' });
  }
};

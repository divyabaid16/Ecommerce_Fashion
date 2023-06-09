const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

// Get all Categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create Category
router.post('/', async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const newCategory = await Category.create({ name, parentId });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update Category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, parentId },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete Category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get Categories in Tree View
router.get('/treeview', async (req, res) => {
  try {
    const categories = await Category.find();

    console.log("categories", categories)
    const categoryTree = buildCategoryTree(categories, null);

    res.json(categoryTree);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories in tree view' });
  }
});

// Helper function to build category tree
function buildCategoryTree(categories) {
  const categoryMap = {};
  const categoryTree = [];

  // Create a mapping of category _id to category object
  categories.forEach((category) => {
    categoryMap[category._id.toString()] = {
      _id: category._id.toString(),
      name: category.name,
      children: [],
    };
  });

  console.log("categoryMap", categoryMap);

  // Build the category tree structure iteratively
  categories.forEach((category) => {
    console.log("category", category)
    if (category.parentId) {
      categoryMap[category.parentId].children.push(categoryMap[category._id.toString()]);
    } else {
      categoryTree.push(categoryMap[category._id.toString()]);
    }
  });

  console.log("categoryTree", categoryTree);

  return categoryTree;
}

module.exports = router;

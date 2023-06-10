import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

function Category({ category, updateCategory, deleteCategory, addCategory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateCategory(category._id, name);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteCategory(category._id);
  };

  const handleAdd = () => {
    const newCategoryName = window.prompt('Enter the name of the new category:');
    if (newCategoryName) {
      addCategory(category._id, newCategoryName);
    }
  };

  return (
    <div>
      <div className="category">
        <span className="category-name">{category.name}</span>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
          </div>
        ) : (
          <div>
            <button type="button" class="btn btn-outline-primary" onClick={handleEdit}>
              Edit
            </button>
            <button type="button" class="btn btn-outline-danger" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" class="btn btn-outline-success" onClick={handleAdd}>
              Add Category
            </button>
          </div>
        )}
      </div>

      {category.children && category.children.length > 0 && (
        <ul>
          {category.children.map((childCategory) => (
            <li key={childCategory._id}>
              <Category
                category={childCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
                addCategory={addCategory}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [categories, setCategories] = useState([]);
  const backendUrl = 'http://localhost:3000'

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/categories/treeview`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const updateCategory = async (categoryId, newName) => {
    try {
      await axios.put(`${backendUrl}/api/categories/${categoryId}`, { name: newName });
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${backendUrl}/api/categories/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const addCategory = async (parentId, categoryName) => {
    try {
      const newCategory = {
        name: categoryName,
        parentId: parentId
      };
      await axios.post(`${backendUrl}/api/categories`, newCategory);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const addRootCategory = async (categoryName) => {
    try {
      const newCategory = {
        name: categoryName
      };
      await axios.post(`${backendUrl}/api/categories`, newCategory);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAdd = () => {
    const newCategoryName = window.prompt('Enter the name of the new category:');
    if (newCategoryName) {
      addRootCategory(newCategoryName);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Categories</h1>
      <button type="button" className="btn btn-outline-primary" onClick={handleAdd}>
        Add Category
      </button>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            <Category
              category={category}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
              addCategory={addCategory}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

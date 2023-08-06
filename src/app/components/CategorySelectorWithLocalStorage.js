import React, { useState, useEffect } from 'react';

function CategorySelectorWithLocalStorage({ onCategoryChange }) {
  const [categories, setCategories] = useState(['coding', 'work']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);

    if (event.target.value === 'addNew') {
      setShowAddNew(true);
    } else {
      setShowAddNew(false);
      onCategoryChange(event.target.value);
    }
  };

  const addCustomCategory = () => {
    if (customCategory && !categories.includes(customCategory)) {
      setCategories([...categories, customCategory]);
      setSelectedCategory(customCategory);
      onCategoryChange(customCategory);
      setShowAddNew(false);
      setCustomCategory('');
    }
  };

  return (
    <div>
      <h2>Choose a category</h2>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
        <option value="addNew">Add New Category</option>
      </select>

      {showAddNew && (
        <div>
          <h3>Add a custom category</h3>
          <input 
            type="text" 
            value={customCategory} 
            onChange={e => setCustomCategory(e.target.value)} 
            placeholder="Enter a new category"
          />
          <button onClick={addCustomCategory}>Add</button>
        </div>
      )}
    </div>
  );
}

export default CategorySelectorWithLocalStorage;

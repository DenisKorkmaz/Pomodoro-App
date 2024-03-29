import React, { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

function CategorySelectorWithLocalStorage({ onCategoryChange }) {
  const [categories, setCategories] = useLocalStorageState("categories", ["work"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    if (newCategory === "addNew") {
      setShowAddNew(true);
    } else {
      setShowAddNew(false);
      onCategoryChange(newCategory);
    }
  };

  const addCustomCategory = () => {
    if (customCategory && !categories.includes(customCategory)) {
      const newCategories = [...categories, customCategory];
      setCategories(newCategories);
      setSelectedCategory(customCategory);
      setCustomCategory("");
      setShowAddNew(false);
      onCategoryChange(customCategory);
    }
  };

  return (
    <div>
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}>
        <option disabled value="">
          Choose category
        </option>
        {Array.isArray(categories) && categories.map((category, index) => (
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
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Type a new category here"
          />
          <button onClick={addCustomCategory}>Add Category</button>
        </div>
      )}
    </div>
  );
}

export default CategorySelectorWithLocalStorage;

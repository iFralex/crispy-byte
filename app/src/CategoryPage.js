import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FoodDetailsPanel, {FoodCard} from './FoodDetailsPanel.js';
import {SectionHeader} from './App.js';

const CategoryPage = ({ category, items, onBackClick }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedFood, setSelectedFood] = useState({});
  
    const handleOpenDetails = food => {
      setShowDetails(true)
      setSelectedFood(food)
    };
  
    const handleCloseDetails = () => {
      setShowDetails(false);
    };
    
    return (
      <div>
      <div className="category-page" aria-hidden={showDetails}>
        <SectionHeader onBackClick={onBackClick} title={category} />
        <div className="food-list">
          {items.map((item, i) => (
            <FoodCard key={item.id} food={item} onOpenDetails={handleOpenDetails} index={i} />
          ))}
        </div>
      </div>
      {showDetails && (
            <FoodDetailsPanel food={selectedFood} onClose={handleCloseDetails} />
        )}
      </div>
    );
  };
  
  export default CategoryPage
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { SectionHeader, orderList, categoriesList, foodsList, PriceFromNum } from "./App"
import { ShortSummary } from "./Summary"

const CategoryList = ({ categories, onCategoryClick, setUpdate }) => {
  const paddingListDivRef = useRef(null);
  const [summaryHeight, setSummaryHeight] = useState(0);
  const [price, setPrice] = useState(PriceFromNum(totalOrderCost()));

  useEffect(() => {
    if (paddingListDivRef.current)
      paddingListDivRef.current.style.height = `${summaryHeight}px`;
  }, [summaryHeight]);

  const handleDeleteOrder = id => {
    delete orderList[id]
    handlePrice()
  }

  const handlePrice = () => setPrice(PriceFromNum(totalOrderCost()))
  const showSummary = Object.keys(orderList).length > 0

  return (<div className='w-100'>
    <SectionHeader title={"Cosa vuoi ordinare?"} />
    <div className="category-list">
      {categories.map((category, i) => (
        <div key={i}>
          <div className="category-card">
            <div className='food-card-bt' role='button' onClick={() => onCategoryClick(category)} tabIndex={i} aria-label={category}>
              <h3>{category}</h3>
              <div className="category-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
            <div className='ordered-list-category' role='group' aria-label={"Ordini di " + category}>
              {Object.keys(orderList).map((id) => (
                id >= categoriesList[category][0] && id < categoriesList[category][0] + categoriesList[category][1] ? (<FoodOrdered key={id} name={foodsList[id].title} quantity={orderList[id]} onDelete={() => handleDeleteOrder(id)} />) : null))}
            </div>
          </div>
        </div>
      ))}
      {showSummary && <div ref={paddingListDivRef} />}
      {showSummary && <ShortSummary price={price} setPaddingDivHeight={setSummaryHeight} />}
    </div>
  </div>
  );
};

const FoodOrdered = ({ name, quantity, onDelete }) => {
  return (<div className='ordered-item-category'>
    <span>{name}: {quantity}</span>
    <button onClick={onDelete} aria-label={"Rimuovi " + quantity + " di " + name}><FontAwesomeIcon icon={faTimesCircle} /></button>
  </div>)
}

export const totalOrderCost = () => Object.keys(orderList).reduce((tot, id) => tot + foodsList[id].price * orderList[id], 0)
export default CategoryList
import React, { useState } from 'react';
import data from "./data.json"
import './App.css'; // Stile della pagina
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import CategoryList from './CategoryList.js';
import CategoryPage from './CategoryPage.js';
import { useSpring, animated } from '@react-spring/web';

const foodsList = data.foodsList
const categoriesList = data.categoriesList

foodsList.map((f, i) => f.id = i)
let pK, i = 0
for (let key in categoriesList) {
  let d = categoriesList[key]
  if (i > 0)
    categoriesList[key] = [categoriesList[pK][0] + categoriesList[pK][1], d]
  else
    categoriesList[key] = [0, d]
  pK = key
  i++
}
const tavolo = new URLSearchParams(window.location.search).get("tavolo") || -1

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [update, setUpdate] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  const handleUpdate = () => setUpdate(!update)

  const items = selectedCategory ? foodsList.slice(categoriesList[selectedCategory][0], categoriesList[selectedCategory][1] + categoriesList[selectedCategory][0]) : [];

  if (tavolo !== -1 && data.tables.includes(tavolo))
    return (
      <div className="app">
        <header className="app-header" aria-label='CrispyByte'>
          <h1>CrispyByte 🍕</h1>
        </header>
        <main className="app-main container">
          {selectedCategory ? (
            <CategoryPage category={selectedCategory} items={items} onBackClick={handleBackClick} />
          ) : (
            <CategoryList categories={Object.keys(categoriesList)} onCategoryClick={handleCategoryClick} setUpdate={handleUpdate} />
          )}
        </main>
      </div>
    );
  else
    return <p style={{ color: "red", padding: 20 }}>Errore: argomento mancante.<br />Prova a scannerizzare di nuovo il QR code.<br /><br />Codice Errore: 001</p>
};

const SectionHeader = ({ title, onBackClick, ariaHidden }) => {
  return (
    <div className="section-header" aria-hidden={ariaHidden}>
      {onBackClick !== undefined && (<div className='back-i' role='button' aria-label="Indietro">
        <FontAwesomeIcon icon={faArrowLeft} onClick={onBackClick} className='display-4' />
      </div>)}
      <h2>{title}</h2>
    </div>
  );
};

export const LoadingIcon = ({ size }) => {
  const props = useSpring({
    to: { transform: 'rotate(360deg)' },
    from: { transform: 'rotate(0deg)' },
    reset: true,
    loop: { reverse: true },
  });

  return (
    <animated.div
      style={{
        border: '10px solid #eee',
        borderTop: '10px solid #ed3434',
        borderRadius: '50%',
        width: size + "px",
        height: size + "px",
        ...props,
      }}
    />
  );
};


export const imgLinks = {}
export const orderList = {}
export const PriceFromNum = n => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
export { SectionHeader, categoriesList, foodsList }
export default App
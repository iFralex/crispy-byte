import React, { useState } from 'react';
import './App.css'; // Stile della pagina
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import CategoryList from './CategoryList.js';
import CategoryPage from './CategoryPage.js';
import { useSpring, animated } from '@react-spring/web';

const foodsList = [
  {
    title: 'Bruschetta',
    description: 'Pane tostato con pomodoro fresco, aglio e basilico.',
    price: 4.5,
    details: {
      Ingredienti: ['Pane', 'Pomodoro', 'Aglio', 'Basilico'],
      Allergeni: ['Glutine'],
    },
  },
  {
    title: 'Caprese',
    description: 'Mozzarella di bufala, pomodoro e basilico freschi.',
    price: 6.0,
    details: {
      Ingredienti: ['Mozzarella di bufala', 'Pomodoro', 'Basilico'],
      Allergeni: ['Lattosio'],
    },
  },
  {
    title: 'Prosciutto e Melone',
    description: 'Prosciutto crudo con fette di melone fresco.',
    price: 7.0,
    details: {
      Ingredienti: ['Prosciutto crudo', 'Melone'],
      Allergeni: [],
    },
  },
  {
    title: 'Carpaccio di Manzo',
    description: 'Fette sottili di manzo marinato con olio e limone.',
    price: 8.5,
    details: {
      Ingredienti: ['Manzo', 'Olio', 'Limone'],
      Allergeni: [],
    },
  },
  //Pizza
  {
    title: 'Margherita',
    description: 'La regina delle pizze! Gustosa salsa di pomodoro, mozzarella di bufala fresca e fragrante basilico, tutto abbracciato dalla crosta perfettamente cotta.',
    price: 6.5,
    details: {
      Ingredienti: ['Pomodoro', 'Mozzarella fior di latte', 'Basilico'],
      Allergeni: ['Uova', 'Latte'],
    },
  },
  {
    title: 'Peperoni',
    description: 'Senti il calore dell\'amore in ogni morso! Una festa di sapori con salsa di pomodoro, mozzarella fusa e peperoncini piccanti che aggiungono un tocco piccante indimenticabile.',
    price: 8.0,
    details: {
      Ingredienti: ['Pomodoro', 'Mozzarella', 'Peperoni'],
      Allergeni: ['Latte'],
    },
  },
  {
    title: 'Funghi',
    description: 'Un bosco di delizie sulla tua pizza! La combinazione perfetta di pomodoro fresco, mozzarella cremosa e funghi appena raccolti che ti faranno immergere nei profumi della natura.',
    price: 7.5,
    details: {
      Ingredienti: ['Pomodoro', 'Mozzarella', 'Funghi'],
      Allergeni: ['Latte'],
    },
  },
  {
    title: 'Quattro Stagioni',
    description: 'Un viaggio culinario attraverso le stagioni! Divertiti con un trionfo di sapori con prosciutto cotto, funghi, carciofi e olive nere, ognuno rappresentante una stagione unica.',
    price: 9.0,
    details: {
      Ingredienti: [
        'Pomodoro',
        'Mozzarella',
        'Prosciutto cotto',
        'Funghi',
        'Carciofi',
        'Olive nere',
      ],
      Allergeni: ['Latte'],
    },
  },
  {
    title: 'Patate e Salsiccia',
    description: 'Un connubio di sapori che ti sorprenderà! Mozzarella di bufala, patate a fette sottili e salsiccia italiana saporita, il tutto sulla nostra crosta tradizionale.',
    price: 10.5,
    details: {
      Ingredienti: ['Mozzarella di bufala', 'Patate', 'Salsiccia', "Rosmarino"],
      Allergeni: ['Latte'],
    },
  },
  //Contorni
  {
    title: 'Patatine fritte',
    description: 'Patatine croccanti e dorate.',
    price: 3.5,
    details: {
      Ingredienti: ['Patate', 'Olio', 'Sale'],
      Allergeni: [],
    },
  },
  {
    title: 'Insalata mista',
    description: 'Un mix fresco di lattuga, pomodori, carote e cetrioli.',
    price: 4.0,
    details: {
      Ingredienti: ['Lattuga', 'Pomodoro', 'Carote', 'Cetrioli'],
      Allergeni: [],
    },
  },
  {
    title: 'Insalata Caesar',
    description: 'Lattuga, crostini, parmigiano e salsa Caesar.',
    price: 5.5,
    details: {
      Ingredienti: ['Lattuga', 'Crostini', 'Parmigiano', 'Salsa Caesar'],
      Allergeni: ['Glutine', 'Lattosio'],
    },
  },
  {
    title: 'Verdure Grigliate',
    description: 'Mix di verdure grigliate con olio e erbe aromatiche.',
    price: 6.0,
    details: {
      Ingredienti: ['Zucchine', 'Peperoni', 'Melanzane', 'Olio', 'Erbe aromatiche'],
      Allergeni: [],
    },
  },
  {
    title: 'Patate al Forno',
    description: 'Patate al forno con rosmarino e aglio.',
    price: 4.0,
    details: {
      Ingredienti: ['Patate', 'Rosmarino', 'Aglio'],
      Allergeni: [],
    },
  },
  //Dolci
  {
    title: 'Tiramisù',
    description: 'Il classico dolce italiano con savoiardi e crema al caffè.',
    price: 5.5,
    details: {
      Ingredienti: ['Savoiardi', 'Caffè', 'Mascarpone', 'Cacao'],
      Allergeni: ['Uova', 'Glutine', 'Lattosio'],
    },
  },
  {
    title: 'Panna Cotta',
    description: 'Dolce al cucchiaio con salsa di frutti di bosco.',
    price: 4.8,
    details: {
      Ingredienti: ['Panna', 'Zucchero', 'Gelatina', 'Frutti di bosco'],
      Allergeni: ['Lattosio'],
    },
  },
  {
    title: 'Torta al Cioccolato',
    description: 'Torta soffice al cioccolato con glassa al cioccolato fondente.',
    price: 6.5,
    details: {
      Ingredienti: ['Farina', 'Cacao', 'Zucchero', 'Cioccolato fondente'],
      Allergeni: ['Glutine', 'Lattosio'],
    },
  },
  //Bevande
  {
    title: 'Acqua naturale',
    description: 'Acqua minerale naturale.',
    price: 2.0,
    details: {
      Ingredienti: ['Acqua'],
      Allergeni: [],
    },
  },
  {
    title: 'Coca-Cola',
    description: 'Bevanda gassata al cola.',
    price: 2.5,
    details: {
      Ingredienti: ['Acqua', 'Zucchero', 'Anidride carbonica', 'Caffeina'],
      Allergeni: [],
    },
  },
  {
    title: 'Limonata',
    description: 'Bevanda rinfrescante al limone.',
    price: 3.0,
    details: {
      Ingredienti: ['Acqua', 'Limone', 'Zucchero'],
      Allergeni: [],
    },
  },
  {
    title: 'Aranciata',
    description: "Bevanda gassata all'arancia.",
    price: 2.8,
    details: {
      Ingredienti: ['Acqua', 'Arancia', 'Zucchero', 'Anidride carbonica'],
      Allergeni: [],
    },
  },
];

const categoriesList = { Antipasto: 4, Pizza: 5, Contorno: 5, Dolce: 3, Bevanda: 4 }
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

  if (tavolo !== -1)
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
  return <p style={{color: "red", padding: 20}}>Errore: argomento mancante.<br/>Prova a scannerizzare di nuovo il QR code.<br/><br/>Codice Errore: 001</p>
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

export const LoadingIcon = ({size}) => {
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
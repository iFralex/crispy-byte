import React, { useState, useEffect, useRef } from 'react';
import "./App.css"
import './FoodDetailsPanel.css';
import { orderList, PriceFromNum, LoadingIcon } from "./App"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faClose, faComment, faTrash } from '@fortawesome/free-solid-svg-icons';
import { animated, useSpring } from '@react-spring/web'
import { GetFirstImage, GetImages } from "./firebase"

export const FoodCard = ({ food, onOpenDetails, index }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    GetFirstImage(food.title, setImageUrl)
  }, [food.title]);

  return (
    <div className="col-xl-2 col-lg-3 col-md-4 col-6 col-xxs-12">
      <div className="food-card" role='button' onClick={() => onOpenDetails(food)} tabIndex={index} aria-label={food.title + (orderList[food.id] == null ? ": clicca per aprire il pannello dei dettagli e per ordinare." : ", " + orderList[food.id] + (orderList[food.id] > 1 ? " ordinati" : " ordinato") + ": clicca per aprire il pannello dei dettagli e per modificare l'ordine.")}>
        {imageUrl ? <img src={imageUrl} alt={"Immagine anteprima di " + food.title}/> : <div className='img-placeholder'><LoadingIcon size={40}/></div>}
        <div>{food.title}</div>
        {orderList[food.id] != null ? <div className='order-n'><FontAwesomeIcon icon={faComment} className='icon' />
          <span>{orderList[food.id]}</span></div> : null}
      </div>
    </div>
  );
};

const FoodDetailsPanel = ({ food, onClose }) => {
  const [quantity, setQuantity] = useState(orderList[food.id] == null ? 1 : orderList[food.id]);
  const [isClosing, setIsClosing] = useState(false);
  const [closeTop, setCloseTop] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    const updateButtonPosition = () => {
      if (divRef.current)
        setCloseTop(divRef.current.clientHeight - window.scrollY)
    }
    updateButtonPosition()
    const resizeObserver = new ResizeObserver(updateButtonPosition);
    if (divRef.current) {
      resizeObserver.observe(divRef.current)
    }
    window.addEventListener('scroll', updateButtonPosition);
    return () => {
      if (divRef.current) {
        resizeObserver.unobserve(divRef.current);
      }
      window.removeEventListener('scroll', updateButtonPosition);

    };
  }, []);

  const upSprings = useSpring({
    from: { transform: "translateY(" + (isClosing ? "0%" : "100%") + ")" },
    to: { transform: "translateY(" + (!isClosing ? "0%" : "100%") + ")" },
    onRest: isClosing ? onClose : null
  })
  const overlaySprings = useSpring({
    from: { backgroundColor: "rgba(0, 0, 0, " + (!isClosing ? "0" : "0.8") + ")" },
    to: { backgroundColor: "rgba(0, 0, 0, " + (isClosing ? "0" : "0.8") + ")" },
  })

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleOrder = () => {
    orderList[food.id] = quantity
    handleIsClosing();
  }

  const handleDeleteOrder = id => {
    delete orderList[id]
    handleIsClosing()
  }

  const handleIsClosing = () => {
    setIsClosing(true);
  };

  const detalisList = (info, title) => (
    info.length > 0 && (<div className='details-list'>
      <h3>{title}</h3>
      <div>{Array.from({ length: info.length }, (_, index) => (
        <div key={index}>{info[index]}</div>))}</div>
    </div>)
  )

  return (
    <div id={"food-details-panel"} aria-hidden="false">
      <animated.div className="overlay" onClick={handleIsClosing} style={{ ...overlaySprings }} />
      {!isClosing && (<button className='close-bt' onClick={handleIsClosing} style={{bottom: closeTop + "px"}} aria-label='Chiudi il pannello dei dettagli'><FontAwesomeIcon icon={faClose} /></button>)}
      <animated.div className={`food-details-panel`} style={{ ...upSprings }} ref={divRef}>
        <h1 className='food-details-title'>{food.title}</h1>
        <div className="food-details-content">
          <ImageGallery name={food.title} />
          {food.description && <div className='text-center'><p>{food.description}</p></div>}
          <div className='divider' />
          {Object.keys(food.details).map((k, i) => (
          detalisList(food.details[k], k)))}
          <div className='row'>
            <div className='price col-6 col-xs-12'>
              <div aria-label={"Prezzo: " + PriceFromNum(food.price)}>{PriceFromNum(food.price)}</div></div>
            <div className='quantity col-6 col-xs-12'>
              <div>
                <button onClick={handleDecrease} aria-label="Diminuisci di uno">-</button>
                <span aria-label={"Quantità: " + quantity}>{quantity}</span>
                <button onClick={handleIncrease} aria-label="Aumenta di uno">+</button>
              </div>
            </div>
          </div>
          <button className='order-bt' onClick={handleOrder}>
            {orderList[food.id] == null ? "Aggiungi " : "Sostituisci "}
            <FontAwesomeIcon icon={faCartPlus} />
          </button>
          {orderList[food.id] != null && <button className='order-bt delete-bt' onClick={() => handleDeleteOrder(food.id)}>
            {"Elimina "}
            <FontAwesomeIcon icon={faTrash} />
          </button>}
        </div>
      </animated.div>
    </div>
  );
};

const ImageGallery = ({ name }) => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    GetImages(name, setImageUrls)
  }, [name]);

  return (imageUrls.length > 0 ? (
    <div className="img-list" role='group' aria-label={"Galleria di foto di " + name}>
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={"foto " + name + " " + index} className="gallery-image" aria-hidden="true" />
      ))}
    </div>
  ) : <div />)
};

export default FoodDetailsPanel;
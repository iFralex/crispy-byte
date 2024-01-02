import React, { useState, useEffect, useRef } from 'react';
import './App.css'
import './FoodDetailsPanel.css'
import './Summary.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faClose, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { animated, useSpring } from '@react-spring/web'
import { orderList, foodsList, LoadingIcon } from "./App"
import { takeOrder } from "./firebase"

const ShortSummary = ({ price, handleOpenSummary, handleCloseSummary, showSummary, setPaddingDivHeight }) => {
    const summaryRef = useRef();

    useEffect(() => {
        if (summaryRef.current && setPaddingDivHeight) {
            setPaddingDivHeight(summaryRef.current.clientHeight);
        }
    });

    return (<div>
        <div className='short-summary-panel' ref={summaryRef} role='group' aria-hidden={showSummary} aria-label={'Riepilogo del tuo ordine: ' + Object.keys(orderList).length + " elementi per " + price}>
            <div className='container'>
                <div className='short-total' aria-label={'Prezzo totale: ' + price}>{price}</div>
                <button className='short-summary-bt' onClick={handleOpenSummary} aria-label={"Ordina " + Object.keys(orderList).length + " elementi."}>
                    {"Ordina ora "}
                    <FontAwesomeIcon icon={faShoppingCart} />
                </button>
            </div>
        </div>
        {showSummary && <ConfirmDialog price={price} onClose={handleCloseSummary} />}
    </div>)
}

const ConfirmDialog = ({ price, onOpen, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [closeTop, setCloseTop] = useState(0);
    const [state, setState] = useState(0);
    const divRef = useRef(null);
    const tavolo = new URLSearchParams(window.location.search).get("tavolo") || -1

    useEffect(() => {
        const updateButtonPosition = () => {
            if (divRef.current) {
                setCloseTop(divRef.current.clientHeight - window.scrollY);
            }
        };
        updateButtonPosition()
        window.addEventListener('scroll', updateButtonPosition);
        return () => {
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

    const handleIsClosing = () => {
        setIsClosing(true);
    };

    const onConfirm = () => {
        setState(1)
        takeOrder(orderList, tavolo, () => setState(2), err => {
            alert("Qualcosa è andato storto.\nErrore: " + err)
            setState(0)
        })
    }

    const content = () => {
        switch (state) {
            case 0:
                return (
                    <div className="food-details-content">
                        <h3>Riepilogo</h3>
                        <p style={{ margin: "15px 0 5px 0" }}>Stai ordinando:</p>
                        <ul>
                            {Object.keys(orderList).map(id => (
                                <li key={id}>{foodsList[id].title + ": x" + orderList[id]}</li>
                            ))}</ul>
                        <p>Per un importo totale di: <strong>{price}</strong></p>
                        <p>Al tavolo: <strong>{tavolo}</strong></p>
                        <div className='divider' />
                        <p>Sei sicuro di voler procedere?</p>
                        <button className='order-bt' onClick={tavolo !== -1 ? onConfirm : () => alert("Errore: argomento mancante.\nProva a scannerizzare di nuovo il QR code.\n\nCodice Errore: 001")}>
                            Ordina
                        </button>
                    </div>)
            case 1:
                return <div className='food-details-content loading-order-div'><LoadingIcon size={80} /></div>
            default:
                return (<div className='food-details-content loading-order-div'>
                    <div>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <h1>Ordine completato!</h1>
                        <p>Hai effettuato correttamente l'ordine.<br />Non ti resta che attendere il tuo pasto, e buon appetito!</p>
                        <button className='reload-bt' onClick={() => window.location.reload()}>Ricarica la pagina per ordinare di nuovo</button>
                    </div>
                </div>)
        }
    }
    return (
        <div style={{ width: 0 }}>
            <animated.div className="overlay" onClick={state === 0 ? handleIsClosing : () => { }} style={{ ...overlaySprings }} />
            {!isClosing && state === 0 && (<button className='close-bt' onClick={handleIsClosing} style={{ bottom: closeTop + "px" }} aria-label='Chiudi il pannello del riepilogo'><FontAwesomeIcon icon={faClose} /></button>)}
            <animated.div className={`food-details-panel`} style={{ ...upSprings }} ref={divRef}>
                {state === 0 && <h1 className='food-details-title'>Conferma ordine</h1>}
                {content()}
            </animated.div>
        </div>
    );
}

export { ShortSummary }
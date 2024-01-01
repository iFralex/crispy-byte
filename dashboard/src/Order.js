import { useState } from "react";
import { foodsList, tables, ColorTable } from "./App"
import { format } from "date-fns"
import { UpdateCompletedsOnDb, DeleteOrder } from "./firebase"
import { faRotateRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Order = ({ order, info }) => {
    const [selection, setSelection] = useState(info.completed || [])
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const completing = info.completed.length === Object.keys(order).length
    let equal = JSON.stringify(selection) === JSON.stringify(info.completed)

    const handleUpdateSelection = item => {
        let newSel = selection.includes(item) ? selection.filter(i => i !== item) : selection.concat(item)
        setSelection(newSel)
        equal = JSON.stringify(newSel.sort((a, b) => a - b)) === JSON.stringify(info.completed)
    }

    const handleResetSelection = () => setSelection(info.completed)

    const SetDone = () => {
        UpdateCompletedsOnDb(true, info.table, info.time, () => setLoading(false))
        setLoading(true)
    }

    const UpdateCompleteds = () => {
        UpdateCompletedsOnDb(selection, info.table, info.time, () => setLoading(false))
        setLoading(true)
    }

    const TotalPrice = obj => {
        let p = 0
        Object.keys(obj).map(id =>
            p += foodsList[parseInt(id)].price * obj[id]
        )
        return p
    }

    return (<div className="order" style={{backgroundColor: ColorTable(tables[info.table])
    }}>
        <div className="details">
            <p>Tavolo: <span>{info.table}</span></p>
            <p>Prezzo: <span>{PriceFromNum(TotalPrice(order))}</span></p>
            <p>Ora: <span>{format(new Date(info.time), "HH:mm")}</span></p>
        </div>
        <p>Ordinato: </p>
        <ul>
            {loading ? <div className="loading">Loading...</div> :
                Object.keys(order).map((foodId, i) => {
                    return (info.completed === true ?
                        <li key={i}>{foodsList[foodId].title + ": x" + order[foodId]}</li> :
                        <label key={i}><input type="checkbox" checked={selection.includes(parseInt(foodId))} onChange={() => handleUpdateSelection(parseInt(foodId))}></input>{foodsList[foodId].title + ": x" + order[foodId]}</label>)
                })}
        </ul>
        {!loading && !equal && info.completed !== true && <div className="d-flex"><button className="update-bt" onClick={UpdateCompleteds}>Aggiorna</button><button className="reset-bt" onClick={handleResetSelection}><FontAwesomeIcon icon={faRotateRight}/></button></div>}
        {!loading && equal && completing && <button className="done-bt" onClick={SetDone}>{"Fatto "} <FontAwesomeIcon icon={faCheckCircle}/></button>}
        {!deleting && info.completed === true && <button className="delete-bt" onClick={() => setDeleting(true)}>Elimina</button>}
        {deleting && <div>
            <p style={{paddingTop: 10}}>Sicuro di vole eliminare quest'ordine?</p>
            <button className="delete-bt" onClick={() => DeleteOrder(info.table, info.time)}>Conferma</button>
            <button className="cancel-bt" onClick={() => setDeleting(false)}>Annulla</button></div>}
    </div>)
}

export const PriceFromNum = n => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });

export default Order
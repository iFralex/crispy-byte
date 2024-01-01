import { useState } from "react"
import { tables, ColorTable } from "./App"
import { GetTableOrderFromDb, DeleteOrder } from "./firebase"
import OrdersList from "./OrdersList"
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PriceFromNum } from "./Order"

const TablesList = () => {
    const [selTable, setSelTable] = useState("")
    const [totalPrice, setTotalPrice] = useState(0)
    const [orderIds, setOrderIds] = useState([])
    const [deleting, setDeleting] = useState(false)

    const handleSelTable = sel => setSelTable(sel)
    const handleUnsetSelTable = () => {
        setSelTable("")
        setDeleting(false)
    }

    const handleInfo = (n, ids) => {
        setTotalPrice(n)
        console.log("ids: ", ids)
        setOrderIds(ids)
    }

    return <div>
        {selTable === "" ? <div className="tables-list">{Object.keys(tables).map(table => (
            <div key={table} role="button" onClick={() => handleSelTable(table)} style={{ backgroundColor: ColorTable(tables[table]) }}>
                <span>Tavolo {table}</span>
            </div>
        ))}</div> :
            <div>
                <div className="head-table">
                    <h1>Tavolo {selTable}</h1>
                    <button onClick={handleUnsetSelTable}><FontAwesomeIcon icon={faArrowLeft} /></button>
                </div>
                <OrdersList GetOrdersFunc={func => GetTableOrderFromDb(selTable, func)} FormatOrders={ol => {
                    let _info = {}, formOrders = {}
                    Object.keys(ol).map(id => {
                        _info[id] = { table: selTable, time: parseInt(id), completed: ol[id].completed || [] }
                        if (ol[id].completed)
                            delete ol[id].completed
                        formOrders[id] = ol[id]
                    })
                    return [formOrders, _info]
                }} callbackFunc={handleInfo} />
                {orderIds.length > 0 ? <div className="total-price"><p style={{ margin: 0 }}>Prezzo totale:</p><span>{PriceFromNum(totalPrice)}</span></div> : <div className="no-order">Nessun ordine per ora</div>}
                {orderIds.length > 0 && (!deleting ? <button className="delete-bt" onClick={() => setDeleting(true)}>Elimina tutto</button> : <div className="confirm-deleting">
                    <p style={{ paddingTop: 10, color: "white", marginBottom: -20 }}>Sicuro di vole eliminare quest'ordine?</p>
                    <button className="delete-bt" onClick={() => orderIds.map(id => DeleteOrder(selTable, id))}>Conferma</button>
                    <button className="cancel-bt" onClick={() => setDeleting(false)}>Annulla</button></div>)}
                <div style={{height: 15}} />
            </div>}
    </div>
}

export default TablesList
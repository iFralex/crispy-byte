import { useState, useEffect, useReducer } from 'react'
import "./App"
import Order from "./Order"
import { GetAllOrders } from "./firebase"

const OrdersList = () => {
    const [orders, setOrderList] = useState({})
    const [info, setInfo] = useState({})
    const [ordersNumber, setOrdersNumber] = useState(0)

    const handleGetOrderList = ol => {
        let formOrders = {}, _info = {}
        if (ol)
            Object.keys(ol).map((table) => Object.keys(ol[table]).map(id => {
                if (ol[table][id].completed !== true) {
                    _info[id] = { table: table, time: parseInt(id), completed: ol[table][id].completed || [] }
                    if (ol[table][id].completed)
                        delete ol[table][id].completed
                    formOrders[id] = ol[table][id]
                }
            }))
        setOrderList(formOrders)
        setInfo(_info)
    }

    useEffect(() => { GetAllOrders(handleGetOrderList) }, [])

    return (<div className='row'>
        {Object.keys(orders).map((id, i) => (
            <div key={i} className='col-12 col-xs-6 col-md-4 col-lg-2'>
                <Order order={orders[id]} info={info[id]} />
            </div>
        ))}
    </div>)
}

export default OrdersList
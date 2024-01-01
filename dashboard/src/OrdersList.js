import { useState, useEffect, useReducer } from 'react'
import {foodsList} from "./App"
import Order from "./Order"

const OrdersList = ({ GetOrdersFunc, FormatOrders, callbackFunc = (_, __) => {}}) => {
    const [orders, setOrderList] = useState({})
    const [info, setInfo] = useState({})

    const handleGetOrderList = ol => {
        let formOrders = {}, _info = {}
        if (ol)
            [formOrders, _info] = FormatOrders(ol)
        setOrderList(formOrders)
        setInfo(_info)
        let tP = 0
        Object.keys(formOrders).map(id => Object.keys(formOrders[id]).map(foodId => tP += foodsList[foodId].price * formOrders[id][foodId]))
        callbackFunc(tP, Object.keys(formOrders))
        console.log(Object.keys(formOrders).map(i => [_info[i].table, i.substring(4)]))
    }

    useEffect(() => { GetOrdersFunc(handleGetOrderList) }, [])

    return (<div className='row'>
        {Object.keys(orders).sort((a, b) => b - a).map((id, i) => (
            <div key={id} className='col-12 col-xs-6 col-md-4 col-lg-2'>
                <Order order={orders[id]} info={info[id]} />
            </div>
        ))}
    </div>)
}

export default OrdersList
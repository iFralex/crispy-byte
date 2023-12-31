import { useState, useEffect, useReducer } from 'react'
import {foodsList} from "./App"
import Order from "./Order"

const OrdersList = ({GetOrdersFunc, FormatOrders, callbackFunc = (_, __) => {}}) => {
    const [orders, setOrderList] = useState({})
    const [info, setInfo] = useState({})
    console.log(GetOrdersFunc)
    const handleGetOrderList = ol => {
        let formOrders = {}, _info = {}
        if (ol)
            [formOrders, _info] = FormatOrders(ol)
        setOrderList(formOrders)
        setInfo(_info)
        let tP = 0
        Object.keys(formOrders).map(id => Object.keys(formOrders[id]).map(foodId => tP += foodsList[foodId].price * formOrders[id][foodId]))
        callbackFunc(tP, Object.keys(formOrders))
    }

    useEffect(() => { GetOrdersFunc(handleGetOrderList) }, [])

    return (<div className='row'>
        {Object.keys(orders).map((id, i) => (
            <div key={i} className='col-12 col-xs-6 col-md-4 col-lg-2'>
                <Order order={orders[id]} info={info[id]} />
            </div>
        ))}
    </div>)
}

export default OrdersList
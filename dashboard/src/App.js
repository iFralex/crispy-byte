import { useState, useEffect } from "react"
import './App.css';
import data from "./data.json"
import 'bootstrap/dist/css/bootstrap.min.css';
import OrdersList from "./OrdersList"
import TablesList from "./TablesList"
import { GetAllOrders } from "./firebase"

export const foodsList = data.foodsList
export const categoriesList = data.categoriesList
export const tables = data.tables

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

function App() {
  const [mode, setMode] = useState(false)
  const [orderList, setOrderList] = useState({})

  return (
    <div className="App">
      <Header mode={mode} setMode={setMode} />
      <main className='app-main container-fluid'>
        {!mode ?
          <OrdersList GetOrdersFunc={func => GetAllOrders(func)} FormatOrders={ol => {
            let _info = {}, formOrders = {}
            Object.keys(ol).map((table) => Object.keys(ol[table]).map(id => {
              if (ol[table][id].completed !== true) {
                _info[id] = { table: table, time: parseInt(id), completed: ol[table][id].completed || [] }
                if (ol[table][id].completed)
                  delete ol[table][id].completed
                formOrders[id] = ol[table][id]
              }
            }))
            return [formOrders, _info]
          }} /> :
          <TablesList />
        }
      </main>
    </div>
  );
}

const Header = ({ mode, setMode }) => {
  return (<header>
    <div className="App-header fixed-top">
      <button className={!mode ? "selected" : ""} onClick={() => setMode(false)}>Ordini</button>
      <button className={mode ? "selected" : ""} onClick={() => setMode(true)}>Tavoli</button>
    </div>
    <div style={{ height: 70 }} />
  </header>)
}

export const ColorTable = color => "rgb(" + color.map(numero => numero / 4).join(", ") + ")"

export default App;

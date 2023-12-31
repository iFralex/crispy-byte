import { useState, useEffect } from "react"
import './App.css';
import data from "./data.json"
import 'bootstrap/dist/css/bootstrap.min.css';
import OrdersList from "./OrdersList"
import TablesList from "./TablesList"

export const foodsList = data.foodsList
export const categoriesList = data.categoriesList

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
          <OrdersList orders={orderList} /> :
          <TablesList />
        }
      </main>
    </div>
  );
}

const Header = ({ mode, setMode }) => {
  return (<header>
    <div  className="App-header fixed-top">
    <button className={!mode ? "selected" : ""} onClick={() => setMode(false)}>Ordini</button>
    <button className={mode ? "selected" : ""} onClick={() => setMode(true)}>Tavoli</button>
    </div>
    <div style={{height: 70}}/>
  </header>)
}

export default App;

import React, { useState, useRef } from 'react';
import $ from 'jquery'

// TODO: spending per week
// TODO: money for spending
// TODO: money saved

function App() {

  var d = new Date()
  const date = d.toISOString().slice(0, 10)

  const dateEl = useRef(null)
  const nameEl = useRef(null)
  const amountEl = useRef(null)
  const incomeEl = useRef(null)
  const incomePerEl = useRef(null)

  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState({
    amount: 0,
    amountEssential: 0,
    amountNonessential: 0
  })
  const [keys, setKeys] = useState(0)
  const [income, setIncome] = useState({
    amount: 0,
    frequency: "bi-weekly"
  })

  const add_expense = () => {

    const date = dateEl.current.value
    const name = nameEl.current.value
    const amount = parseInt(amountEl.current.value)

    if (date !== '' & name !== '' & amount !== '') {
      setExpenses(
        [...expenses,
          {
            key: keys + 1,
            date: date,
            name: name,
            amount: amount
          }
        ]
      )
      setKeys(keys+1)
    }

    setTotal({
      ...total,
      amount: total.amount + amount
    })
  }

  const classifyExpense = (key, classification) => {
    const index = key -1
    const amount = expenses[index]['amount']

    // If the classification changes
    if (expenses[index]['classification'] !== classification) {
      // if already classified, subtract amount from other classification total
      if (expenses[index]['classification']) {
        // if classification was essentials, subtract from essentials, else subtract from nonessentials
        expenses[index]['classification'] === 'essentials' ?
        setTotal({
          ...total,
          amountEssential: total.amountEssential - amount,
          amountNonessential: total.amountNonessential + amount
        })
        :
        setTotal({
          ...total,
          amountNonessential: total.amountNonessential - amount,
          amountEssential: total.amountEssential + amount
        })
      } else {
        // classification not already defined, just add amount to total
        classification === 'essentials' ?
        setTotal({
          ...total,
          amountEssential: total.amountEssential + amount,
        })
        :
        setTotal({
          ...total,
          amountNonessential: total.amountNonessential + amount  
        })
      }

      expenses[index]['classification'] = classification
      setExpenses(expenses.filter(expense => {
        return expense.classification ? 
        {
          ...expense,
          classification: classification
        }
        :
        expense
      }))
    }
  }

  const viewExpenses = () => {
    $(".stats-view").css("display","none")
    $(".expenses-list").show()
  }

  const viewStats = () => {
    $(".expenses-list").css("display","none")
    $(".stats-view").show()
  }

  const deleteExpense = (key) => {
    // get confirmation 
    // eslint-disable-next-line no-restricted-globals
    if (!confirm( "Are you sure you want to delete expense " + expenses[key-1]['name'] + "?")) {
      return
    }

    // update keys of all items from key removed, of filtered expenses without removed item
    setExpenses(expenses.filter(expense => {
        if (expense.key === key) {
          console.log("total amount before: ", total.amount)
          console.log("total amount after: ", total.amount - expense.amount)
          // update classification total if was classified
          if (expense.classification) {
            expense.classification === 'essentials' ?
            setTotal({
              ...total,
              amount: total.amount - expense.amount, // update total
              amountEssential: total.amountEssential - expense.amount,
            })
            :
            setTotal({
              ...total,
              amount: total.amount - expense.amount, // update total
              amountNonessential: total.amountNonessential - expense.amount  
            })
          }
        }
        return expense.key !== key
      }).map(expense => {
      console.log("mapping at key: ",)
      if (expense.key > key) {
        return {
          key: expense.key - 1,
          date: expense.date,
          name: expense.name,
          amount: expense.amount
        }
      }
      return expense
    }))
    // update keys count
    setKeys(key-1)
  }

  const updateIncome = () => {
    setIncome({
      amount: incomeEl.current.value,
      frequency: incomePerEl.current.value
    })
  }

  return <div className="page">

    <div className="input-area">
      <div className="inputs">
        Date: <input ref={dateEl} type="date" className="date-input input"/>
        Expense Name: <input ref={nameEl} type="text" className="expense-name-input input"/>
        Amount: <input ref={amountEl} type="text" className="amount-input input"/>
      </div>
      <button className="add-button" onClick={() => add_expense()}>Add</button>
    </div>


    <div className="select-view">
      <div className="view-selection full-expenses">
        <button id="expenses-view-btn" onClick={() => viewExpenses()} className="view-btn">Full Expenses</button>
      </div>
      <div className="view-selection">
        <button id="stats-view-btn" onClick={() => viewStats()} className="view-btn">Stats</button>
      </div>
    </div>

    <div className="expenses-list">
      <div className="expenses-section">
        {
        expenses.map(expense => {
          return <div key={expense.key} className="expense">
            <h3>{expense.name}</h3>
            <h4>{expense.amount}</h4>
            <h5>{expense.date}</h5>
            <button className={expense.classification === 'essentials' ? 'btn btn-pressed' : 'btn btn-nonpressed'} onClick={() => classifyExpense(expense.key, 'essentials')}>Essential</button>
            <button className={expense.classification === 'non-essentials' ? 'btn btn-pressed' : 'btn btn-nonpressed'} onClick={() => classifyExpense(expense.key, 'non-essentials')}>Non-Essential</button>
            <button className="delete" onClick={() => deleteExpense(expense.key)}>Delete</button>
          </div>
        })
        }
      </div>
    </div>

    <div className="stats-view">
      
      <div className="income">
      <div className="income-section">
          <div className="income-section-group">
            Income: $ <input ref={incomeEl} defaultValue={income.amount} id='salary' type="number"/>
          </div>
          <div className="income-section-group">
          <label htmlFor="incomePer"> Per: </label>
            <select ref={incomePerEl} name="incomePer" id="incomePer" className="incomePer">
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option selected value="bi-weekly">Bi-Weekly</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>
        <button className="update-income-btn" onClick={() => updateIncome()}>Update Income</button>
      </div>
      

      {/* <label htmlFor="statsPer">Stats For Past: </label>
      <select name="statsPer" id="statsPer">
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month" selected>Month</option>
        <option value="year">Year</option>
      </select> */}

      <div className="stats-section">
        $ Spent: {total.amount}
      </div>
      <div className="stats-section">
        <h2>$ SAVED: {income.amount - total.amount}</h2>
      </div>

    </div>

  </div>
  
}

export default App;

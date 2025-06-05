import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

 const getData = () => {
  axios.get('/api/expenses')
    .then(response => {
      console.log('Response from axios:', response);
      if (response.status === 200) {
        setExpenses(response.data);
      } else {
        console.error('Failed to fetch expenses:', response.statusText);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
};  
  useEffect(() => {
    getData();
  }, []);

  const addExpense = async () => {
    const res = await fetch('api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      accept: 'application/json',
      mode: 'no-cors',
      body: JSON.stringify({ amount: parseFloat(amount), note }),
    });
    
    try {
      console.log('Response post:', res);
    if (res.ok) {
      console.log('Response:', res);
      const newExpense = await res.json();
      setExpenses([...expenses, newExpense]);
      setAmount('');
      setNote('');
    } 
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      getData();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Expense Tracker</h1>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <input
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Note"
      />
      <button onClick={addExpense}>Add Expense</button>
      <ul>{
        expenses === null ? <li>No expenses found</li> : expenses.map(exp => (
          <li key={exp.id}>
            ${exp.amount} - {exp.note}
          </li>
        ))}
        
      </ul>
    </div>
  );
}
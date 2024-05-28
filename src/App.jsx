import { useEffect, useState } from "react";
import "./App.css";
import dayjs from "dayjs";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState("");
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(e) {
    e.preventDefault();

 
    const url = process.env.REACT_APP_API_URL + "/transaction";
    console.log(url);
    const price = name.split(" ")[0];

    // Make a POST request to the backend API
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
      // Send the data in the request body
    }).then((response) => {
      response.json().then((json) => {
        // Clear the input fields after submitting the form
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
        // You can handle the response from the server here if needed
      });
    });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];
  return (
    <main>
      <h1>
        ${balance}
        <span>{fraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of the transaction"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">
                  <span>
                    {dayjs(transaction.datetime).format("DD-MM-YYYY")}{" "}
                    {dayjs(transaction.datetime).format("HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;

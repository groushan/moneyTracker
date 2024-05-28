const express = require("express");
const cors = require("cors");
const Transaction = require("./models/transaction");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/test", (req, res) => {
  res.json("test OK");
});

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect("process.env.Mongo_URL").then(() => {
    console.log("Mongodb connected");
  });

  // Extract data from the request body
  const { name, description, datetime, price } = req.body;
  console.log(typeof price);

  // Check if name and description are provided
  if (!name || !description || !datetime) {
    return res
      .status(400)
      .json({ error: "Name description & datetime are required" });
  }

  // Create a new transaction using the Transaction model
  const transaction = await Transaction.create({
    price,
    name,
    description,
    datetime,
  });

  // Respond with the created transaction as JSON
  res.json(transaction);
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect("process.env.Mongo_URL");
  await Transaction.find();
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.listen(4000, () => {
  console.log(`listening on PORT 4000`);
});

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const userroute = require("./app/controller/create");
const creatUser = require("./app/controller/alluser");
dotenv.config()

const app = express();
app.use(express.json());
const url = process.env.MONGO_URL.toString()

const port = 4000;

app.use("/api", userroute);
app.use("/api", creatUser);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, () =>
      console.log(`Server Running on Port: http://localhost:${port}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()
const routes = require("./app/routes");



const app = express();
app.use(express.json());
app.use(cors())

const port = 4000;
let Env = "prod"

app.use("/api", routes);

mongoose
  .connect(
    "mongodb://myfac8ry:2121@ac-z992smf-shard-00-00.fmmrhks.mongodb.net:27017,ac-z992smf-shard-00-01.fmmrhks.mongodb.net:27017,ac-z992smf-shard-00-02.fmmrhks.mongodb.net:27017/myfac8ry?ssl=true&replicaSet=atlas-piyukq-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(port, () =>
      console.log(`Server env ${Env} is Running on Port: http://localhost:${port}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
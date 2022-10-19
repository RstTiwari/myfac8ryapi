const express = require("express");
const mongoose = require("mongoose");
const userroute = require("./app/controller/create");
const creatUser = require("./app/controller/alluser");

const app = express();
app.use(express.json());

const port = 4000;

app.use("/api", userroute);
app.use("/api", creatUser);

mongoose
  .connect(
    "mongodb+srv://myfac8ry:myfac8rycluster0.fmmrhks.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(port, () =>
      console.log(`Server Running on Port: http://localhost:${port}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

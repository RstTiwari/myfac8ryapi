const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()
const routes = require("./app/routes")

const app = express();
app.use(express.json());
app.use(cors())

const port = 4000;

app.use("/api", routes);

mongoose
  .connect(
    process.env.MDURL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(port, () =>
      console.log(`Server Running on Port: http://localhost:${port}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
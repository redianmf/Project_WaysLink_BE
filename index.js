require("dotenv").config();
const express = require("express");

const router = require("./src/routes");
var cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

app.get("/", function (req, res) {
  res.send({
    message: "Hello World",
  });
});

app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads"));

app.listen(port, () => console.log(`Listening on port ${port}!`));

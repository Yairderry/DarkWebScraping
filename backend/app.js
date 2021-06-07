const express = require("express");
const cors = require("cors");
const app = express();
const api = require("./routes");

app.use(cors());
app.use(express.json());

app.use("/api", api);
app.use("/", (req, res) => {
  res.status(404).json({ error: "Page not found!" });
});

module.exports = app;

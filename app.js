"use strict";

const express = require("express");
const cors = require("cors");
const { getAllIds } = require("./scrape");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/find-paste-ids", async (req, res) => {
  res.json(await getAllIds(1));
});

app.use("/", (req, res) => {
  res.status(404).json({ error: "Page not found!" });
});

module.exports = app;

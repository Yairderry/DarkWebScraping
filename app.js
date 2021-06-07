"use strict";

const express = require("express");
const cors = require("cors");
const { findNewPastes } = require("./scrape");
const { addPastes } = require("./queries");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const pastes = await findNewPastes();
    const response = await addPastes(pastes);
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = app;

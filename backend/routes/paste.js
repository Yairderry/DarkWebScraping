const express = require("express");
const paste = express.Router();
const { getAllPastes } = require("../queries");
paste.use(express.json());

paste.get("/all", async (req, res) => {
  try {
    const pastes = await getAllPastes({ title: "bitcoin", content: "works" });
    res.json(pastes);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = paste;

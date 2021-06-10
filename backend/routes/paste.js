const express = require("express");
const paste = express.Router();
const { getAllPastes, getLabels } = require("../queries");
paste.use(express.json());

paste.get("/all", async (req, res) => {
  const { title, content, author, limit, labels, offset } = req.query;

  try {
    const pastes = await getAllPastes({
      title: title ? title : "",
      content: content ? content : "",
      author: author ? author : "",
      limit,
      labels,
      offset,
    });
    res.json(pastes);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

paste.get("/labels", async (req, res) => {
  try {
    const labels = await getLabels();
    res.json(labels);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = paste;

const express = require("express");
const paste = express.Router();
const { getAllPastes } = require("../queries");
paste.use(express.json());

paste.get("/all", async (req, res) => {
  const { title, content, author, limit, offset } = req.query;

  try {
    const pastes = await getAllPastes({
      title: title ? title : "",
      content: content ? content : "",
      author: author ? author : "",
      limit,
      offset,
    });
    res.json(pastes);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = paste;

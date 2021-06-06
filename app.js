"use strict";

const express = require("express");
const cors = require("cors");
const { getAllIds, getPasteFromId } = require("./scrape");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/find-paste-ids", async (req, res) => {
  res.json(await getAllIds(1));
});

app.get("/find-paste", async (req, res) => {
  const ids = [
    "pshjspt28",
    "pgyw5anhz",
    "pgeh5gnvt",
    "pencq39q5",
    "p32eyz5h4",
    "pjp4w1fpt",
    "posb4mmxq",
    "puwl9fqx9",
    "ptdehxvk0",
    "pprc0dtnk",
    "pcfakpjef",
    "phwdfwy0m",
    "pfsbm40oy",
    "p4a2kbszn",
    "ptdqbqzvm",
    "pgn8herea",
    "py8vfg5p3",
    "p3itn2655",
    "pqui0zubs",
    "pjofx6jfo",
    "ps7x2ujbu",
    "pzh7aa7p8",
    "pqz9ztwgk",
    "plawxaw9g",
    "pi1zdqgmz",
    "pa7ul98xv",
    "pocoub46i",
    "ptodgg7wz",
    "pkwxilym6",
    "pfyswxx7r",
    "po0m4mgpo",
  ];
  try {
    const data = await Promise.all(
      ids.map(async (id) => await getPasteFromId(id))
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.use("/", (req, res) => {
  res.status(404).json({ error: "Page not found!" });
});

module.exports = app;

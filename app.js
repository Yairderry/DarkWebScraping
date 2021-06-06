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
    "pxmhn8dee",
    "pdepw2d1a",
    "phhmninqq",
    "pwyszhoim",
    "pdxo1hrxw",
    "pajlfxvvs",
    "phh8ebnyy",
    "pyxt0yzbt",
    "pzoez88ji",
    "p92ymjhcm",
    "psqnhuy9z",
    "pmodt5j7e",
    "plt893tde",
    "po6qbgvuk",
    "pqha8i2cn",
    "pxof7f5ku",
    "p6phc1h58",
    "plj322k1w",
    "pszoo86lu",
    "pzecrefuv",
    "pcanrcnvc",
    "pnezsmnkw",
    "puhlrj66t",
    "peyzf766g",
    "pntcthldh",
    "pk2u8o2z2",
    "prljng81x",
    "piyhr2cpn",
    "ppnrcjlkn",
    "pb16c7efo",
    "p1dmwashn",
    "paibbh8i2",
    "p8dlbntil",
    "pra4d2rdi",
    "pgrczeger",
    "ptzu066jd",
    "pcus3wjqf",
    "petxnnrdw",
    "p0t9jnjge",
    "plbofqeh1",
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

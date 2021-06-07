const { Router } = require("express");
const paste = require("./paste");

const api = Router();

api.use("/paste", paste);

module.exports = api;

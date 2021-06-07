"use strict";

const { findNewPastes } = require("./scrape");
const { addPastes } = require("./queries");

const app = async () => {
  try {
    const pastes = await findNewPastes();
    const response = await addPastes(pastes);
    return response.map((paste) => paste.toJSON());
  } catch (error) {
    return error;
  }
};

setInterval(() => {
  return app();
}, 30000);

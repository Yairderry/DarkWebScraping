"use strict";

const { findNewPastes } = require("./scrape");
const { addPastes } = require("./queries");

const app = async () => {
  try {
    const pastes = await findNewPastes();
    console.log("pastes", pastes);
    const response = await addPastes(pastes);
    console.log("response", response);
    return response;
  } catch (error) {
    return error;
  }
};

setInterval(() => {
  app();
}, 30000);

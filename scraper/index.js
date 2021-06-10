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

app()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

// setInterval(() => {
//   app()
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));
// }, 30000);

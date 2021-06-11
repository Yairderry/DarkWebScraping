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
<<<<<<< HEAD
// }, 120000);
=======
// }, 30000);
>>>>>>> parent of 06a1271 (Tested the app on docker compose (worked))

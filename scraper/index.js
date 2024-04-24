"use strict";

const { findNewPastes } = require("./scrape");
const { addPastes } = require("./queries");
const { findConfigFiles } = require("./utils");

const app = async (file) => {
  console.log("Scraping from: ", file.name);
  try {
    const pastes = await findNewPastes(file);
    const response = await addPastes(pastes);
    return response.map((paste) => paste.toJSON());
  } catch (error) {
    return error;
  }
};

const configFiles = findConfigFiles();
configFiles.forEach((file) =>
  app(file)
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
);

setInterval(() => {
  const configFiles = findConfigFiles();
  configFiles.forEach((file) =>
    app(file)
      .then((data) => console.log(data))
      .catch((err) => console.log(err))
  );
}, 480000);

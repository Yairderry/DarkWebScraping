"use strict";

const { findNewPastes } = require("./scrape");
const { addPastes } = require("./queries");
const YAML = require("js-yaml");
const fs = require("fs");

const getYamlConfig = (filename) => {
  try {
    const raw = fs.readFileSync(`./sites/${filename}`);
    const data = YAML.load(raw);
    return data;
  } catch (error) {
    throw error;
  }
};

const findConfigFiles = () => {
  const filesList = fs.readdirSync("./sites");
  const configFilesList = filesList
    .filter((file) => /(.*)-config.y[a]*ml/.test(file))
    .map((file) => getYamlConfig(file));

  return configFilesList;
};

const app = async (file) => {
  console.log("scraping from: ", file.name);
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
}, 120000);

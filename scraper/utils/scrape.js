"use strict";

require("dotenv").config();
const YAML = require("js-yaml");
const fs = require("fs");
const tr = require("tor-request");
const { default: axios } = require("axios");
const env = process.env.NODE_ENV || "development";
let NER_BASE_URL = "http://127.0.0.1:9000";

if (env === "production") {
  tr.setTorAddress("tor_proxy");
  NER_BASE_URL = "http://ner_server:80"
}

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

const getData = (config, $) => {
  const { regex, selector } = config;
  const rawData = $(selector).text().trim();
  let data = rawData;

  if (regex) {
    const { exp, flags, index } = regex;
    const dataRegex = new RegExp(exp ? exp : "", flags ? flags : "");
    const matches = dataRegex.exec(rawData);
    data = matches[index ? index : 0];
  }

  return data;
};

const generateRegex = (raw, regex) => {
  const { exp, flags, index } = regex;
  const dataRegex = new RegExp(exp ? exp : "", flags ? flags : "");
  return dataRegex.exec(raw)[index ? index : 0];
};

const calculateDate = (rawData, ago) => {
  const { sec, min, hour, day, week, month, year } = ago;
  const totalTime =
    (sec ? generateRegex(rawData, sec) * 1000 : 0) +
    (min ? generateRegex(rawData, min) * 60000 : 0) +
    (hour ? generateRegex(rawData, hour) * 3600000 : 0) +
    (day ? generateRegex(rawData, day) * 86400000 : 0) +
    (week ? generateRegex(rawData, week) * 604800000 : 0) +
    (month ? generateRegex(rawData, month) * 2628000000 : 0) +
    (year ? generateRegex(rawData, year) * 365 * 86400000 : 0);

  const now = new Date().getTime();
  return new Date(now - totalTime);
};

const getEntities = async (text) => {
  try {
    return axios
      .post(`${NER_BASE_URL}/ent`, { text, model: "en" })
      .then(({ data }) => [...new Set(data.map((ent) => ent.type))]);
  } catch (error) {
    console.log("There was an error with getting the entities.");
    console.log(error);
    return [];
  }
};

const torPromise = (url) => {
  return new Promise((resolve, reject) => {
    tr.request(url, (err, response, html) => {
      if (err || response.statusCode !== 200) return reject(err);
      resolve(html);
    });
  });
};

module.exports = {
  findConfigFiles,
  calculateDate,
  getEntities,
  torPromise,
  getData,
};

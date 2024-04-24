"use strict";

require("dotenv").config();
const YAML = require("js-yaml");
const fs = require("fs");
const tr = require("tor-request");
const env = process.env.NODE_ENV || "development";

if (env === "production") tr.setTorAddress("tor_proxy");

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
  const options = {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ text, model: "en" }),
  };
  return await fetch("http://127.0.0.1:8080/ent", options)
    .then((res) => res.json())
    .then((entities) => {
      return [...new Set(entities.map((ent) => ent.type))];
    });
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

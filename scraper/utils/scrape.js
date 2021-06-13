"use strict";

const YAML = require("js-yaml");
const fs = require("fs");
const tr = require("tor-request");
const NER = require("ner");

const ner = new NER({
  port: 9000,
  host: "ner_server",
});

tr.setTorAddress("tor_proxy");

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
  const timer = new Promise((res, reject) =>
    setTimeout(() => reject("ner server took to long to respond"), 20000)
  );
  const nerServer = new Promise((resolve, reject) => {
    ner.get(text, (err, res) => {
      if (err) return reject(err);
      resolve(res.entities);
    });
  });
  return await Promise.race([timer, nerServer]);
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

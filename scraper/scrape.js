"use strict";

require("dotenv").config();
const tr = require("tor-request");
const cheerio = require("cheerio");
const { getAllPasteIds } = require("./queries");
const YAML = require("js-yaml");
const fs = require("fs");
const NER = require("ner");

const ner = new NER({
  port: 9000,
  host: "ner_server",
});

// remove proxy if you're using localhost
tr.setTorAddress("tor_proxy");

const getIdsFromPage = async (page) => {
  return await new Promise((resolve, reject) => {
    const props = getYamlConfig(["pasteIds"]);
    const { pages, link } = props[0];
    tr.request(`${pages.URL}${page}`, function (err, response, html) {
      if (err || response.statusCode !== 200) return reject(err);

      const $ = cheerio.load(html);

      const pastes = [];
      $(link.selector).each((i, el) => {
        const paste = $(el).attr("href");
        pastes.push(paste);
      });

      const pasteIds = pastes.map((pasteId) => pasteId.slice(link.slice));

      resolve(pasteIds);
    });
  });
};

const getPasteFromId = async (pasteId) => {
  console.log("getting paste from id: ", pasteId);

  const paste = {};

  try {
    const props = getYamlConfig(["pastes", "name"]);
    const [pastes, name] = [props[0], props[1]];

    const html = await torPromise(`${pastes.URL}${pasteId}`);

    const $ = cheerio.load(html);

    const title = getData(pastes.title, $);
    const content = getData(pastes.content, $);
    const date = getData(pastes.date, $);
    const author = getData(pastes.author, $);
    const site = name;

    paste.pasteId = pasteId;
    paste.site = site;
    paste.title = title;
    paste.content = content;
    paste.author = author;
    paste.date = pastes.date.ago
      ? calculateDate($(pastes.date.selector), pastes.date.ago)
      : new Date(date);

    try {
      console.log("getting entities for paste ", pasteId);
      const entities = await getEntities(`${title} ${content}`);
      console.log("found entities: ", entities);
      paste.labels = Object.keys(entities);
    } catch (error) {
      console.log("couldn't get entities from the ner server");
    }

    console.log("forwarding data to db: ", paste);

    return paste;
  } catch (error) {
    console.log(error);
    console.log("there was an error while trying to get paste", pasteId);
  }
};

const scrapeAllIds = async (page, pagePasteIds = []) => {
  try {
    const props = getYamlConfig(["pasteIds"]);
    const { pages } = props[0];

    if (pages.limit && page >= pages.limit)
      throw new Error("You've reached the limit you set!");

    console.log("getting ids from page: ", page);

    const pasteIds = await getIdsFromPage(page);

    console.log("ids found in page ", page, pasteIds);

    pagePasteIds.push(...pasteIds);
    return scrapeAllIds(page + pages.step.by, pagePasteIds);
  } catch (error) {
    console.log("error", error);

    console.log("final list of ids:", pagePasteIds);
    return pagePasteIds;
  }
};

const findNewPastes = async () => {
  try {
    const props = getYamlConfig(["pasteIds"]);
    const { pages } = props[0];
    const checkPasteIds = await scrapeAllIds(pages.step.initial);
    const currentPasteIds = await getAllPasteIds();
    const newPasteIds = checkPasteIds.filter(
      (pasteId) => !currentPasteIds.includes(pasteId)
    );

    if (newPasteIds.length <= 0) return [];
    console.log("new pastes ids: ", newPasteIds);

    const pastes = await Promise.all(
      newPasteIds.map(async (id) => await getPasteFromId(id))
    );
    return pastes;
  } catch (error) {
    console.log(error);
  }
};

// helper functions
const getYamlConfig = (properties = []) => {
  try {
    const raw = fs.readFileSync("./sites/stikked-config.yaml");
    const data = YAML.load(raw);
    return properties.map((prop) => data[prop]);
  } catch (error) {
    throw error;
  }
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
    setTimeout(() => reject("ner server took to long to respond"), 5000)
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
  findNewPastes,
};

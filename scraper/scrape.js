"use strict";

const tr = require("tor-request");
const cheerio = require("cheerio");
const { getAllPasteIds } = require("./queries");
const YAML = require("js-yaml");
const fs = require("fs");

// remove proxy if you're using localhost
// tr.setTorAddress("tor_proxy");

const getIdsFromPage = async (page) => {
  return await new Promise((resolve, reject) => {
    const { pages, row, link } = getYamlConfig("pasteIds");
    tr.request(`${pages.URL}${page}`, function (err, response, html) {
      if (err || response.statusCode !== 200) return reject(err);

      const $ = cheerio.load(html);

      const pastes = [];
      $(row.selector).each((i, el) => {
        const paste = $(el).find(link.selector).attr("href");
        pastes.push(paste);
      });

      const pasteIds = pastes
        .filter((paste, i) => (i + 1) % 3 === 0)
        .map((pasteId) => pasteId.slice(30));

      resolve(pasteIds);
    });
  });
};

const getPasteFromId = async (pasteId) => {
  return await new Promise((resolve, reject) => {
    const pastes = getYamlConfig("pastes");
    tr.request(`${pastes.URL}/${pasteId}`, function (err, response, html) {
      if (err || response.statusCode !== 200) reject(err);

      const $ = cheerio.load(html);

      const row = $(pastes.row.selector);
      const title = getData(row, pastes.title);
      const content = getData(row, pastes.content);
      const date = getData(row, pastes.date);
      const author = getData(row, pastes.author);

      const paste = { pasteId, title, content, author, date: new Date(date) };

      resolve(paste);
    });
  });
};

const scrapeAllIds = async (page, pagePasteIds = []) => {
  try {
    const pasteIds = await getIdsFromPage(page);
    const { pages } = getYamlConfig("pasteIds");

    pagePasteIds.push(...pasteIds);
    return scrapeAllIds(page + pages.step.by, pagePasteIds);
  } catch (error) {
    console.log(error);
    return pagePasteIds;
  }
};

const findNewPastes = async () => {
  const { pages } = getYamlConfig("pasteIds");
  const checkPasteIds = await scrapeAllIds(pages.step.initial);
  const currentPasteIds = await getAllPasteIds();
  const newPasteIds = checkPasteIds.filter(
    (pasteId) => !currentPasteIds.includes(pasteId)
  );

  if (newPasteIds.length <= 0) return [];

  const pastes = await Promise.all(
    newPasteIds.map(async (id) => await getPasteFromId(id))
  );

  return pastes;
};

// helper functions
const getYamlConfig = (property) => {
  try {
    const raw = fs.readFileSync("./sites/stronghold-config.yaml");
    const data = YAML.load(raw);
    return data[property];
  } catch (error) {
    throw error;
  }
};

const getData = (parent, config) => {
  const { regex, selector } = config;
  const rawData = parent.find(selector).text().trim();
  let data = rawData;

  if (regex) {
    const { exp, flags, index } = regex;
    const dataRegex = new RegExp(exp ? exp : "", flags ? flags : "");
    data = dataRegex.exec(rawData)[index ? index : 0];
  }

  return data;
};

module.exports = {
  findNewPastes,
};

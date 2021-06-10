"use strict";

const tr = require("tor-request");
const cheerio = require("cheerio");
const { getAllPasteIds } = require("./queries");
const YAML = require("js-yaml");
const node_ner = require("node-ner");
const fs = require("fs");

const ner = new node_ner({
  install_path: "./stanford-ner-2017-06-09",
});

// remove proxy if you're using localhost
// tr.setTorAddress("tor_proxy");

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
  return await new Promise((resolve, reject) => {
    const props = getYamlConfig(["pastes", "name"]);
    const [pastes, name] = [props[0], props[1]];
    tr.request(`${pastes.URL}${pasteId}`, async function (err, response, html) {
      if (err || response.statusCode !== 200) reject(err);

      const $ = cheerio.load(html);

      const title = getData(pastes.title, $);
      const content = getData(pastes.content, $);
      const date = getData(pastes.date, $);
      const author = getData(pastes.author, $);
      const site = name;

      const entities = await getEntities(`${title} ${content}`, pasteId);

      const paste = {
        pasteId,
        site,
        title,
        content,
        author,
        date: pastes.date.ago
          ? calculateDate($(pastes.date.selector), pastes.date.ago)
          : new Date(date),
        labels: Object.keys(entities),
      };

      resolve(paste);
    });
  });
};

const scrapeAllIds = async (page, pagePasteIds = []) => {
  try {
    const props = getYamlConfig(["pasteIds"]);
    const { pages } = props[0];
    if (pages.limit && page >= pages.limit)
      throw new Error("You've reached the limit you set!");
    const pasteIds = await getIdsFromPage(page);

    pagePasteIds.push(...pasteIds);
    return scrapeAllIds(page + pages.step.by, pagePasteIds);
  } catch (error) {
    console.log("error", error);
    return pagePasteIds;
  }
};

const findNewPastes = async () => {
  const props = getYamlConfig(["pasteIds"]);
  const { pages } = props[0];
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
const getYamlConfig = (properties = []) => {
  try {
    const raw = fs.readFileSync("./sites/paste-config.yaml");
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

const getEntities = (text, pasteId) => {
  return new Promise((resolve) => {
    const FILE_NAME = `${pasteId}.txt`;
    fs.writeFileSync(FILE_NAME, text);

    ner.fromFile(
      `C:\\Users\\derry\\Documents\\GitHub\\DarkWebScraping\\scraper\\${FILE_NAME}`,
      function (entities) {
        fs.unlinkSync(
          `C:\\Users\\derry\\Documents\\GitHub\\DarkWebScraping\\scraper\\${FILE_NAME}`
        );
        resolve(entities);
      }
    );
  });
};

module.exports = {
  findNewPastes,
};

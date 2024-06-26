"use strict";

require("dotenv").config();
const cheerio = require("cheerio");
const { getAllPasteIds } = require("./queries");
const { calculateDate, getEntities, torPromise, getData } = require("./utils");

const getIdsFromPage = async (page, config) => {
  const { pages, link, name } = config;
  try {
    const html = await torPromise(`${pages.URL}${page}`);
    const $ = cheerio.load(html);

    const pastes = [];
    $(link.selector).each((i, el) => {
      const paste = $(el).attr("href");
      pastes.push(paste);
    });

    const pasteIds = pastes.map((pasteId) => pasteId.slice(link.slice));

    return pasteIds;
  } catch (error) {
    console.log(`Couldn't connect to ${name}`);
    console.log(error);
  }
};

const getPasteFromId = async (pasteId, pastes, name) => {
  console.log("Getting paste from id: ", pasteId);

  const paste = {};

  try {
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
      console.log("Getting entities for paste ", pasteId);
      const entities = await getEntities(`${title} ${content}`);
      console.log("Found entities: ", entities);
      paste.labels = entities;
    } catch (error) {
      console.log(error);
    }

    return paste;
  } catch (error) {
    console.log(error);
    console.log("There was an error while trying to get paste", pasteId);
  }
};

const scrapeAllIds = async (page, config, pagePasteIds = []) => {
  const { pages } = config;

  if (pages?.limit && page >= pages?.limit) return pagePasteIds;

  try {
    console.log("Getting ids from page: ", page);

    const pasteIds = await getIdsFromPage(page, config);

    console.log("Ids found in page ", page, pasteIds);

    pagePasteIds.push(...pasteIds);
    return scrapeAllIds(page + pages.step.by, config, pagePasteIds);
  } catch (error) {
    console.log("Final list of ids:", pagePasteIds);
    return pagePasteIds;
  }
};

const findNewPastes = async (file) => {
  const { pasteIds, pastes, name } = file;
  const { pages } = pasteIds;
  try {
    const checkPasteIds = await scrapeAllIds(pages.step.initial, {
      ...pasteIds,
      name,
    });
    const currentPasteIds = await getAllPasteIds();
    const newPasteIds = checkPasteIds.filter(
      (pasteId) => !currentPasteIds.includes(pasteId)
    );

    if (newPasteIds.length <= 0) return [];
    console.log("New pastes ids: ", newPasteIds);

    const pastesData = await Promise.all(
      newPasteIds.map(async (id) => await getPasteFromId(id, pastes, name))
    );
    return pastesData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = {
  findNewPastes,
};

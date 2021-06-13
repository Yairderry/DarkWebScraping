"use strict";

require("dotenv").config();
const cheerio = require("cheerio");
const { getAllPasteIds } = require("./queries");
const { calculateDate, getEntities, torPromise, getData } = require("./utils");

const getIdsFromPage = async (page, config) => {
  const { pages, link } = config;

  const html = await torPromise(`${pages.URL}${page}`);

  const $ = cheerio.load(html);

  const pastes = [];
  $(link.selector).each((i, el) => {
    const paste = $(el).attr("href");
    pastes.push(paste);
  });

  const pasteIds = pastes.map((pasteId) => pasteId.slice(link.slice));

  return pasteIds;
};

const getPasteFromId = async (pasteId, pastes, name) => {
  console.log("getting paste from id: ", pasteId);

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
      console.log("getting entities for paste ", pasteId);
      const entities = await getEntities(`${title} ${content}`);
      console.log("found entities: ", entities);
      paste.labels = Object.keys(entities);
    } catch (error) {
      console.log(
        "ner server didn't respond in 20 seconds, couldn't get entities"
      );
    }

    return paste;
  } catch (error) {
    console.log(error);
    console.log("there was an error while trying to get paste", pasteId);
  }
};

const scrapeAllIds = async (page, config, pagePasteIds = []) => {
  const { pages } = config;

  if (pages?.limit && page >= pages?.limit) return pagePasteIds;

  try {
    console.log("getting ids from page: ", page);

    const pasteIds = await getIdsFromPage(page, config);

    console.log("ids found in page ", page, pasteIds);

    pagePasteIds.push(...pasteIds);
    return scrapeAllIds(page + pages.step.by, config, pagePasteIds);
  } catch (error) {
    console.log("final list of ids:", pagePasteIds);
    return pagePasteIds;
  }
};

const findNewPastes = async (file) => {
  const { pasteIds, pastes, name } = file;
  const { pages } = pasteIds;
  try {
    const checkPasteIds = await scrapeAllIds(pages.step.initial, pasteIds);
    const currentPasteIds = await getAllPasteIds();
    const newPasteIds = checkPasteIds.filter(
      (pasteId) => !currentPasteIds.includes(pasteId)
    );

    if (newPasteIds.length <= 0) return [];
    console.log("new pastes ids: ", newPasteIds);

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

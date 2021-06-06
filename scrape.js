"use strict";

const tr = require("tor-request");
const cheerio = require("cheerio");

const getIdsFromPage = async (page) => {
  return await new Promise((resolve, reject) => {
    tr.request(
      `http://nzxj65x32vh2fkhk.onion/all?page=${page}`,
      function (err, response, html) {
        if (err || response.statusCode !== 200) reject(err);

        const $ = cheerio.load(html);

        const pastes = [];
        $("#list .row").each((i, el) => {
          const paste = $(el).find(".btn.btn-success").attr("href");
          pastes.push(paste);
        });

        const pasteIds = pastes
          .filter((paste, i) => (i + 1) % 3 === 0)
          .map((pasteId) => pasteId.slice(30));

        resolve(pasteIds);
      }
    );
  });
};

const getPasteFromId = async (id) => {
  return await new Promise((resolve, reject) => {
    tr.request(
      `http://nzxj65x32vh2fkhk.onion/${id}`,
      function (err, response, html) {
        if (err || response.statusCode !== 200) reject(err);

        const $ = cheerio.load(html);

        const row = $(".row");
        const title = row.find("h4").text();
        const content = row.find(".well.well-sm.well-white.pre").text();
        const info = row.find(".col-sm-6").text();

        const paste = { title, content, info };

        resolve(paste);
      }
    );
  });
};

const getAllIds = async (page, pagePasteIds = []) => {
  try {
    const pasteIds = await getIdsFromPage(page);
    pagePasteIds.push(...pasteIds);
    return getAllIds(++page, pagePasteIds);
  } catch (error) {
    return pagePasteIds;
  }
};

const getPaste = async (id) => {
  try {
  } catch (error) {}
};

module.exports = {
  getAllIds,
  getPaste,
  getPasteFromId,
};

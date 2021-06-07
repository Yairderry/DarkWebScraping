"use strict";

const tr = require("tor-request");
const cheerio = require("cheerio");
const { getAllPasteIds } = require("./queries");

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

const getPasteFromId = async (pasteId) => {
  return await new Promise((resolve, reject) => {
    tr.request(
      `http://nzxj65x32vh2fkhk.onion/${pasteId}`,
      function (err, response, html) {
        if (err || response.statusCode !== 200) reject(err);

        const $ = cheerio.load(html);

        const row = $(".row");
        const title = row.find("h4").text().trim();
        const content = row.find(".well.well-sm.well-white.pre").text().trim();
        const info = row.find(".col-sm-6").text().trim().split(" ");
        const author = info[2];
        info[8] = info[8].slice(0, 3);
        const date = new Date(info.slice(4, 9).join(" "));

        const paste = { pasteId, title, content, author, date };

        resolve(paste);
      }
    );
  });
};

const scrapeAllIds = async (page, pagePasteIds = []) => {
  try {
    const pasteIds = await getIdsFromPage(page);
    pagePasteIds.push(...pasteIds);
    return scrapeAllIds(++page, pagePasteIds);
  } catch (error) {
    return pagePasteIds;
  }
};

const findNewPastes = async () => {
  const checkPasteIds = await scrapeAllIds(1);
  const currentPasteIds = await getAllPasteIds();
  const newPasteIds = checkPasteIds.filter(
    (pasteId) => !currentPasteIds.includes(pasteId)
  );

  if (newPasteIds.length <= 0) return;

  const pastes = await Promise.all(
    newPasteIds.map(async (id) => await getPasteFromId(id))
  );

  return pastes;
};

module.exports = {
  findNewPastes,
};

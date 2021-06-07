const { Paste } = require("./models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const getAllPasteIds = async () => {
  const pastesIds = await Paste.findAll({
    attributes: ["pasteId"],
  });
  return pastesIds.map((paste) => paste.toJSON().pasteId);
};

const addPastes = async (pastes) => {
  return await Paste.bulkCreate(pastes);
};

module.exports = {
  getAllPasteIds,
  addPastes,
};

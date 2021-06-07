const { Paste } = require("./models");

const getAllPasteIds = async () => {
  const pastesIds = await Paste.findAll({
    attributes: ["pasteId"],
  });
  const ids = pastesIds.map((paste) => paste.toJSON().pasteId);
  return ids;
};

const addPastes = async (pastes) => {
  return await Paste.bulkCreate(pastes);
};

module.exports = {
  getAllPasteIds,
  addPastes,
};

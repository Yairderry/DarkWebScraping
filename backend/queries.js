const { Paste, PasteLabel } = require("./models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const getAllPastes = async (params) => {
  if (!params) {
    const pastesIds = await Paste.findAll({
      attributes: { exclude: ["pasteId", "createdAt", "updatedAt"] },
    });
    return pastesIds.map((paste) => paste.toJSON());
  }

  const { title, content, author, limit, labels, offset } = params;

  const where = {};

  if (title) where.title = { [Op.like]: `%${title}%` };
  if (content) where.content = { [Op.like]: `%${content}%` };
  if (author) where.author = { [Op.like]: `%${author}%` };
  if (labels) {
    const label = typeof labels === "string" ? labels : { [Op.or]: labels };
    const possiblePastes = await PasteLabel.findAll({
      where: {
        label,
      },
      attributes: ["pasteId", "label"],
    });
    where.id = {
      [Op.in]: possiblePastes.map((paste) => paste.toJSON().pasteId),
    };
  }

  const limitOffset = {};

  if (limit) limitOffset.limit = Number(limit);
  if (offset) limitOffset.offset = Number(offset);

  const pastesIds = await Paste.findAndCountAll({
    attributes: { exclude: ["pasteId", "createdAt", "updatedAt"] },
    ...limitOffset,
    where,
    include: { model: PasteLabel, attributes: ["label"] },
  });

  pastesIds.rows = pastesIds.rows.map((paste) => {
    const newPaste = paste.toJSON();
    newPaste.PasteLabels = newPaste.PasteLabels.map(({ label }) => label);
    return newPaste;
  });

  return pastesIds;
};

const getLabels = async () => {
  return (
    await PasteLabel.findAll({
      group: "label",
      attributes: ["label"],
    })
  ).map(({ label }) => label);
};

module.exports = {
  getAllPastes,
  getLabels,
};

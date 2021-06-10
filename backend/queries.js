const { Paste, PasteLabel } = require("./models");
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
  let include = { model: PasteLabel, attributes: ["label"] };

  if (title) where.title = { [Op.like]: `%${title}%` };
  if (content) where.content = { [Op.like]: `%${content}%` };
  if (author) where.author = { [Op.like]: `%${author}%` };

  const limitOffset = {};

  if (limit) limitOffset.limit = Number(limit);
  if (offset) limitOffset.offset = Number(offset);

  const pastesIds = await Paste.findAndCountAll({
    attributes: { exclude: ["pasteId", "createdAt", "updatedAt"] },
    ...limitOffset,
    where,
    include,
  });

  pastesIds.rows = pastesIds.rows
    .map((paste) => {
      const newPaste = paste.toJSON();
      newPaste.PasteLabels = newPaste.PasteLabels.map(({ label }) => label);
      return newPaste;
    })
    .filter(({ PasteLabels }) => {
      return typeof labels === "object"
        ? labels.every((label) => PasteLabels.includes(label))
        : typeof labels === "undefined"
        ? PasteLabels
        : PasteLabels.includes(labels);
    });

  pastesIds.count = pastesIds.rows.length;

  return pastesIds;
};

module.exports = {
  getAllPastes,
};

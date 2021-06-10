const { Paste, PasteLabel } = require("./models");
const { Op } = require("sequelize");

const getAllPastes = async (params) => {
  if (!params) {
    const pastesIds = await Paste.findAll({
      attributes: { exclude: ["pasteId", "createdAt", "updatedAt"] },
    });
    return pastesIds.map((paste) => paste.toJSON());
  }

  const { title, content, author, limit, offset } = params;

  const where = {};

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
    include: { model: PasteLabel, attributes: ["label"] },
  });

  pastesIds.rows.map((paste) => paste.toJSON());

  return pastesIds;
};

module.exports = {
  getAllPastes,
};

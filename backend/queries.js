const { Paste } = require("./models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const getAllPastes = async (params) => {
  if (!params) {
    const pastesIds = await Paste.findAll({
      attributes: { exclude: ["pasteId", "createdAt", "updatedAt"] },
    });
    return pastesIds.map((paste) => paste.toJSON());
  }

  const { title, content, author, date } = params;
  const where = {};
  if (title) where.title = { [Op.like]: `%${title}%` };
  if (content) where.content = { [Op.like]: `%${content}%` };
  if (author) where.author = { [Op.like]: `%${author}%` };

  const pastesIds = await Paste.findAll({
    attributes: { exclude: ["pasteId", "createdAt", "updatedAt"] },
    where,
  });

  return pastesIds.map((paste) => paste.toJSON());
};

module.exports = {
  getAllPastes,
};

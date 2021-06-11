const { Paste, PasteLabel } = require("./models");

const getAllPasteIds = async () => {
  const pastesIds = await Paste.findAll({
    attributes: ["pasteId"],
  });
  const ids = pastesIds.map((paste) => paste.toJSON().pasteId);
  return ids;
};

const addPastes = async (pastes) => {
  return await Promise.all(
    pastes.map(
      async ({ pasteId, site, title, content, author, date, labels }) => {
        const paste = await Paste.create({
          pasteId,
          site,
          title,
          content,
          author,
          date,
        });

        console.log(paste);

        if (labels.length > 0) {
          const pasteLabels = labels.map((label) => ({
            pasteId: paste.id,
            label,
          }));
          const pasteLabel = await PasteLabel.bulkCreate(pasteLabels);

          console.log(pasteLabel);
        }

        return paste;
      }
    )
  );
};

module.exports = {
  getAllPasteIds,
  addPastes,
};

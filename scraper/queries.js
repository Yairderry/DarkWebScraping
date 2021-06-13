const { Paste, PasteLabel } = require("./models");

const getAllPasteIds = async () => {
  const pastesIds = await Paste.findAll({
    attributes: ["pasteId"],
  });
  const ids = pastesIds.map((paste) => paste.toJSON().pasteId);
  return ids;
};

const addPastes = async (pastes) => {
  pastes && pastes.length > 0
    ? console.log("fresh new pastes to add,yum!", pastes)
    : console.log("there are no new pastes");

  return await Promise.all(
    pastes.map(async (paste) => {
      if (!paste) return;
      const { pasteId, site, title, content, author, date, labels } = paste;
      const newPaste = await Paste.create({
        pasteId,
        site,
        title,
        content,
        author,
        date,
      });

      console.log("added new paste to db: ", newPaste.toJSON());

      if (labels && labels.length > 0) {
        const pasteLabels = labels.map((label) => ({
          pasteId: newPaste.id,
          label,
        }));
        const pasteLabel = await PasteLabel.bulkCreate(pasteLabels);

        console.log(
          "added new labels to db: ",
          pasteLabel.map((label) => label.toJSON())
        );
      }

      return newPaste;
    })
  );
};

module.exports = {
  getAllPasteIds,
  addPastes,
};

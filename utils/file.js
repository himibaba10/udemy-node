const fs = require("fs");

const deleteFile = (fileName) => {
  if (fileName) {
    fs.unlink(fileName, (err) => {
      if (err) throw new Error(err);
    });
  }
};

module.exports = { deleteFile };

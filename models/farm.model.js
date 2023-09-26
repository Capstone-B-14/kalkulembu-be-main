module.exports = (sequelize, Sequelize) => {
  const Farm = sequelize.define("farm", {
    name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    photo: {
      type: Sequelize.STRING,
    },
  });

  return Farm;
};

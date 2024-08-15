const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = OrderItem;

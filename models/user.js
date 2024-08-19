const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/database");

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }

  findById(userId) {
    const db = getDB();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;

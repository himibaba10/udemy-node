const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://himibaba10:PDSc0wmxY1wiVn65@cluster0.jtbd7.mongodb.net/node-complete?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

let _db;

const mongoConnect = (cb) => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  client
    .connect()
    .then(() => {
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  } else {
    throw "No database is connected";
  }
};

module.exports = { mongoConnect, getDB };

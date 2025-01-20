const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const { isEmptyPayload, isInvalidEmail } = require("./validator");

// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "myProject";
const collName = "users";

app.use(bodyParser.json());
app.use("/", express.static(__dirname + "/dist"));

app.get("/get-profile", async function (req, res) {
  // connect to database
  await client.connect();
  // console.log("Connected successfully to server");

  // initiates database
  const db = client.db(dbName);
  const collection = db.collection(collName);

  // Get Data from the backend
  const user = await collection.findOne({ id: 1 });
  // console.log(user)
  client.close();

  response = {};
  if (user !== null) {
    response = {
      name: user.name,
      email: user.email,
      interests: user.interests,
    };
  }
  res.send(response);
});

app.post("/send-user", async function (req, res) {
  const user = req.body;
  console.log(user);

  if (isEmptyPayload(user) || isInvalidEmail(user)) {
    res.send({ error: "invalid payload. Couldn't update user profile data" });
  } else {
    // connect to database
    await client.connect();
    console.log("DATABASE connected successfully to server");

    // initiates database
    const db = client.db(dbName);
    const collection = db.collection(collName);

    // insert data into db
    user["id"] = 1;
    const updateValue = { $set: user };
    await collection.updateOne({ id: 1 }, updateValue, { upsert: true });
    client.close();

    res.send({ info: "user profile data updated successfully" });
  }
});

const server = app.listen(3000, function () {
  console.log("port is running on port 4400 ect lol..");
});

module.exports ={ app,
  server
}
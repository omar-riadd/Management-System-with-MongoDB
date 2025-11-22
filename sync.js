require("dotenv").config();
const { MongoClient } = require("mongodb");

// Local MongoDB
const localUri = "mongodb://127.0.0.1:27017";
const localClient = new MongoClient(localUri);

// Atlas MongoDB (loaded securely from .env)
const atlasUri = process.env.ATLAS_URI;
if (!atlasUri) {
  console.error("ERROR: ATLAS_URI is missing in .env file!");
  process.exit(1);
}

const atlasClient = new MongoClient(atlasUri);

let localDb, atlasDb;

// Collections to sync
const collections = ["students", "instructors", "courses"];

async function connectDbs() {
  try {
    await localClient.connect();
    await atlasClient.connect();

    localDb = localClient.db("universityDB");
    atlasDb = atlasClient.db("universityDB");

    console.log("Databases connected successfully.");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}

async function sync() {
  try {
    if (!localDb || !atlasDb) {
      console.error("Databases not connected yet!");
      return;
    }

    for (const col of collections) {
      const localData = await localDb.collection(col).find().toArray();

      // Replace Atlas data with local data
      await atlasDb.collection(col).deleteMany({});
      if (localData.length > 0) {
        await atlasDb.collection(col).insertMany(localData);
      }
    }

    console.log("Sync complete at", new Date().toLocaleTimeString());
  } catch (err) {
    console.error("Error during sync:", err);
  }
}

// Start
(async () => {
  await connectDbs();
  sync(); // First sync

  // Run sync every 10 seconds
  setInterval(sync, 10 * 1000);
})();


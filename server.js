const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

// ---------------- Local MongoDB ----------------
const localUri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(localUri);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("universityDB");
  console.log("Connected to Local MongoDB");
}
connectDB();

// Allowed collections
const collections = ["students", "instructors", "courses"];

/* ---------------------- ROUTES ---------------------- */

// Get all documents from a collection
app.get("/:collection", async (req, res) => {
  try {
    const collectionName = req.params.collection;
    if (!collections.includes(collectionName)) {
      return res.status(400).json({ error: "Invalid collection" });
    }

    const data = await db.collection(collectionName).find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add document with optional custom _id
app.post("/:collection", async (req, res) => {
  try {
    const collectionName = req.params.collection;
    if (!collections.includes(collectionName)) {
      return res.status(400).json({ error: "Invalid collection" });
    }

    let doc = { ...req.body };

    // Ensure _id is integer and auto-generate if missing
    if (!doc._id) {
      const maxIdDoc = await db.collection(collectionName).find().sort({ _id: -1 }).limit(1).toArray();
      doc._id = maxIdDoc.length > 0 ? maxIdDoc[0]._id + 1 : 1;
    } else {
      doc._id = parseInt(doc._id);
    }

    // Ensure courses is an array for students and instructors
    if ((collectionName === "students" || collectionName === "instructors") && typeof doc.courses === "string") {
      doc.courses = doc.courses.split(",").map(c => c.trim());
    }

    const result = await db.collection(collectionName).insertOne(doc);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update document by _id
app.put("/:collection/:id", async (req, res) => {
  try {
    const collectionName = req.params.collection;
    if (!collections.includes(collectionName)) {
      return res.status(400).json({ error: "Invalid collection" });
    }

    let doc = { ...req.body };

    // Ensure courses is array for students and instructors
    if ((collectionName === "students" || collectionName === "instructors") && typeof doc.courses === "string") {
      doc.courses = doc.courses.split(",").map(c => c.trim());
    }

    const result = await db.collection(collectionName).updateOne(
      { _id: parseInt(req.params.id) },
      { $set: doc }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete document by _id
app.delete("/:collection/:id", async (req, res) => {
  try {
    const collectionName = req.params.collection;
    if (!collections.includes(collectionName)) {
      return res.status(400).json({ error: "Invalid collection" });
    }

    const result = await db.collection(collectionName).deleteOne({ _id: parseInt(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------- START SERVER ---------------------- */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


// Program for min togbanen
// Laget av Arne-Johnny Bentzen

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DATABASE = "db_traintrack";
const CONNECTION_STRING =
  "mongodb+srv://arnbrick:2FGwsHmmdDfzmhkm@cluster0.8fpvb2u.mongodb.net/";
let client, db, colInit, colTrainstat, colStationsxy, colCrossingxy, colLines;

// Koble til MongoDB
async function connectDB() {
  try {
    client = new MongoClient(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db(DATABASE);
    colInit = db.collection("init");
    colTrainstat = db.collection("trainstat");
    colStationsxy = db.collection("stationsxy");
    colCrossingxy = db.collection("crossingxy");
    colLines = db.collection("line");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}
connectDB();

// Håndtere 400-feil
app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send("Bad request: " + err.message);
  } else {
    next(err);
  }
});

// Hent togstatistikk
app.get("/train", async (req, res) => {
  console.log("Get Trains");
  let l = [];
  try {
    const trains = await colTrainstat.find().toArray();
    trains.forEach((train) => {
      delete train._id;
      l.push(train);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "Feil", message: err.message });
  }
  res.json({ trains: l });
});

// Oppdater togstatistikk
app.post("/train", async (req, res) => {
  console.log("Set Trains");
  const trainid = parseInt(req.body.trainid);
  const status = [
    req.body[0],
    req.body[1],
    req.body[2],
    req.body[3],
    req.body[4],
    req.body[5],
    req.body[6],
  ].map(Number);
  const stations = [];
  const stnum = parseInt(req.body.stnum);

  for (let i = 0; i < stnum; i++) {
    const stid = `stid${i}`;
    if (req.body[stid]) {
      stations.push(parseInt(req.body[stid]));
    }
  }

  try {
    await colTrainstat.updateOne(
      { trainid },
      { $set: { trainid, status, stations } }
    );
    const trains = await colTrainstat.find().toArray();
    const response = trains.map((train) => {
      delete train._id;
      return train;
    });
    res.json({ trains: response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "Feil", message: err.message });
  }
});

// Hent stasjoner
app.get("/get_stations", async (req, res) => {
  let stations = {};
  try {
    const data = await colStationsxy.find().toArray();
    data.forEach((station) => {
      delete station._id;
      Object.assign(stations, station);
    });
    console.log("Creating stations");
    console.log(data);
    console.log("Stations created");
    res.json({ data: stations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching stations");
  }
});

// Hent kryssinger
app.get("/get_crossings", async (req, res) => {
  let crossings = {};
  try {
    const data = await colCrossingxy.find().toArray();
    data.forEach((crossing) => {
      delete crossing._id;
      Object.assign(crossings, crossing);
    });
    console.log("Creating crossings");
    console.log(data);
    console.log("Crossings created");
    res.json({ data: crossings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching crossings");
  }
});

// Hent linjer
app.get("/get_lines", async (req, res) => {
  let lines = {};
  try {
    const data = await colLines.find().toArray();
    data.forEach((line) => {
      delete line._id;
      Object.assign(lines, line);
    });
    console.log("Creating lines");
    console.log(data);
    console.log("Lines created");
    res.json({ data: lines });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching lines");
  }
});

// Hent togstatistikk
app.get("/get_trainstat", async (req, res) => {
  let trains = [];
  try {
    const data = await colTrainstat.find().toArray();
    data.forEach((train) => {
      delete train._id;
      trains.push(train);
    });
    console.log("Creating trainstat");
    console.log(data);
    console.log("Trainstat collected");
    res.json({ data: trains });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching train stats");
  }
});

// Start serveren
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Lukk MongoDB-tilkoblingen ved avslutning
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

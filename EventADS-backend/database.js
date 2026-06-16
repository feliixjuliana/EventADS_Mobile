const { MongoClient } = require("mongodb");

let client;
let db;

function getMongoUri() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI não configurada no .env do backend.");
  }

  return process.env.MONGODB_URI;
}

async function getDatabase() {
  if (!client) {
    client = new MongoClient(getMongoUri(), {
      serverSelectionTimeoutMS: 10000,
    });
    await client.connect();
    db = client.db(process.env.MONGODB_DB || "eventads");
  }

  return db;
}

async function initDatabase() {
  const database = await getDatabase();

  await database.collection("people").createIndex({ uid: 1 }, { unique: true, sparse: true });
  await database.collection("people").createIndex({ email: 1 }, { unique: true });
  await database.collection("events").createIndex({ eventAt: 1 });
  await database.collection("events").createIndex({ ownerId: 1 });
}

async function listPeople() {
  const database = await getDatabase();
  return database.collection("people").find({}).sort({ criadoEm: -1 }).toArray();
}

async function getPersonById(id) {
  const database = await getDatabase();
  return database.collection("people").findOne({
    $or: [{ id }, { uid: id }, { email: id }],
  });
}

async function savePerson(person, previousEmail) {
  const database = await getDatabase();
  const people = database.collection("people");
  const cleanPerson = cleanObject(person);
  const conditions = [];

  if (cleanPerson.uid) conditions.push({ uid: cleanPerson.uid });
  if (previousEmail) conditions.push({ email: previousEmail });
  if (cleanPerson.email) conditions.push({ email: cleanPerson.email });

  const existing = conditions.length ? await people.findOne({ $or: conditions }) : null;
  const now = new Date().toISOString();

  if (existing) {
    await people.updateOne(
      { id: existing.id },
      {
        $set: {
          ...cleanPerson,
          atualizadoEm: now,
        },
      }
    );

    return getPersonById(existing.id);
  }

  const document = {
    id: cleanPerson.id || Date.now().toString(),
    ...cleanPerson,
    criadoEm: cleanPerson.criadoEm || now,
    atualizadoEm: cleanPerson.atualizadoEm || now,
  };

  await people.insertOne(document);
  return getPersonById(document.id);
}

async function updatePerson(id, data) {
  const database = await getDatabase();
  const person = await getPersonById(id);
  if (!person) return null;

  await database.collection("people").updateOne(
    { id: person.id },
    {
      $set: {
        ...cleanObject(data),
        atualizadoEm: new Date().toISOString(),
      },
    }
  );

  return getPersonById(person.id);
}

async function listEvents() {
  const database = await getDatabase();
  return database
    .collection("events")
    .find({})
    .sort({ eventAt: 1, criadoEm: -1 })
    .toArray()
    .then((events) => events.map(stripMongoId));
}

async function getEventById(id) {
  const database = await getDatabase();
  const event = await database.collection("events").findOne({ id });
  return event ? stripMongoId(event) : null;
}

async function createEvent(event) {
  const database = await getDatabase();
  const now = new Date().toISOString();
  const document = {
    id: event.id || Date.now().toString(),
    ...cleanObject(event),
    eventAt: parseEventDateTime(event),
    criadoEm: event.criadoEm || now,
    atualizadoEm: event.atualizadoEm || now,
  };

  await database.collection("events").insertOne(document);
  return getEventById(document.id);
}

async function updateEvent(id, event) {
  const database = await getDatabase();
  const currentEvent = await getEventById(id);
  if (!currentEvent) return null;

  const nextEvent = {
    ...cleanObject(event),
    eventAt: parseEventDateTime({ ...currentEvent, ...event }),
    atualizadoEm: new Date().toISOString(),
  };

  await database.collection("events").updateOne({ id }, { $set: nextEvent });
  return getEventById(id);
}

async function deleteEvent(id) {
  const database = await getDatabase();
  const event = await getEventById(id);
  if (!event) return null;

  await database.collection("events").deleteOne({ id });
  return event;
}

function parseEventDateTime(event) {
  const [day, month, year] = String(event.date || "").split("/").map(Number);
  const [hour, minute] = String(event.time || "").replace("h", ":").split(":").map(Number);

  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day, hour || 0, minute || 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function cleanObject(data) {
  return Object.fromEntries(Object.entries(data || {}).filter(([, value]) => value !== undefined && value !== null));
}

function stripMongoId(document) {
  const { _id, ...data } = document;
  return data;
}

module.exports = {
  initDatabase,
  listPeople,
  getPersonById,
  savePerson,
  updatePerson,
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};

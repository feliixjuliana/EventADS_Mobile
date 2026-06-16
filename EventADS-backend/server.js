require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const database = require("./database");

const app = express();
const API_URL = process.env.API_URL || "http://localhost:3002";
const parsedApiUrl = new URL(API_URL);
const PORT = Number(parsedApiUrl.port || 3002);
const HOST = process.env.HOST || "0.0.0.0";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ origin: CORS_ORIGIN }));
app.use(bodyParser.json({ limit: "20mb" }));

function getUploadImage(req) {
  if (req.file) {
    return `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  }

  return req.body.image;
}

function getPublicId(publicId, fallback, folder) {
  return String(publicId || fallback).replace(`${folder}/`, "");
}

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

app.get("/", (req, res) => {
  res.json({ ok: true, app: "EventADS backend", url: API_URL, database: "mongodb" });
});

app.get("/people", asyncHandler(async (req, res) => {
  res.json(await database.listPeople());
}));

app.get("/people/:id", asyncHandler(async (req, res) => {
  const person = await database.getPersonById(req.params.id);
  if (!person) return res.status(404).json({ error: "Pessoa não encontrada." });
  res.json(person);
}));

app.post("/people", asyncHandler(async (req, res) => {
  const { name, nome, email, previousEmail, emailAnterior, uid, photoURL, foto, photoPublicId } = req.body;

  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório." });
  }

  const person = await database.savePerson(
    {
      uid,
      name: name || nome,
      email,
      photoURL: photoURL || foto,
      photoPublicId,
    },
    previousEmail || emailAnterior
  );

  res.status(201).json(person);
}));

app.put("/people/:id", asyncHandler(async (req, res) => {
  const person = await database.updatePerson(req.params.id, req.body);
  if (!person) return res.status(404).json({ error: "Pessoa não encontrada." });
  res.json(person);
}));

app.get("/events", asyncHandler(async (req, res) => {
  res.json(await database.listEvents());
}));

app.get("/events/:id", asyncHandler(async (req, res) => {
  const event = await database.getEventById(req.params.id);
  if (!event) return res.status(404).json({ error: "Evento não encontrado." });
  res.json(event);
}));

app.post("/events", asyncHandler(async (req, res) => {
  const event = await database.createEvent(req.body);
  res.status(201).json(event);
}));

app.put("/events/:id", asyncHandler(async (req, res) => {
  const event = await database.updateEvent(req.params.id, req.body);
  if (!event) return res.status(404).json({ error: "Evento não encontrado." });
  res.json(event);
}));

app.delete("/events/:id", asyncHandler(async (req, res) => {
  const event = await database.deleteEvent(req.params.id);
  if (!event) return res.status(404).json({ error: "Evento não encontrado." });

  if (event.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(event.imagePublicId);
    } catch (error) {
      console.log("Imagem do evento não removida do Cloudinary:", error.message);
    }
  }

  res.json({ ok: true });
}));

app.post("/upload-event", upload.single("file"), asyncHandler(async (req, res) => {
  const { public_id } = req.body;
  const image = getUploadImage(req);
  const folder = "eventads/events";

  if (!image) {
    return res.status(400).json({ error: "Imagem é obrigatória." });
  }

  const uploadResult = await cloudinary.uploader.upload(image, {
    public_id: getPublicId(public_id, `event_${Date.now()}`, folder),
    folder,
    overwrite: true,
    resource_type: "image",
  });

  res.json({
    public_id: uploadResult.public_id,
    secure_url: uploadResult.secure_url,
  });
}));

app.post("/upload-profile", upload.single("file"), asyncHandler(async (req, res) => {
  const { public_id, name, email, uid } = req.body;
  const profileImage = getUploadImage(req);
  const folder = "eventads/profiles";

  if (!profileImage) {
    return res.status(400).json({ error: "Imagem é obrigatória." });
  }

  const uploadResult = await cloudinary.uploader.upload(profileImage, {
    public_id: getPublicId(public_id, `profile_${uid || Date.now()}`, folder),
    folder,
    overwrite: true,
    resource_type: "image",
  });

  const profile = email
    ? await database.savePerson({
        uid,
        name,
        email,
        photoURL: uploadResult.secure_url,
        photoPublicId: uploadResult.public_id,
      })
    : null;

  res.json({
    public_id: uploadResult.public_id,
    secure_url: uploadResult.secure_url,
    profile,
  });
}));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Erro interno do backend." });
});

database
  .initDatabase()
  .then(() => {
    const server = app.listen(PORT, HOST, () => {
      console.log(`EventADS backend rodando em ${API_URL}`);
      console.log("Banco de dados: MongoDB Atlas");
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`A porta ${PORT} já está em uso. Feche outro backend ou altere a porta da API_URL no .env.`);
        process.exit(1);
      }

      if (error.code === "EADDRNOTAVAIL") {
        console.error(`O endereço configurado não está disponível nesta máquina. Escuta atual: ${HOST}:${PORT}.`);
        process.exit(1);
      }

      console.error("Erro ao iniciar backend EventADS:", error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar/configurar MongoDB Atlas:", error.message);
    process.exit(1);
  });

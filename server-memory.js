const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json(), cors());

// "Base de datos" simulada en memoria
let eventos = [
  {
    id: 1,
    title: "GTA VI",
    description: "Release Date",
    category: "Gaming",
    imgURL: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    dateTime: "2026-03-05T17:30:00Z",
  },
  {
    id: 2,
    title: "New Year 2026",
    description: "Celebration",
    category: "Holiday",
    imgURL:
      "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400",
    dateTime: "2026-01-01T00:00:00Z",
  },
];

let siguienteId = 3;

// ============= RUTAS CRUD =============

// READ - Obtener todos los eventos
app.get("/api/eventos", (req, res) => {
  res.json(eventos);
});

// READ - Obtener un evento por ID
app.get("/api/eventos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const evento = eventos.find((e) => e.id === id);

  if (!evento) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  res.json(evento);
});

// CREATE - Crear un nuevo evento
app.post("/api/eventos", (req, res) => {
  const { title, description, category, imgURL, dateTime } = req.body;

  if (!title || !dateTime) {
    return res
      .status(400)
      .json({ error: "El título y la fecha/hora son obligatorios" });
  }

  const nuevoEvento = {
    id: siguienteId++,
    title,
    description: description || "",
    category: category || "General",
    imgURL: imgURL || "",
    dateTime,
  };

  eventos.push(nuevoEvento);
  res.status(201).json(nuevoEvento);
});

// UPDATE - Actualizar un evento existente
app.put("/api/eventos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, category, imgURL, dateTime } = req.body;

  const indice = eventos.findIndex((e) => e.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  // Actualizar solo los campos proporcionados
  if (title !== undefined) eventos[indice].title = title;
  if (description !== undefined) eventos[indice].description = description;
  if (category !== undefined) eventos[indice].category = category;
  if (imgURL !== undefined) eventos[indice].imgURL = imgURL;
  if (dateTime !== undefined) eventos[indice].dateTime = dateTime;

  res.json(eventos[indice]);
});

// DELETE - Eliminar un evento
app.delete("/api/eventos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = eventos.findIndex((e) => e.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  const eventoEliminado = eventos.splice(indice, 1)[0];
  res.json({ mensaje: "Evento eliminado", evento: eventoEliminado });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("\nPrueba estas rutas:");
  console.log("GET    /api/eventos      - Ver todos los eventos");
  console.log("GET    /api/eventos/:id  - Ver un evento");
  console.log("POST   /api/eventos      - Crear evento");
  console.log("PUT    /api/eventos/:id  - Actualizar evento");
  console.log("DELETE /api/eventos/:id  - Eliminar evento");
});

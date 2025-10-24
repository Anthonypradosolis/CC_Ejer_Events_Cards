const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (index.html, css, img, script.js, etc.)
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, "datos.json");

let events = [];

async function loadData() {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf8");
        events = JSON.parse(raw);
        console.log(`Cargados ${events.length} eventos desde datos.json`);
    } catch (err) {
        console.warn("No se pudo leer datos.json o está vacío. Iniciando con lista vacía.");
        events = [];
    }
}

async function saveData() {
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf8");
}

// Inicializar carga de datos
loadData();

// ============= RUTAS CRUD PARA EVENTOS =============

// GET - todas los eventos
app.get("/api/events", (req, res) => {
    res.json(events);
});

// GET - un evento por id
app.get("/api/events/:id", (req, res) => {
    const id = req.params.id;
    const ev = events.find((e) => e.id === id);
    if (!ev) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(ev);
});

// POST - crear evento
app.post("/api/events", async (req, res) => {
    const { id, title, description, category, imgUrl, dateTime } = req.body;
    if (!title || !dateTime) return res.status(400).json({ error: "Faltan campos obligatorios (title, dateTime)" });

    // Generar id si no viene
    const newId = id || `evt-${Date.now()}`;
    const nuevo = { id: newId, title, description: description || "", category: category || "general", imgUrl: imgUrl || "", dateTime };
    events.push(nuevo);
    await saveData();
    res.status(201).json(nuevo);
});

// PUT - actualizar evento
app.put("/api/events/:id", async (req, res) => {
    const id = req.params.id;
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) return res.status(404).json({ error: "Evento no encontrado" });

    const allowed = ["title", "description", "category", "imgUrl", "dateTime"];
    allowed.forEach((k) => {
        if (req.body[k] !== undefined) events[idx][k] = req.body[k];
    });

    await saveData();
    res.json(events[idx]);
});

// DELETE - eliminar evento
app.delete("/api/events/:id", async (req, res) => {
    const id = req.params.id;
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) return res.status(404).json({ error: "Evento no encontrado" });
    const removed = events.splice(idx, 1)[0];
    await saveData();
    res.json({ mensaje: "Evento eliminado", evento: removed });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log("Rutas útiles:");
    console.log("GET    /api/events      - Listar eventos");
    console.log("GET    /api/events/:id  - Obtener evento");
    console.log("POST   /api/events      - Crear evento");
    console.log("PUT    /api/events/:id  - Actualizar evento");
    console.log("DELETE /api/events/:id  - Eliminar evento");
});
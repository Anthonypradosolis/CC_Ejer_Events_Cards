const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const db = require("./database");

// Middleware para parsear JSON
app.use(express.json(), cors());

// ============= RUTAS CRUD =============

// READ - Obtener todos los eventos
app.get("/api/eventos", (req, res) => {
  const sql = "SELECT * FROM events ORDER BY dateTime ASC";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// READ - Obtener un evento por ID
app.get("/api/eventos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.get("SELECT * FROM events WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(row);
  });
});

// CREATE - Crear un nuevo evento
app.post("/api/eventos", (req, res) => {
  const { title, description, category, imgURL, dateTime } = req.body;
  if (!title || !dateTime) {
    return res
      .status(400)
      .json({ error: "El título y la fecha/hora son obligatorios" });
  }

  const sql = `INSERT INTO events (title, description, category, imgURL, dateTime) VALUES (?, ?, ?, ?, ?)`;
  db.run(
    sql,
    [title, description || "", category || "General", imgURL || "", dateTime],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const newEvent = {
        id: this.lastID,
        title,
        description: description || "",
        category: category || "General",
        imgURL: imgURL || "",
        dateTime,
      };
      res.status(201).json(newEvent);
    }
  );
});

// UPDATE - Actualizar un evento existente
app.put("/api/eventos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, category, imgURL, dateTime } = req.body;

  const sql = `UPDATE events SET title = ?, description = ?, category = ?, imgURL = ?, dateTime = ? WHERE id = ?`;
  db.run(
    sql,
    [title, description, category, imgURL, dateTime, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Evento no encontrado" });
      db.get("SELECT * FROM events WHERE id = ?", [id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(row);
      });
    }
  );
});

// DELETE - Eliminar un evento
app.delete("/api/eventos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.run("DELETE FROM events WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Evento no encontrado" });
    res.json({ mensaje: "Evento eliminado", id });
  });
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

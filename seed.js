const db = require("./database");

// Eventos iniciales (tomados de server-memory.js)
const eventosIniciales = [
  {
    title: "GTA VI",
    description: "Release Date",
    category: "Gaming",
    imgURL: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    dateTime: "2026-03-05T17:30:00Z",
  },
  {
    title: "New Year 2026",
    description: "Celebration",
    category: "Holiday",
    imgURL:
      "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400",
    dateTime: "2026-01-01T00:00:00Z",
  },
];

// Función para cargar eventos
function cargarEventos() {
  console.log("🌱 Cargando eventos iniciales...");

  const sql = `INSERT INTO events (title, description, category, imgURL, dateTime) VALUES (?, ?, ?, ?, ?)`;

  let cargados = 0;

  eventosIniciales.forEach((evento, index) => {
    db.run(
      sql,
      [
        evento.title,
        evento.description,
        evento.category,
        evento.imgURL,
        evento.dateTime,
      ],
      function (err) {
        if (err) {
          console.error(
            `❌ Error al cargar evento "${evento.title}":`,
            err.message
          );
        } else {
          cargados++;
          console.log(
            `✅ Evento "${evento.title}" cargado con ID ${this.lastID}`
          );
        }

        // Cerrar conexión cuando termine el último evento
        if (index === eventosIniciales.length - 1) {
          console.log(
            `\n🎉 Proceso completado: ${cargados}/${eventosIniciales.length} eventos cargados`
          );
          db.close();
        }
      }
    );
  });
}

// Ejecutar
cargarEventos();

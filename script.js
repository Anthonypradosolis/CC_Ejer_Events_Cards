
document.addEventListener("DOMContentLoaded", () => {
  fetchEventsAndRender();
});

async function fetchEventsAndRender() {
  try {
    const res = await fetch("/api/events");
    if (!res.ok) throw new Error("Error al obtener eventos");
    const events = await res.json();
    renderEvents(events);
  } catch (err) {
    console.error(err);
    const container = document.querySelector(".cards-container");
    container.innerHTML = `<p class="error">No se pudieron cargar los eventos.</p>`;
  }
}

function renderEvents(events) {
  const container = document.querySelector(".cards-container");
  container.innerHTML = ""; // limpiar plantilla estática

  events.forEach((ev) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.className = "card-img";
    img.src = ev.imgUrl || "./img/placeholder.png";
    img.alt = ev.title;

    const spanCat = document.createElement("span");
    spanCat.className = `category ${ev.category || 'general'}`;
    spanCat.textContent = capitalize(ev.category || "General");

    const h2 = document.createElement("h2");
    h2.className = "card-title";
    h2.textContent = ev.title;

    const p = document.createElement("p");
    p.className = "card-subtitle";
    p.textContent = ev.description || "";

    const dateDiv = document.createElement("div");
    dateDiv.className = "event-date";
    const calIcon = document.createElement("img");
    calIcon.src = "./img/calendar-icon.svg";
    calIcon.alt = "calendar";
    const dateText = document.createElement("span");
    dateText.textContent = formatEventDate(ev.dateTime);
    dateDiv.appendChild(calIcon);
    dateDiv.appendChild(dateText);

    const countdownArea = document.createElement("div");
    countdownArea.className = "countdown-area";

    const parts = ["Días", "Horas", "Minutos", "Segundos"];
    const valueEls = [];
    parts.forEach((label) => {
      const item = document.createElement("div");
      item.className = "countdown-item";
      const val = document.createElement("span");
      val.className = "countdown-value";
      val.textContent = "--";
      const lab = document.createElement("span");
      lab.className = "countdown-label";
      lab.textContent = label;
      item.appendChild(val);
      item.appendChild(lab);
      countdownArea.appendChild(item);
      valueEls.push(val);
    });

    card.appendChild(img);
    card.appendChild(spanCat);
    card.appendChild(h2);
    card.appendChild(p);
    card.appendChild(dateDiv);
    card.appendChild(countdownArea);

    container.appendChild(card);

    // marcar si el evento es pasado o futuro (para estilos)
    const target = parseDate(ev.dateTime);
    const now = new Date();
    if (!(target instanceof Date) || isNaN(target.getTime())) {
      // fecha inválida: tratar como pasado para evitar destacar
      card.classList.add("event-past");
    } else if (target < now) {
      card.classList.add("event-past");
    } else {
      card.classList.add("event-future");
    }

    // iniciar countdown
    startCountdown(target, valueEls);
  });
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseDate(iso) {
  try {
    // Temporal API fallback
    if (typeof Temporal !== "undefined" && Temporal.PlainDateTime) {
      // Temporal parsing expects no Z for PlainDateTime; if Z present, use Instant -> ZonedDateTime
      try {
        const inst = Temporal.Instant.from(iso);
        const zdt = inst.toZonedDateTimeISO(Intl.DateTimeFormat().resolvedOptions().timeZone);
        return new Date(zdt.epochMilliseconds);
      } catch (e) {
        // fallback to Date
      }
    }
  } catch (e) {}
  return new Date(iso);
}

function formatEventDate(iso) {
  const d = parseDate(iso);
  if (isNaN(d)) return "Fecha inválida";
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(d);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${capitalize(weekday)}, ${day}/${month}/${year} - ${hours}:${mins}`;
}

function startCountdown(targetDate, valueEls) {
  // Si la fecha objetivo no es válida, mostrar guiones y no iniciar el intervalo
  if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
    valueEls.forEach((el) => (el.textContent = "--"));
    return;
  }

  function update() {
    const now = new Date();
    let diff = targetDate - now;
    if (diff <= 0) {
      valueEls[0].textContent = "00";
      valueEls[1].textContent = "00";
      valueEls[2].textContent = "00";
      valueEls[3].textContent = "00";
      clearInterval(iv);
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    valueEls[0].textContent = String(days).padStart(2, "0");
    valueEls[1].textContent = String(hours).padStart(2, "0");
    valueEls[2].textContent = String(minutes).padStart(2, "0");
    valueEls[3].textContent = String(seconds).padStart(2, "0");
  }

  let iv = null;
  update();
  iv = setInterval(update, 1000);
}

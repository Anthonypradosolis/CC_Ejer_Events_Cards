# Plan trabajo 24/10/2025 (Está guardado en la carpeta de red DWCC)

## Material Necesario (Está guardado en la carpeta de red DWCC)

- eventos-api (hay que hacer un npm install para instalar las dependencias y npm start para iniciar el servidor)
- events-cards

1. Adaptar nuestra API (Backend) events-api a la especifiación de datos comentada en clase durante esta semana:
   Un evento debe tener:

- id
- title
- description
- category
- imgUrl
- dateTime (formato Temporal API) - 2025-10-16T14:30:00Z

`NOTA:` Podéis usar ChatGPT, Claude o el modo agente de Copilot.

2. Probar la API usando la extensión de VSCode ThunderClient:

- Puedo crear una tarea?
- Puedo actualizar una tarea?
- Puedo eliminar una tarea?
- Puedo mostrar todas las tareas?
- Puedo mostrar una tarea por id?

3. Realizar un fetch a nuestra API desde JS para poder reflejar los datos de alguna tarea en nuestro diseño de cartas (parecido a la llamada que hicimos en la PokeAPI)

## Requisitos eventos

- Debemos tener al menos 3 categorías distintas.
- Al menos un evento debe de tener una fecha vencida.
- Debemos de estilar de forma distinta los eventos futuros y pasados.

## Ideas Ampliación

- Crear un pequeño proyecto paralelo dirigido a los administradores de la web de eventos, permitiéndoles subir nuevos eventos, modificar los eventos existentes o borrar eventos con poca relevancia.
- La idea es generar formularios HTML5 + llamadas a la API mediante JS usando los verbos HTTP -> POST, DELETE, PATCH...
- Guardar (usando localStorage) una lista de eventos cacheados.
- Implementar en el lado servidor (API REST con Express) la creación de una cookie que tiene el nombre de tu usuarie. Crea una pequeña función en el cliente que realice un console.log mostrando el nombre de usuarie.

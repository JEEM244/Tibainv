# Tibainv

Tibainv es una herramienta que estoy haciendo para organizar información de Tibia. La idea es tener en un solo lugar mis notas, listas, capturas y algunos datos públicos del juego.

Es un proyecto personal y todavía tiene funciones que están en pruebas. No se conecta a la cuenta del juego ni necesita la contraseña de Tibia.

## Qué tiene

- Buscar información pública de personajes, objetos y criaturas.
- Guardar listas y notas propias.
- Registrar sesiones de hunt y cantidades manualmente.
- Importar capturas de pantalla del juego.
- Intentar leer texto de las capturas usando OCR.
- Exportar e importar respaldos JSON.
- Guardar información en el navegador.

## Cómo abrirlo

Abre `index.html` en un navegador. Si algunas peticiones externas no funcionan al abrir el archivo directamente, puedes usar un servidor local o publicar la página en un hosting estático.

## Cómo funciona la parte de capturas

1. Guarda una captura desde Tibia.
2. En Tibainv, abre la sección de capturas y selecciona la imagen.
3. Usa la opción para leer el texto.
4. Revisa el resultado y corrige lo que esté mal antes de guardarlo.

El OCR puede confundir letras y números. No hay que tomar el resultado como información exacta sin revisarlo.

## Qué no hace todavía

- No lee el inventario en vivo.
- No detecta automáticamente los objetos por sus iconos.
- No cuenta las criaturas eliminadas por sí solo.
- No lee la memoria del cliente ni intercepta el tráfico del juego.

Los datos personales se guardan localmente en el navegador. Las consultas de personajes y criaturas usan un servicio público externo, por lo que pueden tardar o dejar de funcionar.

## Tecnologías y herramientas

- HTML, CSS y JavaScript.
- IndexedDB para guardar imágenes.
- APIs públicas para algunos datos del juego.
- Tesseract.js para OCR.
- Pruebas automatizadas con GitHub Actions.

Este proyecto me sirve para practicar JavaScript, almacenamiento local, consumo de APIs y manejo de archivos.

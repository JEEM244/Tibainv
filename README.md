<p align="center">
  <img src=".github/assets/cover.svg" alt="Tibainv - organizador personal de Tibia" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-interfaz-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-estilos-1572B6?style=flat-square&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-l%C3%B3gica-F7DF1E?style=flat-square&logo=javascript&logoColor=222">
  <img src="https://img.shields.io/badge/IndexedDB-im%C3%A1genes-8A6D3B?style=flat-square">
  <img src="https://img.shields.io/badge/Estado-prototipo-b88635?style=flat-square">
</p>

<h1 align="center">Tibainv</h1>
<p align="center">Un pequeño centro para guardar notas, listas, capturas y datos de Tibia.</p>

<p align="center">
  <a href="#mapa-del-proyecto">Mapa del proyecto</a> ·
  <a href="#herramientas">Herramientas</a> ·
  <a href="#capturas-y-ocr">Capturas y OCR</a> ·
  <a href="#límites-actuales">Límites</a>
</p>

Tibainv es una herramienta que estoy haciendo para organizar información de Tibia. La idea es tener en un solo lugar mis notas, listas, capturas y algunos datos públicos del juego.

Es un proyecto personal y todavía tiene funciones en pruebas. No se conecta a la cuenta del juego ni necesita la contraseña de Tibia.

## Mapa del proyecto

```mermaid
flowchart TD
    A["Tibainv en el navegador"] --> B["Notas y listas"]
    A --> C["Sesiones de hunt"]
    A --> D["Capturas de pantalla"]
    A --> E["Consultas públicas"]
    B --> F["Almacenamiento local"]
    C --> F
    D --> G["OCR para extraer texto"]
    G --> H["Revisión manual"]
    H --> F
    E --> I["API pública"]
    F --> J["Respaldo JSON"]
```

## Qué tiene

| Herramienta | Uso |
|---|---|
| Búsqueda | Consultar información pública de personajes, objetos y criaturas |
| Notas y listas | Guardar información propia |
| Sesiones | Registrar manualmente hunts y cantidades |
| Capturas | Importar imágenes del juego |
| OCR | Intentar leer texto de una captura |
| Respaldos | Importar y exportar JSON |

## Cómo abrirlo

Abre `index.html` en un navegador. Si algunas peticiones externas no funcionan al abrir el archivo directamente, puedes usar un servidor local o publicar la página en un hosting estático.

## Capturas y OCR

1. Guarda una captura desde Tibia.
2. En Tibainv, abre la sección de capturas y selecciona la imagen.
3. Usa la opción para leer el texto.
4. Revisa el resultado y corrige lo que esté mal antes de guardarlo.

> El OCR puede confundir letras y números. Revisa el texto antes de guardarlo como un dato correcto.

## Dónde se guardan los datos

La información personal se guarda en el navegador. Las imágenes se manejan con IndexedDB. Las consultas de personajes y criaturas usan un servicio público externo, por lo que pueden tardar o dejar de funcionar.

## Límites actuales

- No lee el inventario en vivo.
- No detecta automáticamente los objetos por sus iconos.
- No cuenta las criaturas eliminadas por sí solo.
- No lee la memoria del cliente ni intercepta el tráfico del juego.

## Tecnologías y herramientas

HTML, CSS, JavaScript, IndexedDB, APIs públicas y Tesseract.js para OCR. También hay pruebas automatizadas con GitHub Actions.

<p align="center"><sub>Proyecto personal · No solicita credenciales ni se conecta a la cuenta del juego.</sub></p>

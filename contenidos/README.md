# Guía de HTML paso a paso — LMSGI 1.º DAM

Apuntes web de la UT2 (HTML) del módulo Lenguajes de marcas y sistemas de gestión de información.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo, `guia-html`).
2. Sube todo el contenido de esta carpeta a la raíz del repositorio (botón **Add file › Upload files**, o con `git push`).
3. En el repositorio, ve a **Settings › Pages**.
4. En **Build and deployment**, elige **Source: Deploy from a branch**, rama `main` y carpeta `/ (root)`. Pulsa **Save**.
5. En uno o dos minutos la web estará en `https://TU-USUARIO.github.io/guia-html/`.

El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll; no lo borres.

## Estructura

- `index.html`: portada y preparación del entorno.
- `bloque-0.html` … `bloque-8.html`: un bloque por página.
- `chuleta.html`: referencia rápida.
- `assets/`: estilos, JavaScript (copiar código, editor «Probar», progreso) y favicon.

El progreso de ejercicios se guarda en el navegador de cada alumno (localStorage); no se envía a ningún sitio.

## Editar

Las páginas son HTML estático: se pueden editar directamente. Las fuentes (Atkinson Hyperlegible e IBM Plex Mono) se cargan desde Google Fonts; sin conexión se usan fuentes del sistema.

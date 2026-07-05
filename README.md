# TRUST. Immersive Website

A full multi-file website for the TRUST. clothing brand, featuring:

- Scroll-driven immersive 3D experience (desktop)
- 5-scene camera journey with animated shirts
- Overlay storytelling UI + navigation + scene progress
- Mobile fallback with intersection-based reveal animations
- Optional GLTF shirt model loading with procedural fallback

## Project structure

- `index.html` — app shell + overlays + CDN scripts
- `styles/main.css` — full visual styling
- `scripts/main.js` — app bootstrap and mode routing
- `scripts/three-scene.js` — Three.js scene, camera path, particles, shirts
- `scripts/ui.js` — overlay/panel GSAP and UI helpers
- `assets/models/` — place GLTF model files here

## GLTF model integration

Current loader path in `scripts/three-scene.js`:

`assets/models/T_shirt_gltf.zip.gltf`

For proper loading, include matching binary file in the same folder:

- `assets/models/T_shirt_gltf.zip.gltf`
- `assets/models/T_shirt_gltf.zip.bin`

If model loading fails, the site automatically falls back to procedural shirts.

## Run

Open `index.html` via a local static server (recommended), for example:

- VSCode Live Server
- `python -m http.server`

Then visit the local URL in your browser.
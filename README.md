[![English](https://img.shields.io/badge/English-default-blue)](README.md) [![简体中文](https://img.shields.io/badge/简体中文-docs-red)](doc/README.md)

# Minimalist New Tab

A lightweight Chrome MV3 extension that replaces the new tab page. Glassmorphism UI, zero-deps and no build step — easy to customize and localize.

---

## Features

- Glassmorphism UI — clean and responsive
- Multiple wallpaper sources (Bing / Anime / Picsum / Custom / Local)
- Search suggestions (proxy-enabled in extension mode)
- Smart favicon fallback + letter avatars
- Dock drag & reorder (supports long-press on mobile)
- Import bookmarks (HTML)
- Export/Import JSON settings
- Developer-friendly: no build required

## Installation (recommended: Chrome extension)

1. Open `chrome://extensions/` and enable **Developer mode**
2. Click **Load unpacked** and select the project folder

> Note: You can also open [newtab.html](newtab.html) directly in a browser for quick testing; some features are limited in page mode (e.g., `background.js` won't act as a proxy and search suggestions may be blocked by CORS).

## File overview

| File | Description |
|------|-------------|
| [newtab.html](newtab.html) | Page markup & styles |
| [app.js](app.js) | Core logic (state, UI, settings, icons, bg, drag) |
| [background.js](background.js) | Suggestion proxy (extension mode) |
| [sw.js](sw.js) | Optional service worker (page mode caching) |
| [manifest.json](manifest.json) | Extension manifest |
| [_locales/](_locales/) | i18n resources (zh/en) |

## Development & customization

- No-build workflow: edit source files and refresh the extension or page to see changes.

- Adding wallpaper sources: update `Config.BG_SOURCES` (in `app.js`) and add required `host_permissions` in `manifest.json`.

- Custom search engines: edit `Config.ENGINES` in `app.js`.

- Styling options: use `Config.STYLES` and `State.styles` to control size, spacing and blur.

## Internationalization

Chinese and English are supported. Strings are centralized in the `I18N` object in [app.js]; use `_locales/` for Chrome extension localization files.

## Deployment (GitHub Pages)

- Publish the repository via GitHub Pages (root or `/docs`) — `index.html` redirects to `newtab.html`.

- Note: extension-specific features (bookmark sync) are not available in page mode; search suggestions may be blocked by CORS.

- Service Worker requires HTTPS (GitHub Pages provides HTTPS by default).

## Common actions

| Action | Where |
|------|------|
| Import bookmarks | Settings → Import bookmarks |
| Custom wallpaper | Settings → Wallpaper |
| Export/Import settings | Settings → Import/Export |
| Reset configuration | Settings → Reset |

## Contributing

PRs are welcome. Please follow the project's zero-deps, no-build approach.

## License

MIT

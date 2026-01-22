# Minimalist New Tab 🚀

**Minimalist New Tab** 是一个基于 Chrome 扩展 MV3 的自定义新标签页替换页，采用玻璃拟态风格、零依赖与无构建流程：直接打开 `newtab.html` 或将整个文件夹作为「已解压扩展」加载即可使用。

---

## ✨ 主要特性

- 玻璃拟态 UI，轻量且响应式
- 可配置壁纸来源（Bing / Anime / Picsum / 自定义 / 本地）
- 支持搜索建议（通过 `background.js` 做 CORS 代理以兼容部分站点）
- Dock（快捷链接）支持拖拽重排与移动端长按拖拽
- 支持导入书签（HTML）、导出/导入配置（JSON）
- 图标获取多重回退策略 + 字母头像占位
- 无需构建：直接修改源码即可预览与调试

---

## ▶️ 快速开始

- 将项目文件夹打开为 Chrome 的已解压扩展：
  1. 打开 `chrome://extensions/`，开启「开发者模式」
  2. 点击「加载已解压的扩展程序」，选择项目根目录
- 或直接在浏览器打开 `newtab.html`（非扩展环境下部分 API 限制，建议仅用于调试）

> Tip: 在非扩展模式下 `background.js` 不会被自动使用，搜索建议可能受 CORS 限制。

---

## 🔧 主要文件

- `newtab.html` — 页面结构与样式
- `app.js` — 应用逻辑（State、UI、Settings、Drag/Drop、图标处理、背景管理等）
- `background.js` — 建议接口的代理（在扩展上下文下提供跨域请求）
- `sw.js` — 可选的 service worker，用于缓存资源（页面模式下注册）
- `manifest.json` — 扩展清单
- `_locales/` — 本地化字符串
- `assets/` — 图标与资源

---

## 🛠 开发与定制

- 无构建：直接修改 `newtab.html` 或 `app.js`，然后刷新扩展页面或重新加载扩展
- 增加壁纸来源：编辑 `Config.BG_SOURCES`（`app.js` 中）并在 `manifest.json` 中添加需要的 `host_permissions`
- 增加/修改搜索引擎：编辑 `Config.ENGINES`
- 样式配置：`Config.STYLES` 与 `State.styles` 控制尺寸、模糊、间距等

---

## 🌐 本地化

- 默认支持中/英；字符串定义在 `app.js` 的 `I18N`，同时 `_locales/` 包含用于 Chrome 扩展的本地化文件。

---

## ✅ 常见操作

- 导入书签：设置 → 导入书签 HTML
- 添加自定义壁纸来源：设置 → 壁纸 → 添加自定义来源
- 清空/导出配置：设置内提供导入/导出与重置选项

---

## 📤 部署到 GitHub Pages (让页面以网站形式访问)

如果你希望直接通过 GitHub Pages 访问和展示该页面（例如 https://<你的用户名>.github.io/<仓库>/），请按下列建议操作：

1. 根入口（已添加）
   - 我已添加 `index.html`，它会自动重定向到 `newtab.html`，所以发布后直接访问站点根即可看到页面。

2. 在仓库设置中启用 GitHub Pages：
   - 进入仓库 Settings → Pages → Source，选择分支（通常为 `main` 或 `gh-pages`）与根目录（/ 或 `/docs`），保存并等待几分钟。

3. 资源路径
   - 本项目使用相对路径（如 `./assets/*`），适合 GitHub Pages，通常无需修改。

4. 功能限制（重要） ⚠️
   - 扩展专属功能（例如“同步书签”、“管理书签”按钮的真实打开与同步）**仅在 Chrome 扩展上下文可用**，在 GitHub Pages 上这些按钮会被禁用或提示不可用。
   - 搜索建议可能受 CORS 限制（非扩展环境下 `background.js` 不会作为代理）。若遇到建议无法加载，可以：
     - 使用允许 CORS 的建议接口，或
     - 部署一个轻量的代理（例如 serverless 函数）并把 `SuggestionManager` 指向代理 URL（注意隐私与安全）。

5. 其他建议
   - 确保 GitHub Pages 启用了 HTTPS（默认启用），以便 Service Worker (`sw.js`) 正常注册与生效。
   - 若需要在页面模式也提供与浏览器书签类似的在线同步体验，需要额外的后端服务（不在当前项目范围内）。

---

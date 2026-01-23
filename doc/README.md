# Minimalist New Tab — 极简新标签页

一个轻量级的 Chrome MV3 扩展，用于替换浏览器新标签页。采用玻璃拟态风格，零依赖、无构建流程，便于定制和本地化。

---

## 特性

- 玻璃拟态 UI：简洁、响应式
- 多源壁纸：Bing / Anime / Picsum / 自定义 / 本地
- 搜索建议：扩展模式通过代理支持跨域
- 智能图标恢复策略 + 字母占位符
- Dock 拖拽管理（支持移动端长按）
- 支持导入书签（HTML）
- 导出/导入 JSON 配置，便于迁移
- 开发友好：无需构建，修改即见效

---

## 安装（推荐：作为 Chrome 扩展）

1. 打开 `chrome://extensions/` 并启用「开发者模式」
2. 点击「加载已解压的扩展程序」，选择项目目录

也可以直接在浏览器打开 `newtab.html`（页面模式下部分功能受限，例如 `background.js` 不可作为代理，搜索建议可能受 CORS 限制）。

---

## 文件说明

- `newtab.html` — 页面结构与样式
- `app.js` — 核心逻辑（State、UI、设置、图标、背景、拖拽）
- `background.js` — 建议代理（扩展模式）
- `sw.js` — 可选 Service Worker（页面模式缓存）
- `manifest.json` — 扩展清单
- `_locales/` — 国际化资源（中文/英文）

---

## 开发与定制

- 无构建：编辑源文件后刷新或重新加载扩展即可生效。
- 增加壁纸来源：编辑 `Config.BG_SOURCES`（`app.js`）并在 `manifest.json` 添加所需 `host_permissions`。
- 自定义搜索引擎：编辑 `Config.ENGINES`。
- 样式配置：使用 `Config.STYLES` 与 `State.styles` 调整尺寸、间距与模糊效果。

---

## 部署（GitHub Pages）

- 将仓库发布为 GitHub Pages（根目录或 `/docs`），`index.html` 已指向 `newtab.html`。
- 注意：扩展专有功能（如书签同步）在页面模式下不可用；搜索建议可能受 CORS 限制。
- Service Worker 需要 HTTPS（GitHub Pages 默认启用）。

---

## 常见操作

- 导入书签：设置 → 导入书签
- 自定义壁纸：设置 → 壁纸
- 导出/导入设置：设置 → 导入/导出
- 重置配置：设置 → 重置

---

## 贡献

欢迎通过 Pull Request 提交改进，请遵循简洁、零依赖、无构建的设计原则。

## License

MIT

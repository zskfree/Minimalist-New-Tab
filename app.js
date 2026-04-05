if (typeof isExtensionContext === 'undefined') {
    var isExtensionContext = function () { return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id; };
}

/** Module: Constants & Config */
const Config = {
    BING_API: "https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN",
    FALLBACK_BG: './assets/default.png',
    ENGINES: {
        google: { name: "Google", url: "https://www.google.com/search?q=", suggest: "https://suggestqueries.google.com/complete/search?client=chrome&q={q}&callback={cb}" },
        bing: { name: "Bing", url: "https://www.bing.com/search?q=", suggest: "https://api.bing.com/qsonhs.aspx?type=cb&q={q}&cb={cb}" },
        baidu: { name: "百度", url: "https://www.baidu.com/s?wd=", suggest: "https://suggestion.baidu.com/su?wd={q}&cb={cb}" },
        sogou: { name: "搜狗", url: "https://www.sogou.com/web?query=", suggest: "https://www.sogou.com/suggnew/ajajjson?key={q}&type=web&ori=yes&pr=web&abtestid=&ip=&t={t}" },
        duckduckgo: { name: "Duck", url: "https://duckduckgo.com/?q=", suggest: null }, // DDG CORS strict
        yandex: { name: "Yandex", url: "https://yandex.com/search/?text=", suggest: null }
    },
    BG_SOURCES: {
        bing: { labelKey: "bg.bing", url: "https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN" },
        anime: { labelKey: "bg.anime", url: "https://api.btstu.cn/sjbz/api.php?lx=dongman&format=images", random: true, randomParam: "t" },
        picsum: { labelKey: "bg.picsum", url: "https://picsum.photos/1920/1080", random: true, randomParam: "random" }
    },
    DEFAULT_LINKS: [
        { title: "Google", url: "https://www.google.com", icon: "assets/google.png" },
        { title: "YouTube", url: "https://www.youtube.com", icon: "assets/youtube.png" },
        { title: "GitHub", url: "https://github.com", icon: "assets/github.png" },
        { title: "ChatGPT", url: "https://chat.openai.com", icon: "assets/chatgpt.png" }
    ],
    STYLES: [
        { id: 'iconSize', group: 'layout', labelKey: 'style.iconSize', min: 40, max: 90, unit: 'px' },
        { id: 'innerScale', group: 'layout', labelKey: 'style.innerScale', min: 45, max: 100, unit: '%' },
        { id: 'fontSize', group: 'layout', labelKey: 'style.fontSize', min: 10, max: 20, unit: 'px' },
        { id: 'gridGap', group: 'layout', labelKey: 'style.gridGap', min: 8, max: 64, unit: 'px' },
        { id: 'sidebarWidth', group: 'layout', labelKey: 'style.sidebarWidth', min: 520, max: 1100, step: 10, unit: 'px' },
        { id: 'bookmarkHoverLift', group: 'motion', labelKey: 'style.bookmarkHoverLift', min: 2, max: 16, unit: 'px' },
        { id: 'bookmarkHoverScale', group: 'motion', labelKey: 'style.bookmarkHoverScale', min: 100, max: 132, unit: '%' },
        { id: 'glassBlur', group: 'glass', labelKey: 'style.glassBlur', min: 8, max: 36, unit: 'px' },
        { id: 'glassRadius', group: 'glass', labelKey: 'style.glassRadius', min: 10, max: 28, unit: 'px' },
        { id: 'cardRadius', group: 'glass', labelKey: 'style.cardRadius', min: 10, max: 28, unit: 'px' },
        { id: 'bgBlur', group: 'background', labelKey: 'style.bgBlur', min: 0, max: 30, unit: 'px' },
        { id: 'bgOverlay', group: 'background', labelKey: 'style.bgOverlay', min: 0, max: 80, unit: '%' },
        { id: 'accentHue', group: 'color', labelKey: 'style.accentHue', min: 0, max: 360, unit: '°' },
        { id: 'accentSaturation', group: 'color', labelKey: 'style.accentSaturation', min: 40, max: 100, unit: '%' },
        { id: 'accentLightness', group: 'color', labelKey: 'style.accentLightness', min: 40, max: 70, unit: '%' }
    ],
    STYLE_GROUPS: [
        { id: 'layout', titleKey: 'appearance.layout' },
        { id: 'motion', titleKey: 'appearance.motion' },
        { id: 'glass', titleKey: 'appearance.glass' },
        { id: 'background', titleKey: 'appearance.background' },
        { id: 'color', titleKey: 'appearance.color' }
    ],
    STYLE_PRESETS: {
        balanced: { iconSize: 56, innerScale: 78, fontSize: 13, gridGap: 20, sidebarWidth: 820, bookmarkHoverLift: 4, bookmarkHoverScale: 106, glassBlur: 18, glassRadius: 18, cardRadius: 15, bgBlur: 2, bgOverlay: 28, accentHue: 210, accentSaturation: 92, accentLightness: 56 },
        compact: { iconSize: 48, innerScale: 84, fontSize: 12, gridGap: 16, sidebarWidth: 700, bookmarkHoverLift: 3, bookmarkHoverScale: 104, glassBlur: 12, glassRadius: 14, cardRadius: 12, bgBlur: 1, bgOverlay: 24, accentHue: 212, accentSaturation: 88, accentLightness: 54 },
        immersive: { iconSize: 60, innerScale: 76, fontSize: 14, gridGap: 24, sidebarWidth: 900, bookmarkHoverLift: 5, bookmarkHoverScale: 108, glassBlur: 22, glassRadius: 20, cardRadius: 17, bgBlur: 4, bgOverlay: 32, accentHue: 204, accentSaturation: 86, accentLightness: 58 }
    }
};

const I18N = {
    zh: {
        appTitle: '新标签页',
        settingsTitle: '偏好设置',
        labelAppearance: '🎨 界面外观',
        labelLanguage: '🌐 语言',
        labelBackground: '🖼️ 壁纸来源',
        labelCustomBg: '🧩 自定义来源',
        labelSearchEngine: '🔍 默认搜索引擎',
        labelDock: '⚓ Dock 栏图标',
        labelImportBookmarks: '📂 导入书签 HTML',
        labelExportConfig: '⬇️ 导出配置',
        labelImportConfig: '⬆️ 导入配置',
        btnAddLinkRow: '+ 添加一行',
        btnAddCustomBg: '+ 添加自定义来源',
        btnExportConfig: '导出配置文件',
        exportHint: '导出书签、样式、壁纸与搜索引擎配置',
        btnReset: '⚠️ 重置所有数据',
        btnCancel: '取消',
        btnSave: '保存配置',
        btnRefreshBg: '更换壁纸',
        btnSyncBookmarks: '同步书签',
        btnManageBookmarks: '管理书签',
        searchPlaceholder: '{engine} 搜索... ("/" 搜书签)',
        searchEngineMenu: '选择搜索引擎',
        searchEngineAria: '搜索引擎：{engine}',
        welcome: '👋 欢迎！<br>请点击右上角 ⚙️ 导入书签',
        home: '🏠 首页',
        emptyFolder: '空文件夹',
        noResults: '未找到结果',
        linkName: '名',
        linkUrl: 'URL',
        linkIcon: '图标',
        customName: '名称',
        customUrl: 'URL',
        customRandom: '随机',
        importDetected: '✅ 识别到 <b>{count}</b> 个项目<br>点击保存生效',
        importSuccess: '✅ 导入成功',
        importInvalid: '❌ 配置文件无效',
        importFormatError: '❌ 格式错误',
        confirmReset: '确定清空并重置？',
        confirmResetHard: '此操作不可撤销，确定继续？',
        confirmRemoveRow: '确定删除该条目？',
        rowRemoved: '✅ 已删除',
        history: '历史',
        clearHistory: '清空搜索历史',
        historyCleared: '✅ 已清空搜索历史',
        historyToggle: '记录搜索历史',
        historyItemRemoved: '✅ 已删除该历史',
        bgLoading: '正在加载壁纸…',
        bgUpdated: '壁纸已更新',
        bgFailed: '壁纸加载失败，已回退到 Bing',
        bgRandomSelected: '随机壁纸已更新',
        imageTooLarge: '图片需 < 3MB',
        lunarUnsupported: '不支持阴历显示',
        syncLoading: '正在同步书签…',
        syncSuccess: '✅ 书签已同步',
        syncFailed: '❌ 同步失败',
        syncUnavailable: '❌ 仅扩展模式可同步',
        manageUnavailable: '❌ 仅扩展模式可打开书签管理',
        bgUrl: '链接',
        bgLocal: '本地',
        useDefaultBg: '使用默认壁纸',
        langZh: '中文',
        langEn: 'English',
        style: {
            bgBlur: '模糊',
            bgOverlay: '暗度',
            iconSize: '尺寸',
            innerScale: '填充',
            gridGap: '间距',
            fontSize: '字体'
        },
        bg: {
            bing: 'Bing 每日',
            anime: '二次元',
            picsum: 'Picsum 随机'
        }
    },
    en: {
        appTitle: 'New Tab',
        settingsTitle: 'Preferences',
        labelAppearance: '🎨 Appearance',
        labelLanguage: '🌐 Language',
        labelBackground: '🖼️ Wallpaper Source',
        labelCustomBg: '🧩 Custom Sources',
        labelSearchEngine: '🔍 Default Search Engine',
        labelDock: '⚓ Dock Icons',
        labelImportBookmarks: '📂 Import Bookmarks (HTML)',
        labelExportConfig: '⬇️ Export Config',
        labelImportConfig: '⬆️ Import Config',
        btnAddLinkRow: '+ Add Row',
        btnAddCustomBg: '+ Add Custom Source',
        btnExportConfig: 'Export Config File',
        exportHint: 'Export bookmarks, styles, wallpaper and search engine settings',
        btnReset: '⚠️ Reset All Data',
        btnCancel: 'Cancel',
        btnSave: 'Save',
        btnRefreshBg: 'Change Wallpaper',
        btnSyncBookmarks: 'Sync Bookmarks',
        btnManageBookmarks: 'Manage Bookmarks',
        searchPlaceholder: 'Search {engine}... ("/" bookmarks)',
        searchEngineMenu: 'Choose search engine',
        searchEngineAria: 'Search engine: {engine}',
        welcome: '👋 Welcome!<br>Click ⚙️ in the top-right to import bookmarks',
        home: '🏠 Home',
        emptyFolder: 'Empty folder',
        noResults: 'No results',
        linkName: 'Name',
        linkUrl: 'URL',
        linkIcon: 'Icon',
        customName: 'Name',
        customUrl: 'URL',
        customRandom: 'Random',
        importDetected: '✅ Found <b>{count}</b> items<br>Click save to apply',
        importSuccess: '✅ Imported successfully',
        importInvalid: '❌ Invalid config file',
        importFormatError: '❌ Invalid format',
        confirmReset: 'Are you sure you want to reset?',
        confirmResetHard: 'This cannot be undone. Continue?',
        confirmRemoveRow: 'Delete this item?',
        rowRemoved: '✅ Removed',
        history: 'History',
        clearHistory: 'Clear search history',
        historyCleared: '✅ Search history cleared',
        historyToggle: 'Save search history',
        historyItemRemoved: '✅ History item removed',
        bgLoading: 'Loading wallpaper…',
        bgUpdated: 'Wallpaper updated',
        bgFailed: 'Wallpaper failed to load, falling back to Bing',
        bgRandomSelected: 'Random wallpaper updated',
        imageTooLarge: 'Image must be < 3MB',
        lunarUnsupported: 'Lunar calendar not supported',
        syncLoading: 'Syncing bookmarks…',
        syncSuccess: '✅ Bookmarks synced',
        syncFailed: '❌ Sync failed',
        syncUnavailable: '❌ Sync only in extension mode',
        manageUnavailable: '❌ Bookmark manager only in extension mode',
        bgUrl: 'URL',
        bgLocal: 'Local',
        langZh: '中文',
        langEn: 'English',
        style: {
            bgBlur: 'Blur',
            bgOverlay: 'Dim',
            iconSize: 'Icon',
            innerScale: 'Fill',
            gridGap: 'Gap',
            fontSize: 'Font'
        },
        bg: {
            bing: 'Bing Daily',
            anime: 'Anime',
            picsum: 'Picsum Random'
        }
    }
};

Object.assign(I18N.zh, {
    btnEditBookmarks: '\u7f16\u8f91',
    btnDoneEditing: '\u5b8c\u6210',
    btnAddBookmark: '\u65b0\u589e',
    bookmarkEditAction: '\u7f16\u8f91',
    bookmarkDeleteAction: '\u5220\u9664',
    bookmarkCreateLink: '\u65b0\u5efa\u4e66\u7b7e',
    bookmarkCreateFolder: '\u65b0\u5efa\u6587\u4ef6\u5939',
    bookmarkEditHeading: '\u7f16\u8f91\u4e66\u7b7e',
    bookmarkCreateHeading: '\u65b0\u5efa\u5230\u5f53\u524d\u6587\u4ef6\u5939',
    bookmarkErrorTitleRequired: '\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a',
    bookmarkErrorUrlInvalid: 'URL \u683c\u5f0f\u65e0\u6548\uff0c\u9700\u4ee5 http:// \u6216 https:// \u5f00\u5934',
    bookmarkEditUnavailable: '\u4ec5\u6269\u5c55\u6a21\u5f0f\u53ef\u7f16\u8f91\u4e66\u7b7e',
    bookmarkEditExitSearch: '\u8bf7\u5148\u9000\u51fa\u4e66\u7b7e\u641c\u7d22\u518d\u8fdb\u5165\u7f16\u8f91',
    bookmarkCreateUnavailable: '\u8bf7\u5148\u8fdb\u5165\u4e00\u4e2a\u6587\u4ef6\u5939\u518d\u65b0\u589e',
    bookmarkSaveSuccess: '\u4e66\u7b7e\u5df2\u66f4\u65b0',
    bookmarkSaveFailed: '\u66f4\u65b0\u4e66\u7b7e\u5931\u8d25',
    bookmarkCreateSuccess: '\u5df2\u65b0\u5efa\u4e66\u7b7e',
    bookmarkCreateFailed: '\u65b0\u5efa\u4e66\u7b7e\u5931\u8d25',
    bookmarkDeleteSuccess: '\u5df2\u5220\u9664\u4e66\u7b7e',
    bookmarkDeleteFailed: '\u5220\u9664\u4e66\u7b7e\u5931\u8d25',
    bookmarkDeleteConfirm: '\u786e\u5b9a\u8981\u5220\u9664\u201c{title}\u201d\u5417\uff1f\u6b64\u64cd\u4f5c\u4e0d\u53ef\u64a4\u9500\u3002',
    bookmarkErrorIconInvalid: '\u56fe\u6807\u94fe\u63a5\u65e0\u6548\uff0c\u8bf7\u4f7f\u7528 https:// \u6216\u4e0a\u4f20\u672c\u5730\u56fe\u7247',
    bookmarkUploadIcon: '\u4e0a\u4f20\u56fe\u6807',
    bookmarkClearIcon: '\u6e05\u9664\u56fe\u6807',
    bookmarkIconSelected: '\u5df2\u9009\u62e9\u81ea\u5b9a\u4e49\u56fe\u6807',
    dockCreateAction: '\u65b0\u589e\u5bfc\u822a',
    dockEditHeading: '\u7f16\u8f91\u5e95\u90e8\u5bfc\u822a',
    dockCreateHeading: '\u65b0\u589e\u5e95\u90e8\u5bfc\u822a',
    dockCreateHint: '\u8bbe\u7f6e\u5e95\u90e8\u5feb\u6377\u5bfc\u822a\u94fe\u63a5\u4e0e\u56fe\u6807',
    dockSaveSuccess: '\u5e95\u90e8\u5bfc\u822a\u5df2\u66f4\u65b0',
    dockSaveFailed: '\u66f4\u65b0\u5e95\u90e8\u5bfc\u822a\u5931\u8d25',
    dockCreateSuccess: '\u5e95\u90e8\u5bfc\u822a\u5df2\u65b0\u589e',
    dockCreateFailed: '\u65b0\u589e\u5e95\u90e8\u5bfc\u822a\u5931\u8d25',
    dockDeleteSuccess: '\u5e95\u90e8\u5bfc\u822a\u5df2\u5220\u9664',
    dockDeleteFailed: '\u5220\u9664\u5e95\u90e8\u5bfc\u822a\u5931\u8d25',
    dockDeleteConfirm: '\u786e\u5b9a\u8981\u5220\u9664\u201c{title}\u201d\u5417\uff1f\u6b64\u64cd\u4f5c\u4e0d\u53ef\u64a4\u9500\u3002',
    appearance: {
        layout: '\u5e03\u5c40',
        motion: '\u52a8\u6548',
        glass: '\u73bb\u7483\u8d28\u611f',
        background: '\u80cc\u666f',
        color: '\u914d\u8272',
        presets: '\u5feb\u901f\u9884\u8bbe',
        presetBalanced: '\u5747\u8861',
        presetCompact: '\u7d27\u51d1',
        presetImmersive: '\u6c89\u6d78'
    },
    style: {
        sidebarWidth: '\u4fa7\u680f',
        glassBlur: '\u9762\u677f\u6a21\u7cca',
        glassRadius: '\u9762\u677f\u5706\u89d2',
        cardRadius: '\u5361\u7247\u5706\u89d2',
        accentHue: '\u8272\u76f8',
        accentSaturation: '\u9971\u548c',
        accentLightness: '\u4eae\u5ea6'
    }
});

Object.assign(I18N.en, {
    btnEditBookmarks: 'Edit',
    btnDoneEditing: 'Done',
    btnAddBookmark: 'Add',
    bookmarkEditAction: 'Edit',
    bookmarkDeleteAction: 'Delete',
    bookmarkCreateLink: 'New Bookmark',
    bookmarkCreateFolder: 'New Folder',
    bookmarkEditHeading: 'Edit bookmark',
    bookmarkCreateHeading: 'Create in current folder',
    bookmarkErrorTitleRequired: 'Title cannot be empty',
    bookmarkErrorUrlInvalid: 'Invalid URL format. Use http:// or https://',
    bookmarkEditUnavailable: 'Edit only works in extension mode',
    bookmarkEditExitSearch: 'Exit bookmark search before editing',
    bookmarkCreateUnavailable: 'Open a folder before creating bookmarks',
    bookmarkSaveSuccess: 'Bookmark updated',
    bookmarkSaveFailed: 'Failed to update bookmark',
    bookmarkCreateSuccess: 'Bookmark created',
    bookmarkCreateFailed: 'Failed to create bookmark',
    bookmarkDeleteSuccess: 'Bookmark deleted',
    bookmarkDeleteFailed: 'Failed to delete bookmark',
    bookmarkDeleteConfirm: 'Delete "{title}"? This action cannot be undone.',
    bookmarkErrorIconInvalid: 'Invalid icon URL. Use https:// or upload a local image',
    bookmarkUploadIcon: 'Upload Icon',
    bookmarkClearIcon: 'Clear Icon',
    bookmarkIconSelected: 'Custom icon selected',
    dockCreateAction: 'Add Dock Link',
    dockEditHeading: 'Edit dock link',
    dockCreateHeading: 'Add dock link',
    dockCreateHint: 'Set the dock shortcut title, URL and icon',
    dockSaveSuccess: 'Dock link updated',
    dockSaveFailed: 'Failed to update dock link',
    dockCreateSuccess: 'Dock link added',
    dockCreateFailed: 'Failed to add dock link',
    dockDeleteSuccess: 'Dock link removed',
    dockDeleteFailed: 'Failed to remove dock link',
    dockDeleteConfirm: 'Delete "{title}" from the dock? This action cannot be undone.',
    appearance: {
        layout: 'Layout',
        motion: 'Motion',
        glass: 'Glass',
        background: 'Background',
        color: 'Color',
        presets: 'Quick Presets',
        presetBalanced: 'Balanced',
        presetCompact: 'Compact',
        presetImmersive: 'Immersive'
    },
    style: {
        sidebarWidth: 'Sidebar',
        glassBlur: 'Panel Blur',
        glassRadius: 'Panel Radius',
        cardRadius: 'Card Radius',
        accentHue: 'Hue',
        accentSaturation: 'Saturation',
        accentLightness: 'Lightness'
    }
});

Object.assign(I18N.zh.style, {
    bgBlur: '\u6a21\u7cca',
    bgOverlay: '\u6697\u5ea6',
    iconSize: '\u5c3a\u5bf8',
    innerScale: '\u586b\u5145',
    gridGap: '\u95f4\u8ddd',
    bookmarkHoverLift: '\u5f39\u8df3\u9ad8\u5ea6',
    bookmarkHoverScale: '\u5f39\u8df3\u7f29\u653e',
    fontSize: '\u5b57\u4f53',
    sidebarWidth: '\u4fa7\u680f',
    glassBlur: '\u9762\u677f\u6a21\u7cca',
    glassRadius: '\u9762\u677f\u5706\u89d2',
    cardRadius: '\u5361\u7247\u5706\u89d2',
    accentHue: '\u8272\u76f8',
    accentSaturation: '\u9971\u548c',
    accentLightness: '\u4eae\u5ea6'
});

Object.assign(I18N.en.style, {
    bgBlur: 'Blur',
    bgOverlay: 'Overlay',
    iconSize: 'Icon',
    innerScale: 'Fill',
    gridGap: 'Gap',
    bookmarkHoverLift: 'Hover Lift',
    bookmarkHoverScale: 'Hover Scale',
    fontSize: 'Text',
    sidebarWidth: 'Sidebar',
    glassBlur: 'Panel Blur',
    glassRadius: 'Panel Radius',
    cardRadius: 'Card Radius',
    accentHue: 'Hue',
    accentSaturation: 'Saturation',
    accentLightness: 'Lightness'
});

const t = (key, vars = {}) => {
    const lang = I18N[State.language] ? State.language : 'zh';
    const path = key.split('.');
    let val = I18N[lang];
    for (const p of path) val = val?.[p];
    if (!val) return key;
    return String(val).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
};

/** Module: Application State */
const State = {
    bookmarks: [],
    quickLinks: [],
    currentFolderId: 'root',
    breadcrumbPath: [],
    styles: { iconSize: 56, innerScale: 75, fontSize: 13, gridGap: 20, bgBlur: 0, bgOverlay: 28, sidebarWidth: 800, bookmarkHoverLift: 4, bookmarkHoverScale: 106, glassBlur: 18, glassRadius: 16, cardRadius: 15, accentHue: 210, accentSaturation: 100, accentLightness: 52 },
    bgConfig: { type: 'custom_zhimg-pica', value: 'https://pica.zhimg.com/v2-564f2c587f65e208a130242b34338872_1440w.jpg' },
    currentEngine: 'google',
    language: 'zh',
    customBgSources: [{ id: 'zhimg-pica', name: 'Zhimg Pica', url: 'https://pica.zhimg.com/v2-564f2c587f65e208a130242b34338872_1440w.jpg', random: false }],
    bookmarkCustomIcons: {},
    tempBgValue: null,
    pendingImportData: null,
    isSearchMode: false,
    suggestions: [],
    selectedSuggestionIndex: -1,
    searchHistory: [],
    searchHistoryEnabled: true,
    bookmarkEditor: {
        enabled: false,
        pending: false,
        form: null
    }
};

/** Module: Utilities */
const DOM_CACHE = {};
const $ = (id) => DOM_CACHE[id] || (DOM_CACHE[id] = document.getElementById(id));
const $$ = (sel, root = document) => root.querySelectorAll(sel);
const getDomain = (url) => { try { return new URL(url).hostname; } catch (e) { return ''; } };
const FAILED_FAVICONS = new Set();
const ICON_TIMEOUTS = new WeakMap();
const ICON_LOAD_TIMEOUT = 1200;
const FAVICON_CACHE_KEY = 'favicon_cache_v1';
const FAVICON_FAIL_KEY = 'favicon_fail_v1';
const FAVICON_FAIL_TTL = 12 * 60 * 60 * 1000;
const FAVICON_PROVIDERS = {
    direct: { id: 'direct', build: (domain) => `https://${domain}/favicon.ico` },
    baidu: { id: 'baidu', build: (domain) => `https://favicon.baidusearch.com/favicon?domain=${domain}` },
    sogou: { id: 'sogou', build: (domain) => `https://favicon.sogou.com/favicon?domain=${domain}` },
    iowen: { id: 'iowen', build: (domain) => `https://api.iowen.cn/favicon/${domain}.png` },
    google: { id: 'google', build: (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128` },
    yandex: { id: 'yandex', build: (domain) => `https://favicon.yandex.net/favicon/${domain}?size=120` }
};
let _faviconCacheMem = null;
const getFaviconCache = () => {
    if (_faviconCacheMem) return _faviconCacheMem;
    try { _faviconCacheMem = JSON.parse(localStorage.getItem(FAVICON_CACHE_KEY) || '{}'); }
    catch (e) { _faviconCacheMem = {}; }
    return _faviconCacheMem;
};
const setFaviconCache = (cache) => {
    _faviconCacheMem = cache;
    localStorage.setItem(FAVICON_CACHE_KEY, JSON.stringify(cache));
};
let _faviconFailCacheMem = null;
const getFaviconFailCache = () => {
    if (_faviconFailCacheMem) return _faviconFailCacheMem;
    try { _faviconFailCacheMem = JSON.parse(localStorage.getItem(FAVICON_FAIL_KEY) || '{}'); }
    catch (e) { _faviconFailCacheMem = {}; }
    return _faviconFailCacheMem;
};
const setFaviconFailCache = (cache) => {
    _faviconFailCacheMem = cache;
    localStorage.setItem(FAVICON_FAIL_KEY, JSON.stringify(cache));
};
const pruneFaviconFailCache = (cache) => {
    const now = Date.now();
    let changed = false;
    Object.keys(cache).forEach((domain) => {
        const entries = cache[domain];
        if (!entries || typeof entries !== 'object') {
            delete cache[domain];
            changed = true;
            return;
        }
        Object.keys(entries).forEach((url) => {
            if (!entries[url] || now - entries[url] > FAVICON_FAIL_TTL) {
                delete entries[url];
                changed = true;
            }
        });
        if (Object.keys(entries).length === 0) {
            delete cache[domain];
            changed = true;
        }
    });
    if (changed) setFaviconFailCache(cache);
    return cache;
};
const shouldSkipFavicon = (domain, url) => {
    if (!domain || !url) return false;
    const cache = pruneFaviconFailCache(getFaviconFailCache());
    const entries = cache[domain];
    if (!entries) return false;
    return !!entries[url];
};
const recordFaviconFailure = (domain, url) => {
    if (!domain || !url) return;
    const cache = getFaviconFailCache();
    cache[domain] = cache[domain] || {};
    cache[domain][url] = Date.now();
    setFaviconFailCache(cache);
};
const clearFaviconFailure = (domain, url) => {
    if (!domain || !url) return;
    const cache = getFaviconFailCache();
    if (!cache[domain] || !cache[domain][url]) return;
    delete cache[domain][url];
    if (Object.keys(cache[domain]).length === 0) delete cache[domain];
    setFaviconFailCache(cache);
};
const clearIconTimeout = (img) => {
    const t = ICON_TIMEOUTS.get(img);
    if (t) {
        clearTimeout(t);
        ICON_TIMEOUTS.delete(img);
    }
};
const startIconTimeout = (img) => {
    if (!img || img.dataset.state) return;
    clearIconTimeout(img);
    const timer = setTimeout(() => {
        if (!img || img.dataset.state) return;
        window.handleIconError(img, img.dataset.url || '', img.dataset.title || '');
    }, ICON_LOAD_TIMEOUT);
    ICON_TIMEOUTS.set(img, timer);
};
const cacheFavicon = (domain, src) => {
    if (!domain || !src) return;
    const cache = getFaviconCache();
    if (cache[domain] === src) return;
    cache[domain] = src;
    setFaviconCache(cache);
};
let iconObserver = null;
const initIconObserver = () => {
    if (iconObserver) return;
    iconObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                iconObserver.unobserve(img);

                // Start loading process only when visible
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                }

                if (img.complete) {
                    checkIcon(img, img.dataset.url || '', img.dataset.title || '');
                } else {
                    startIconTimeout(img);
                }
            }
        });
    }, { rootMargin: '100px' }); // Load slightly before coming into view
};

const bindIconEvents = (root) => {
    if (!root) return;
    initIconObserver();

    root.querySelectorAll('img.card-icon, img.dock-icon').forEach((img) => {
        if (img.dataset.bound) return;
        img.dataset.bound = '1';
        img.addEventListener('load', () => {
            clearIconTimeout(img);
            checkIcon(img, img.dataset.url || '', img.dataset.title || '');
        });
        img.addEventListener('error', () => {
            clearIconTimeout(img);
            handleIconError(img, img.dataset.url || '', img.dataset.title || '');
        });

        // Observe for lazy loading
        iconObserver.observe(img);
    });

    // Animate folder emojis
    setTimeout(() => {
        root.querySelectorAll('.folder-emoji:not(.loaded)').forEach(el => {
            el.classList.add('loaded');
        });
    }, 10);
};
const isChinaEnv = (() => {
    let _cache = null;
    return () => {
        if (_cache !== null) return _cache;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const langs = (navigator.languages && navigator.languages.length)
            ? navigator.languages
            : [navigator.language || ''];
        const langHit = langs.some(l => /^zh(-CN)?/i.test(l));
        _cache = tz === 'Asia/Shanghai' || tz === 'Asia/Chongqing' || tz === 'Asia/Harbin' || tz === 'Asia/Beijing' || langHit;
        return _cache;
    };
})();
const getFaviconProviders = () => {
    const base = [FAVICON_PROVIDERS.google, FAVICON_PROVIDERS.direct];
    if (isChinaEnv()) {
        return base.concat([
            FAVICON_PROVIDERS.baidu,
            FAVICON_PROVIDERS.sogou,
            FAVICON_PROVIDERS.iowen
        ]);
    }
    return base.concat([
        FAVICON_PROVIDERS.yandex
    ]);
};
const getFaviconCandidates = (domain, customIcon) => {
    const candidates = [];
    if (customIcon) candidates.push(customIcon);
    if (!domain) return candidates;
    if (domain === 'chatgpt.com' || domain.endsWith('.chatgpt.com') || domain === 'openai.com' || domain.endsWith('.openai.com')) {
        const special = [
            'https://chatgpt.com/favicon.ico',
            'https://chat.openai.com/favicon.ico',
            'https://openai.com/favicon.ico',
            'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
            'https://www.google.com/s2/favicons?domain=openai.com&sz=128'
        ];
        special.forEach((url) => {
            if (!shouldSkipFavicon(domain, url)) candidates.push(url);
        });
    }
    const cache = getFaviconCache();
    if (cache[domain] && !shouldSkipFavicon(domain, cache[domain])) candidates.push(cache[domain]);
    getFaviconProviders().forEach((p) => {
        const url = p.build(domain);
        if (url && !shouldSkipFavicon(domain, url)) candidates.push(url);
    });
    return candidates;
};
const escapeHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const normalizeUrl = (url) => {
    if (!url) return '';
    const raw = String(url).trim();
    if (!raw) return '';
    const withProto = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw) ? raw : `https://${raw}`;
    try {
        const u = new URL(withProto, location.origin);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
        return u.href;
    } catch (e) {
        return '';
    }
};

const normalizeCustomIconUrl = (url) => {
    if (!url) return '';
    const raw = String(url).trim();
    if (!raw) return '';
    if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(raw)) return raw;
    return normalizeUrl(raw);
};

const applyBookmarkCustomIcons = (nodes, iconMap = State.bookmarkCustomIcons || {}) => (nodes || []).map((node) => {
    const next = { ...node };
    const customIcon = iconMap[next.id];
    if (customIcon) next.icon = customIcon;
    if (next.children) next.children = applyBookmarkCustomIcons(next.children, iconMap);
    return next;
});

const collectBookmarkIds = (node, acc = []) => {
    if (!node) return acc;
    acc.push(node.id);
    (node.children || []).forEach((child) => collectBookmarkIds(child, acc));
    return acc;
};

const mapBookmarkNode = (node) => {
    if (node.url) return { id: node.id, type: 'link', title: node.title || node.url, url: node.url };
    return {
        id: node.id,
        type: 'folder',
        title: node.title || 'Folder',
        children: (node.children || []).map(mapBookmarkNode)
    };
};

const fetchBookmarksFromChrome = () => new Promise((resolve, reject) => {
    if (!isExtensionContext() || !chrome.bookmarks) {
        reject(new Error('unavailable'));
        return;
    }
    chrome.bookmarks.getTree((tree) => {
        const err = chrome.runtime && chrome.runtime.lastError;
        if (err) {
            reject(err);
            return;
        }
        const root = tree && tree[0];
        resolve(root && root.children ? root.children.map(mapBookmarkNode) : []);
    });
});

const isSafeUrl = (url) => !!normalizeUrl(url);

const callBookmarkApi = (invoke) => new Promise((resolve, reject) => {
    if (!isExtensionContext() || !chrome.bookmarks) {
        reject(new Error('unavailable'));
        return;
    }
    try {
        invoke((result) => {
            const err = chrome.runtime && chrome.runtime.lastError;
            if (err) {
                reject(new Error(err.message || String(err)));
                return;
            }
            resolve(result);
        });
    } catch (err) {
        reject(err);
    }
});

const refreshBookmarksState = async () => {
    const bookmarks = await fetchBookmarksFromChrome();
    State.bookmarks = applyBookmarkCustomIcons(bookmarks || []);
    Storage.save();
    return State.bookmarks;
};

const BookmarkEditor = {
    getState: function () {
        if (!State.bookmarkEditor) {
            State.bookmarkEditor = { enabled: false, pending: false, form: null, confirmDelete: null };
        }
        if (!Object.prototype.hasOwnProperty.call(State.bookmarkEditor, 'confirmDelete')) {
            State.bookmarkEditor.confirmDelete = null;
        }
        return State.bookmarkEditor;
    },

    isAvailable: function () {
        return isExtensionContext() && !!(chrome && chrome.bookmarks);
    },

    isEnabled: function () {
        return !!this.getState().enabled;
    },

    isPending: function () {
        return !!this.getState().pending;
    },

    getForm: function () {
        return this.getState().form;
    },

    getConfirmDelete: function () {
        return this.getState().confirmDelete;
    },

    isDockForm: function (form = this.getForm()) {
        return !!form && form.scope === 'dock';
    },

    getDockTargetId: function (index) {
        const value = Number.parseInt(index, 10);
        return Number.isInteger(value) && value >= 0 ? `dock:${value}` : '';
    },

    parseDockIndex: function (targetId) {
        const match = /^dock:(\d+)$/.exec(String(targetId || ''));
        if (!match) return -1;
        return Number.parseInt(match[1], 10);
    },

    getQuickLinkByIndex: function (index) {
        const value = Number.parseInt(index, 10);
        if (!Number.isInteger(value) || value < 0) return null;
        return State.quickLinks[value] || null;
    },

    getNodeById: function (id, nodes = State.bookmarks) {
        for (const node of nodes || []) {
            if (!node) continue;
            if (node.id === id) return node;
            if (node.children && node.children.length) {
                const hit = this.getNodeById(id, node.children);
                if (hit) return hit;
            }
        }
        return null;
    },

    getCurrentFolderNode: function () {
        if (State.currentFolderId === 'root') return null;
        const path = UIManager.getFolderPath(State.currentFolderId);
        return path.length ? path[path.length - 1] : null;
    },

    getResolvedFolderId: function () {
        let targetId = State.currentFolderId || 'root';
        if (targetId === 'root') {
            return UIManager.getDefaultFolderId();
        }
        return UIManager.getFolderPath(targetId).length ? targetId : UIManager.getDefaultFolderId();
    },

    canCreateInCurrentFolder: function () {
        return !!this.getCurrentFolderNode();
    },

    updateHeaderControls: function () {
        const editBtn = $('btnEditBookmarks');
        const addBtn = $('btnAddBookmark');
        const available = this.isAvailable();
        const enabled = this.isEnabled();
        const pending = this.isPending();

        if (editBtn) {
            editBtn.hidden = !available;
            editBtn.disabled = pending;
            editBtn.classList.toggle('is-disabled', pending);
            editBtn.setAttribute('aria-disabled', String(pending));
            const span = editBtn.querySelector('span');
            if (span) span.textContent = enabled ? t('btnDoneEditing') : t('btnEditBookmarks');
        }

        if (addBtn) {
            const showAdd = available && enabled;
            const addDisabled = pending || !this.canCreateInCurrentFolder();
            addBtn.hidden = !showAdd;
            addBtn.disabled = addDisabled;
            addBtn.classList.toggle('is-disabled', addDisabled);
            addBtn.setAttribute('aria-disabled', String(addDisabled));
            const span = addBtn.querySelector('span');
            if (span) span.textContent = t('btnAddBookmark');
        }
    },

    setPending: function (pending) {
        this.getState().pending = pending;
        this.updateHeaderControls();
        if (!State.isSearchMode && $('bookmarkGrid')) UIManager.enterFolder(State.currentFolderId);
    },

    focusPrimaryInput: function () {
        setTimeout(() => {
            const field = document.querySelector('[data-bookmark-input="title"]');
            if (field) field.focus();
        }, 0);
    },

    handleEscape: function () {
        if (this.isPending()) return false;
        if (this.getConfirmDelete()) {
            this.closeDeleteConfirm();
            return true;
        }
        if (this.getForm()) {
            this.closeForm();
            return true;
        }
        if (this.isEnabled()) {
            this.exit();
            return true;
        }
        return false;
    },

    async refreshAndRenderCurrentFolder() {
        await refreshBookmarksState();
        this.updateHeaderControls();
        if (!State.bookmarks.length) {
            State.currentFolderId = 'root';
            State.breadcrumbPath = [{ id: 'root', title: t('home') }];
            $('bookmarkGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;opacity:0.6;padding:60px;">${t('welcome')}</div>`;
            $('breadcrumb').innerHTML = `<div class="breadcrumb-item">${t('home')}</div>`;
            return;
        }
        const targetId = this.getResolvedFolderId();
        UIManager.enterFolder(targetId);
    },

    async enter() {
        if (this.isPending()) return;
        if (!this.isAvailable()) {
            showActionToast(t('bookmarkEditUnavailable'), 'error');
            this.updateHeaderControls();
            return;
        }
        if (State.isSearchMode) {
            showActionToast(t('bookmarkEditExitSearch'), 'error');
            return;
        }

        this.setPending(true);
        try {
            this.getState().enabled = true;
            this.getState().form = null;
            this.getState().confirmDelete = null;
            this.updateModal();
            await this.refreshAndRenderCurrentFolder();
        } catch (err) {
            this.getState().enabled = false;
            showActionToast(t('syncFailed'), 'error');
        } finally {
            this.getState().pending = false;
            this.updateHeaderControls();
            this.updateModal();
            UIManager.renderDock();
            if (!State.isSearchMode && $('bookmarkGrid')) UIManager.enterFolder(State.currentFolderId);
        }
    },

    exit: function () {
        if (this.isPending()) return;
        const state = this.getState();
        state.enabled = false;
        state.form = null;
        state.confirmDelete = null;
        this.updateHeaderControls();
        this.updateModal();
        UIManager.renderDock();
        if (!State.isSearchMode && $('bookmarkGrid')) UIManager.enterFolder(State.currentFolderId);
    },

    toggle: function () {
        if (this.isEnabled()) this.exit();
        else this.enter();
    },

    updateModal: function () {
        const root = $('bookmarkModalRoot');
        if (!root) return;
        const form = this.getForm();
        const confirmDelete = this.getConfirmDelete();
        const shouldShow = this.isEnabled() && (form || confirmDelete);

        if (!shouldShow) {
            root.hidden = true;
            root.innerHTML = '';
            document.body.classList.remove('bookmark-modal-open');
            return;
        }

        root.hidden = false;
        root.innerHTML = confirmDelete ? this.renderDeleteModal(confirmDelete) : this.renderFormModal(form);
        document.body.classList.add('bookmark-modal-open');
    },

    openEdit: function (id) {
        if (!this.isEnabled() || this.isPending()) return;
        const node = this.getNodeById(id);
        if (!node) return;
        const state = this.getState();
        state.confirmDelete = null;
        state.form = {
            scope: 'bookmark',
            mode: node.type === 'folder' ? 'edit-folder' : 'edit-link',
            targetId: node.id,
            parentId: null,
            title: node.title || '',
            url: node.url || '',
            icon: node.icon || '',
            error: ''
        };
        this.updateModal();
        this.focusPrimaryInput();
    },

    openCreate: function (kind = 'link') {
        if (!this.isEnabled() || this.isPending()) return;
        if (!this.canCreateInCurrentFolder()) {
            showActionToast(t('bookmarkCreateUnavailable'), 'error');
            this.updateHeaderControls();
            return;
        }
        const parent = this.getCurrentFolderNode();
        const state = this.getState();
        state.confirmDelete = null;
        state.form = {
            scope: 'bookmark',
            mode: kind === 'folder' ? 'create-folder' : 'create-link',
            targetId: null,
            parentId: parent.id,
            title: '',
            url: '',
            icon: '',
            error: ''
        };
        this.updateModal();
        this.focusPrimaryInput();
    },

    openDockEdit: function (index) {
        if (!this.isEnabled() || this.isPending()) return;
        const quickLink = this.getQuickLinkByIndex(index);
        if (!quickLink) return;
        const state = this.getState();
        state.confirmDelete = null;
        state.form = {
            scope: 'dock',
            mode: 'edit-dock-link',
            targetId: this.getDockTargetId(index),
            quickLinkIndex: Number.parseInt(index, 10),
            parentId: null,
            title: quickLink.title || '',
            url: quickLink.url || '',
            icon: quickLink.icon || '',
            error: ''
        };
        this.updateModal();
        this.focusPrimaryInput();
    },

    openDockCreate: function () {
        if (!this.isEnabled() || this.isPending()) return;
        const state = this.getState();
        state.confirmDelete = null;
        state.form = {
            scope: 'dock',
            mode: 'create-dock-link',
            targetId: null,
            quickLinkIndex: null,
            parentId: null,
            title: '',
            url: '',
            icon: '',
            error: ''
        };
        this.updateModal();
        this.focusPrimaryInput();
    },

    switchCreateMode: function (mode) {
        const form = this.getForm();
        if (!form || form.targetId !== null) return;
        if (this.isDockForm(form)) return;
        form.mode = mode === 'create-folder' ? 'create-folder' : 'create-link';
        form.error = '';
        if (form.mode === 'create-folder') form.url = '';
        this.updateModal();
        this.focusPrimaryInput();
    },

    closeForm: function () {
        const state = this.getState();
        if (!state.form && !state.confirmDelete) return;
        state.form = null;
        state.confirmDelete = null;
        this.updateModal();
        this.updateHeaderControls();
    },

    requestDelete: function (id) {
        if (!this.isEnabled() || this.isPending()) return;
        const dockIndex = this.parseDockIndex(id);
        if (dockIndex >= 0) {
            const quickLink = this.getQuickLinkByIndex(dockIndex);
            if (!quickLink) return;
            this.getState().confirmDelete = {
                targetId: this.getDockTargetId(dockIndex),
                title: quickLink.title || quickLink.url || this.getDockTargetId(dockIndex),
                type: 'dock-link',
                scope: 'dock'
            };
            this.updateModal();
            return;
        }
        const node = this.getNodeById(id);
        if (!node) return;
        this.getState().confirmDelete = {
            targetId: node.id,
            title: node.title || node.id,
            type: node.type
        };
        this.updateModal();
    },

    closeDeleteConfirm: function () {
        if (!this.getConfirmDelete()) return;
        this.getState().confirmDelete = null;
        this.updateModal();
        if (this.getForm()) this.focusPrimaryInput();
    },

    handleFormInput: function (target) {
        const form = this.getForm();
        if (!form) return;
        const field = target && target.dataset ? target.dataset.bookmarkInput : '';
        if (!field || !Object.prototype.hasOwnProperty.call(form, field)) return;
        form[field] = target.value;
        if (form.error) {
            form.error = '';
            const errorEl = document.querySelector('.bookmark-form-error');
            if (errorEl) {
                errorEl.hidden = true;
                errorEl.textContent = '';
            }
        }
    },

    async handleIconFile(file) {
        const form = this.getForm();
        if (!form || !file) return;
        if (!/^image\//i.test(file.type || '')) {
            form.error = t('bookmarkErrorIconInvalid');
            this.updateModal();
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            form.icon = String(e.target?.result || '');
            form.error = '';
            this.updateModal();
        };
        reader.readAsDataURL(file);
    },

    validateForm: function () {
        const form = this.getForm();
        if (!form) return null;
        const title = String(form.title || '').trim();
        if (!title) {
            form.error = t('bookmarkErrorTitleRequired');
            return null;
        }
        const payload = { title };
        const icon = normalizeCustomIconUrl(form.icon);
        if (String(form.icon || '').trim() && !icon) {
            form.error = t('bookmarkErrorIconInvalid');
            return null;
        }
        payload.icon = icon;
        if (form.mode === 'edit-link' || form.mode === 'create-link' || form.mode === 'edit-dock-link' || form.mode === 'create-dock-link') {
            const url = normalizeUrl(form.url);
            if (!url) {
                form.error = t('bookmarkErrorUrlInvalid');
                return null;
            }
            payload.url = url;
        }
        form.error = '';
        return payload;
    },

    async submitForm() {
        const state = this.getState();
        const form = state.form;
        if (!form || state.pending) return;

        const payload = this.validateForm();
        if (!payload) {
            this.updateModal();
            this.focusPrimaryInput();
            return;
        }

        state.pending = true;
        this.updateHeaderControls();
        this.updateModal();

        try {
            if (this.isDockForm(form)) {
                const quickLink = { title: payload.title, url: payload.url, icon: payload.icon || '' };
                const dockIndex = form.targetId === null ? -1 : this.parseDockIndex(form.targetId);
                if (dockIndex >= 0) {
                    if (!this.getQuickLinkByIndex(dockIndex)) throw new Error('dock_link_missing');
                    State.quickLinks[dockIndex] = quickLink;
                } else {
                    State.quickLinks.push(quickLink);
                }
                Storage.saveNow();
                state.form = null;
                state.confirmDelete = null;
                this.updateModal();
                UIManager.renderDock();
                showActionToast(t(dockIndex >= 0 ? 'dockSaveSuccess' : 'dockCreateSuccess'), 'success');
            } else if (form.mode === 'edit-folder' || form.mode === 'edit-link') {
                const changes = { title: payload.title };
                if (payload.url) changes.url = payload.url;
                await callBookmarkApi((done) => chrome.bookmarks.update(form.targetId, changes, done));
                if (payload.icon) State.bookmarkCustomIcons[form.targetId] = payload.icon;
                else delete State.bookmarkCustomIcons[form.targetId];
                Storage.save();
                state.form = null;
                state.confirmDelete = null;
                this.updateModal();
                await this.refreshAndRenderCurrentFolder();
                showActionToast(t('bookmarkSaveSuccess'), 'success');
            } else {
                const parentId = form.parentId || this.getCurrentFolderNode()?.id;
                if (!parentId) throw new Error('parent_unavailable');
                const createInfo = { parentId, title: payload.title };
                if (payload.url) createInfo.url = payload.url;
                const created = await callBookmarkApi((done) => chrome.bookmarks.create(createInfo, done));
                if (payload.icon && created?.id) State.bookmarkCustomIcons[created.id] = payload.icon;
                Storage.save();
                state.form = null;
                state.confirmDelete = null;
                this.updateModal();
                await this.refreshAndRenderCurrentFolder();
                showActionToast(t('bookmarkCreateSuccess'), 'success');
            }
        } catch (err) {
            if (this.isDockForm(form)) {
                form.error = t(form.mode.startsWith('create') ? 'dockCreateFailed' : 'dockSaveFailed');
            } else {
                form.error = t(form.mode.startsWith('create') ? 'bookmarkCreateFailed' : 'bookmarkSaveFailed');
            }
            this.updateModal();
            showActionToast(form.error, 'error');
            this.focusPrimaryInput();
        } finally {
            state.pending = false;
            this.updateHeaderControls();
            this.updateModal();
        }
    },

    async remove(id) {
        if (!this.isEnabled() || this.isPending()) return;
        const dockIndex = this.parseDockIndex(id);
        if (dockIndex >= 0) {
            if (!this.getQuickLinkByIndex(dockIndex)) return;
            const state = this.getState();
            state.pending = true;
            this.updateHeaderControls();
            this.updateModal();
            try {
                State.quickLinks.splice(dockIndex, 1);
                Storage.saveNow();
                state.form = null;
                state.confirmDelete = null;
                this.updateModal();
                UIManager.renderDock();
                showActionToast(t('dockDeleteSuccess'), 'success');
            } catch (err) {
                showActionToast(t('dockDeleteFailed'), 'error');
            } finally {
                state.pending = false;
                this.updateHeaderControls();
                this.updateModal();
            }
            return;
        }
        const node = this.getNodeById(id);
        if (!node) return;

        const state = this.getState();
        state.pending = true;
        this.updateHeaderControls();
        this.updateModal();

        try {
            if (node.type === 'folder') {
                await callBookmarkApi((done) => chrome.bookmarks.removeTree(id, done));
            } else {
                await callBookmarkApi((done) => chrome.bookmarks.remove(id, done));
            }
            collectBookmarkIds(node).forEach((bookmarkId) => {
                delete State.bookmarkCustomIcons[bookmarkId];
            });
            Storage.save();
            if (state.form && state.form.targetId === id) state.form = null;
            state.confirmDelete = null;
            this.updateModal();
            await this.refreshAndRenderCurrentFolder();
            showActionToast(t('bookmarkDeleteSuccess'), 'success');
        } catch (err) {
            showActionToast(t('bookmarkDeleteFailed'), 'error');
        } finally {
            state.pending = false;
            this.updateHeaderControls();
            this.updateModal();
        }
    },

    renderFormModal: function (form) {
        if (!form) return '';
        const isCreate = form.targetId === null;
        const isDock = this.isDockForm(form);
        const isLink = form.mode === 'edit-link' || form.mode === 'create-link';
        const isDockLink = form.mode === 'edit-dock-link' || form.mode === 'create-dock-link';
        const disabled = this.isPending() ? ' disabled aria-disabled="true"' : '';
        const titleValue = escapeHtml(form.title || '');
        const urlValue = escapeHtml(form.url || '');
        const iconValue = escapeHtml(form.icon || '');
        const currentFolderTitle = escapeHtml(this.getCurrentFolderNode()?.title || t('home'));
        const heading = isDock ? (isCreate ? t('dockCreateHeading') : t('dockEditHeading')) : (isCreate ? t('bookmarkCreateHeading') : t('bookmarkEditHeading'));
        const eyebrow = isCreate ? (isDock ? t('dockCreateAction') : t('btnAddBookmark')) : t('bookmarkEditAction');
        const subtitle = isDock
            ? (isCreate ? t('dockCreateHint') : escapeHtml(normalizeUrl(form.url) || form.url || ''))
            : (isCreate ? currentFolderTitle : (isLink ? escapeHtml(normalizeUrl(form.url) || form.url || '') : currentFolderTitle));
        const iconPreview = form.icon ? `
            <div class="bookmark-icon-preview">
                <div class="bookmark-icon-preview-tile">
                    <img src="${iconValue}" alt="${escapeHtml(t('linkIcon'))}">
                </div>
                <div class="bookmark-icon-preview-copy">${t('bookmarkIconSelected')}</div>
            </div>
        ` : '';
        const switcher = isCreate && !isDock ? `
            <div class="bookmark-modal-switcher">
                <button class="bookmark-switch-btn${form.mode === 'create-link' ? ' active' : ''}" type="button" data-action="bookmark-form-mode" data-mode="create-link"${disabled}>${t('bookmarkCreateLink')}</button>
                <button class="bookmark-switch-btn${form.mode === 'create-folder' ? ' active' : ''}" type="button" data-action="bookmark-form-mode" data-mode="create-folder"${disabled}>${t('bookmarkCreateFolder')}</button>
            </div>
        ` : '';
        const deleteAction = !isCreate ? `
            <button class="bookmark-danger-btn" type="button" data-action="bookmark-delete-request" data-id="${form.targetId}"${disabled}>${t('bookmarkDeleteAction')}</button>
        ` : '<span class="bookmark-modal-spacer"></span>';
        return `
            <div class="bookmark-modal-backdrop" data-action="bookmark-modal-close"></div>
            <div class="bookmark-modal-shell">
                <section class="bookmark-modal" role="dialog" aria-modal="true" aria-label="${heading}">
                    <button class="bookmark-modal-close" type="button" data-action="bookmark-modal-close" aria-label="${t('btnCancel')}">×</button>
                    <div class="bookmark-modal-eyebrow">${eyebrow}</div>
                    <h3 class="bookmark-modal-title">${heading}</h3>
                    <p class="bookmark-modal-subtitle">${subtitle || '&nbsp;'}</p>
                    ${switcher}
                    <form class="bookmark-modal-form" data-bookmark-form="1">
                        <label class="bookmark-form-label">
                            <span>${t('customName')}</span>
                            <input class="bookmark-form-input" type="text" value="${titleValue}" data-bookmark-input="title" autocomplete="off"${disabled}>
                        </label>
                        ${isLink || isDockLink ? `
                            <label class="bookmark-form-label">
                                <span>${t('customUrl')}</span>
                                <input class="bookmark-form-input" type="text" value="${urlValue}" data-bookmark-input="url" autocomplete="off" spellcheck="false"${disabled}>
                            </label>
                        ` : ''}
                        <label class="bookmark-form-label">
                            <span>${t('linkIcon')}</span>
                            <input class="bookmark-form-input" type="text" value="${iconValue}" data-bookmark-input="icon" autocomplete="off" spellcheck="false" placeholder="https://..."${disabled}>
                        </label>
                        ${iconPreview}
                        <div class="bookmark-icon-actions">
                            <label class="bookmark-secondary-btn bookmark-icon-upload${this.isPending() ? ' is-disabled' : ''}">
                                <input type="file" accept="image/*" data-bookmark-icon-file hidden${disabled}>
                                <span>${t('bookmarkUploadIcon')}</span>
                            </label>
                            <button class="bookmark-secondary-btn" type="button" data-action="bookmark-icon-clear"${disabled}>${t('bookmarkClearIcon')}</button>
                        </div>
                        <div class="bookmark-form-error"${form.error ? '' : ' hidden'}>${escapeHtml(form.error || '')}</div>
                        <div class="bookmark-modal-footer">
                            ${deleteAction}
                            <div class="bookmark-modal-footer-actions">
                                <button class="bookmark-secondary-btn" type="button" data-action="bookmark-modal-close"${disabled}>${t('btnCancel')}</button>
                                <button class="bookmark-primary-btn" type="submit"${disabled}>${isCreate ? (isDock ? t('dockCreateAction') : t('btnAddBookmark')) : t('btnSave')}</button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        `;
    },

    renderDeleteModal: function (confirmDelete) {
        if (!confirmDelete) return '';
        const disabled = this.isPending() ? ' disabled aria-disabled="true"' : '';
        const confirmCopy = confirmDelete.scope === 'dock'
            ? t('dockDeleteConfirm', { title: confirmDelete.title })
            : t('bookmarkDeleteConfirm', { title: confirmDelete.title });
        return `
            <div class="bookmark-modal-backdrop" data-action="bookmark-delete-cancel"></div>
            <div class="bookmark-modal-shell danger">
                <section class="bookmark-modal danger" role="dialog" aria-modal="true" aria-label="${t('bookmarkDeleteAction')}">
                    <div class="bookmark-modal-icon danger">!</div>
                    <h3 class="bookmark-modal-title">${t('bookmarkDeleteAction')}</h3>
                    <p class="bookmark-modal-copy">${escapeHtml(confirmCopy)}</p>
                    <div class="bookmark-confirm-actions">
                        <button class="bookmark-secondary-btn" type="button" data-action="bookmark-delete-cancel"${disabled}>${t('btnCancel')}</button>
                        <button class="bookmark-danger-btn" type="button" data-action="bookmark-delete-confirm" data-id="${confirmDelete.targetId}"${disabled}>${t('bookmarkDeleteAction')}</button>
                    </div>
                </section>
            </div>
        `;
    },

    renderCardActions: function (node) {
        if (!this.isEnabled()) return '';
        return `
            <button class="bookmark-card-cue bookmark-card-cue-delete" type="button" data-action="bookmark-card-delete" data-id="${node.id}" aria-label="${escapeHtml(t('bookmarkDeleteAction'))}: ${escapeHtml(node.title || node.id)}">
                <svg viewBox="0 0 24 24">
                    <path d="M5 7h14" />
                    <path d="M9 7V5h6v2" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M7 7l1 12h8l1-12" />
                </svg>
            </button>
            <button class="bookmark-card-cue" type="button" data-action="bookmark-card-edit" data-id="${node.id}" aria-label="${escapeHtml(t('bookmarkEditAction'))}: ${escapeHtml(node.title || node.id)}">
                <svg viewBox="0 0 24 24">
                    <path d="M14 5l5 5" />
                    <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z" />
                </svg>
            </button>
        `;
    },

    renderDockActions: function (index, title) {
        if (!this.isEnabled()) return '';
        return `
            <button class="bookmark-card-cue bookmark-card-cue-delete dock-card-cue dock-card-cue-delete" type="button" data-action="dock-link-delete" data-index="${index}" aria-label="${escapeHtml(t('bookmarkDeleteAction'))}: ${escapeHtml(title || String(index + 1))}">
                <svg viewBox="0 0 24 24">
                    <path d="M5 7h14" />
                    <path d="M9 7V5h6v2" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M7 7l1 12h8l1-12" />
                </svg>
            </button>
            <button class="bookmark-card-cue dock-card-cue" type="button" data-action="dock-link-edit" data-index="${index}" aria-label="${escapeHtml(t('bookmarkEditAction'))}: ${escapeHtml(title || String(index + 1))}">
                <svg viewBox="0 0 24 24">
                    <path d="M14 5l5 5" />
                    <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z" />
                </svg>
            </button>
        `;
    },

    renderDockCreateItem: function () {
        if (!this.isEnabled()) return '';
        return `
            <button class="dock-item dock-add-item" type="button" data-action="dock-link-create" aria-label="${escapeHtml(t('dockCreateAction'))}">
                <div class="ios-icon dock-add-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                </div>
            </button>
        `;
    },

    renderCard: function (node) {
        const escTitle = escapeHtml(node.title || '');
        const displayTitle = node.highlightedTitle || escTitle;
        const cue = this.renderCardActions(node);

        if (node.type === 'folder') {
            return `<div class="card${this.isEnabled() ? ' is-edit-mode' : ''}" data-fid="${node.id}" data-ftitle="${escTitle}" data-bookmark-id="${node.id}" data-bookmark-type="folder" role="listitem" tabindex="0" aria-label="${escTitle}">${cue}<div class="ios-icon folder-icon"><span class="folder-emoji">馃搨</span></div><div class="card-title">${displayTitle}</div></div>`;
        }

        const safeUrl = normalizeUrl(node.url);
        const domain = getDomain(safeUrl);
        const candidates = getFaviconCandidates(domain, node.icon || '');
        const iconUrl = candidates[0] || '';
        const candidatesAttr = escapeHtml(JSON.stringify(candidates));
        const href = safeUrl || '#';
        const disabled = safeUrl ? '' : ' aria-disabled="true" tabindex="-1"';
        const draggable = this.isEnabled() ? '' : ' draggable="true"';
        return `<a href="${href}" class="card${this.isEnabled() ? ' is-edit-mode' : ''}" target="_blank" rel="noopener"${draggable} data-bookmark-id="${node.id}" data-bookmark-type="link" role="listitem" aria-label="${escTitle}"${disabled}>${cue}<div class="ios-icon"><img class="card-icon" data-src="${iconUrl}" data-step="0" data-candidates="${candidatesAttr}" loading="lazy" decoding="async" data-url="${safeUrl}" data-title="${escTitle}"></div><div class="card-title">${displayTitle}</div></a>`;
    }
};

const scheduleIdle = window.requestIdleCallback
    ? (cb) => window.requestIdleCallback(cb, { timeout: 500 })
    : (cb) => setTimeout(cb, 1);

// Unified sidebar status helper — sets class + content on any .bg-status element
const formatStyleValue = (style, value) => {
    const num = parseInt(value, 10);
    if (!Number.isFinite(num)) return String(value ?? '');
    return `${num}${style.unit || ''}`;
};

const getActiveStylePreset = () => Object.keys(Config.STYLE_PRESETS).find((presetId) => {
    const preset = Config.STYLE_PRESETS[presetId];
    return Object.keys(preset).every((key) => parseInt(State.styles[key], 10) === parseInt(preset[key], 10));
}) || '';

const setSidebarStatus = (el, html, type = '') => {
    if (!el) return;
    el.className = `bg-status${type ? ' ' + type : ''}`;
    el.innerHTML = html || '';
};

const setBgStatus = (text, type = '') => {
    const el = $('bgStatus');
    if (!el) return;
    el.textContent = text || '';
    el.className = `bg-status${type ? ' ' + type : ''}`;
};

let bgBtnTimer = 0;
const showBgToast = (text, type = '') => {
    const btn = $('btnRefreshBg');
    if (!btn) return;
    const span = btn.querySelector('span');
    btn.classList.remove('bg-loading', 'bg-success', 'bg-error');
    if (!type) btn.classList.add('bg-loading');
    else if (type === 'success') btn.classList.add('bg-success');
    else if (type === 'error') btn.classList.add('bg-error');
    if (span && text) span.textContent = text;
    clearTimeout(bgBtnTimer);
    if (type === 'success' || type === 'error') {
        bgBtnTimer = setTimeout(() => {
            btn.classList.remove('bg-loading', 'bg-success', 'bg-error');
            if (span) span.textContent = t('btnRefreshBg');
        }, 1400);
    }
};

let actionToastTimer = 0;
const showActionToast = (text, type = '') => {
    const el = $('actionToast');
    if (!el) return;
    el.textContent = text || '';
    el.className = `action-toast show${type ? ' ' + type : ''}`;
    clearTimeout(actionToastTimer);
    actionToastTimer = setTimeout(() => {
        el.className = 'action-toast';
    }, 1400);
};

const getBgRandomCache = () => {
    try {
        return JSON.parse(localStorage.getItem('bg_random_cache') || '{}');
    } catch (e) {
        return {};
    }
};

const setBgRandomCache = (cache) => {
    localStorage.setItem('bg_random_cache', JSON.stringify(cache));
};

const getLastGoodBg = () => localStorage.getItem('bg_last_good') || '';
const setLastGoodBg = (url) => {
    if (url) localStorage.setItem('bg_last_good', url);
};

const withCacheBuster = (url, param) => {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}${param}=${Date.now()}`;
};

const getBgSourcesMap = () => {
    // Ensure the fallback (local bundled image) appears first in the list
    const map = {};
    if (Config.FALLBACK_BG) {
        map['fallback'] = { label: t('bgLocal') + ' (默认)', url: Config.FALLBACK_BG, random: false, isFallback: true };
    }
    // Add built-in presets after fallback
    Object.keys(Config.BG_SOURCES).forEach(k => map[k] = Config.BG_SOURCES[k]);
    // Add user custom sources last
    State.customBgSources.forEach(src => {
        map[`custom_${src.id}`] = {
            label: src.name,
            url: src.url,
            random: !!src.random,
            randomParam: 't',
            isCustom: true
        };
    });
    return map;
};

const resolveBgUrl = (type, forceRefresh = false) => {
    const preset = getBgSourcesMap()[type];
    if (!preset) return Config.BING_API;
    if (!preset.random) return preset.url;

    const cache = getBgRandomCache();
    if (!forceRefresh && cache[type]) return cache[type];

    const url = withCacheBuster(preset.url, preset.randomParam || 't');
    cache[type] = url;
    setBgRandomCache(cache);
    return url;
};

const applyLanguage = () => {
    document.title = t('appTitle');
    // id → i18n key 映射，统一批量设置 textContent
    const textMap = {
        settingsTitle: 'settingsTitle',
        labelAppearance: 'labelAppearance',
        labelLanguage: 'labelLanguage',
        labelBackground: 'labelBackground',
        labelCustomBg: 'labelCustomBg',
        labelSearchEngine: 'labelSearchEngine',
        labelDock: 'labelDock',
        labelImportBookmarks: 'labelImportBookmarks',
        labelExportConfig: 'labelExportConfig',
        labelImportConfig: 'labelImportConfig',
        btnAddLinkRow: 'btnAddLinkRow',
        btnAddCustomBg: 'btnAddCustomBg',
        labelHistoryToggle: 'historyToggle',
        btnClearHistory: 'clearHistory',
        btnExportConfig: 'btnExportConfig',
        exportHint: 'exportHint',
        btnReset: 'btnReset',
        btnCloseSidebarBottom: 'btnCancel',
        btnSaveSettings: 'btnSave',
        btnRefreshBg: 'btnRefreshBg'
    };
    Object.entries(textMap).forEach(([id, key]) => {
        const el = $(id);
        if (el) el.textContent = t(key);
    });
    // 含 <span> 子元素的按钮
    if ($('btnEditBookmarks')) $('btnEditBookmarks').querySelector('span').textContent = State.bookmarkEditor?.enabled ? t('btnDoneEditing') : t('btnEditBookmarks');
    if ($('btnAddBookmark')) $('btnAddBookmark').querySelector('span').textContent = t('btnAddBookmark');
    if ($('btnSyncBookmarks')) $('btnSyncBookmarks').querySelector('span').textContent = t('btnSyncBookmarks');
    if ($('btnManageBookmarks')) $('btnManageBookmarks').querySelector('span').textContent = t('btnManageBookmarks');
    if ($('searchInput')) UIManager.updateSearchPlaceholder();
    if ($('engineToggle')) UIManager.updateSearchEngineUI();
    if ($('dateLink') && $('lunarDate')) {
        const now = new Date();
        const locale = State.language === 'en' ? 'en-US' : 'zh-CN';
        $('dateLink').textContent = now.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
        $('lunarDate').textContent = State.language === 'en' ? '' : getChineseLunarDate(now);
    }
    if (typeof UIManager !== 'undefined' && $('dockContainer')) UIManager.renderDock();
    if (typeof BookmarkEditor !== 'undefined') BookmarkEditor.updateHeaderControls();
    if (typeof BookmarkEditor !== 'undefined') BookmarkEditor.updateModal();
    if (typeof BookmarkEditor !== 'undefined' && State.bookmarkEditor?.enabled && !State.isSearchMode && State.bookmarks.length && $('bookmarkGrid')) {
        UIManager.enterFolder(State.currentFolderId);
    }
};

// Debounce Utility
const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Fuzzy Match with Highlight
// Returns { matched: boolean, html: string }
const fuzzyMatchWithHighlight = (text, query) => {
    const rawText = String(text || '');
    if (!query) return { matched: true, html: escapeHtml(rawText) };

    const lowerText = rawText.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let i = 0;
    let matchedCount = 0;
    const parts = [];

    for (let j = 0; j < rawText.length; j++) {
        const safeChar = escapeHtml(rawText[j]);
        if (i < lowerQuery.length && lowerText[j] === lowerQuery[i]) {
            parts.push(`<span class="highlight">${safeChar}</span>`);
            i++;
            matchedCount++;
        } else {
            parts.push(safeChar);
        }
    }

    return {
        matched: matchedCount === lowerQuery.length,
        html: parts.join(''),
        score: matchedCount > 0 ? matchedCount / Math.max(1, rawText.length) : 0
    };
};

const toCnDay = (n) => {
    const map = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    return map[n - 1] || '';
};
const getCyclicalYear = (yearNum) => {
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const idx = ((yearNum - 1984) % 60 + 60) % 60;
    return `${stems[idx % 10]}${branches[idx % 12]}年`;
};
const getChineseLunarDate = (date) => {
    try {
        const fmt = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { year: 'numeric', month: 'long', day: 'numeric' });
        const parts = fmt.formatToParts(date);
        const yearRaw = parts.find(p => p.type === 'relatedYear')?.value || parts.find(p => p.type === 'year')?.value || '';
        const yearNum = parseInt(yearRaw, 10);
        const year = Number.isFinite(yearNum) ? getCyclicalYear(yearNum) : yearRaw;
        const month = parts.find(p => p.type === 'month')?.value || '';
        const day = parseInt(parts.find(p => p.type === 'day')?.value || '0', 10);
        return `${year} ${month} ${toCnDay(day)}`.trim();
    } catch (e) {
        return t('lunarUnsupported');
    }
};

/** Module: UI Manager */
const UIManager = {
    init: function () {
        this.setupTime();
        this.applyStyles();
        this.applySidebarWidth();
        this.applyBackground(true);
        this.updateSearchPlaceholder();
        this.updateSearchEngineUI();

        scheduleIdle(() => {
            this.renderDock();
            if (State.bookmarks.length === 0) {
                $('bookmarkGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;opacity:0.6;padding:60px;">${t('welcome')}</div>`;
                $('breadcrumb').innerHTML = `<div class="breadcrumb-item">${t('home')}</div>`;
            } else {
                this.enterFolder(this.getDefaultFolderId());
            }
            BookmarkEditor.updateHeaderControls();
        });
    },

    setupTime: function () {
        let lastMinuteKey = '';
        const tick = () => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            const key = `${h}:${m}`;
            if (key !== lastMinuteKey) {
                lastMinuteKey = key;
                $('time').textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                const locale = State.language === 'en' ? 'en-US' : 'zh-CN';
                const solar = now.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
                $('dateLink').textContent = solar;
                $('lunarDate').textContent = State.language === 'en' ? '' : getChineseLunarDate(now);
            }
        };
        const schedule = () => {
            const now = new Date();
            const ms = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
            setTimeout(() => { tick(); schedule(); }, ms);
        };
        tick(); schedule();
    },

    applyStyles: function () {
        const r = document.documentElement.style;
        const s = State.styles;
        const accentColor = `hsl(${s.accentHue} ${s.accentSaturation}% ${s.accentLightness}%)`;
        const accentSoft = `hsl(${s.accentHue} ${s.accentSaturation}% ${s.accentLightness}% / 0.2)`;
        const accentSoftStrong = `hsl(${s.accentHue} ${s.accentSaturation}% ${s.accentLightness}% / 0.35)`;
        const accentGlow = `hsl(${s.accentHue} ${s.accentSaturation}% ${s.accentLightness}% / 0.42)`;
        const accentSurface = `hsl(${s.accentHue} ${s.accentSaturation}% ${Math.min(72, s.accentLightness)}% / 0.78)`;
        const accentSurfaceStrong = `hsl(${s.accentHue} ${s.accentSaturation}% ${Math.min(78, s.accentLightness + 8)}% / 0.88)`;
        r.setProperty('--icon-size', s.iconSize + 'px');
        r.setProperty('--icon-inner-scale', s.innerScale / 100);
        r.setProperty('--card-font-size', s.fontSize + 'px');
        r.setProperty('--grid-gap', s.gridGap + 'px');
        r.setProperty('--grid-min-width', Math.max(90, s.iconSize + 30) + 'px');
        r.setProperty('--bookmark-hover-lift', s.bookmarkHoverLift + 'px');
        r.setProperty('--bookmark-hover-scale', s.bookmarkHoverScale / 100);
        r.setProperty('--bg-blur', s.bgBlur + 'px');
        r.setProperty('--bg-overlay-opacity', s.bgOverlay / 100);
        r.setProperty('--glass-blur', s.glassBlur + 'px');
        r.setProperty('--glass-radius', s.glassRadius + 'px');
        r.setProperty('--card-radius', s.cardRadius + 'px');
        r.setProperty('--accent-color', accentColor);
        r.setProperty('--accent-soft', accentSoft);
        r.setProperty('--accent-soft-strong', accentSoftStrong);
        r.setProperty('--accent-glow', accentGlow);
        r.setProperty('--accent-surface', accentSurface);
        r.setProperty('--accent-surface-strong', accentSurfaceStrong);
        this.applySidebarWidth();
    },

    applySidebarWidth: function () {
        const sidebar = $('settingsSidebar');
        if (!sidebar) return;
        const width = parseInt(State.styles.sidebarWidth, 10);
        if (Number.isFinite(width) && width > 0) {
            sidebar.style.width = width + 'px';
        }
    },

    applyBackground: function (forceRefreshRandom = false, opts = {}) {
        const c = State.bgConfig;
        const fromPreset = Config.BG_SOURCES[c.type]?.url;
        let preset = getBgSourcesMap()[c.type];
        let src = (c.type === 'url' || c.type === 'local') && c.value
            ? c.value
            : resolveBgUrl(c.type, forceRefreshRandom);
        const img = $('bg-layer');
        const silent = !!opts.silent;
        img.style.opacity = '0';
        if (!silent) {
            setBgStatus(t('bgLoading'), 'loading');
            showBgToast(t('bgLoading'));
        }
        const handleLoad = () => {
            setLastGoodBg(img.src);
            img.style.opacity = '1';
            if (!silent) {
                if (forceRefreshRandom && preset?.random) {
                    setBgStatus(t('bgRandomSelected'), 'success');
                    showBgToast(t('bgRandomSelected'), 'success');
                }
                setBgStatus(t('bgUpdated'), 'success');
                showBgToast(t('bgUpdated'), 'success');
                setTimeout(() => setBgStatus(''), 1200);
            }
        };
        const handleError = () => {
            if (!silent) {
                setBgStatus(t('bgFailed'), 'error');
                showBgToast(t('bgFailed'), 'error');
            }
            const last = getLastGoodBg();
            if (last && img.src !== last) {
                img.src = last;
                return;
            }
            // Try bundled local fallback first (user-provided `assets/default.png`), then Bing API
            if (Config.FALLBACK_BG) {
                img.src = Config.FALLBACK_BG;
                return;
            }
            if (c.type !== 'bing') img.src = Config.BING_API;
        };
        const swap = () => {
            img.onload = handleLoad;
            img.onerror = handleError;
            img.src = src;
        };
        if (src === img.src) {
            swap();
            return;
        }
        if (preset?.random) {
            swap();
            return;
        }
        const pre = new Image();
        pre.decoding = 'async';
        pre.onload = swap;
        pre.onerror = handleError;
        pre.src = src;
    },

    renderDock: function () {
        const container = $('dockContainer');
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');
        const editing = typeof BookmarkEditor !== 'undefined' && BookmarkEditor.isEnabled();

        tempDiv.innerHTML = State.quickLinks.map((i, index) => {
            // 优先使用自定义图标，其次缓存，再使用多个备用源
            const safeUrl = normalizeUrl(i.url);
            const domain = getDomain(safeUrl);
            const candidates = getFaviconCandidates(domain, i.icon || '');
            const iconUrl = candidates[0] || '';
            const candidatesAttr = escapeHtml(JSON.stringify(candidates));
            const safeTitle = escapeHtml(i.title || '');
            const href = safeUrl || '#';
            const disabled = safeUrl ? '' : ' aria-disabled="true" tabindex="-1"';
            const cue = editing ? BookmarkEditor.renderDockActions(index, i.title || i.url || String(index + 1)) : '';

            // 添加 draggable="true" 和 data-index
            return `
        <a href="${href}" class="dock-item${editing ? ' is-edit-mode' : ''}" target="_blank" rel="noopener" draggable="${editing ? 'false' : 'true'}" data-index="${index}" data-url="${safeUrl}" data-title="${safeTitle}" role="listitem" aria-label="${safeTitle}"${disabled}>
            ${cue}
            <div class="ios-icon">
                <img class="dock-icon" data-src="${iconUrl}" data-step="0" data-candidates="${candidatesAttr}" decoding="async" data-url="${safeUrl}" data-title="${safeTitle}">
            </div>
        </a>`;
        }).join('') + (editing ? BookmarkEditor.renderDockCreateItem() : '');

        while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
        }

        container.innerHTML = '';
        container.appendChild(fragment);
        bindIconEvents(container);
    },

    getDefaultFolderId: function () {
        const roots = (State.bookmarks || []).filter(n => n && n.type === 'folder');
        if (!roots.length) return 'root';
        const normalize = (s) => String(s || '').trim().toLowerCase();
        const preferredTitles = new Set([
            'bookmarks bar',
            'bookmark bar',
            'bookmarks toolbar',
            'favorites bar',
            '书签栏',
            '收藏夹栏'
        ].map(normalize));
        const exact = roots.find(f => preferredTitles.has(normalize(f.title)));
        if (exact) return exact.id;
        if (roots.length === 1) return roots[0].id;
        let best = roots[0];
        let max = (best.children || []).length;
        roots.forEach(f => {
            const len = (f.children || []).length;
            if (len > max) {
                max = len;
                best = f;
            }
        });
        return best?.id || 'root';
    },

    getFolderPath: function (fid) {
        const walk = (nodes, path = []) => {
            for (const n of nodes || []) {
                if (!n || n.type !== 'folder') continue;
                if (n.id === fid) return [...path, n];
                if (n.children && n.children.length) {
                    const res = walk(n.children, [...path, n]);
                    if (res) return res;
                }
            }
            return null;
        };
        return walk(State.bookmarks) || [];
    },

    enterFolder: function (fid) {
        const prevFolderId = State.currentFolderId;
        if (prevFolderId !== fid && State.bookmarkEditor?.form) {
            State.bookmarkEditor.form = null;
        }
        State.currentFolderId = fid;
        let items = State.bookmarks;

        if (fid === 'root') {
            State.breadcrumbPath = [{ id: 'root', title: t('home') }];
        } else {
            const path = this.getFolderPath(fid);
            const folder = path.length ? path[path.length - 1] : null;
            if (folder) {
                items = folder.children || [];
                State.breadcrumbPath = [{ id: 'root', title: t('home') }].concat(
                    path.map(n => ({ id: n.id, title: n.title }))
                );
            } else {
                State.currentFolderId = 'root';
                items = State.bookmarks;
                State.breadcrumbPath = [{ id: 'root', title: t('home') }];
            }
        }
        this.renderBreadcrumb();
        this.renderGrid(items);
        BookmarkEditor.updateHeaderControls();
    },

    renderBreadcrumb: function () {
        $('breadcrumb').innerHTML = State.breadcrumbPath.map((it, i) =>
            `<div class="breadcrumb-item" data-idx="${i}" role="link" tabindex="0" aria-label="${escapeHtml(it.title)}">${it.title}</div>${i !== State.breadcrumbPath.length - 1 ? '<span class="breadcrumb-separator">/</span>' : ''}`
        ).join('');
    },

    renderGrid: function (items, isSearch = false) {
        const grid = $('bookmarkGrid');
        if (!items || !items.length) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;opacity:0.5;padding:20px;">${isSearch ? t('noResults') : t('emptyFolder')}</div>`;
            return;
        }

        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');

        tempDiv.innerHTML = items.map(i => BookmarkEditor.renderCard(i)).join('');
        /*
        } else { /* legacy rendering path removed
            const escTitle = escapeHtml(i.title || '');
            // Use highlighted title if available (from search), otherwise raw title
            const displayTitle = i.highlightedTitle || escTitle;

            if (i.type === 'folder') {
                return `<div class="card" data-fid="${i.id}" data-ftitle="${escTitle}" role="listitem" tabindex="0" aria-label="${escTitle}"><div class="ios-icon folder-icon"><span class="folder-emoji">📂</span></div><div class="card-title">${displayTitle}</div></div>`;
            }
            // Added draggable="true" here
            const safeUrl = normalizeUrl(i.url);
            const domain = getDomain(safeUrl);
            const candidates = getFaviconCandidates(domain, i.icon || '');
            const iconUrl = candidates[0] || '';
            const candidatesAttr = escapeHtml(JSON.stringify(candidates));
            const href = safeUrl || '#';
            const disabled = safeUrl ? '' : ' aria-disabled="true" tabindex="-1"';
            return `<a href="${href}" class="card" target="_blank" rel="noopener" draggable="true" role="listitem" aria-label="${escTitle}"${disabled}><div class="ios-icon"><img class="card-icon" data-src="${iconUrl}" data-step="0" data-candidates="${candidatesAttr}" loading="lazy" decoding="async" data-url="${safeUrl}" data-title="${escTitle}"></div><div class="card-title">${displayTitle}</div></a>`;
            }).join('');
        */

        while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
        }

        grid.innerHTML = '';
        grid.appendChild(fragment);
        items.filter((item) => item.type === 'folder' && item.icon).forEach((item) => {
            const folderIcon = grid.querySelector(`.card[data-bookmark-id="${item.id}"] .folder-icon`);
            if (!folderIcon) return;
            folderIcon.classList.add('has-custom-icon');
            folderIcon.innerHTML = `<img class="card-icon custom-folder-icon loaded" src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.title || 'Folder')}">`;
        });
        bindIconEvents(grid);
    },

    updateSearchPlaceholder: function () {
        $('searchInput').placeholder = t('searchPlaceholder', { engine: Config.ENGINES[State.currentEngine].name });
    },

    updateSearchEngineUI: function () {
        const toggle = $('engineToggle');
        const nameEl = $('engineName');
        const menu = $('engineMenu');
        if (!toggle || !nameEl || !menu) return;
        const current = Config.ENGINES[State.currentEngine] || Config.ENGINES.google;
        nameEl.textContent = current.name;
        toggle.setAttribute('aria-label', t('searchEngineAria', { engine: current.name }));
        menu.setAttribute('aria-label', t('searchEngineMenu'));
        menu.innerHTML = Object.keys(Config.ENGINES).map(k => {
            const isActive = k === State.currentEngine;
            return `
                <button class="engine-item${isActive ? ' active' : ''}" type="button" role="option" aria-selected="${isActive}" data-engine="${k}">
                    <span class="engine-item-name">${Config.ENGINES[k].name}</span>
                    <span class="engine-check">${isActive ? '✓' : ''}</span>
                </button>
            `;
        }).join('');
    },

    generateAvatar: function (parent, title) {
        if (parent.querySelector('.letter-avatar')) return;
        const div = document.createElement('div');
        div.className = 'letter-avatar';
        div.textContent = (title || "A").trim().charAt(0).toUpperCase();
        let hash = 0;
        for (let i = 0; i < (title || "").length; i++) hash = (title || "").charCodeAt(i) + ((hash << 5) - hash);
        div.style.background = `linear-gradient(135deg, hsl(${hash % 360},70%,60%), hsl(${(hash + 40) % 360},70%,50%))`;
        parent.appendChild(div);
        // Trigger reflow to ensure transition plays
        void div.offsetWidth;
        div.classList.add('loaded');
    }
};

/** Constants: Search History */
const SEARCH_HISTORY_MAX_SAVE = 10;
const SEARCH_HISTORY_MAX_SHOW = 6;

/** Module: Suggestion Manager (API & Rendering) */
const SuggestionManager = {
    _reqId: 0,
    _timer: 0,
    resolveProvider: function () {
        if (State.currentEngine === 'baidu' || State.currentEngine === 'sogou') return 'baidu';
        if (State.currentEngine === 'duckduckgo' || State.currentEngine === 'yandex') return 'google';
        if (State.currentEngine === 'bing') return 'bing';
        return State.currentEngine === 'google' ? 'google' : 'baidu';
    },
    getSuggestUrl: function (engineKey, query) {
        const q = encodeURIComponent(query);
        if (engineKey === 'google') {
            return `https://suggestqueries.google.com/complete/search?client=firefox&q=${q}`;
        }
        if (engineKey === 'bing') {
            return `https://www.bing.com/osjson.aspx?query=${q}`;
        }
        if (engineKey === 'baidu') {
            return `https://suggestion.baidu.com/su?wd=${q}&cb=bdcb`;
        }
        if (engineKey === 'sogou') {
            return `https://www.sogou.com/suggnew/ajajjson?key=${q}&type=web&callback=sogoucb`;
        }
        if (engineKey === 'duckduckgo') {
            return `https://duckduckgo.com/ac/?q=${q}&type=list`;
        }
        if (engineKey === 'yandex') {
            return `https://suggest.yandex.com/suggest-ff.cgi?part=${q}&uil=zh`;
        }
        return '';
    },
    parseTextSuggestions: function (engineKey, text) {
        if (!text) return [];
        if (engineKey === 'sogou') {
            const objStart = text.indexOf('{');
            const objEnd = text.lastIndexOf('}');
            if (objStart !== -1 && objEnd > objStart) {
                const slice = text.slice(objStart, objEnd + 1);
                try {
                    const obj = JSON.parse(slice);
                    if (Array.isArray(obj?.s)) return obj.s;
                } catch { }
            }
        }
        const objStart = text.indexOf('{');
        const objEnd = text.lastIndexOf('}');
        if (objStart !== -1 && objEnd > objStart) {
            const slice = text.slice(objStart, objEnd + 1);
            try {
                const obj = JSON.parse(slice);
                if (Array.isArray(obj?.s)) return obj.s;
            } catch { }
        }
        const arrStart = text.indexOf('[');
        const arrEnd = text.lastIndexOf(']');
        if (arrStart !== -1 && arrEnd > arrStart) {
            const slice = text.slice(arrStart, arrEnd + 1);
            try {
                const arr = JSON.parse(slice);
                return Array.isArray(arr) ? arr : [];
            } catch { }
        }
        return [];
    },
    fetchViaBackground: function (url, responseType) {
        return new Promise((resolve, reject) => {
            if (!isExtensionContext() || !chrome?.runtime?.sendMessage) {
                reject(new Error('no-background'));
                return;
            }
            chrome.runtime.sendMessage({ type: 'suggest_fetch', url, responseType }, (resp) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                if (!resp || !resp.ok) {
                    reject(new Error(resp?.error || 'suggest_fetch'));
                    return;
                }
                resolve(resp.data);
            });
        });
    },
    addHistory: function (text) {
        if (!State.searchHistoryEnabled) return;
        const q = (text || '').trim();
        if (!q || q.startsWith('/')) return;
        const list = State.searchHistory || [];
        const next = [q, ...list.filter(x => x !== q)].slice(0, SEARCH_HISTORY_MAX_SAVE);
        State.searchHistory = next;
        Storage.save();
    },

    renderHistory: function () {
        if (!State.searchHistoryEnabled) {
            this.clear();
            return;
        }
        const list = (State.searchHistory || []).slice(0, SEARCH_HISTORY_MAX_SHOW);
        if (!list.length) {
            this.clear();
            return;
        }
        this.render(list, t('history'));
    },

    removeHistory: function (text, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const q = (text || '').trim();
        State.searchHistory = (State.searchHistory || []).filter(x => x !== q);
        Storage.save();
        // 在建议框顶部内联显示反馈，比弹出右上角 toast 更贴近操作位置
        const box = $('suggestionBox');
        if (box && box.classList.contains('active')) {
            const fb = document.createElement('div');
            fb.className = 'suggestion-feedback';
            fb.textContent = t('historyItemRemoved');
            box.prepend(fb);
            setTimeout(() => { fb.remove(); this.renderHistory(); }, 900);
        } else {
            this.renderHistory();
        }
    },

    fetch: function (query) {
        const providerKey = this.resolveProvider();
        const url = this.getSuggestUrl(providerKey, query);
        if (!url) return;

        this._reqId += 1;
        const reqId = this._reqId;
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            if (reqId === this._reqId) this.clear();
        }, 1200);

        const useBackground = providerKey === 'baidu';
        const responseType = providerKey === 'baidu' ? 'text' : 'json';
        const run = useBackground && isExtensionContext()
            ? this.fetchViaBackground(url, responseType)
            : fetch(url).then((res) => {
                if (!res.ok) throw new Error('suggest');
                return responseType === 'text' ? res.text() : res.json();
            });

        run.then((data) => {
            if (reqId !== this._reqId) return;
            clearTimeout(this._timer);
            this.processData(providerKey, data);
        }).catch((err) => {
            // If a CORS/network error happened and background proxy is available, retry via background
            if (!useBackground && isExtensionContext && isExtensionContext() && typeof this.fetchViaBackground === 'function') {
                this.fetchViaBackground(url, responseType).then((data) => {
                    if (reqId !== this._reqId) return;
                    clearTimeout(this._timer);
                    this.processData(providerKey, data);
                }).catch(() => { if (reqId === this._reqId) this.clear(); });
                return;
            }
            if (reqId === this._reqId) this.clear();
        });
    },

    processData: function (engine, data) {
        let results = [];
        try {
            if (engine === 'google') results = data[1];
            else if (engine === 'bing') results = data[1];
            else if (engine === 'baidu') results = typeof data === 'string' ? this.parseTextSuggestions(engine, data) : data.s;
            else if (engine === 'sogou') results = typeof data === 'string' ? this.parseTextSuggestions(engine, data) : data[1];
            else if (engine === 'duckduckgo') results = Array.isArray(data) ? data.map(i => i.phrase || i).filter(Boolean) : [];
            else if (engine === 'yandex') results = Array.isArray(data?.[1]) ? data[1] : [];
        } catch (e) {
            results = [];
        }

        this.render(results.slice(0, 6), Config.ENGINES[State.currentEngine].name); // Limit to 6
    },

    render: function (list, sourceLabel = '') {
        const normalized = (list || []).map(item => {
            if (typeof item === 'string') return { text: item, source: sourceLabel || Config.ENGINES[State.currentEngine].name };
            return { text: item.text || '', source: item.source || sourceLabel || Config.ENGINES[State.currentEngine].name };
        });
        State.suggestions = normalized.map(i => i.text);
        State.selectedSuggestionIndex = -1;
        const box = $('suggestionBox');
        clearTimeout(this._timer);

        if (!normalized.length) {
            box.classList.remove('active');
            $('searchInput').setAttribute('aria-expanded', 'false');
            return;
        }

        const isHistory = sourceLabel === t('history');
        box.innerHTML = normalized.map((item, idx) => {
            const safeText = escapeHtml(item.text);
            return `
                    <div class="suggestion-item" role="option" aria-selected="false" data-idx="${idx}" data-text="${safeText}">
                        <span>${safeText}</span>
                        <span class="suggestion-source">${escapeHtml(item.source)}</span>
                        ${isHistory ? `<button class=\"btn-icon\" style=\"width:26px;height:26px;margin:0 0 0 8px;\" aria-label=\"remove\" data-action=\"remove-history\" data-text=\"${safeText}\">×</button>` : ''}
                    </div>
                `;
        }).join('');
        box.classList.add('active');
        $('searchInput').setAttribute('aria-expanded', 'true');
    },

    select: function (text) {
        $('searchInput').value = text;
        $('suggestionBox').classList.remove('active');
        this.addHistory(text);
        window.open(Config.ENGINES[State.currentEngine].url + encodeURIComponent(text), '_blank');
    },

    clear: function () {
        $('suggestionBox').classList.remove('active');
        State.suggestions = [];
        $('searchInput').setAttribute('aria-expanded', 'false');
    },

    handleKeyNavigation: function (e) {
        const box = $('suggestionBox');
        if (!box.classList.contains('active')) return;

        const items = $$('.suggestion-item');
        if (e.key === 'ArrowDown' || e.key === 'Tab') {
            e.preventDefault();
            const dir = e.shiftKey && e.key === 'Tab' ? -1 : 1;
            State.selectedSuggestionIndex = (State.selectedSuggestionIndex + dir + items.length) % items.length;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            State.selectedSuggestionIndex = (State.selectedSuggestionIndex - 1 + items.length) % items.length;
        } else if (e.key === 'Enter' && State.selectedSuggestionIndex >= 0) {
            e.preventDefault();
            this.select(State.suggestions[State.selectedSuggestionIndex]);
            return;
        } else {
            return;
        }

        const shouldAutofill = (e.key === 'ArrowDown' || e.key === 'ArrowUp');
        items.forEach((item, idx) => {
            if (idx === State.selectedSuggestionIndex) {
                item.classList.add('selected');
                item.setAttribute('aria-selected', 'true');
                if (shouldAutofill) {
                    $('searchInput').value = State.suggestions[idx];
                }
            } else {
                item.classList.remove('selected');
                item.setAttribute('aria-selected', 'false');
            }
        });
    }
};

/** Module: Storage */
const Storage = {
    load: function () {
        const applyData = (data) => {
            const get = (k) => data?.[k] ?? null;
            State.bookmarkCustomIcons = get('my_bookmark_icon_map') || {};
            State.bookmarks = applyBookmarkCustomIcons(get('my_bookmarks') || [], State.bookmarkCustomIcons);
            State.quickLinks = get('my_quicklinks') || Config.DEFAULT_LINKS;
            State.styles = { ...State.styles, ...(get('my_style_config') || {}) };
            State.bgConfig = get('my_bg_config') || State.bgConfig;
            State.currentEngine = data?.my_search_engine || 'google';
            State.language = data?.my_lang || 'zh';
            State.customBgSources = get('my_custom_bg_sources') || [];
            State.searchHistory = get('my_search_history') || [];
            State.searchHistoryEnabled = data?.my_search_history_enabled !== false && data?.my_search_history_enabled !== 'false';
        };

        const useChromeStorage = isExtensionContext() && chrome.storage && chrome.storage.local;
        const afterBaseLoad = (resolve) => {
            const shouldLoadBookmarks = (!State.bookmarks || State.bookmarks.length === 0) && isExtensionContext() && chrome.bookmarks;
            if (!shouldLoadBookmarks) {
                resolve();
                return;
            }

            fetchBookmarksFromChrome().then((bookmarks) => {
                State.bookmarks = applyBookmarkCustomIcons(bookmarks || []);
                resolve();
            }).catch(() => resolve());
        };

        return new Promise((resolve) => {
            // Helper: map init-config.json keys to internal storage keys and persist
            const loadFromInitAndApply = (initData, storageType) => {
                const mapped = {
                    my_bookmarks: initData.bookmarks || [],
                    my_quicklinks: initData.quickLinks || [],
                    my_style_config: initData.styles || {},
                    my_bg_config: initData.bgConfig || {},
                    my_search_engine: initData.currentEngine || initData.searchEngine || 'google',
                    my_lang: initData.language || 'zh',
                    my_custom_bg_sources: initData.customBgSources || [],
                    my_bookmark_icon_map: initData.bookmarkCustomIcons || {},
                    my_search_history: initData.searchHistory || [],
                    my_search_history_enabled: initData.searchHistoryEnabled !== false && initData.searchHistoryEnabled !== 'false'
                };

                if (storageType === 'chrome') {
                    // Persist into chrome.storage and mark initialized
                    chrome.storage.local.set(Object.assign({}, mapped, { initialized_v1: true }), () => {
                        applyData(mapped);
                        afterBaseLoad(resolve);
                    });
                } else {
                    try {
                        localStorage.setItem('my_bookmarks', JSON.stringify(mapped.my_bookmarks));
                        localStorage.setItem('my_quicklinks', JSON.stringify(mapped.my_quicklinks));
                        localStorage.setItem('my_style_config', JSON.stringify(mapped.my_style_config));
                        localStorage.setItem('my_bg_config', JSON.stringify(mapped.my_bg_config));
                        localStorage.setItem('my_search_engine', mapped.my_search_engine);
                        localStorage.setItem('my_lang', mapped.my_lang);
                        localStorage.setItem('my_custom_bg_sources', JSON.stringify(mapped.my_custom_bg_sources));
                        localStorage.setItem('my_bookmark_icon_map', JSON.stringify(mapped.my_bookmark_icon_map));
                        localStorage.setItem('my_search_history', JSON.stringify(mapped.my_search_history || []));
                        localStorage.setItem('my_search_history_enabled', String(!!mapped.my_search_history_enabled));
                        localStorage.setItem('initialized_v1', 'true');
                    } catch (e) { /* ignore storage errors */ }
                    applyData(mapped);
                    afterBaseLoad(resolve);
                }
            };

            if (useChromeStorage) {
                // If not initialized, load defaults from init-config.json and persist to chrome.storage
                chrome.storage.local.get(['initialized_v1'], (d) => {
                    if (!d || !d.initialized_v1) {
                        fetch(new URL('init-config.json', location.href).toString()).then(r => {
                            if (!r.ok) throw new Error('init-config not found: ' + r.status);
                            return r.json();
                        }).then(cfg => {
                            console.info('init-config.json loaded and applied (chrome)');
                            loadFromInitAndApply(cfg, 'chrome');
                        }).catch((err) => {
                            console.warn('failed to load init-config.json (chrome):', err);
                            chrome.storage.local.get(null, (data) => { applyData(data || {}); afterBaseLoad(resolve); });
                        });
                    } else {
                        chrome.storage.local.get(null, (data) => { applyData(data || {}); afterBaseLoad(resolve); });
                    }
                });
            } else {
                // Local (non-extension) mode
                const getLocal = (k) => {
                    try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; }
                };
                const buildLocalData = () => ({
                    my_bookmarks: getLocal('my_bookmarks'),
                    my_quicklinks: getLocal('my_quicklinks'),
                    my_style_config: getLocal('my_style_config'),
                    my_bg_config: getLocal('my_bg_config'),
                    my_search_engine: localStorage.getItem('my_search_engine') || 'google',
                    my_lang: localStorage.getItem('my_lang') || 'zh',
                    my_custom_bg_sources: getLocal('my_custom_bg_sources'),
                    my_bookmark_icon_map: getLocal('my_bookmark_icon_map'),
                    my_search_history: getLocal('my_search_history'),
                    my_search_history_enabled: localStorage.getItem('my_search_history_enabled')
                });
                if (!localStorage.getItem('initialized_v1')) {
                    fetch(new URL('init-config.json', location.href).toString()).then(r => {
                        if (!r.ok) throw new Error('init-config not found: ' + r.status);
                        return r.json();
                    }).then(cfg => {
                        console.info('init-config.json loaded and applied (local)');
                        loadFromInitAndApply(cfg, 'local');
                    }).catch((err) => {
                        console.warn('failed to load init-config.json (local):', err);
                        applyData(buildLocalData());
                        afterBaseLoad(resolve);
                    });
                } else {
                    applyData(buildLocalData());
                    afterBaseLoad(resolve);
                }
            }
        });
    },
    _saveTimer: 0,
    save: async function () {
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => { this._doSave(); }, 300);
    },
    saveNow: function () {
        clearTimeout(this._saveTimer);
        return this._doSave();
    },
    _doSave: function () {
        const data = {
            my_bookmarks: State.bookmarks,
            my_quicklinks: State.quickLinks,
            my_style_config: State.styles,
            my_bg_config: State.bgConfig,
            my_search_engine: State.currentEngine,
            my_lang: State.language,
            my_custom_bg_sources: State.customBgSources,
            my_bookmark_icon_map: State.bookmarkCustomIcons,
            my_search_history: State.searchHistory,
            my_search_history_enabled: String(State.searchHistoryEnabled)
        };

        if (isExtensionContext() && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.set(data, () => resolve());
            });
        } else {
            localStorage.setItem('my_bookmarks', JSON.stringify(State.bookmarks));
            localStorage.setItem('my_quicklinks', JSON.stringify(State.quickLinks));
            localStorage.setItem('my_style_config', JSON.stringify(State.styles));
            localStorage.setItem('my_bg_config', JSON.stringify(State.bgConfig));
            localStorage.setItem('my_search_engine', State.currentEngine);
            localStorage.setItem('my_lang', State.language);
            localStorage.setItem('my_custom_bg_sources', JSON.stringify(State.customBgSources));
            localStorage.setItem('my_bookmark_icon_map', JSON.stringify(State.bookmarkCustomIcons));
            localStorage.setItem('my_search_history', JSON.stringify(State.searchHistory));
            localStorage.setItem('my_search_history_enabled', String(State.searchHistoryEnabled));
            return Promise.resolve();
        }
    },
    export: function () {
        const data = {
            bookmarks: State.bookmarks,
            bookmarkCustomIcons: State.bookmarkCustomIcons,
            quickLinks: State.quickLinks,
            styles: State.styles,
            bgConfig: State.bgConfig,
            currentEngine: State.currentEngine,
            language: State.language,
            customBgSources: State.customBgSources,
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `new-tab-config-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },
    importFromFile: function (file) {
        if (!file) return;
        const status = $('configImportStatus');
        const r = new FileReader();
        r.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                State.bookmarkCustomIcons = data.bookmarkCustomIcons || {};
                State.bookmarks = applyBookmarkCustomIcons(data.bookmarks || [], State.bookmarkCustomIcons);
                State.quickLinks = data.quickLinks || Config.DEFAULT_LINKS;
                State.styles = { ...State.styles, ...(data.styles || {}) };
                State.bgConfig = data.bgConfig || State.bgConfig;
                State.currentEngine = data.currentEngine || 'google';
                State.language = data.language || State.language;
                State.customBgSources = data.customBgSources || State.customBgSources;
                this.saveNow();

                UIManager.applyStyles();
                UIManager.applyBackground();
                UIManager.renderDock();
                applyLanguage();
                UIManager.updateSearchPlaceholder();
                if (State.bookmarks.length) {
                    UIManager.enterFolder(UIManager.getDefaultFolderId());
                } else {
                    $('bookmarkGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;opacity:0.6;padding:60px;">${t('welcome')}</div>`;
                    $('breadcrumb').innerHTML = `<div class="breadcrumb-item">${t('home')}</div>`;
                }

                if ($('settingsSidebar').classList.contains('open')) SettingsManager.render();

                if (status) setSidebarStatus(status, t('importSuccess'), 'success');
            } catch (err) {
                if (status) setSidebarStatus(status, t('importInvalid'), 'error');
            }
        };
        r.readAsText(file);
    },
    reset: function () {
        if (confirm(t('confirmReset')) && confirm(t('confirmResetHard'))) {
            if (isExtensionContext() && chrome.storage && chrome.storage.local) {
                chrome.storage.local.clear(() => location.reload());
            } else {
                localStorage.clear();
                location.reload();
            }
        }
    }
};

/** Module: Global Icon Handlers */
window.checkIcon = function (img, url, title) {
    if (img.dataset.state === "failed") return;
    const w = img.naturalWidth, s = parseInt(img.dataset.step || "0");
    if (w === 0 || (s === 0 && w < 32) || (s === 1 && w < 16)) {
        window.handleIconError(img, url, title);
        return;
    }
    img.dataset.state = "loaded";
    img.classList.add("loaded");
    clearIconTimeout(img);
    const domain = getDomain(url);
    const src = img.currentSrc || img.src;
    cacheFavicon(domain, src);
    clearFaviconFailure(domain, src);
};
window.handleIconError = function (img, url, title) {
    if (img.dataset.state === "failed") return;
    const domain = getDomain(url);
    const candidates = (() => {
        try {
            return JSON.parse(img.dataset.candidates || '[]');
        } catch {
            return [];
        }
    })();
    const step = parseInt(img.dataset.step || "0") + 1;
    img.dataset.step = step;

    const failedUrl = candidates[step - 1];
    if (failedUrl) recordFaviconFailure(domain, failedUrl);

    if (candidates[step]) {
        img.src = candidates[step];
        startIconTimeout(img);
        return;
    }

    img.dataset.state = "failed";
    if (domain) FAILED_FAVICONS.add(domain);
    UIManager.generateAvatar(img.parentElement, title);
    img.remove();
};

/** Module: Settings Manager */
const SettingsManager = {
    toggle: function (open) {
        const sidebar = $('settingsSidebar');
        if (open) {
            // display:none → flex，然后下帧触发 transform 过渡（否则浏览器会合并跳过动画）
            sidebar.style.display = 'flex';
            sidebar.style.willChange = 'transform';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sidebar.classList.add('open');
                });
            });
            $('sidebarBackdrop').classList.add('open');
            $('mainWrapper').classList.add('sidebar-open');
            this.render();
            UIManager.applySidebarWidth();
        } else {
            sidebar.style.willChange = 'transform';
            sidebar.classList.remove('open');
            $('sidebarBackdrop').classList.remove('open');
            $('mainWrapper').classList.remove('sidebar-open');
            // 过渡结束后才 display:none，彻底停止 backdrop-filter 合成
            const onEnd = (e) => {
                if (e.propertyName !== 'transform') return;
                sidebar.style.display = 'none';
                sidebar.style.willChange = '';
                sidebar.removeEventListener('transitionend', onEnd);
            };
            sidebar.addEventListener('transitionend', onEnd);
            Storage.load().then(() => { applyLanguage(); UIManager.applyStyles(); UIManager.applyBackground(false, { silent: true }); UIManager.renderDock(); UIManager.updateSearchPlaceholder(); });
        }
    },

    render: function () {
        const activePreset = getActiveStylePreset();
        const presetButtons = Object.keys(Config.STYLE_PRESETS).map((id) => `
                <button class="appearance-preset-btn${activePreset === id ? ' active' : ''}" type="button" data-preset="${id}">${t(`appearance.preset${id.charAt(0).toUpperCase() + id.slice(1)}`)}</button>
        `).join('');
        const groupedControls = Config.STYLE_GROUPS.map((group) => {
            const items = Config.STYLES.filter((style) => style.group === group.id).map((style) => `
                <label class="range-container">
                    <div class="range-meta">
                        <span class="range-label">${t(style.labelKey)}</span>
                        <span class="range-value" data-style-value="${style.id}">${formatStyleValue(style, State.styles[style.id])}</span>
                    </div>
                    <input type="range" min="${style.min}" max="${style.max}" step="${style.step || 1}" value="${State.styles[style.id]}" data-style="${style.id}">
                </label>
            `).join('');
            return `
                <section class="appearance-section">
                    <div class="appearance-section-title">${t(group.titleKey)}</div>
                    ${items}
                </section>
            `;
        }).join('');
        $('appearanceControls').innerHTML = `
            <div class="appearance-presets">
                <div class="appearance-section-title">${t('appearance.presets')}</div>
                <div class="appearance-preset-grid">${presetButtons}</div>
            </div>
            ${groupedControls}
        `;

        // Language
        $('languageGrid').innerHTML = [
            { v: 'zh', l: t('langZh') },
            { v: 'en', l: t('langEn') }
        ].map(l => `
                    <label><input type="radio" name="lang" value="${l.v}" ${State.language === l.v ? 'checked' : ''}><div class="engine-option-label">${l.l}</div></label>`
        ).join('');

        // Engines
        $('engineGrid').innerHTML = Object.keys(Config.ENGINES).map(k => `
                    <label><input type="radio" name="eng" value="${k}" ${State.currentEngine === k ? 'checked' : ''}><div class="engine-option-label">${Config.ENGINES[k].name}</div></label>`
        ).join('');

        const historyToggle = $('toggleHistory');
        if (historyToggle) historyToggle.checked = !!State.searchHistoryEnabled;

        const dockLabel = $('labelDock');
        if (dockLabel) {
            const dockGroup = dockLabel.closest('.setting-group');
            if (dockGroup) dockGroup.remove();
        }

        // Backgrounds
        const sourcesMap = getBgSourcesMap();
        const types = [
            ...Object.keys(sourcesMap).filter(k => !sourcesMap[k].hidden).map(k => ({ v: k, l: sourcesMap[k].labelKey ? t(sourcesMap[k].labelKey) : sourcesMap[k].label })),
            { v: 'url', l: t('bgUrl') },
            { v: 'local', l: t('bgLocal') }
        ];
        $('bgTypeRadios').innerHTML = types.map(t =>
            `<label><input type="radio" name="bgT" value="${t.v}" ${State.bgConfig.type === t.v ? 'checked' : ''}><span class="engine-option-label">${t.l}</span></label>`
        ).join('');
        this.setBgType(State.bgConfig.type);

        this.renderCustomBg();

        $$('#appearanceControls input[type="range"]').forEach((input) => {
            input.addEventListener('input', (e) => {
                const key = e.target.dataset.style;
                if (key) SettingsManager.updateStyle(key, e.target.value);
            });
        });
        $$('#appearanceControls [data-preset]').forEach((btn) => {
            btn.addEventListener('click', (e) => SettingsManager.applyStylePreset(e.currentTarget.dataset.preset));
        });

        $$('#bgTypeRadios input[name="bgT"]').forEach((input) => {
            input.addEventListener('change', (e) => SettingsManager.setBgType(e.target.value));
        });
    },

    renderCustomBg: function () {
        const wrap = $('customBgEditor');
        if (!wrap) return;
        wrap.innerHTML = '';
        State.customBgSources.forEach((s) => {
            const row = document.createElement('div');
            row.className = 'custom-bg-row';
            row.dataset.id = s.id;
            const safePreviewUrl = escapeHtml(normalizeUrl(s.url || '') || '');
            const previewStyle = safePreviewUrl ? `background-image:url('${safePreviewUrl}')` : '';
            row.innerHTML = `
                        <div class="custom-preview" style="${previewStyle}"></div>
                        <div class="custom-inputs">
                            <input class="link-input" type="text" value="${s.name || ''}" placeholder="${t('customName')}">
                            <input class="link-input" type="text" value="${s.url || ''}" placeholder="${t('customUrl')}">
                        </div>
                        <div class="custom-controls">
                            <label class="custom-random"><input type="checkbox" ${s.random ? 'checked' : ''}>${t('customRandom')}</label>
                            <div class="control-buttons">
                                <button class="btn btn-secondary use-bg-btn" data-id="${s.id}">使用</button>
                                <button class="btn-icon" data-action="remove-row">×</button>
                            </div>
                        </div>
                    `;
            wrap.appendChild(row);
        });
    },

    updateStyle: function (key, val) {
        State.styles[key] = parseInt(val);
        UIManager.applyStyles();
        const style = Config.STYLES.find((item) => item.id === key);
        const valueEl = document.querySelector(`[data-style-value="${key}"]`);
        if (style && valueEl) valueEl.textContent = formatStyleValue(style, State.styles[key]);
    },

    applyStylePreset: function (presetId) {
        const preset = Config.STYLE_PRESETS[presetId];
        if (!preset) return;
        State.styles = { ...State.styles, ...preset };
        UIManager.applyStyles();
        this.render();
    },

    setBgType: function (type) {
        const area = $('bgInputArea');
        State.tempBgValue = null;
        const sourcesMap = getBgSourcesMap();
        if (type === 'url') {
            area.innerHTML = `<input type="text" id="bgUrlInput" class="link-input" placeholder="URL" value="${State.bgConfig.type === 'url' ? State.bgConfig.value : ''}">`;
            $('bgUrlInput').oninput = e => {
                State.tempBgValue = e.target.value;
                setBgStatus(t('bgLoading'), 'loading');
                $('bg-layer').src = e.target.value;
            };
        } else if (type === 'local') {
            area.innerHTML = `<input type="file" id="bgFileInput" accept="image/*">`;
            $('bgFileInput').onchange = e => {
                const f = e.target.files[0];
                if (f && f.size <= 3e6) {
                    const r = new FileReader();
                    r.onload = ev => {
                        State.tempBgValue = ev.target.result;
                        setBgStatus(t('bgLoading'), 'loading');
                        $('bg-layer').src = ev.target.result;
                    };
                    r.readAsDataURL(f);
                } else showActionToast(t('imageTooLarge'), 'error');
            };
        } else if (sourcesMap[type]) {
            area.innerHTML = '';
            State.tempBgValue = sourcesMap[type].url;
            if (sourcesMap[type].random) {
                setBgStatus('');
            } else {
                setBgStatus(t('bgLoading'), 'loading');
                $('bg-layer').src = sourcesMap[type].url;
            }
        } else {
            area.innerHTML = '';
            State.tempBgValue = Config.BING_API;
            setBgStatus(t('bgLoading'), 'loading');
            $('bg-layer').src = Config.BING_API;
        }
    },

    addLinkRow: function (d = { title: '', url: '', icon: '' }) {
        const div = document.createElement('div'); div.className = 'link-editor-row';
        div.innerHTML = `<input class="link-input" style="width:25%" value="${d.title}" placeholder="${t('linkName')}"><input class="link-input" style="flex:1" value="${d.url}" placeholder="${t('linkUrl')}"><input class="link-input" style="width:25%" value="${d.icon}" placeholder="${t('linkIcon')}"><button class="btn-icon" data-action="remove-row">×</button>`;
        $('quickLinksEditor').appendChild(div);
    },

    addCustomBgRow: function (d = { id: String(Date.now()), name: '', url: '', random: true }) {
        const wrap = $('customBgEditor');
        if (!wrap) return;
        const row = document.createElement('div');
        row.className = 'custom-bg-row';
        row.dataset.id = d.id;
        const safePreviewUrl = escapeHtml(normalizeUrl(d.url || '') || '');
        const previewStyle = safePreviewUrl ? `background-image:url('${safePreviewUrl}')` : '';
        row.innerHTML = `
                        <div class="custom-preview" style="${previewStyle}"></div>
                        <div class="custom-inputs">
                            <input class="link-input" type="text" value="${d.name || ''}" placeholder="${t('customName')}">
                            <input class="link-input" type="text" value="${d.url || ''}" placeholder="${t('customUrl')}">
                        </div>
                        <div class="custom-controls">
                            <label class="custom-random"><input type="checkbox" ${d.random ? 'checked' : ''}>${t('customRandom')}</label>
                            <div class="control-buttons">
                                <button class="btn btn-secondary use-bg-btn" data-id="${d.id}">使用</button>
                                <button class="btn-icon" data-action="remove-row">×</button>
                            </div>
                        </div>
                    `;
        wrap.appendChild(row);
    },

    confirmRemoveRow: function (btn) {
        if (confirm(t('confirmRemoveRow'))) {
            // Remove the whole custom-bg-row (button may be nested inside controls)
            const row = btn.closest('.custom-bg-row') || btn.parentElement;
            if (row) row.remove();
            showActionToast(t('rowRemoved'), 'success');
        }
    },

    save: async function () {
        // Engine
        const eng = document.querySelector('input[name="eng"]:checked');
        if (eng) State.currentEngine = eng.value;

        // Language
        const lang = document.querySelector('input[name="lang"]:checked');
        if (lang) State.language = lang.value;

        // BG
        const type = document.querySelector('input[name="bgT"]:checked').value;
        if (State.tempBgValue !== null) State.bgConfig = { type, value: State.tempBgValue };
        else if (getBgSourcesMap()[type]) State.bgConfig = { type, value: getBgSourcesMap()[type].url };
        else if (type === 'url') State.bgConfig = { type: 'url', value: $('bgUrlInput').value };

        // Custom BG Sources
        const customRows = $$('#customBgEditor .custom-bg-row');
        State.customBgSources = Array.from(customRows).map(r => {
            const inputs = r.querySelectorAll('input[type="text"]');
            const checkbox = r.querySelector('input[type="checkbox"]');
            return {
                id: r.dataset.id || String(Date.now() + Math.random()),
                name: inputs[0]?.value?.trim() || '',
                url: inputs[1]?.value?.trim() || '',
                random: !!checkbox?.checked
            };
        }).filter(s => s.name && s.url);

        // Import
        if (State.pendingImportData) { State.bookmarks = State.pendingImportData; UIManager.enterFolder(UIManager.getDefaultFolderId()); }

        await Storage.saveNow();
        location.reload();
    },

    parseImport: function (file) {
        if (!file) return;
        const r = new FileReader();
        r.onload = e => {
            const doc = new DOMParser().parseFromString(e.target.result, "text/html");
            const parse = (list, pid) => Array.from(list ? list.children : []).reduce((acc, n, i) => {
                if (n.tagName === 'DT') {
                    const h3 = n.querySelector('h3'), a = n.querySelector('a'), id = `${pid}-${i}`;
                    if (h3) {
                        let dl = n.querySelector('dl') || n.nextElementSibling;
                        if (dl && dl.tagName !== 'DL') dl = null;
                        acc.push({ id, type: 'folder', title: h3.textContent, children: parse(dl, id) });
                    } else if (a && isSafeUrl(a.href)) acc.push({ id, type: 'link', title: a.textContent, url: a.href });
                }
                return acc;
            }, []);

            const root = parse(doc.querySelector('dl'), 'root');
            let final = [];
            root.forEach(n => {
                if (n.type === 'folder') {
                    final.push(...(n.children || []));
                } else {
                    final.push(n);
                }
            });

            if (final.length) {
                State.pendingImportData = final;
                setSidebarStatus($('importStatus'), t('importDetected', { count: final.length }), 'success');
            } else {
                setSidebarStatus($('importStatus'), t('importFormatError'), 'error');
            }
        };
        r.readAsText(file);
    }
};
window.SettingsManager = SettingsManager;
window.SuggestionManager = SuggestionManager;

/** Module: Advanced Drag & Drop Manager */
const DragManager = {
    dragSrcEl: null,
    dragOverRaf: 0,
    dragOverTarget: null,
    dragOverSide: null,
    lastDragEvent: null,
    touchDragging: false,
    touchStartX: 0,
    touchStartY: 0,
    touchTimer: 0,
    touchDragIndex: -1,
    blockClickUntil: 0,

    init: function () {
        const dock = $('dockContainer');

        // 1. Grid Items Drag Start (Delegated)
        document.addEventListener('dragstart', this.handleDragStart.bind(this));

        // 2. Dock Container Events
        dock.addEventListener('dragover', this.handleDragOver.bind(this));
        dock.addEventListener('dragleave', this.handleDragLeave.bind(this));
        dock.addEventListener('drop', this.handleDrop.bind(this));

        // 3. Dock Items Drag End (Clean up)
        dock.addEventListener('dragend', this.handleDragEnd.bind(this));

        // Touch reorder support (mobile)
        dock.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        dock.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        dock.addEventListener('touchend', this.handleTouchEnd.bind(this));
        dock.addEventListener('touchcancel', this.handleTouchEnd.bind(this));

        dock.addEventListener('click', (e) => {
            if (Date.now() < this.blockClickUntil) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    },

    moveDockItem: function (oldIndex, dropIndex) {
        if (oldIndex === dropIndex || (oldIndex === dropIndex - 1 && dropIndex > oldIndex)) return;
        const itemToMove = State.quickLinks[oldIndex];
        State.quickLinks.splice(oldIndex, 1);
        const newIndex = (oldIndex < dropIndex) ? dropIndex - 1 : dropIndex;
        State.quickLinks.splice(newIndex, 0, itemToMove);
    },

    handleDragStart: function (e) {
        this.dragSrcEl = e.target.closest('.card, .dock-item');
        if (!this.dragSrcEl) return;

        // 判断拖拽源
        if (this.dragSrcEl.classList.contains('dock-item')) {
            if (typeof BookmarkEditor !== 'undefined' && BookmarkEditor.isEnabled()) {
                e.preventDefault();
                this.dragSrcEl = null;
                return;
            }
            this.dragSrcEl.classList.add('dragging');
            this.dragSrcEl.style.transform = 'scale(1.05)';
            this.dragSrcEl.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
            e.dataTransfer.effectAllowed = 'move';
            // 传输索引
            e.dataTransfer.setData('text/plain', JSON.stringify({
                type: 'dock',
                index: parseInt(this.dragSrcEl.dataset.index)
            }));
        } else if (this.dragSrcEl.classList.contains('card')) {
            // 只有链接卡片可以拖拽，文件夹不行
            if (this.dragSrcEl.dataset.fid) {
                e.preventDefault();
                return;
            }
            this.dragSrcEl.classList.add('dragging');
            this.dragSrcEl.style.transform = 'scale(1.05)';
            this.dragSrcEl.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
            e.dataTransfer.effectAllowed = 'copy';
            const url = this.dragSrcEl.getAttribute('href');
            const title = this.dragSrcEl.querySelector('.card-title').innerText;
            // 传输数据
            e.dataTransfer.setData('text/plain', JSON.stringify({
                type: 'grid',
                title: title,
                url: url,
                icon: ''
            }));
        }
    },

    handleDragOver: function (e) {
        if (typeof BookmarkEditor !== 'undefined' && BookmarkEditor.isEnabled()) return;
        e.preventDefault(); // 必要，允许 drop
        this.lastDragEvent = e;
        if (this.dragOverRaf) return;
        this.dragOverRaf = requestAnimationFrame(() => {
            this.dragOverRaf = 0;
            const evt = this.lastDragEvent;
            if (!evt) return;

            const dock = $('dockContainer');
            dock.classList.add('drag-over');

            const targetItem = evt.target.closest('.dock-item');
            if (!targetItem || targetItem === this.dragSrcEl) {
                this.clearDragIndicators();
                return;
            }

            const rect = targetItem.getBoundingClientRect();
            const side = evt.clientX < rect.left + rect.width / 2 ? 'left' : 'right';

            if (this.dragOverTarget !== targetItem || this.dragOverSide !== side) {
                this.clearDragIndicators();
                this.dragOverTarget = targetItem;
                this.dragOverSide = side;
                targetItem.classList.add(side === 'left' ? 'drag-over-left' : 'drag-over-right');
            }
        });
    },

    handleDragLeave: function (e) {
        // 只有当真正离开 dock container 时才移除样式
        if (e.relatedTarget && !$('dockContainer').contains(e.relatedTarget)) {
            $('dockContainer').classList.remove('drag-over');
            this.clearDragIndicators();
        }
    },

    handleDrop: function (e) {
        if (typeof BookmarkEditor !== 'undefined' && BookmarkEditor.isEnabled()) return;
        e.stopPropagation();
        e.preventDefault();

        const dock = $('dockContainer');
        dock.classList.remove('drag-over');
        this.clearDragIndicators();

        // 获取放置位置的索引
        let dropIndex = State.quickLinks.length; // 默认放到最后
        const targetItem = e.target.closest('.dock-item');

        if (targetItem) {
            const rect = targetItem.getBoundingClientRect();
            const midPoint = rect.left + rect.width / 2;
            const targetIndex = parseInt(targetItem.dataset.index);

            // 如果在左侧 drop，插入到当前索引；如果在右侧，插入到当前索引+1
            dropIndex = (e.clientX < midPoint) ? targetIndex : targetIndex + 1;
        }

        const dataRaw = e.dataTransfer.getData('text/plain');
        if (!dataRaw) return;

        const data = JSON.parse(dataRaw);

        if (data.type === 'dock') {
            // --- 内部排序逻辑 ---
            const oldIndex = data.index;
            this.moveDockItem(oldIndex, dropIndex);

        } else if (data.type === 'grid') {
            // --- 从 Grid 添加逻辑 ---
            // 查重
            const exists = State.quickLinks.some(l => l.url === data.url);
            if (!exists) {
                const newItem = { title: data.title, url: data.url, icon: data.icon };
                State.quickLinks.splice(dropIndex, 0, newItem);
            }
        }

        // 保存并重新渲染
        Storage.saveNow();
        UIManager.renderDock();
        this.handleDragEnd();
    },

    handleTouchStart: function (e) {
        if (typeof BookmarkEditor !== 'undefined' && BookmarkEditor.isEnabled()) return;
        const target = e.target.closest('.dock-item');
        if (!target) return;

        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchDragIndex = parseInt(target.dataset.index);
        this.touchDragging = false;

        clearTimeout(this.touchTimer);
        this.touchTimer = setTimeout(() => {
            this.touchDragging = true;
            target.classList.add('dragging');
            $('dockContainer').classList.add('drag-over');
            document.body.classList.add('dragging-dock');
        }, 220); // long-press to drag
    },

    handleTouchMove: function (e) {
        if (typeof BookmarkEditor !== 'undefined' && BookmarkEditor.isEnabled()) return;
        if (!e.touches.length) return;
        const touch = e.touches[0];
        const dx = Math.abs(touch.clientX - this.touchStartX);
        const dy = Math.abs(touch.clientY - this.touchStartY);

        if (!this.touchDragging) {
            // 如果移动超过阈值，取消长按拖拽
            if (dx > 8 || dy > 8) {
                clearTimeout(this.touchTimer);
            }
            return;
        }

        e.preventDefault();
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetItem = el ? el.closest('.dock-item') : null;

        if (!targetItem || parseInt(targetItem.dataset.index) === this.touchDragIndex) {
            this.clearDragIndicators();
            return;
        }

        const rect = targetItem.getBoundingClientRect();
        const side = touch.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
        if (this.dragOverTarget !== targetItem || this.dragOverSide !== side) {
            this.clearDragIndicators();
            this.dragOverTarget = targetItem;
            this.dragOverSide = side;
            targetItem.classList.add(side === 'left' ? 'drag-over-left' : 'drag-over-right');
        }
    },

    handleTouchEnd: function () {
        if (typeof BookmarkEditor !== 'undefined' && BookmarkEditor.isEnabled()) return;
        clearTimeout(this.touchTimer);
        if (!this.touchDragging) return;

        const targetItem = this.dragOverTarget;
        let dropIndex = State.quickLinks.length;

        if (targetItem) {
            const rect = targetItem.getBoundingClientRect();
            const midPoint = rect.left + rect.width / 2;
            const targetIndex = parseInt(targetItem.dataset.index);
            dropIndex = (this.dragOverSide === 'left') ? targetIndex : targetIndex + 1;
        }

        if (this.touchDragIndex >= 0) {
            this.moveDockItem(this.touchDragIndex, dropIndex);
            Storage.saveNow();
            UIManager.renderDock();
        }

        this.blockClickUntil = Date.now() + 350;
        this.handleDragEnd();
        document.body.classList.remove('dragging-dock');
        this.touchDragging = false;
        this.touchDragIndex = -1;
    },

    handleDragEnd: function () {
        if (this.dragSrcEl) {
            this.dragSrcEl.classList.remove('dragging');
            this.dragSrcEl.style.transform = '';
            this.dragSrcEl.style.boxShadow = '';
        }
        $('dockContainer').classList.remove('drag-over');
        this.clearDragIndicators();
        this.dragSrcEl = null;
    },
    clearDragIndicators: function () {
        if (this.dragOverTarget) {
            this.dragOverTarget.classList.remove('drag-over-left', 'drag-over-right');
        }
        this.dragOverTarget = null;
        this.dragOverSide = null;
    }
};

/** Module: Event Binding */
function bindEvents() {
    const scrollArea = document.querySelector('.scroll-area');
    const suggestionBox = $('suggestionBox');
    const sidebarRoot = $('settingsSidebar');
    const searchBox = $('searchBox');
    const engineToggle = $('engineToggle');
    const engineMenu = $('engineMenu');
    const closeEngineMenu = () => {
        if (!searchBox || !engineToggle) return;
        searchBox.classList.remove('engine-open');
        engineToggle.setAttribute('aria-expanded', 'false');
    };
    const openEngineMenu = () => {
        if (!searchBox || !engineToggle) return;
        searchBox.classList.add('engine-open');
        engineToggle.setAttribute('aria-expanded', 'true');
    };
    // Navigation + modal bookmark editing
    const bookmarkGrid = $('bookmarkGrid');
    bookmarkGrid.addEventListener('click', (e) => {
        const deleteTrigger = e.target.closest('[data-action="bookmark-card-delete"]');
        if (deleteTrigger) {
            e.preventDefault();
            e.stopPropagation();
            BookmarkEditor.requestDelete(deleteTrigger.dataset.id);
            return;
        }

        const editTrigger = e.target.closest('[data-action="bookmark-card-edit"]');
        if (editTrigger) {
            e.preventDefault();
            e.stopPropagation();
            BookmarkEditor.openEdit(editTrigger.dataset.id);
            return;
        }

        const c = e.target.closest('.card[data-fid]');
        if (c) {
            State.breadcrumbPath.push({ id: c.dataset.fid, title: c.dataset.ftitle });
            UIManager.enterFolder(c.dataset.fid);
            if (scrollArea) scrollArea.scrollTop = 0;
        }
    });

    bookmarkGrid.onkeydown = e => {
        const activeEl = document.activeElement;
        const cards = Array.from($('bookmarkGrid').querySelectorAll('.card[tabindex], a.card'));
        const idx = cards.indexOf(activeEl);

        if (e.key === 'Enter' || e.key === ' ') {
            const c = activeEl.closest('.card[data-fid]');
            if (c) {
                e.preventDefault();
                State.breadcrumbPath.push({ id: c.dataset.fid, title: c.dataset.ftitle });
                UIManager.enterFolder(c.dataset.fid);
                if (scrollArea) scrollArea.scrollTop = 0;
            }
            return;
        }

        if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
        if (idx === -1) return;
        e.preventDefault();

        let target = -1;
        if (e.key === 'ArrowRight') {
            target = Math.min(idx + 1, cards.length - 1);
        } else if (e.key === 'ArrowLeft') {
            target = Math.max(idx - 1, 0);
        } else {
            const firstRect = cards[0].getBoundingClientRect();
            let colCount = 1;
            for (let i = 1; i < cards.length; i++) {
                if (Math.abs(cards[i].getBoundingClientRect().top - firstRect.top) < 4) colCount++;
                else break;
            }
            if (e.key === 'ArrowDown') {
                target = Math.min(idx + colCount, cards.length - 1);
            } else if (e.key === 'ArrowUp') {
                target = Math.max(idx - colCount, 0);
            }
        }

        if (target >= 0 && target !== idx) {
            cards[target].focus();
            cards[target].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    };

    const dockContainer = $('dockContainer');
    if (dockContainer) {
        dockContainer.addEventListener('click', (e) => {
            const deleteTrigger = e.target.closest('[data-action="dock-link-delete"]');
            if (deleteTrigger) {
                e.preventDefault();
                e.stopPropagation();
                BookmarkEditor.requestDelete(BookmarkEditor.getDockTargetId(deleteTrigger.dataset.index));
                return;
            }

            const editTrigger = e.target.closest('[data-action="dock-link-edit"]');
            if (editTrigger) {
                e.preventDefault();
                e.stopPropagation();
                BookmarkEditor.openDockEdit(editTrigger.dataset.index);
                return;
            }

            const createTrigger = e.target.closest('[data-action="dock-link-create"]');
            if (createTrigger) {
                e.preventDefault();
                e.stopPropagation();
                BookmarkEditor.openDockCreate();
            }
        });
    }

    const bookmarkModalRoot = $('bookmarkModalRoot');
    if (bookmarkModalRoot) {
        bookmarkModalRoot.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (!action) return;
            e.preventDefault();
            e.stopPropagation();
            const actionType = action.dataset.action;
            if (actionType === 'bookmark-modal-close') {
                BookmarkEditor.closeForm();
                return;
            }
            if (actionType === 'bookmark-form-mode') {
                BookmarkEditor.switchCreateMode(action.dataset.mode);
                return;
            }
            if (actionType === 'bookmark-delete-request') {
                BookmarkEditor.requestDelete(action.dataset.id);
                return;
            }
            if (actionType === 'bookmark-delete-cancel') {
                BookmarkEditor.closeDeleteConfirm();
                return;
            }
            if (actionType === 'bookmark-delete-confirm') {
                BookmarkEditor.remove(action.dataset.id);
                return;
            }
            if (actionType === 'bookmark-icon-clear') {
                const form = BookmarkEditor.getForm();
                if (!form) return;
                form.icon = '';
                form.error = '';
                BookmarkEditor.updateModal();
            }
        });

        bookmarkModalRoot.addEventListener('input', (e) => {
            if (e.target.matches('[data-bookmark-input]')) {
                BookmarkEditor.handleFormInput(e.target);
            }
        });

        bookmarkModalRoot.addEventListener('change', (e) => {
            if (!e.target.matches('[data-bookmark-icon-file]')) return;
            const file = e.target.files && e.target.files[0];
            if (file) BookmarkEditor.handleIconFile(file);
            e.target.value = '';
        });

        bookmarkModalRoot.addEventListener('submit', (e) => {
            if (!e.target.matches('[data-bookmark-form]')) return;
            e.preventDefault();
            BookmarkEditor.submitForm();
        });
    }
    $('breadcrumb').onclick = e => {
        const item = e.target.closest('.breadcrumb-item');
        if (item) {
            const idx = parseInt(item.dataset.idx);
            State.breadcrumbPath = State.breadcrumbPath.slice(0, idx + 1);
            UIManager.enterFolder(State.breadcrumbPath[idx].id);
        }
    };
    $('breadcrumb').onkeydown = e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const item = e.target.closest('.breadcrumb-item');
        if (item) {
            e.preventDefault();
            const idx = parseInt(item.dataset.idx);
            State.breadcrumbPath = State.breadcrumbPath.slice(0, idx + 1);
            UIManager.enterFolder(State.breadcrumbPath[idx].id);
        }
    };

    const editBtn = $('btnEditBookmarks');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            BookmarkEditor.toggle();
        });
    }

    const addBtn = $('btnAddBookmark');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            BookmarkEditor.openCreate('link');
        });
    }

    BookmarkEditor.updateHeaderControls();

    const syncBtn = $('btnSyncBookmarks');
    const syncAvailable = () => isExtensionContext() && chrome.bookmarks;
    const setSyncBtnState = (enabled) => {
        if (!syncBtn) return;
        syncBtn.disabled = !enabled;
        syncBtn.classList.toggle('is-disabled', !enabled);
        syncBtn.setAttribute('aria-disabled', String(!enabled));
    };
    if (syncBtn) {
        setSyncBtnState(syncAvailable());
        syncBtn.addEventListener('click', async () => {
            if (!syncAvailable()) {
                showActionToast(t('syncUnavailable'), 'error');
                setSyncBtnState(false);
                return;
            }
            if (syncBtn.dataset.syncing === '1') return;
            syncBtn.dataset.syncing = '1';
            syncBtn.classList.add('syncing');
            setSyncBtnState(false);
            try {
                const bookmarks = await fetchBookmarksFromChrome();
                State.bookmarks = applyBookmarkCustomIcons(bookmarks || []);
                Storage.save();
                if ($('searchInput') && $('searchInput').value.startsWith('/')) {
                    $('searchInput').value = '';
                    SuggestionManager.clear();
                }
                State.isSearchMode = false;
                if (State.bookmarks.length) {
                    let targetId = State.currentFolderId || 'root';
                    if (targetId === 'root') {
                        targetId = UIManager.getDefaultFolderId();
                    } else {
                        const path = UIManager.getFolderPath(targetId);
                        if (!path.length) targetId = UIManager.getDefaultFolderId();
                    }
                    UIManager.enterFolder(targetId);
                } else {
                    $('bookmarkGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;opacity:0.6;padding:60px;">${t('welcome')}</div>`;
                    $('breadcrumb').innerHTML = `<div class="breadcrumb-item">${t('home')}</div>`;
                }
                // 在按钮上直接显示成功状态
                syncBtn.classList.add('sync-success');
                const syncSpan = syncBtn.querySelector('span');
                const origText = syncSpan ? syncSpan.textContent : '';
                if (syncSpan) syncSpan.textContent = t('syncSuccess');
                setTimeout(() => {
                    syncBtn.classList.remove('sync-success');
                    if (syncSpan) syncSpan.textContent = origText;
                }, 2000);
            } catch (err) {
                showActionToast(t('syncFailed'), 'error');
                syncBtn.classList.add('sync-error');
                setTimeout(() => syncBtn.classList.remove('sync-error'), 2000);
            } finally {
                syncBtn.classList.remove('syncing');
                syncBtn.dataset.syncing = '';
                setSyncBtnState(syncAvailable());
            }
        });
    }

    const manageBtn = $('btnManageBookmarks');
    const setManageBtnState = (enabled) => {
        if (!manageBtn) return;
        manageBtn.disabled = !enabled;
        manageBtn.classList.toggle('is-disabled', !enabled);
        manageBtn.setAttribute('aria-disabled', String(!enabled));
    };
    if (manageBtn) {
        setManageBtnState(isExtensionContext() && !!(chrome && chrome.tabs));
        manageBtn.addEventListener('click', () => {
            if (!isExtensionContext() || !chrome.tabs) {
                showActionToast(t('manageUnavailable'), 'error');
                return;
            }
            chrome.tabs.create({ url: 'chrome://bookmarks/' });
        });
    }

    // --- Drag and Drop Logic (Updated) ---
    DragManager.init();
    // --- End Drag and Drop Logic ---

    // Search Logic
    const input = $('searchInput');
    let tabNavLockUntil = 0;
    let isComposing = false;

    // Debounced Input Handler
    const handleSearchInput = debounce((e) => {
        if (isComposing) return;
        const val = e.target.value;

        // Mode 1: Local Bookmark Search (starts with /)
        if (val.startsWith('/')) {
            if (BookmarkEditor.isEnabled()) BookmarkEditor.exit();
            SuggestionManager.clear(); // Hide web suggestions
            State.isSearchMode = true;
            const q = val.substring(1);

            if (!q.trim()) {
                UIManager.renderGrid([], true);
                return;
            }

            $('breadcrumb').innerHTML = `<div class="breadcrumb-item">🔍 "${q}"</div>`;
            const res = [];
            const qLower = q.toLowerCase();

            const walk = nodes => nodes.forEach(n => {
                if (n.type === 'link') {
                    // Fuzzy Match Logic
                    const matchResult = fuzzyMatchWithHighlight(n.title, q);
                    if (matchResult.matched) {
                        const titleLower = (n.title || '').toLowerCase();
                        const starts = titleLower.startsWith(qLower) ? 0.6 : 0;
                        const contains = titleLower.includes(qLower) ? 0.2 : 0;
                        const score = matchResult.score + starts + contains;
                        res.push({ ...n, highlightedTitle: matchResult.html, _score: score });
                    } else if (n.url.toLowerCase().includes(qLower)) {
                        // Fallback: URL match (no highlight on title)
                        res.push({ ...n, _score: 0.15 });
                    }
                }
                if (n.children) walk(n.children);
            });

            walk(State.bookmarks);
            res.sort((a, b) => (b._score || 0) - (a._score || 0) || (a.title || '').localeCompare(b.title || ''));
            UIManager.renderGrid(res, true);
        }
        // Mode 2: Web Search Suggestions
        else if (val.trim().length > 0) {
            if (State.isSearchMode) {
                State.isSearchMode = false;
                UIManager.enterFolder(State.currentFolderId);
            }
            SuggestionManager.fetch(val);
        } else {
            SuggestionManager.renderHistory();
            if (State.isSearchMode) {
                State.isSearchMode = false;
                UIManager.enterFolder(State.currentFolderId);
            }
        }
    }, 300); // 300ms debounce

    input.addEventListener('input', handleSearchInput);
    input.addEventListener('compositionstart', () => {
        isComposing = true;
    });
    input.addEventListener('compositionend', (e) => {
        isComposing = false;
        handleSearchInput(e);
    });
    input.addEventListener('focus', () => {
        closeEngineMenu();
        if (!input.value.trim() && !State.isSearchMode) {
            SuggestionManager.renderHistory();
        }
    });

    if (engineToggle && engineMenu && searchBox) {
        engineToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (searchBox.classList.contains('engine-open')) {
                closeEngineMenu();
            } else {
                SuggestionManager.clear();
                openEngineMenu();
            }
        });

        engineMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.engine-item');
            if (!item) return;
            const key = item.dataset.engine;
            if (!Config.ENGINES[key]) return;
            if (State.currentEngine !== key) {
                State.currentEngine = key;
                Storage.save();
                UIManager.updateSearchPlaceholder();
                UIManager.updateSearchEngineUI();
                if ($('settingsSidebar').classList.contains('open')) {
                    const engInput = document.querySelector(`input[name="eng"][value="${key}"]`);
                    if (engInput) engInput.checked = true;
                }
            }
            closeEngineMenu();
            input.focus();
            const v = input.value.trim();
            if (v && !v.startsWith('/')) {
                SuggestionManager.fetch(v);
            }
        });
    }

    // Keyboard Navigation
    input.addEventListener('keydown', (e) => {
        if (isComposing) return;
        if (e.key === 'Tab' && $('suggestionBox').classList.contains('active')) {
            e.preventDefault();
            tabNavLockUntil = Date.now() + 250;
            SuggestionManager.handleKeyNavigation(e);
            input.focus();
            return;
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            SuggestionManager.handleKeyNavigation(e);
        } else if (e.key === 'Enter') {
            if ($('suggestionBox').classList.contains('active') && State.selectedSuggestionIndex >= 0) {
                e.preventDefault();
                SuggestionManager.select(State.suggestions[State.selectedSuggestionIndex]);
                return;
            }
            if (State.selectedSuggestionIndex === -1) {
                const v = input.value;
                if (v.startsWith('/')) {
                    const f = document.querySelector('.card[href]');
                    if (f) window.open(f.href, '_blank');
                } else if (v.trim()) {
                    SuggestionManager.addHistory(v);
                    window.open(Config.ENGINES[State.currentEngine].url + encodeURIComponent(v), '_blank');
                    SuggestionManager.clear();
                }
            }
        } else if (e.key === 'Escape') {
            closeEngineMenu();
            if ($('settingsSidebar').classList.contains('open')) SettingsManager.toggle(false);
            else {
                input.blur();
                SuggestionManager.clear();
                if (State.isSearchMode) {
                    input.value = '';
                    State.isSearchMode = false;
                    UIManager.enterFolder(State.currentFolderId);
                }
            }
        }
    });

    input.addEventListener('blur', () => {
        if (Date.now() < tabNavLockUntil) {
            input.focus();
        }
    });

    window.addEventListener('blur', () => {
        SuggestionManager.clear();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            SuggestionManager.clear();
        }
    });

    // Global Shortcut
    document.addEventListener('keydown', e => {
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;

        if (e.key === 'Escape' && BookmarkEditor.handleEscape()) {
            e.preventDefault();
            return;
        }

        if (e.key === '/' && !isInput) {
            e.preventDefault();
            input.focus();
            input.value = '/';
            input.dispatchEvent(new Event('input'));
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            input.focus();
        } else if (e.key === 'Escape') {
            if (document.activeElement === input) {
                input.blur();
                input.value = '';
                input.dispatchEvent(new Event('input'));
            } else if ($('settingsSidebar').classList.contains('open')) {
                SettingsManager.toggle(false);
            }
        } else if (e.key === 'Backspace' && !isInput) {
            if (State.currentFolderId !== 'root' && State.breadcrumbPath.length > 1) {
                const parentId = State.breadcrumbPath[State.breadcrumbPath.length - 2].id;
                UIManager.enterFolder(parentId);
            }
        }
    });

    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            SuggestionManager.clear();
            closeEngineMenu();
        }
    });

    if (suggestionBox) {
        suggestionBox.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('[data-action="remove-history"]');
            if (removeBtn) {
                SuggestionManager.removeHistory(removeBtn.dataset.text || '', e);
                return;
            }
            const item = e.target.closest('.suggestion-item');
            if (!item) return;
            const text = item.dataset.text || '';
            if (text) SuggestionManager.select(text);
        });
    }

    if (sidebarRoot) {
        sidebarRoot.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('[data-action="remove-row"]');
            if (removeBtn) { SettingsManager.confirmRemoveRow(removeBtn); return; }

            const useBtn = e.target.closest('.use-bg-btn');
            if (useBtn) {
                const id = useBtn.dataset.id;
                const type = `custom_${id}`;
                const radio = document.querySelector(`input[name="bgT"][value="${type}"]`);
                if (radio) {
                    radio.checked = true;
                    // trigger change handler
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                    SettingsManager.setBgType(type);
                    // ensure the preview is visible immediately
                } else {
                    // Fallback: try to preview the URL directly from saved state or the editor row (unsaved)
                    let url = State.customBgSources.find(s => s.id === id)?.url;
                    if (!url) {
                        const row = useBtn.closest('.custom-bg-row');
                        const inputs = row ? row.querySelectorAll('input[type="text"]') : null;
                        url = inputs && inputs[1] ? inputs[1].value.trim() : url || '';
                    }
                    State.tempBgValue = url || '';
                    if (State.tempBgValue) {
                        setBgStatus(t('bgLoading'), 'loading');
                        $('bg-layer').src = State.tempBgValue;
                    }
                }
                return;
            }
        });
    }

    // Settings
    $('btnOpenSettings').onclick = () => SettingsManager.toggle(true);
    $('btnOpenSettings').onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            SettingsManager.toggle(true);
        }
    };
    $('sidebarBackdrop').onclick = $('btnCloseSidebarTop').onclick = $('btnCloseSidebarBottom').onclick = () => SettingsManager.toggle(false);

    // Swipe to close sidebar
    let sidebarTouchStartX = 0;
    $('settingsSidebar').addEventListener('touchstart', e => {
        sidebarTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    $('settingsSidebar').addEventListener('touchmove', e => {
        if (sidebarTouchStartX === 0) return;
        const dx = e.touches[0].clientX - sidebarTouchStartX;
        if (dx > 50) { // Swipe right threshold
            SettingsManager.toggle(false);
            sidebarTouchStartX = 0;
        }
    }, { passive: true });
    $('settingsSidebar').addEventListener('touchend', () => {
        sidebarTouchStartX = 0;
    });

    $('btnSaveSettings').onclick = () => SettingsManager.save();
    $('btnReset').onclick = Storage.reset;
    $('btnExportConfig').onclick = () => Storage.export();
    if ($('btnAddLinkRow')) $('btnAddLinkRow').onclick = () => SettingsManager.addLinkRow();
    $('btnAddCustomBg').onclick = () => SettingsManager.addCustomBgRow();
    $('toggleHistory').onchange = (e) => {
        State.searchHistoryEnabled = !!e.target.checked;
        Storage.save();
        if (!State.searchHistoryEnabled) {
            SuggestionManager.clear();
        } else if ($('searchInput').value.trim() === '') {
            SuggestionManager.renderHistory();
        }
    };
    $('btnClearHistory').onclick = () => {
        State.searchHistory = [];
        Storage.save();
        if ($('searchInput').value.trim() === '' && !$('searchInput').matches(':focus')) {
            SuggestionManager.clear();
        } else if ($('searchInput').value.trim() === '') {
            SuggestionManager.renderHistory();
        }
        showActionToast(t('historyCleared'), 'success');
    };
    $('fileInput').onchange = e => SettingsManager.parseImport(e.target.files[0]);
    $('configInput').onchange = e => Storage.importFromFile(e.target.files[0]);
    $('btnRefreshBg').onclick = () => {
        const sourcesMap = getBgSourcesMap();
        const current = sourcesMap[State.bgConfig.type];
        UIManager.applyBackground(!!current?.random);
    };

    // Sidebar resize
    const resizer = $('sidebarResizer');
    const sidebarEl = $('settingsSidebar');
    if (resizer && sidebarEl) {
        const minW = 260;
        const maxW = 900;
        const onMove = (e) => {
            const dx = startX - e.clientX;
            const next = Math.min(maxW, Math.max(minW, startWidth + dx));
            sidebarEl.style.width = next + 'px';
        };
        const onUp = () => {
            const width = parseInt(sidebarEl.style.width, 10);
            if (Number.isFinite(width) && width > 0) {
                State.styles.sidebarWidth = width;
                Storage.save();
            }
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.classList.remove('resizing');
        };
        let startX = 0;
        let startWidth = 0;
        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;
            const computed = sidebarEl.getBoundingClientRect().width;
            startWidth = Number.isFinite(computed) && computed > 0
                ? computed
                : (parseInt(sidebarEl.style.width, 10) || startWidth || sidebarEl.offsetWidth);
            document.body.classList.add('resizing');
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }
}

// Init
/**
 * 用 Canvas 生成静态噪点纹理，替代 CSS 内联 SVG feTurbulence。
 * SVG feTurbulence + mix-blend-mode 在 Edge 中会导致全页每帧重合成，性能极差。
 * Canvas 只运行一次，生成 PNG data URL 后作为 background-image 平铺，消耗极低。
 */
function initNoiseOverlay() {
    const el = document.getElementById('noise-overlay');
    if (!el) return;
    try {
        const SIZE = 200;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(SIZE, SIZE);
        const data = imageData.data;
        // 使用 xorshift 伪随机（比 Math.random 快，且噪点更均匀）
        let seed = 0xdeadbeef;
        const rand = () => {
            seed ^= seed << 13;
            seed ^= seed >> 17;
            seed ^= seed << 5;
            return (seed >>> 0) / 0xffffffff;
        };
        for (let i = 0; i < data.length; i += 4) {
            const v = (rand() * 255) | 0;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
        el.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
    } catch (e) {
        // Canvas 不可用时静默忽略，不影响其他功能
    }
}

window.onload = () => {
    Storage.load().then(() => {
        applyLanguage();
        UIManager.init();
        bindEvents();
        if (!isExtensionContext() && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(() => { });
        }
    });
    initNoiseOverlay();
};

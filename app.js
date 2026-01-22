if (typeof isExtensionContext === 'undefined') {
    var isExtensionContext = function () { return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id; };
}

/** Module: Constants & Config */
const Config = {
    BING_API: "https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN",
    FALLBACK_BG: './assets/defult.png',
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
        { title: "Google", url: "https://www.google.com", icon: "" },
        { title: "YouTube", url: "https://www.youtube.com", icon: "" },
        { title: "GitHub", url: "https://github.com", icon: "" },
        { title: "ChatGPT", url: "https://chat.openai.com", icon: "" }
    ],
    STYLES: [
        { id: 'bgBlur', labelKey: 'style.bgBlur', min: 0, max: 30 },
        { id: 'bgOverlay', labelKey: 'style.bgOverlay', min: 0, max: 80 },
        { id: 'iconSize', labelKey: 'style.iconSize', min: 40, max: 80 },
        { id: 'innerScale', labelKey: 'style.innerScale', min: 30, max: 100 },
        { id: 'gridGap', labelKey: 'style.gridGap', min: 10, max: 60 },
        { id: 'fontSize', labelKey: 'style.fontSize', min: 10, max: 20 }
    ]
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
    styles: { iconSize: 60, innerScale: 75, fontSize: 13, gridGap: 24, bgBlur: 0, bgOverlay: 20, sidebarWidth: 800 },
    bgConfig: { type: 'custom_zhimg-pica', value: 'https://pica.zhimg.com/v2-564f2c587f65e208a130242b34338872_1440w.jpg' },
    currentEngine: 'google',
    language: 'zh',
    customBgSources: [{ id: 'zhimg-pica', name: 'Zhimg Pica', url: 'https://pica.zhimg.com/v2-564f2c587f65e208a130242b34338872_1440w.jpg', random: false }],
    tempBgValue: null,
    pendingImportData: null,
    isSearchMode: false,
    suggestions: [],
    selectedSuggestionIndex: -1,
    searchHistory: [],
    searchHistoryEnabled: true
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
const getFaviconCache = () => {
    try {
        return JSON.parse(localStorage.getItem(FAVICON_CACHE_KEY) || '{}');
    } catch (e) {
        return {};
    }
};
const setFaviconCache = (cache) => {
    localStorage.setItem(FAVICON_CACHE_KEY, JSON.stringify(cache));
};
const getFaviconFailCache = () => {
    try {
        return JSON.parse(localStorage.getItem(FAVICON_FAIL_KEY) || '{}');
    } catch (e) {
        return {};
    }
};
const setFaviconFailCache = (cache) => {
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
const bindIconEvents = (root) => {
    if (!root) return;
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
        startIconTimeout(img);
    });
};
const isChinaEnv = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const langs = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || ''];
    const langHit = langs.some(l => /^zh(-CN)?/i.test(l));
    return tz === 'Asia/Shanghai' || tz === 'Asia/Chongqing' || tz === 'Asia/Harbin' || tz === 'Asia/Beijing' || langHit;
};
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

const scheduleIdle = window.requestIdleCallback
    ? (cb) => window.requestIdleCallback(cb, { timeout: 500 })
    : (cb) => setTimeout(cb, 1);

const setBgStatus = (text, type = '') => {
    const el = $('bgStatus');
    if (!el) return;
    el.textContent = text || '';
    el.className = `bg-status${type ? ' ' + type : ''}`;
};

let bgToastTimer = 0;
const showBgToast = (text, type = '') => {
    const el = $('bgToast');
    if (!el) return;
    el.textContent = text || '';
    el.className = `bg-toast show${type ? ' ' + type : ''}`;
    clearTimeout(bgToastTimer);
    bgToastTimer = setTimeout(() => {
        el.className = 'bg-toast';
    }, 1400);
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
    if ($('settingsTitle')) $('settingsTitle').textContent = t('settingsTitle');
    if ($('labelAppearance')) $('labelAppearance').textContent = t('labelAppearance');
    if ($('labelLanguage')) $('labelLanguage').textContent = t('labelLanguage');
    if ($('labelBackground')) $('labelBackground').textContent = t('labelBackground');
    if ($('labelCustomBg')) $('labelCustomBg').textContent = t('labelCustomBg');
    if ($('labelSearchEngine')) $('labelSearchEngine').textContent = t('labelSearchEngine');
    if ($('labelDock')) $('labelDock').textContent = t('labelDock');
    if ($('labelImportBookmarks')) $('labelImportBookmarks').textContent = t('labelImportBookmarks');
    if ($('labelExportConfig')) $('labelExportConfig').textContent = t('labelExportConfig');
    if ($('labelImportConfig')) $('labelImportConfig').textContent = t('labelImportConfig');
    if ($('btnAddLinkRow')) $('btnAddLinkRow').textContent = t('btnAddLinkRow');
    if ($('btnAddCustomBg')) $('btnAddCustomBg').textContent = t('btnAddCustomBg');
    if ($('labelHistoryToggle')) $('labelHistoryToggle').textContent = t('historyToggle');
    if ($('btnClearHistory')) $('btnClearHistory').textContent = t('clearHistory');
    if ($('btnExportConfig')) $('btnExportConfig').textContent = t('btnExportConfig');
    if ($('exportHint')) $('exportHint').textContent = t('exportHint');
    if ($('btnReset')) $('btnReset').textContent = t('btnReset');
    if ($('btnCloseSidebarBottom')) $('btnCloseSidebarBottom').textContent = t('btnCancel');
    if ($('btnSaveSettings')) $('btnSaveSettings').textContent = t('btnSave');
    if ($('btnRefreshBg')) $('btnRefreshBg').textContent = t('btnRefreshBg');
    if ($('btnSyncBookmarks')) $('btnSyncBookmarks').querySelector('span').textContent = t('btnSyncBookmarks');
    if ($('btnManageBookmarks')) $('btnManageBookmarks').querySelector('span').textContent = t('btnManageBookmarks');
    if ($('searchInput')) UIManager.updateSearchPlaceholder();
    if ($('dateLink') && $('lunarDate')) {
        const now = new Date();
        const locale = State.language === 'en' ? 'en-US' : 'zh-CN';
        $('dateLink').textContent = now.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
        $('lunarDate').textContent = State.language === 'en' ? '' : getChineseLunarDate(now);
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

        scheduleIdle(() => {
            this.renderDock();
            if (State.bookmarks.length === 0) {
                $('bookmarkGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;opacity:0.6;padding:60px;">${t('welcome')}</div>`;
                $('breadcrumb').innerHTML = `<div class="breadcrumb-item">${t('home')}</div>`;
            } else {
                this.enterFolder(this.getDefaultFolderId());
            }
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
        r.setProperty('--icon-size', s.iconSize + 'px');
        r.setProperty('--icon-inner-scale', s.innerScale / 100);
        r.setProperty('--card-font-size', s.fontSize + 'px');
        r.setProperty('--grid-gap', s.gridGap + 'px');
        r.setProperty('--grid-min-width', Math.max(90, s.iconSize + 30) + 'px');
        r.setProperty('--bg-blur', s.bgBlur + 'px');
        r.setProperty('--bg-overlay-opacity', s.bgOverlay / 100);
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
                    setBgStatus(t('bgRandomSelected'));
                    showBgToast(t('bgRandomSelected'), 'success');
                }
                setBgStatus(t('bgUpdated'));
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
            // Try bundled local fallback first (user-provided `assets/defult.png`), then Bing API
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
        container.innerHTML = State.quickLinks.map((i, index) => {
            // 优先使用自定义图标，其次缓存，再使用多个备用源
            const safeUrl = normalizeUrl(i.url);
            const domain = getDomain(safeUrl);
            const candidates = getFaviconCandidates(domain, i.icon || '');
            const iconUrl = candidates[0] || '';
            const candidatesAttr = escapeHtml(JSON.stringify(candidates));
            const safeTitle = escapeHtml(i.title || '');
            const href = safeUrl || '#';
            const disabled = safeUrl ? '' : ' aria-disabled="true" tabindex="-1"';

            // 添加 draggable="true" 和 data-index
            return `
        <a href="${href}" class="dock-item" target="_blank" rel="noopener" draggable="true" data-index="${index}" data-url="${safeUrl}" data-title="${safeTitle}" role="listitem" aria-label="${safeTitle}"${disabled}>
            <div class="ios-icon">
                <img class="dock-icon" src="${iconUrl}" data-step="0" data-candidates="${candidatesAttr}" decoding="async" data-url="${safeUrl}" data-title="${safeTitle}">
            </div>
        </a>`;
        }).join('');
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
    },

    renderBreadcrumb: function () {
        $('breadcrumb').innerHTML = State.breadcrumbPath.map((it, i) =>
            `<div class="breadcrumb-item" data-idx="${i}" role="link" tabindex="0" aria-label="${escapeHtml(it.title)}">${it.title}</div>${i !== State.breadcrumbPath.length - 1 ? '<span class="breadcrumb-separator">/</span>' : ''}`
        ).join('');
    },

    renderGrid: function (items, isSearch = false) {
        if (!items || !items.length) {
            $('bookmarkGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;opacity:0.5;padding:20px;">${isSearch ? t('noResults') : t('emptyFolder')}</div>`;
            return;
        }

        $('bookmarkGrid').innerHTML = items.map(i => {
            const escTitle = escapeHtml(i.title || '');
            // Use highlighted title if available (from search), otherwise raw title
            const displayTitle = i.highlightedTitle || escTitle;

            if (i.type === 'folder') {
                return `<div class="card" data-fid="${i.id}" data-ftitle="${escTitle}" role="listitem" tabindex="0" aria-label="${escTitle}"><div class="ios-icon folder-icon"><span class="folder-emoji">📂</span></div><div class="card-title">${displayTitle}</div></div>`;
            }
            // Added draggable="true" here
            const safeUrl = normalizeUrl(i.url);
            const domain = getDomain(safeUrl);
            const candidates = getFaviconCandidates(domain, '');
            const iconUrl = candidates[0] || '';
            const candidatesAttr = escapeHtml(JSON.stringify(candidates));
            const href = safeUrl || '#';
            const disabled = safeUrl ? '' : ' aria-disabled="true" tabindex="-1"';
            return `<a href="${href}" class="card" target="_blank" rel="noopener" draggable="true" role="listitem" aria-label="${escTitle}"${disabled}><div class="ios-icon"><img class="card-icon" src="${iconUrl}" data-step="0" data-candidates="${candidatesAttr}" loading="lazy" decoding="async" data-url="${safeUrl}" data-title="${escTitle}"></div><div class="card-title">${displayTitle}</div></a>`;
        }).join('');
        bindIconEvents($('bookmarkGrid'));
    },

    updateSearchPlaceholder: function () {
        $('searchInput').placeholder = t('searchPlaceholder', { engine: Config.ENGINES[State.currentEngine].name });
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
    }
};

/** Module: Suggestion Manager (API & Rendering) */
const SuggestionManager = {
    _reqId: 0,
    _timer: 0,
    resolveProvider: function () {
        if (State.currentEngine === 'baidu' || State.currentEngine === 'sogou') return 'baidu';
        if (State.currentEngine === 'duckduckgo' || State.currentEngine === 'yandex') return 'google';
        if (State.currentEngine === 'bing') return 'google';
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
        const next = [q, ...list.filter(x => x !== q)].slice(0, 10);
        State.searchHistory = next;
        Storage.save();
    },

    renderHistory: function () {
        if (!State.searchHistoryEnabled) {
            this.clear();
            return;
        }
        const list = (State.searchHistory || []).slice(0, 6);
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
        this.renderHistory();
        showActionToast(t('historyItemRemoved'), 'success');
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
            State.bookmarks = get('my_bookmarks') || [];
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
                State.bookmarks = bookmarks || [];
                resolve();
            }).catch(() => resolve());
        };

        return new Promise((resolve) => {
            if (useChromeStorage) {
                chrome.storage.local.get(null, (data) => {
                    applyData(data || {});
                    afterBaseLoad(resolve);
                });
            } else {
                const getLocal = (k) => {
                    try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; }
                };
                const localData = {
                    my_bookmarks: getLocal('my_bookmarks'),
                    my_quicklinks: getLocal('my_quicklinks'),
                    my_style_config: getLocal('my_style_config'),
                    my_bg_config: getLocal('my_bg_config'),
                    my_search_engine: localStorage.getItem('my_search_engine') || 'google',
                    my_lang: localStorage.getItem('my_lang') || 'zh',
                    my_custom_bg_sources: getLocal('my_custom_bg_sources'),
                    my_search_history: getLocal('my_search_history'),
                    my_search_history_enabled: localStorage.getItem('my_search_history_enabled')
                };
                applyData(localData);
                afterBaseLoad(resolve);
            }
        });
    },
    save: function () {
        const data = {
            my_bookmarks: State.bookmarks,
            my_quicklinks: State.quickLinks,
            my_style_config: State.styles,
            my_bg_config: State.bgConfig,
            my_search_engine: State.currentEngine,
            my_lang: State.language,
            my_custom_bg_sources: State.customBgSources,
            my_search_history: State.searchHistory,
            my_search_history_enabled: String(State.searchHistoryEnabled)
        };

        if (isExtensionContext() && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set(data);
        } else {
            localStorage.setItem('my_bookmarks', JSON.stringify(State.bookmarks));
            localStorage.setItem('my_quicklinks', JSON.stringify(State.quickLinks));
            localStorage.setItem('my_style_config', JSON.stringify(State.styles));
            localStorage.setItem('my_bg_config', JSON.stringify(State.bgConfig));
            localStorage.setItem('my_search_engine', State.currentEngine);
            localStorage.setItem('my_lang', State.language);
            localStorage.setItem('my_custom_bg_sources', JSON.stringify(State.customBgSources));
            localStorage.setItem('my_search_history', JSON.stringify(State.searchHistory));
            localStorage.setItem('my_search_history_enabled', String(State.searchHistoryEnabled));
        }
    },
    export: function () {
        const data = {
            bookmarks: State.bookmarks,
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
                State.bookmarks = data.bookmarks || [];
                State.quickLinks = data.quickLinks || Config.DEFAULT_LINKS;
                State.styles = { ...State.styles, ...(data.styles || {}) };
                State.bgConfig = data.bgConfig || State.bgConfig;
                State.currentEngine = data.currentEngine || 'google';
                State.language = data.language || State.language;
                State.customBgSources = data.customBgSources || State.customBgSources;
                this.save();

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

                if (status) {
                    status.innerHTML = t('importSuccess');
                    status.style.color = '#4cd964';
                }
            } catch (err) {
                if (status) {
                    status.textContent = t('importInvalid');
                    status.style.color = '#ff3b30';
                }
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
        const action = open ? 'add' : 'remove';
        $('settingsSidebar').classList[action]('open');
        $('sidebarBackdrop').classList[action]('open');
        $('mainWrapper').classList[open ? 'add' : 'remove']('sidebar-open');
        if (open) { this.render(); UIManager.applySidebarWidth(); }
        else { Storage.load().then(() => { applyLanguage(); UIManager.applyStyles(); UIManager.applyBackground(false, { silent: true }); UIManager.renderDock(); UIManager.updateSearchPlaceholder(); }); }
    },

    render: function () {
        // Style Sliders
        $('appearanceControls').innerHTML = Config.STYLES.map(s => `
                <div class="range-container"><span class="range-label">${t(s.labelKey)}</span>
                <input type="range" min="${s.min}" max="${s.max}" value="${State.styles[s.id]}" data-style="${s.id}"></div>`
        ).join('');

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

        // Links
        $('quickLinksEditor').innerHTML = '';
        State.quickLinks.forEach(l => this.addLinkRow(l));

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
            row.innerHTML = `
                        <div class="custom-preview" style="background-image:url('${escapeHtml(s.url || '')}')"></div>
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
                } else alert(t('imageTooLarge'));
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
        row.innerHTML = `
                        <div class="custom-preview" style="background-image:url('${escapeHtml(d.url || '')}')"></div>
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

    save: function () {
        const rows = $$('#quickLinksEditor .link-editor-row');

        State.quickLinks = Array.from(rows).map(r => {
            const i = r.querySelectorAll('input');
            const normalized = normalizeUrl(i[1].value);
            return { title: i[0].value, url: normalized, icon: i[2].value };
        }).filter(l => l.title && l.url);

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

        Storage.save();
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
                $('importStatus').innerHTML = t('importDetected', { count: final.length });
                $('importStatus').style.color = '#4cd964';
            } else {
                $('importStatus').textContent = t('importFormatError');
                $('importStatus').style.color = '#ff3b30';
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
            this.dragSrcEl.classList.add('dragging');
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
        Storage.save();
        UIManager.renderDock();
        this.handleDragEnd();
    },

    handleTouchStart: function (e) {
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
            Storage.save();
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
    // Navigation
    $('bookmarkGrid').onclick = e => {
        const c = e.target.closest('.card[data-fid]');
        if (c) {
            State.breadcrumbPath.push({ id: c.dataset.fid, title: c.dataset.ftitle });
            UIManager.enterFolder(c.dataset.fid);
            if (scrollArea) scrollArea.scrollTop = 0;
        }
    };
    $('bookmarkGrid').onkeydown = e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const c = e.target.closest('.card[data-fid]');
        if (c) {
            e.preventDefault();
            State.breadcrumbPath.push({ id: c.dataset.fid, title: c.dataset.ftitle });
            UIManager.enterFolder(c.dataset.fid);
            if (scrollArea) scrollArea.scrollTop = 0;
        }
    };
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
            setSyncBtnState(false);
            showActionToast(t('syncLoading'));
            try {
                const bookmarks = await fetchBookmarksFromChrome();
                State.bookmarks = bookmarks || [];
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
                showActionToast(t('syncSuccess'), 'success');
            } catch (err) {
                showActionToast(t('syncFailed'), 'error');
            } finally {
                syncBtn.dataset.syncing = '';
                setSyncBtnState(syncAvailable());
            }
        });
    }

    const manageBtn = $('btnManageBookmarks');
    if (manageBtn) {
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
            SuggestionManager.clear(); // Hide web suggestions
            State.isSearchMode = true;
            const q = val.substring(1);

            if (!q.trim()) {
                UIManager.renderGrid([]);
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
        if (!input.value.trim() && !State.isSearchMode) {
            SuggestionManager.renderHistory();
        }
    });

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
        if (e.key === '/' && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
            input.value = '/';
            input.dispatchEvent(new Event('input'));
        }
    });

    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            SuggestionManager.clear();
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
    $('btnSaveSettings').onclick = () => SettingsManager.save();
    $('btnReset').onclick = Storage.reset;
    $('btnExportConfig').onclick = () => Storage.export();
    $('btnAddLinkRow').onclick = () => SettingsManager.addLinkRow();
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
window.onload = () => {
    Storage.load().then(() => {
        applyLanguage();
        UIManager.init();
        bindEvents();
        if (!isExtensionContext() && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(() => { });
        }
    });
};

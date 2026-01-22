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
        { title: "Google", url: "https://www.google.com", icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABfVBMVEX///8ZdtL/PQBMr1D/wQcAbs/Q3N6owun/MgD/vgD/vQD/NwD/LAD/MQD/wgD//vr/JABErUsoesEAbNH/RAD/bEH/xgc8qkE+q0X/7eT/9Ov/13Xo7u8Ab87/24X/+ev/49z/5tb/TgD/2sr/mXn/yLH/z7r/bjr/YC3/iFz/Zzn/4dL/YQL/7sb/9Nn/bQP/swb/xij/4JX/zEj/7805rlNZkcnN4rrW5sROnnmPxHqm0Zyey47m8eP/28X/wqb/pYX/k33/elr/YB//zsP/d1b/vKn/gFD/TBj/nYP/i2v/rpL/lXP/dEr/ZS7/YCT/hGz/fQD/oQb/z1f/kgX/6LP/3LujvMtwnslPjNLj6vOOsNF1odnZ4d//560xfcK6zt0WdcePsc/d1omTtTnuvxBsskfOvCNyu2mktzS1uS1jsUmyyuR2uFWQwW15rJBRp2HP3qw9ialKkpZRo205g7Wex3yMxodGlo08iKtMn3hTi7nB1prj57xisD7uzp0jAAAKU0lEQVR4nO2d+1/b1hXAhW0SgSTLCgYJB9cxBDeQkDVPu8bC5NFAeCVt+kiTZYEtbdg8WNJtpFspf/sky9iSLMnnXuneK3v6/tLHp8H3m3PuOUf3yinHJSQkJCQkJCQkJCQkJCQkJMCRDQrl62trlbW1crlg/iPrJUWFPHuluf7g4aN5QcwZiKL1l9T8o+cP1ptXZodbtPz46lfXUqIo8YIgpJwY/4aXRDG1/NXVx2XWC8Wi/GRjUxD5PjM3giCJwubGkwLrBSNRqDzI58SBcnZNMTf/tDIkGVtYfJgXebBcz5LP5bcq8Q/lwkZehMfODS9ubi2wVgiisD4fQq8TSXF+O67ZurAkSiH9LElR3LnOWsaDyjTO5vOBF3fjlqyVa2HT04UgTa+xlrJRmc9F69d2zO3FJVev7xLwsxyX4jDtFLYiKS/e8MJV5nV1OxVdffFCyi8y9Svv5Yj6pcxUnZ5lJ7hOMEFtjsITRn7lPZGCn4m4y2RcbRKqoF7wUoW6X2GJ+A50kKNdVMubElVBI1P3qBacJsLTbVQIKYpj3DrdDD1XzG1T8pOXaNVQN7mrdAQ/ZyVobMYlCoKFZ2THtGCkPeKdcXaefo2xGy6TNiznmQryy6S7YpltBPlrpAVnRz2CBcYRnCYtKD8b8QjKn7NsExT2IMdskrEEiacotz7qgotMhu2uIPkULY94keEKj0IbWpfaomje5EvS4LthuyD5FOWWQj3RC7yYSz17vrO+vVhZuLLweHF7fef5s1RO5EGaFCLINfE3oWl342lztu/lElmebT69AbCksAe5Mm4ZNRJzcyfwdl5e3NmUAiVppCi3jLcJBXFzB3ALKC9sBdwcUxHE64R8bncRurjC4rLP4SuNPciVcYY1XlxCu/y7vuEVR4mGILeHnqOCsIR+uFne6LsFoZKiGHVUEHfxLm8Xpp37QaIiWEAOoJTHv2NoCrYtQaNNGOwg9npB3AqzrsJSdztSKTJGAUAsM3yIAFos5q2PpLMHOW4XrcxEcdE32z5xphRBroJWZnLrUXyovJNLSXT2IMfd+hohhoIU1UsFzRylFOVWJme+AR8gCvnoXtRao3WrfSeTmZm8AaumQv4KpVVFyMpExmDmW8hjnJBn+E4INi8ybWa+GJypwyl4c8IyzGQn/zCgLQ5linLc5XPDwZkqxe1tUBClnqCZqUF3Fjm2757hcttumMlmvvbNVPEp67XicSvjZOYbnxNAfpf1UvG4O5FxK34x7xVGIR//70h4crnPMJOd8RriRPqvnEWC7E7STqb2tUZpi/VSMVnpD6GVqa4hTkgxf00ZE48k7WSqszUOaaMwkjTrLejOVGFI66j53ORr6Bji+KEcZkw+80nSThi/7Rxt8g9ZLxQbz0pqLzjWECfG4RsfWJQCktTK1PYQJ2ywXig23wUmqRVGY4jLxeWLSej49QpXpk6zXic+A7ZhJ1Mnvme9TmxKEMFM5tawjjO+I5uLic9wfvbcBQIgr+I2zPAmjuHFqfHIKb691OYH8CpegAxv4QhyF8fHSDH+EryKO+SSlKTh2I/QwlDK+s/dPSZXYmd4MAdcxE3YNsQSJGpYfAVcBKyU3omf4RS0qIJK6cTt+BmOQ4tp8KPTueF3MTR8DVzEZUiSTpbiZ1j8I3ARoGaRxRzZiBreBy4KNHdjFhqyhm9hhvIMQHDicgwNxy4BDUGFBm+iIWx4AFuDPOgIo22I2SzIGk7B1jDwkKZt+KdYGsLGNpgh3lQaD8ObEMPJu7E0fBOhIdbjb0wM74684ejHcPT34ejX0tHvh6M/0wzxXDoGNBzeZ4uDUX8+HAM+H/4fPOOP/jkN7KwNsyESNYSetQ3veemfgYsY2jPv8X3gImD3FpMxNITeW4z+3dPo3x8O6x1w8T54FXG7xy/CDMGlFPwuxl9wDHHexXjzG8gRXEqBpSb7Lk3rfRr5ABZEcKGBzN7Zn36+p1bJSTnYnwIJAs/02wx8ry37Pp1OK4fEnJzcByVpEf6yyeB3E7N/vWcYplWdmJSdN7AQjv8d4WcGH9WYGWoKppU6MSs7L2G1FHhI0yFoI7Yz1IJKEOeAHRRlGwZ2xOzf7nUNqQQRGELww6GF/7v6M+96gum0ViOk1eMCsN9P7SP9WL/vW2R/atkFaZRTWCEdQ+qGJt79Ivve4WfuRNI9EdgLUZPUb3B75xY0FMkONtBxBq1XtH9yfzXtNgkHhIvNS/CjCGKSeqSprUk4g0iy2OxDBRGenM5xf4e0M8Z4Qa4pzkFzFOW5oosjTb0zlHQ9lcF1FHpj4cDe9LPvW35+BlojcjeL1+BNCD4ptWP7Pr59jPHcimRaBrRRjKHOpOd0a03Wo0lQqDbQYWYMq86YdI5N3WOM916Mvtq8OgALYtUZkxdBTcJl2Ipace4AHsKxHzE/xJxrBmdoR1GLVhFJEHme6XInqEm4FSNti69QBMFXv/2sgDK0qxhdubmAJIgfQo47UhAUo2sa4FmtQ4iPqqkohml1NRLB1/A+aDIVIoQcd4wUxLR2iHn3bUP/B5ogdiHtfBxaECPYjLW0+iWSYJhdaNJAC6KRqY0wj8Ry3fgt1T4gFBrMcaZHKWjk9g5jiBGuqipWJryFz9zQe19fPiLmqRnGOl5rrB32PusX4GYEf9UpALSOYYVRw3DU65rtk7R/AhXDCyIXG8sRNY56XXX+TsLqDeIhqQ+nGoai4XhYg9YcuXqo9mWK9q/B9WYc9QjRB8Sm2HNsNSCB1Bvpfj/z13+4NKjewF++CKaEk6cdyXQjMJJyzUev/avT/w7ejNHkqAlGPe0tU1OPVqu6x/8bQa+u/qxqgfmh/hIURYTv3w/kBGsr2i3Pjj41Tk+rNV3Xa9WPq41PR2cD7CzFXwMUw41rTmSMltGnqSiapqkGmmb8PfBXBZXU0L3ejh4uiCHwHeHCzqNufg+xFcNh1BuvTJ26GK2g0RWZKabT/+lXHA87cHsQstqEQekb4YpRVpkumI0/CtQvnVEsRtXqnURRUHFxj3CRltEepRY7ReWD7ZEx/DNhLBV7JbW4T0qQrWJvhCMoyFrx1yLBPRgLRe2/xfEDwoKGIsOKaoxwvxFpE07kY3atXzsOf+IM4YTVAKeeUPHjmM2o6iktQY6rAR5eo0Zp/U5P0HhePKK9GbUjOluwi0x5M6on9P8o0arvGVn0KOpH6n4G+iGtTKXVJPo5pRJGhWYNdaMfkt+N6jHuH6MSDR8Jz6lKi8kOtFNqEExVRT1htQPt6MeEHBX1mM7XjgZTOyLgqKhH5L/MAafmcQE4Sn4mkToa+Rk3PxP9RI1mBNDUk7jsPzel1VboQCpq6zQO9dOXWt3/ThekdxLH9HRSqn06w5JU1LN6Ldbh6yHXVkE3vDY7TT1bBb+7EQ/0at2IyuC7XkUx/qvWcXVIgudCrzXqh632rbanm6aprcN6oxbXyglDLulV88WElqpad/jtq3z1rGW+ulDV9eHKzCBkA12vmRhaJqxXlJCQkJCQkJCQkJCQkJCQMFT8D+A9qt2p0niaAAAAAElFTkSuQmCC" },
        { title: "YouTube", url: "https://www.youtube.com", icon: "data:image/png;base64,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" },
        { title: "GitHub", url: "https://github.com", icon: "data:image/png;base64,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" },
        { title: "ChatGPT", url: "https://chat.openai.com", icon: "data:image/png;base64,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" }
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

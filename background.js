chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message.type !== 'suggest_fetch') return;

    const url = message.url;
    const responseType = message.responseType || 'json';

    fetch(url, { credentials: 'omit' })
        .then(async (res) => {
            if (!res.ok) throw new Error('suggest_fetch');
            if (responseType === 'text') {
                const lowerUrl = (url || '').toLowerCase();
                const isGbk = lowerUrl.includes('suggestion.baidu.com') || lowerUrl.includes('sogou.com');
                if (isGbk) {
                    const buffer = await res.arrayBuffer();
                    const decoder = new TextDecoder('gbk');
                    return decoder.decode(buffer);
                }
                return res.text();
            }
            return res.json();
        })
        .then((data) => sendResponse({ ok: true, data }))
        .catch((err) => sendResponse({ ok: false, error: String(err) }));

    return true;
});

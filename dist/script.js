/**
 * 知識ドリルDX — 生徒配布用ローダー
 * file:// で開き、CDN 上の本体を読み込む（classic script / no modules）
 *
 * 初期ハッシュ (abb7c49…): abb7c4954d80cc25617a025545de9fd685e08773
 */
(function () {
  'use strict';

  const FALLBACK_COMMIT_HASH = 'abb7c4954d80cc25617a025545de9fd685e08773';
  const REPO = 'dancedunce1988-max/dx';
  const JSDELIVR_HOST = 'cdn.jsdelivr.net';
  const RAW_HOST = 'raw.githubusercontent.com';

  function cdnBase(commitHash) {
    return 'https://' + JSDELIVR_HOST + '/gh/' + REPO + '@' + commitHash + '/';
  }

  function rawHtmlUrl(commitHash) {
    return 'https://' + RAW_HOST + '/' + REPO + '/' + commitHash + '/kokugo_app.html';
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showError(message) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML =
      '<div style="padding:1.5rem;font-family:sans-serif;line-height:1.6;color:#333;">' +
      '<p style="color:#b00020;font-weight:bold;margin:0 0 .5rem;">読み込みに失敗しました</p>' +
      '<p style="margin:0;white-space:pre-wrap;">' + escapeHtml(message) + '</p>' +
      '</div>';
  }

  function isDangerousSrc(src) {
    if (!src || typeof src !== 'string') return true;
    const s = src.trim();
    if (!s) return true;
    const lower = s.toLowerCase();
    if (lower.indexOf('javascript:') === 0) return true;
    if (lower.indexOf('data:') === 0) return true;
    if (lower.indexOf('vbscript:') === 0) return true;
    if (s.indexOf('..') !== -1) return true;
    return false;
  }

  function isAllowedAbsoluteUrl(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== 'https:') return false;
      if (u.hostname === JSDELIVR_HOST) {
        return u.pathname.indexOf('/gh/' + REPO + '@') === 0;
      }
      if (u.hostname === RAW_HOST) {
        return u.pathname.indexOf('/' + REPO + '/') === 0;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * 相対パス → jsDelivr 絶対 URL。既に絶対 URL なら許可ホストのみ通す。
   * 危険・不許可なら null。
   */
  function resolveAssetUrl(src, commitHash) {
    if (isDangerousSrc(src)) return null;
    const s = src.trim();

    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s) || s.indexOf('//') === 0) {
      const abs = s.indexOf('//') === 0 ? 'https:' + s : s;
      return isAllowedAbsoluteUrl(abs) ? abs : null;
    }

    const path = s.replace(/^\.\//, '').replace(/^\/+/, '');
    if (!path || path.indexOf('..') !== -1) return null;
    return cdnBase(commitHash) + path;
  }

  function rewriteAssetAttrs(root, commitHash) {
    const nodes = root.querySelectorAll('[src], [href]');
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      const tag = el.tagName.toLowerCase();
      if (tag === 'script') continue;

      if (el.hasAttribute('src')) {
        const src = el.getAttribute('src');
        const resolvedSrc = resolveAssetUrl(src, commitHash);
        if (resolvedSrc) el.setAttribute('src', resolvedSrc);
        else if (src && src.trim()) el.removeAttribute('src');
      }
      if (el.hasAttribute('href') && tag === 'link') {
        const href = el.getAttribute('href');
        const resolvedHref = resolveAssetUrl(href, commitHash);
        if (resolvedHref) el.setAttribute('href', resolvedHref);
      }
    }
  }

  function injectHeadStyles(doc, commitHash) {
    const head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;

    const styles = doc.querySelectorAll('head style');
    for (let i = 0; i < styles.length; i++) {
      const styleEl = document.createElement('style');
      styleEl.textContent = styles[i].textContent;
      head.appendChild(styleEl);
    }

    const links = doc.querySelectorAll('head link[rel="stylesheet"]');
    for (let j = 0; j < links.length; j++) {
      const href = links[j].getAttribute('href');
      const resolved = resolveAssetUrl(href, commitHash);
      if (!resolved) continue;
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = resolved;
      head.appendChild(linkEl);
    }
  }

  /**
   * 連続する外部 script はまとめて append（async=false → 並列取得・順序実行）。
   * インライン script の直前で、それまでの外部 script の完了を待つ。
   */
  function injectScriptsInOrder(scriptInfos) {
    return new Promise(function (resolve, reject) {
      let i = 0;
      let settled = false;

      function fail(err) {
        if (settled) return;
        settled = true;
        reject(err);
      }

      function done() {
        if (settled) return;
        settled = true;
        resolve();
      }

      function appendExternalBatch(batch) {
        return new Promise(function (res, rej) {
          if (batch.length === 0) {
            res();
            return;
          }
          let remaining = batch.length;
          for (let b = 0; b < batch.length; b++) {
            (function (info) {
              const s = document.createElement('script');
              s.async = false;
              s.onload = function () {
                remaining--;
                if (remaining === 0) res();
              };
              s.onerror = function () {
                rej(new Error('スクリプトの読み込みに失敗しました: ' + info.src));
              };
              s.src = info.src;
              document.body.appendChild(s);
            })(batch[b]);
          }
        });
      }

      function pump() {
        if (i >= scriptInfos.length) {
          done();
          return;
        }

        if (scriptInfos[i].src) {
          const batch = [];
          while (i < scriptInfos.length && scriptInfos[i].src) {
            batch.push(scriptInfos[i]);
            i++;
          }
          appendExternalBatch(batch).then(pump).catch(fail);
          return;
        }

        const inline = document.createElement('script');
        inline.textContent = scriptInfos[i].code || '';
        document.body.appendChild(inline);
        i++;
        pump();
      }

      pump();
    });
  }

  function collectScripts(doc, commitHash) {
    const list = [];
    const scripts = doc.querySelectorAll('script');
    for (let i = 0; i < scripts.length; i++) {
      const sc = scripts[i];
      const src = sc.getAttribute('src');
      if (src != null && String(src).trim() !== '') {
        const resolved = resolveAssetUrl(src, commitHash);
        if (!resolved) {
          throw new Error('許可されていないスクリプト URL です: ' + src);
        }
        list.push({ src: resolved });
      } else {
        list.push({ code: sc.textContent || '' });
      }
    }
    return list;
  }

  function extractVersion(doc) {
    const tag = doc.querySelector('span.ver-tag');
    if (!tag) return '';
    return (tag.textContent || '').trim();
  }

  function parseHtml(htmlText) {
    return new DOMParser().parseFromString(htmlText, 'text/html');
  }

  function fetchText(url) {
    return fetch(url, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) {
        throw new Error('HTTP ' + res.status + ' — ' + url);
      }
      return res.text();
    });
  }

  // 最新 config は @hash 固定だと永遠に古い。main の raw を読む（再配布不要のため）。
  // jsDelivr @main は CDN キャッシュが残りやすいので使わない。
  function fetchConfig() {
    const url =
      'https://' +
      RAW_HOST +
      '/' +
      REPO +
      '/main/dist/import-config.json?ts=' +
      String(Date.now());
    return fetch(url, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('設定の取得に失敗しました (HTTP ' + res.status + ')');
        }
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data.commitHash !== 'string' || !data.commitHash.trim()) {
          throw new Error('import-config.json に有効な commitHash がありません');
        }
        return data.commitHash.trim();
      });
  }

  function boot() {
    const hostApp = document.getElementById('app');
    if (!hostApp) {
      console.error('[DX] #app が見つかりません');
      return;
    }

    hostApp.innerHTML =
      '<p style="padding:1rem;font-family:sans-serif;color:#555;">読み込み中…</p>';

    let commitHash = FALLBACK_COMMIT_HASH;

    fetchConfig()
      .then(function (hash) {
        commitHash = hash;
      })
      .catch(function (err) {
        console.warn('[DX] config fetch failed, using fallback hash', err);
        commitHash = FALLBACK_COMMIT_HASH;
      })
      .then(function () {
        window.__DX_CDN_BASE__ = cdnBase(commitHash);

        return fetchText(rawHtmlUrl(commitHash)).then(function (htmlText) {
          const doc = parseHtml(htmlText);
          const remoteApp = doc.querySelector('#app');
          if (!remoteApp) {
            throw new Error('リモート HTML に #app がありません');
          }

          const ver = extractVersion(doc);
          if (ver) {
            document.title = '知識ドリルDX (' + ver + ')';
          }

          injectHeadStyles(doc, commitHash);

          // ネスト回避: remote #app の中身だけを host #app へ
          const wrapper = document.createElement('div');
          wrapper.innerHTML = remoteApp.innerHTML;
          rewriteAssetAttrs(wrapper, commitHash);
          hostApp.innerHTML = '';
          while (wrapper.firstChild) {
            hostApp.appendChild(wrapper.firstChild);
          }

          const scripts = collectScripts(doc, commitHash);
          return injectScriptsInOrder(scripts).then(function () {
            installNobiruOpener();
            /* CDN の旧 kokugo_app は jsDelivr HTML へ遷移して text/plain 表示になるため上書き。
               viaDaily（一日一読）は落とさず __DX_OPEN_NOBIRU__ へ渡す。 */
            window.ddOpenNobiru = function (key, viaDaily) {
              return window.__DX_OPEN_NOBIRU__(key, viaDaily ? { viaDaily: '1' } : {});
            };
          });
        });
      })
      .catch(function (err) {
        const msg =
          (err && err.message) ||
          String(err) ||
          '不明なエラーです。ネットワーク接続と CDN の状態を確認してください。';
        showError(msg);
        console.error('[DX] boot failed', err);
      });
  }

  /**
   * jsDelivr は .html を text/plain で返すため、直接 location 遷移するとソース表示になる。
   * Blob / <base> 併用は about:srcdoc・blob:null が相対パスになり
   * /nobiru/srcdoc や /nobiru/null/<uuid> を取りにいって壊れる。
   * → iframe srcdoc + 相対URLの絶対化（<base> なし）+ キャプチャ段階で遷移を差し替え。
   */
  function closeNobiruFrame() {
    const f = document.getElementById('dx-nobiru-frame');
    if (!f) return;
    try {
      f.srcdoc = '';
    } catch (e) {}
    f.hidden = true;
  }

  function showNobiruHtml(out) {
    try {
      if (window.frameElement && window.frameElement.id === 'dx-nobiru-frame') {
        window.frameElement.srcdoc = out;
        return;
      }
    } catch (e1) {}

    let f = document.getElementById('dx-nobiru-frame');
    if (!f) {
      f = document.createElement('iframe');
      f.id = 'dx-nobiru-frame';
      f.title = 'のびる読解';
      f.setAttribute(
        'style',
        'position:fixed;inset:0;border:0;width:100%;height:100%;z-index:99999;background:#fff;'
      );
      document.documentElement.appendChild(f);
    }
    f.hidden = false;
    f.srcdoc = out;
  }

  function resolveNobiruAsset(url, nobiruBase) {
    if (!url || typeof url !== 'string') return null;
    const s = url.trim();
    if (!s || s.charAt(0) === '#' || s.indexOf('mailto:') === 0 || s.indexOf('javascript:') === 0) {
      return null;
    }
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s) || s.indexOf('//') === 0) {
      return s;
    }
    if (s.indexOf('..') !== -1) return null;
    return nobiruBase + s.replace(/^\.\//, '').replace(/^\/+/, '');
  }

  function absolutizeNobiruHtml(html, nobiruBase) {
    /* .toString() で iframe に注入するため、クロージャ名ではなく window 経由で解決する */
    const resolve = window.__DX_RESOLVE_NOBIRU__;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const nodes = doc.querySelectorAll('[src], link[href], image[href]');
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      if (el.hasAttribute('src')) {
        const absSrc = resolve(el.getAttribute('src'), nobiruBase);
        if (absSrc) el.setAttribute('src', absSrc);
      }
      if (el.hasAttribute('href') && el.tagName.toLowerCase() === 'link') {
        const absHref = resolve(el.getAttribute('href'), nobiruBase);
        if (absHref) el.setAttribute('href', absHref);
      }
    }
    /* ホームリンクはクリックで差し替える。相対 href のまま残すと変な遷移の元になる */
    const homes = doc.querySelectorAll('a.back, a.modesel-back');
    for (let h = 0; h < homes.length; h++) {
      homes[h].setAttribute('href', '#');
    }
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  }

  function openNobiruPage(key, searchObj) {
    const base = window.__DX_CDN_BASE__;
    let home = window.__DX_HOME_URL__ || '';
    try {
      if (!home && (!window.frameElement || window.frameElement.id !== 'dx-nobiru-frame')) {
        home = location.href;
      }
    } catch (e0) {
      home = home || location.href;
    }

    if (!base) {
      const qsLocal = new URLSearchParams(searchObj || {});
      let localUrl = 'nobiru/' + key + '.html';
      if (qsLocal.toString()) localUrl += '?' + qsLocal.toString();
      location.href = localUrl;
      return Promise.resolve();
    }

    const nobiruBase = base + 'nobiru/';
    const bootParams = new URLSearchParams(searchObj || {});
    const bootSearch = bootParams.toString() ? '?' + bootParams.toString() : '';
    const htmlName = String(key || '').replace(/[^A-Za-z0-9_-]/g, '');
    if (!htmlName) {
      return Promise.reject(new Error('不正な教材キーです'));
    }

    return fetch(nobiruBase + htmlName + '.html', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('のびる読解の取得に失敗しました (HTTP ' + res.status + ')');
        }
        return res.text();
      })
      .then(function (html) {
        const openerSrc =
          'window.__DX_OPEN_NOBIRU__=(' +
          window.__DX_OPEN_NOBIRU__.toString() +
          ');' +
          'window.__DX_SHOW_NOBIRU_HTML__=(' +
          window.__DX_SHOW_NOBIRU_HTML__.toString() +
          ');' +
          'window.__DX_CLOSE_NOBIRU__=function(){try{if(parent!==window&&parent.__DX_CLOSE_NOBIRU__)parent.__DX_CLOSE_NOBIRU__();}catch(e){}};' +
          'window.__DX_RESOLVE_NOBIRU__=(' +
          window.__DX_RESOLVE_NOBIRU__.toString() +
          ');' +
          'window.__DX_ABS_NOBIRU__=(' +
          window.__DX_ABS_NOBIRU__.toString() +
          ');';

        const boot =
          '<script>(function(){' +
          'window.__DX_CDN_BASE__=' +
          JSON.stringify(base) +
          ';' +
          'window.__DX_HOME_URL__=' +
          JSON.stringify(home) +
          ';' +
          'window.__DX_NOBIRU_KEY__=' +
          JSON.stringify(htmlName) +
          ';' +
          'window.__DX_NOBIRU_BASE__=' +
          JSON.stringify(nobiruBase) +
          ';' +
          'window.__DX_BOOT_SEARCH__=' +
          JSON.stringify(bootSearch) +
          ';' +
          'try{const d=Object.getOwnPropertyDescriptor(Location.prototype,"search");' +
          'if(d&&d.get&&window.__DX_BOOT_SEARCH__){Object.defineProperty(Location.prototype,"search",{' +
          'configurable:true,enumerable:true,get:function(){' +
          'if(this===window.location&&window.__DX_BOOT_SEARCH__)return window.__DX_BOOT_SEARCH__;' +
          'return d.get.call(this);}});}}catch(e){}' +
          /* 動的 script.src = "engine.js" を CDN 絶対URLへ */
          '(function(){const nb=' +
          JSON.stringify(nobiruBase) +
          ';const ce=document.createElement.bind(document);' +
          'document.createElement=function(tag){const el=ce(tag);' +
          'if(String(tag).toLowerCase()==="script"){const sa=el.setAttribute.bind(el);' +
          'el.setAttribute=function(n,v){if(String(n).toLowerCase()==="src"&&v&&!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)&&v.indexOf("//")!==0){' +
          'v=nb+String(v).replace(/^\\.\\//,"").replace(/^\\/+/,"");}return sa(n,v);};' +
          'try{Object.defineProperty(el,"src",{configurable:true,enumerable:true,' +
          'get:function(){return el.getAttribute("src");},' +
          'set:function(v){el.setAttribute("src",v);}});}' +
          'catch(e2){}}return el;};})();' +
          'window.__DX_GO_HOME__=function(){try{if(parent!==window&&parent.__DX_CLOSE_NOBIRU__){parent.__DX_CLOSE_NOBIRU__();return;}}catch(e){}' +
          'if(window.__DX_HOME_URL__)location.href=window.__DX_HOME_URL__;};' +
          /* キャプチャで srcdoc 上の壊れる遷移（pathname=srcdoc / ../kokugo_app / reload）を潰す */
          'document.addEventListener("click",function(ev){' +
          'const btn=ev.target&&ev.target.closest&&ev.target.closest(".modesel-card[data-mode]");' +
          'if(btn&&window.__DX_OPEN_NOBIRU__){ev.preventDefault();ev.stopImmediatePropagation();' +
          'window.__DX_OPEN_NOBIRU__(window.__DX_NOBIRU_KEY__,{mode:btn.getAttribute("data-mode")});return;}' +
          'const sw=ev.target&&ev.target.closest&&ev.target.closest("a.modeSwitch, #modeSwitch");' +
          'if(sw&&window.__DX_OPEN_NOBIRU__&&window.__DX_NOBIRU_KEY__){ev.preventDefault();ev.stopImmediatePropagation();' +
          'window.__DX_OPEN_NOBIRU__(window.__DX_NOBIRU_KEY__,{});return;}' +
          'const a=ev.target&&ev.target.closest&&ev.target.closest("a.back, a.modesel-back");' +
          'if(a){ev.preventDefault();ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();return;}' +
          'const again=ev.target&&ev.target.closest&&ev.target.closest("button.again");' +
          'if(again){const oc=String(again.getAttribute("onclick")||"");const tx=String(again.textContent||"");' +
          'if(again.classList.contains("daily-end")||oc.indexOf("kokugo_app")!==-1||tx.indexOf("ホーム")!==-1||tx.indexOf("一日一読を終える")!==-1){' +
          'ev.preventDefault();ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();return;}' +
          'if(oc.indexOf("location.reload")!==-1||tx.indexOf("はじめからやり直す")!==-1){' +
          'ev.preventDefault();ev.stopImmediatePropagation();' +
          'if(window.__DX_OPEN_NOBIRU__&&window.__DX_NOBIRU_KEY__){const o={};' +
          'try{new URLSearchParams(window.__DX_BOOT_SEARCH__||"").forEach(function(v,k){o[k]=v;});}catch(e3){}' +
          'window.__DX_OPEN_NOBIRU__(window.__DX_NOBIRU_KEY__,o);}return;}}' +
          '},true);' +
          openerSrc +
          '})();<\/script>';

        /* <base> は使わない（about:srcdoc → /nobiru/srcdoc 事故の原因） */
        const absHtml = window.__DX_ABS_NOBIRU__(html, nobiruBase);
        let out = absHtml;
        if (/<head[^>]*>/i.test(out)) {
          out = out.replace(/<head[^>]*>/i, function (m) {
            return m + boot;
          });
        } else {
          out = boot + out;
        }

        window.__DX_SHOW_NOBIRU_HTML__(out);
      });
  }

  function installNobiruOpener() {
    window.__DX_OPEN_NOBIRU__ = openNobiruPage;
    window.__DX_SHOW_NOBIRU_HTML__ = showNobiruHtml;
    window.__DX_CLOSE_NOBIRU__ = closeNobiruFrame;
    /* ABS が RESOLVE を参照するため、RESOLVE を先に載せる */
    window.__DX_RESOLVE_NOBIRU__ = resolveNobiruAsset;
    window.__DX_ABS_NOBIRU__ = absolutizeNobiruHtml;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

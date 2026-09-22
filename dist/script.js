/**
 * 知識ドリルDX — 生徒配布用ローダー
 * file:// で開き、CDN 上の本体を読み込む（classic script / no modules）
 *
 * 初期ハッシュ (abb7c49…): abb7c4954d80cc25617a025545de9fd685e08773
 */
(function () {
  'use strict';

  var FALLBACK_COMMIT_HASH = 'abb7c4954d80cc25617a025545de9fd685e08773';
  var REPO = 'happa0827/dx';
  var JSDELIVR_HOST = 'cdn.jsdelivr.net';
  var RAW_HOST = 'raw.githubusercontent.com';

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
    var app = document.getElementById('app');
    if (!app) return;
    app.innerHTML =
      '<div style="padding:1.5rem;font-family:sans-serif;line-height:1.6;color:#333;">' +
      '<p style="color:#b00020;font-weight:bold;margin:0 0 .5rem;">読み込みに失敗しました</p>' +
      '<p style="margin:0;white-space:pre-wrap;">' + escapeHtml(message) + '</p>' +
      '</div>';
  }

  function isDangerousSrc(src) {
    if (!src || typeof src !== 'string') return true;
    var s = src.trim();
    if (!s) return true;
    var lower = s.toLowerCase();
    if (lower.indexOf('javascript:') === 0) return true;
    if (lower.indexOf('data:') === 0) return true;
    if (lower.indexOf('vbscript:') === 0) return true;
    if (s.indexOf('..') !== -1) return true;
    return false;
  }

  function isAllowedAbsoluteUrl(url) {
    try {
      var u = new URL(url);
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
    var s = src.trim();

    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s) || s.indexOf('//') === 0) {
      var abs = s.indexOf('//') === 0 ? 'https:' + s : s;
      return isAllowedAbsoluteUrl(abs) ? abs : null;
    }

    var path = s.replace(/^\.\//, '').replace(/^\/+/, '');
    if (!path || path.indexOf('..') !== -1) return null;
    return cdnBase(commitHash) + path;
  }

  function rewriteAssetAttrs(root, commitHash) {
    var nodes = root.querySelectorAll('[src], [href]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var tag = el.tagName.toLowerCase();
      if (tag === 'script') continue;

      if (el.hasAttribute('src')) {
        var src = el.getAttribute('src');
        var resolvedSrc = resolveAssetUrl(src, commitHash);
        if (resolvedSrc) el.setAttribute('src', resolvedSrc);
        else if (src && src.trim()) el.removeAttribute('src');
      }
      if (el.hasAttribute('href') && tag === 'link') {
        var href = el.getAttribute('href');
        var resolvedHref = resolveAssetUrl(href, commitHash);
        if (resolvedHref) el.setAttribute('href', resolvedHref);
      }
    }
  }

  function injectHeadStyles(doc, commitHash) {
    var head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;

    var styles = doc.querySelectorAll('head style');
    for (var i = 0; i < styles.length; i++) {
      var styleEl = document.createElement('style');
      styleEl.textContent = styles[i].textContent;
      head.appendChild(styleEl);
    }

    var links = doc.querySelectorAll('head link[rel="stylesheet"]');
    for (var j = 0; j < links.length; j++) {
      var href = links[j].getAttribute('href');
      var resolved = resolveAssetUrl(href, commitHash);
      if (!resolved) continue;
      var linkEl = document.createElement('link');
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
      var i = 0;
      var settled = false;

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
          var remaining = batch.length;
          for (var b = 0; b < batch.length; b++) {
            (function (info) {
              var s = document.createElement('script');
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
          var batch = [];
          while (i < scriptInfos.length && scriptInfos[i].src) {
            batch.push(scriptInfos[i]);
            i++;
          }
          appendExternalBatch(batch).then(pump).catch(fail);
          return;
        }

        var inline = document.createElement('script');
        inline.textContent = scriptInfos[i].code || '';
        document.body.appendChild(inline);
        i++;
        pump();
      }

      pump();
    });
  }

  function collectScripts(doc, commitHash) {
    var list = [];
    var scripts = doc.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
      var sc = scripts[i];
      var src = sc.getAttribute('src');
      if (src != null && String(src).trim() !== '') {
        var resolved = resolveAssetUrl(src, commitHash);
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
    var tag = doc.querySelector('span.ver-tag');
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
    var url =
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
    var hostApp = document.getElementById('app');
    if (!hostApp) {
      console.error('[DX] #app が見つかりません');
      return;
    }

    hostApp.innerHTML =
      '<p style="padding:1rem;font-family:sans-serif;color:#555;">読み込み中…</p>';

    var commitHash = FALLBACK_COMMIT_HASH;

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
          var doc = parseHtml(htmlText);
          var remoteApp = doc.querySelector('#app');
          if (!remoteApp) {
            throw new Error('リモート HTML に #app がありません');
          }

          var ver = extractVersion(doc);
          if (ver) {
            document.title = '知識ドリルDX (' + ver + ')';
          }

          injectHeadStyles(doc, commitHash);

          // ネスト回避: remote #app の中身だけを host #app へ
          var wrapper = document.createElement('div');
          wrapper.innerHTML = remoteApp.innerHTML;
          rewriteAssetAttrs(wrapper, commitHash);
          hostApp.innerHTML = '';
          while (wrapper.firstChild) {
            hostApp.appendChild(wrapper.firstChild);
          }

          var scripts = collectScripts(doc, commitHash);
          return injectScriptsInOrder(scripts).then(function () {
            installNobiruOpener();
            /* CDN の旧 kokugo_app は jsDelivr HTML へ遷移して text/plain 表示になるため上書き */
            window.ddOpenNobiru = function (key) {
              return window.__DX_OPEN_NOBIRU__(key, {});
            };
          });
        });
      })
      .catch(function (err) {
        var msg =
          (err && err.message) ||
          String(err) ||
          '不明なエラーです。ネットワーク接続と CDN の状態を確認してください。';
        showError(msg);
        console.error('[DX] boot failed', err);
      });
  }

  /**
   * jsDelivr は .html を text/plain で返すため、直接 location 遷移するとソース表示になる。
   * Blob URL も file:// 由来だと blob:null/uuid になり、<base> 解決で
   * /nobiru/null/<uuid> を取りにいって壊れる。
   * → ランチャー上の iframe srcdoc で text/html として開く。
   */
  function closeNobiruFrame() {
    var f = document.getElementById('dx-nobiru-frame');
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

    var f = document.getElementById('dx-nobiru-frame');
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

  function openNobiruPage(key, searchObj) {
    var base = window.__DX_CDN_BASE__;
    var home = window.__DX_HOME_URL__ || '';
    try {
      if (!home && (!window.frameElement || window.frameElement.id !== 'dx-nobiru-frame')) {
        home = location.href;
      }
    } catch (e0) {
      home = home || location.href;
    }

    if (!base) {
      var qsLocal = new URLSearchParams(searchObj || {});
      var localUrl = 'nobiru/' + key + '.html';
      if (qsLocal.toString()) localUrl += '?' + qsLocal.toString();
      location.href = localUrl;
      return Promise.resolve();
    }

    var nobiruBase = base + 'nobiru/';
    var bootParams = new URLSearchParams(searchObj || {});
    var bootSearch = bootParams.toString() ? '?' + bootParams.toString() : '';
    var htmlName = String(key || '').replace(/[^A-Za-z0-9_-]/g, '');
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
        var openerSrc =
          'window.__DX_OPEN_NOBIRU__=(' +
          openNobiruPage.toString() +
          ');' +
          'window.__DX_SHOW_NOBIRU_HTML__=(' +
          showNobiruHtml.toString() +
          ');' +
          'window.__DX_CLOSE_NOBIRU__=function(){try{if(parent!==window&&parent.__DX_CLOSE_NOBIRU__)parent.__DX_CLOSE_NOBIRU__();}catch(e){}};';

        /* about:srcdoc では location.search が空のことがあるため、getter を一時的に被せる */
        var boot =
          '<base href="' +
          nobiruBase.replace(/"/g, '&quot;') +
          '">' +
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
          'window.__DX_BOOT_SEARCH__=' +
          JSON.stringify(bootSearch) +
          ';' +
          'try{var d=Object.getOwnPropertyDescriptor(Location.prototype,"search");' +
          'if(d&&d.get&&window.__DX_BOOT_SEARCH__){Object.defineProperty(Location.prototype,"search",{' +
          'configurable:true,enumerable:true,get:function(){' +
          'if(this===window.location&&window.__DX_BOOT_SEARCH__)return window.__DX_BOOT_SEARCH__;' +
          'return d.get.call(this);}});}}catch(e){}' +
          'window.__DX_GO_HOME__=function(){try{if(parent!==window&&parent.__DX_CLOSE_NOBIRU__){parent.__DX_CLOSE_NOBIRU__();return;}}catch(e){}' +
          'if(window.__DX_HOME_URL__)location.href=window.__DX_HOME_URL__;};' +
          openerSrc +
          '})();<\/script>';

        var patch =
          '<script>(function(){function patch(){' +
          'document.querySelectorAll(".modesel-card[data-mode]").forEach(function(btn){' +
          'btn.onclick=function(){if(window.__DX_OPEN_NOBIRU__)window.__DX_OPEN_NOBIRU__(window.__DX_NOBIRU_KEY__,{mode:btn.getAttribute("data-mode")});};' +
          '});' +
          'document.querySelectorAll("a.back, a.modesel-back").forEach(function(a){' +
          'a.addEventListener("click",function(ev){ev.preventDefault();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();});' +
          '});}' +
          'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(patch,0);});' +
          'else setTimeout(patch,0);})();<\/script>';

        var out = html;
        if (/<head[^>]*>/i.test(out)) {
          out = out.replace(/<head[^>]*>/i, function (m) {
            return m + boot;
          });
        } else {
          out = boot + out;
        }
        if (/<\/body>/i.test(out)) {
          out = out.replace(/<\/body>/i, patch + '</body>');
        } else {
          out = out + patch;
        }

        window.__DX_SHOW_NOBIRU_HTML__(out);
      });
  }

  function installNobiruOpener() {
    window.__DX_OPEN_NOBIRU__ = openNobiruPage;
    window.__DX_SHOW_NOBIRU_HTML__ = showNobiruHtml;
    window.__DX_CLOSE_NOBIRU__ = closeNobiruFrame;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

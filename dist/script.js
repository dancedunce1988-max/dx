/**
 * 知識ドリルDX — CDN 上の厚いローダー
 * file:// の index.html が、このファイルをコミットハッシュ付きで読む。
 * URL にハッシュがあるときは、その世代の本体だけを取る（設定は読み直さない）。
 * index.html?local=1 でローカルのこのファイルを開いたときは、import-config を読む。
 *
 * フォールバックハッシュ: index.html の起動役と同じ値に保つ
 * dist/script.js がある世代（33026c5 にはこのファイルが無い）
 * 3fd657b029e1a8ae84444ac8af969dab40f97caa
 */
(function () {
  'use strict';

  const FALLBACK_COMMIT_HASH = '3fd657b029e1a8ae84444ac8af969dab40f97caa';
  const COMMIT_HASH_RE = /^[0-9a-f]{40}$/i;

  /* DOMContentLoaded より前に取る。コールバックの中では currentScript は null。 */
  function hashFromThisScript() {
    const src = document.currentScript && document.currentScript.src;
    if (!src) return '';
    try {
      const u = new URL(src);
      const marker = '/gh/' + REPO + '@';
      if (u.protocol !== 'https:' || u.hostname !== JSDELIVR_HOST || u.username || u.password) return '';
      if (u.pathname.indexOf(marker) !== 0) return '';
      const after = u.pathname.slice(marker.length);
      const slash = after.indexOf('/');
      const hash = (slash < 0 ? after : after.slice(0, slash)).toLowerCase();
      const rest = slash < 0 ? '' : after.slice(slash);
      if (!COMMIT_HASH_RE.test(hash) || rest !== '/dist/script.js') return '';
      return hash;
    } catch (eHash) {
      return '';
    }
  }

  const REPO = 'dancedunce1988-max/dx';
  const JSDELIVR_HOST = 'cdn.jsdelivr.net';
  const RAW_HOST = 'raw.githubusercontent.com';
  const PINNED_COMMIT_HASH = hashFromThisScript();
  window.__DX_REPO__ = REPO;
  window.__DX_JSDELIVR_HOST__ = JSDELIVR_HOST;
  window.__DX_RAW_HOST__ = RAW_HOST;

  function cdnBase(commitHash) {
    return 'https://' + JSDELIVR_HOST + '/gh/' + REPO + '@' + commitHash + '/';
  }

  /* ピン済みの本体は fetch だけなので jsDelivr。text/plain は画面遷移のときだけ問題になる。 */
  function appHtmlUrl(commitHash) {
    return cdnBase(commitHash) + 'kokugo_app.html';
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setBootStatus(label, ratio) {
    const labelEl = document.getElementById('dx-boot-label');
    const bar = document.getElementById('dx-boot-bar');
    const progress = document.getElementById('dx-boot-progress');
    const detail = document.getElementById('dx-boot-detail');
    if (labelEl && label && labelEl.textContent !== label) labelEl.textContent = label;
    if (detail && ratio == null) detail.textContent = '';
    if (!bar || !progress) return;
    if (ratio == null) {
      bar.classList.add('is-indeterminate');
      bar.style.width = '';
      progress.removeAttribute('aria-valuenow');
      return;
    }
    const pct = Math.max(0, Math.min(100, Math.round(ratio * 100)));
    bar.classList.remove('is-indeterminate');
    bar.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(pct));
  }

  function hideBoot() {
    const el = document.getElementById('dx-boot');
    const app = document.getElementById('app');
    const reveal = function () {
      if (app && app.getAttribute('data-dx-boot-hidden') === '1') {
        app.removeAttribute('aria-hidden');
        app.removeAttribute('data-dx-boot-hidden');
      }
    };
    if (!el || el.getAttribute('data-closing') === '1') {
      reveal();
      return;
    }
    el.setAttribute('data-closing', '1');
    el.setAttribute('aria-busy', 'false');
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let removed = false;
    const remove = function () {
      if (removed) return;
      removed = true;
      if (el.parentNode) el.parentNode.removeChild(el);
      reveal();
    };
    if (reduce) {
      remove();
      return;
    }
    el.classList.add('is-done');
    el.addEventListener('transitionend', function (ev) {
      if (ev.target !== el || ev.propertyName !== 'opacity') return;
      remove();
    });
    setTimeout(remove, 500);
  }

  function showError(message) {
    const boot = document.getElementById('dx-boot');
    const card = boot && boot.querySelector('.dx-boot-card');
    const html =
      '<p class="dx-boot-title">知識ドリル<span>DX</span></p>' +
      '<p class="dx-boot-error-title">読み込みに失敗しました</p>' +
      '<p class="dx-boot-error">' + escapeHtml(message) + '</p>';
    if (boot && card) {
      boot.setAttribute('aria-busy', 'false');
      card.innerHTML = html;
      return;
    }
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML =
      '<div style="padding:1.5rem;font-family:sans-serif;line-height:1.6;color:#333;">' +
      '<p style="color:#b00020;font-weight:bold;margin:0 0 .5rem;">読み込みに失敗しました</p>' +
      '<p style="margin:0;white-space:pre-wrap;">' + escapeHtml(message) + '</p>' +
      '</div>';
  }

  /**
   * 相対パス → base 付きの絶対 URL。既に絶対 URL なら、base と同じコミットの
   * jsDelivr / raw だけ通す。危険・不許可なら null。
   * toString で iframe に渡すため window の定数だけを見る。
   * 判定に使う文字列と返す文字列を分けない（空白を抜いた形だけ見て、元の文字列を返さない）。
   */
  function resolveCdnUrl(url, base) {
    const repo = window.__DX_REPO__;
    const jsdelivrHost = window.__DX_JSDELIVR_HOST__;
    const rawHost = window.__DX_RAW_HOST__;
    if (!url || typeof url !== 'string' || !base) return null;
    const s = url.trim();
    if (!s || s.charAt(0) === '#') return null;
    /* 途中の空白・制御文字は、抜いた結果だけを検査すると別 URL に化ける */
    if (/[\u0000-\u0020\u007f]/.test(s)) return null;

    /* %2e%2e のようなエンコードを戻す。戻し切っても %2e / %2f / %5c が残るものは拒否する。 */
    function checkText(raw) {
      let t = String(raw);
      for (let n = 0; n < 8; n++) {
        let decoded;
        try {
          decoded = decodeURIComponent(t);
        } catch (e) {
          return null;
        }
        if (decoded === t) break;
        t = decoded;
      }
      if (/[\u0000-\u0020\u007f]/.test(t)) return null;
      if (/%(?:2e|2f|5c)/i.test(t)) return null;
      return t.toLowerCase();
    }

    function isUnsafe(text) {
      if (text == null) return true;
      if (text.indexOf('mailto:') === 0) return true;
      if (text.indexOf('javascript:') === 0) return true;
      if (text.indexOf('data:') === 0) return true;
      if (text.indexOf('vbscript:') === 0) return true;
      if (text.indexOf('..') !== -1) return true;
      if (text.indexOf('\\') !== -1) return true;
      return false;
    }

    const checked = checkText(s);
    if (isUnsafe(checked)) return null;

    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s);
    const originalAbs = hasScheme || s.indexOf('//') === 0;
    const decodedAbs = /^[a-z][a-z0-9+.-]*:/.test(checked) || checked.indexOf('//') === 0;
    if (decodedAbs && !originalAbs) return null;
    if (hasScheme && !/^https:/i.test(s)) return null;

    let pinnedJs = '';
    let pinnedRaw = '';
    try {
      const b = new URL(base);
      const marker = '/gh/' + repo + '@';
      if (b.protocol !== 'https:' || b.hostname !== jsdelivrHost || b.username || b.password) return null;
      if (b.pathname.indexOf(marker) !== 0) return null;
      const after = b.pathname.slice(marker.length);
      const slash = after.indexOf('/');
      const hash = slash < 0 ? after : after.slice(0, slash);
      if (!/^[0-9a-f]{40}$/i.test(hash)) return null;
      pinnedJs = marker + hash + '/';
      pinnedRaw = '/' + repo + '/' + hash + '/';
    } catch (ePin) {
      return null;
    }

    let resolved;
    try {
      if (originalAbs) {
        resolved = new URL(s.indexOf('//') === 0 ? 'https:' + s : s);
      } else {
        const path = s.replace(/^\.\//, '').replace(/^\/+/, '');
        if (!path) return null;
        resolved = new URL(path, base);
      }
    } catch (eUrl) {
      return null;
    }
    if (resolved.protocol !== 'https:' || resolved.username || resolved.password) return null;
    if (isUnsafe(checkText(resolved.pathname + resolved.search + resolved.hash))) return null;
    if (resolved.hostname === jsdelivrHost && resolved.pathname.indexOf(pinnedJs) === 0) return resolved.href;
    if (resolved.hostname === rawHost && resolved.pathname.indexOf(pinnedRaw) === 0) return resolved.href;
    return null;
  }

  /* 本体の注入でも srcdoc でも同じ判定を使う。window 経由で参照する関数（rewriteAssetAttrs 等）のため先に載せる */
  window.__DX_RESOLVE_NOBIRU__ = resolveCdnUrl;

  function resolveAssetUrl(src, commitHash) {
    return resolveCdnUrl(src, cdnBase(commitHash));
  }

  /* src と link の href を base 付きの絶対 URL にする。許可外は属性ごと外す。
     本体 #app（script は別に集める）と、のびる読解・ミニゲームの srcdoc の両方で使う。
     toString で iframe に渡すため、判定は window.__DX_RESOLVE_NOBIRU__ を見る。 */
  function rewriteAssetAttrs(root, base, skipScripts) {
    const resolve = window.__DX_RESOLVE_NOBIRU__;
    const nodes = root.querySelectorAll('[src], link[href]');
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      const tag = el.tagName.toLowerCase();
      if (skipScripts && tag === 'script') continue;

      if (el.hasAttribute('src')) {
        const src = el.getAttribute('src');
        const resolvedSrc = resolve(src, base);
        if (resolvedSrc) el.setAttribute('src', resolvedSrc);
        else if (src && String(src).trim()) el.removeAttribute('src');
      }
      if (tag === 'link' && el.hasAttribute('href')) {
        const href = el.getAttribute('href');
        const resolvedHref = resolve(href, base);
        if (resolvedHref) el.setAttribute('href', resolvedHref);
        else if (href && String(href).trim()) el.removeAttribute('href');
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
  function injectScriptsInOrder(scriptInfos, onProgress) {
    return new Promise(function (resolve, reject) {
      let i = 0;
      let settled = false;
      let finished = 0;
      const total = scriptInfos.length;

      function note() {
        finished++;
        if (typeof onProgress === 'function') onProgress(finished, total);
      }

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
                note();
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
        note();
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

  function fetchText(url, commitHash) {
    const base = cdnBase(commitHash);
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('HTTP ' + res.status + ' — ' + url);
      }
      /* 転送先が別ホストや別コミットなら、許可した URL の中身ではない */
      if (!resolveCdnUrl(res.url, base)) {
        throw new Error('許可されていない URL へ転送されました');
      }
      return res.text();
    });
  }

  function allowedConfigResponseUrl(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== 'https:' || u.hostname !== RAW_HOST || u.username || u.password) return false;
      return u.pathname === '/' + REPO + '/main/dist/import-config.json';
    } catch (e) {
      return false;
    }
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
        if (!allowedConfigResponseUrl(res.url)) {
          throw new Error('許可されていない URL へ転送されました');
        }
        return res.json();
      })
      .then(function (data) {
        const hash = data && typeof data.commitHash === 'string' ? data.commitHash.trim().toLowerCase() : '';
        if (!COMMIT_HASH_RE.test(hash)) {
          throw new Error('import-config.json の commitHash が不正です');
        }
        return hash;
      });
  }

  function boot() {
    const hostApp = document.getElementById('app');
    if (!hostApp) {
      console.error('[DX] #app が見つかりません');
      return;
    }

    /* ロード画面は #app の外に置く。中に置くと本体 HTML を入れた瞬間に消え、
       スクリプト完了前の空画面が見えてしまう。 */
    hostApp.setAttribute('aria-hidden', 'true');
    hostApp.setAttribute('data-dx-boot-hidden', '1');
    if (!PINNED_COMMIT_HASH) setBootStatus('最新の版を確認しています');

    let commitHash = PINNED_COMMIT_HASH || FALLBACK_COMMIT_HASH;

    const loadAppHtml = function (requested) {
      setBootStatus(requested === FALLBACK_COMMIT_HASH && !PINNED_COMMIT_HASH
        ? '前回の版を取得しています'
        : 'アプリ本体を取得しています');
      return fetchText(appHtmlUrl(requested), requested).then(function (htmlText) {
        return { hash: requested, htmlText: htmlText };
      });
    };

    /* CDN から読まれた世代は、その HTML だけ。別世代へは落とさない。 */
    const appReady = PINNED_COMMIT_HASH
      ? loadAppHtml(PINNED_COMMIT_HASH)
      : fetchConfig()
          .then(function (hash) {
            commitHash = hash;
          })
          .catch(function (err) {
            console.warn('[DX] config fetch failed, using fallback hash', err);
            commitHash = FALLBACK_COMMIT_HASH;
          })
          .then(function () {
            const requested = commitHash;
            return loadAppHtml(requested).catch(function (err) {
              if (requested === FALLBACK_COMMIT_HASH) throw err;
              console.warn('[DX] app html fetch failed, using fallback hash', err);
              commitHash = FALLBACK_COMMIT_HASH;
              return loadAppHtml(FALLBACK_COMMIT_HASH);
            });
          });

    appReady
      .then(function (loaded) {
        commitHash = loaded.hash;
        window.__DX_CDN_BASE__ = cdnBase(commitHash);
        const htmlText = loaded.htmlText;
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

        /* スクリプトの中身は、ノードを移す前に控える。移したあとは doc から外れる。 */
        const scripts = collectScripts(doc, commitHash);

        /* ネスト回避: remote #app の中身だけを host #app へ。
           innerHTML でパースし直さない。script は別に実行するので、ここからは外す。 */
        const fragment = document.createDocumentFragment();
        while (remoteApp.firstChild) {
          fragment.appendChild(document.adoptNode(remoteApp.firstChild));
        }
        const inertScripts = fragment.querySelectorAll('script');
        for (let s = 0; s < inertScripts.length; s++) {
          const node = inertScripts[s];
          if (node.parentNode) node.parentNode.removeChild(node);
        }
        /* #app 内の base / meta refresh は、親ページの遷移先を書き換える */
        removeNavigationTraps(fragment);
        rewriteAssetAttrs(fragment, cdnBase(commitHash), true);
        hostApp.textContent = '';
        hostApp.appendChild(fragment);
        setBootStatus('スクリプトを読み込んでいます');
        return injectScriptsInOrder(scripts, function (done, total) {
          setBootStatus('スクリプトを読み込んでいます', total ? done / total : 1);
          const detail = document.getElementById('dx-boot-detail');
          if (detail) detail.textContent = done + ' / ' + total;
        }).then(function () {
          installNobiruOpener();
          installMinigameDistHooks();
          /* 配布時ののびる読解入口はここだけ。本体 ddOpenNobiru（location.href）を上書きし、
             viaDaily / viaCheck を落とさず __DX_OPEN_NOBIRU__（fetch→srcdoc）へ渡す。 */
          window.ddOpenNobiru = function (key, viaDaily, viaCheck) {
            const params = {};
            if (viaCheck) params.viaCheck = '1';
            else if (viaDaily) params.viaDaily = '1';
            return window.__DX_OPEN_NOBIRU__(key, params);
          };
          hideBoot();
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
  /* 注入 HTML が同じ id を持っても、作った iframe 自身を掴む。 */
  let nobiruFrameEl = null;
  function dxNobiruFrame() {
    if (nobiruFrameEl && nobiruFrameEl.isConnected && nobiruFrameEl.tagName === 'IFRAME') {
      return nobiruFrameEl;
    }
    nobiruFrameEl = null;
    return null;
  }

  function closeNobiruFrame() {
    const f = dxNobiruFrame();
    /* 閉じたあとに、取得中のページが iframe を開き直さない */
    if (window.__DX_CANCEL_PAGE_OPEN__) window.__DX_CANCEL_PAGE_OPEN__();
    if (f) {
      try {
        if (f.contentWindow && f.contentWindow.__DX_CANCEL_PAGE_OPEN__) {
          f.contentWindow.__DX_CANCEL_PAGE_OPEN__();
        }
      } catch (eCancel) {}
    }
    if (!f) return;
    try {
      markSrcdocSwitch(f.contentWindow);
      f.srcdoc = '';
    } catch (e) {}
    f.hidden = true;
    try {
      if (window.__DX_HOST_TITLE__) document.title = window.__DX_HOST_TITLE__;
    } catch (eTitle) {}
  }

  /* srcdoc の差し替えは、同一オリジンなら iframe 側の navigate イベントにもなる（destination は about:srcdoc）。
     ランチャーが行う差し替えだと分かるよう、直前に印を立てる。印のない about:srcdoc 遷移は止める。 */
  function markSrcdocSwitch(win) {
    try {
      if (win) win.__DX_SRCDOC_SWITCHING__ = true;
    } catch (eMark) {}
  }

  /* 本体セーブはレベル表示のために iframe へ渡すが、戻すときは写さない。
     それ以外は、開いたときから変わったキーと新しいキーだけ親へ戻す。 */
  const FRAME_STORAGE_SKIP_KEYS = ['kokugoTrainingStats_v5'];
  /* 親と iframe の保存場所が同じかを調べる印。親が書き、iframe が同じ値を読めれば同じ場所。
     Storage オブジェクトは window ごとに別なので、`parent.localStorage === localStorage` では分からない。 */
  const FRAME_STORAGE_PROBE_KEY = '__dx_frame_storage_probe__';
  window.__DX_FRAME_STORAGE_PROBE_KEY__ = FRAME_STORAGE_PROBE_KEY;

  /* srcdoc に埋め込む JSON。`<` を残すと script タグを途中で閉じる。 */
  function jsEmbed(value) {
    return JSON.stringify(value)
      .replace(/</g, '\\u003c')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  }

  /* toString で iframe に渡す。この window の localStorage を種にする。
     印（probe）を書いてから渡し、iframe が同じ値を読めれば保存場所は同じ。
     同じなら何も書かない（取得中の親の更新を古い値で潰さない）。分かれているときだけ、渡した値で子を揃える。
     親が組み立てたときは、同じかどうかを親の __DX_FRAME_STORAGE_SHARED__ に残し、以後の写しと種を省く。
     控え（snapshot）は、この関数の実行時ではなく、新しい srcdoc が動き始めてから親へ書く。
     ページを切り替える前の写しが、今の値を「最初からこうだった」と誤認しないため。 */
  function frameStorageSeedScript() {
    const embed = window.__DX_JS_EMBED__;
    const probeKey = window.__DX_FRAME_STORAGE_PROBE_KEY__;
    if (typeof embed !== 'function' || !probeKey) return '';
    let byHost = true;
    try {
      byHost = !(window.frameElement && window.frameElement.id === 'dx-nobiru-frame');
    } catch (eFrame) {}
    let knownShared = false;
    try {
      const host = window.parent && window.parent !== window ? window.parent : window;
      knownShared = host.__DX_FRAME_STORAGE_SHARED__ === true;
    } catch (eKnown) {}

    let token = '';
    try {
      token = String(Date.now()) + '-' + Math.random().toString(36).slice(2);
      localStorage.setItem(probeKey, token);
    } catch (e) {
      token = '';
    }

    /* 同じ場所だと分かっていれば、種は要らない。印だけ渡す。 */
    const pairs = [];
    if (!knownShared) {
      let count = 0;
      try {
        count = localStorage.length;
      } catch (e) {
        count = 0;
      }
      for (let i = 0; i < count; i++) {
        let key = null;
        let value = null;
        try {
          key = localStorage.key(i);
          if (key == null || key === probeKey) continue;
          value = localStorage.getItem(key);
        } catch (e) {
          continue;
        }
        if (value != null) pairs.push([key, value]);
      }
    }
    return (
      'try{const __dxls=' +
      embed(pairs) +
      ';const __dxpk=' +
      embed(probeKey) +
      ';const __dxtok=' +
      embed(token) +
      ';let __dxsh=false;' +
      'try{__dxsh=!!__dxtok&&localStorage.getItem(__dxpk)===__dxtok;}catch(eSh){}' +
      'try{if(__dxsh)localStorage.removeItem(__dxpk);}catch(eRm){}' +
      'try{const __dxhost=window.parent&&window.parent!==window?window.parent:window;' +
      '__dxhost.__DX_FRAME_STORAGE_SEED_SNAPSHOT__=__dxls;' +
      (byHost ? '__dxhost.__DX_FRAME_STORAGE_SHARED__=__dxsh;' : '') +
      '}catch(eSnap){}' +
      'if(!__dxsh){for(let i=0;i<__dxls.length;i++){localStorage.setItem(__dxls[i][0],__dxls[i][1]);}}}catch(e){}'
    );
  }

  /* 次の srcdoc を組み立てる前に、今の iframe の記録を親へ写す。
     組み立て側で控えを更新すると、写しが差分なしになる。 */
  function copyBeforeFrameSwitch() {
    try {
      const host =
        window.parent && typeof window.parent.__DX_COPY_FRAME_STORAGE__ === 'function'
          ? window.parent
          : window;
      if (typeof host.__DX_COPY_FRAME_STORAGE__ !== 'function') return false;
      const copied = host.__DX_COPY_FRAME_STORAGE__();
      return !!(copied && copied.ok);
    } catch (e) {
      return false;
    }
  }

  /* iframe を閉じる前に、子の localStorage を親へ写す。
     srcdoc と親で storage が分かれているときだけ必要。同じなら読み書きは同じ領域。
     失敗したら ok: false。呼び出し側は iframe を閉じずに知らせる。 */
  function copyFrameStorage() {
    const f = dxNobiruFrame();
    /* srcdoc を空にしたあとの枠は、空の保存場所を親へ写さない */
    if (!f || !f.getAttribute('srcdoc')) return { ok: true };
    /* 分かれていたときに残る印は、ここで消す */
    try {
      localStorage.removeItem(FRAME_STORAGE_PROBE_KEY);
    } catch (eProbe) {}
    /* 同じ保存場所なら、子の書き込みはすでに親から見えている */
    if (window.__DX_FRAME_STORAGE_SHARED__ === true) return { ok: true };
    try {
      const cw = f.contentWindow;
      if (!cw) return { ok: false, error: new Error('frame window missing') };
      const store = cw.localStorage;
      const names = [];
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (key != null) names.push(key);
      }
      const seeded = Object.create(null);
      const snap = window.__DX_FRAME_STORAGE_SEED_SNAPSHOT__ || [];
      for (let s = 0; s < snap.length; s++) {
        if (snap[s] && snap[s].length >= 2) seeded[snap[s][0]] = snap[s][1];
      }
      for (let j = 0; j < names.length; j++) {
        if (names[j] === FRAME_STORAGE_PROBE_KEY || FRAME_STORAGE_SKIP_KEYS.indexOf(names[j]) !== -1) continue;
        const value = store.getItem(names[j]);
        if (value == null) continue;
        if (Object.prototype.hasOwnProperty.call(seeded, names[j]) && seeded[names[j]] === value) continue;
        localStorage.setItem(names[j], value);
      }
      return { ok: true };
    } catch (eSync) {
      console.error('[DX] frame storage copy failed', eSync);
      return { ok: false, error: eSync };
    }
  }

  /* 画面全体に重ねるカード。toString で iframe にも渡すため、window の関数だけを使う。
     buttons: [{ label, onClick }]。押すとカードを閉じてから onClick を呼ぶ。 */
  function overlayCard(id, heading, message, buttons) {
    const old = document.getElementById(id);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const wrap = document.createElement('div');
    wrap.id = id;
    wrap.setAttribute('role', 'alert');
    wrap.setAttribute(
      'style',
      'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(43,43,43,.35);'
    );
    const card = document.createElement('div');
    card.setAttribute(
      'style',
      'width:min(100%,360px);background:#fff;border:1px solid #e4ded3;border-radius:14px;padding:28px 28px 24px;text-align:center;font-family:"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;color:#2b2b2b;'
    );
    const title = document.createElement('p');
    title.setAttribute('style', 'margin:0 0 8px;color:#b00020;font-weight:bold;font-size:.95rem;');
    title.textContent = String(heading || '');
    const body = document.createElement('p');
    body.setAttribute('style', 'margin:0;text-align:left;white-space:pre-wrap;font-size:.88rem;line-height:1.6;');
    body.textContent = String(message || '');
    card.appendChild(title);
    card.appendChild(body);
    const btnStyle =
      'margin-top:16px;padding:8px 18px;border:1px solid #e4ded3;border-radius:8px;background:#fff;font:inherit;cursor:pointer;';
    for (let i = 0; i < buttons.length; i++) {
      (function (spec) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = spec.label;
        btn.setAttribute('style', btnStyle + (i < buttons.length - 1 ? 'margin-right:8px;' : ''));
        btn.addEventListener('click', function () {
          if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
          if (typeof spec.onClick === 'function') spec.onClick();
        });
        card.appendChild(btn);
      })(buttons[i]);
    }
    wrap.appendChild(card);
    (document.documentElement || document.body).appendChild(wrap);
  }

  /* 写しに失敗したまま閉じると、iframe 側の報酬・レベルが消える。残るか戻るかを選ばせる。 */
  function confirmLeaveWithoutStorage(message, onLeave) {
    overlayCard('dx-storage-copy-error', '記録を写せませんでした', message, [
      { label: 'この画面に残る' },
      { label: 'ホームに戻る', onClick: onLeave },
    ]);
  }

  /* 通常版は nobiru / ミニゲーム → kokugo_app.html へ遷移し直し、showHome で報酬やレベルが出る。
     配布は同一ページのまま iframe を閉じるだけなので、本体の画面遷移を明示的に呼ぶ。
     （閉じるだけだと、開く前の画面が再表示され、ホームへ押すまでクリア画面が出ない）
     iframe 破棄と同フレームで DOM を書き換えると端末によって描画が残るため、次タスクで呼ぶ。 */
  function finishReturnFromFrame(afterClose) {
    closeNobiruFrame();
    setTimeout(function () {
      try {
        afterClose();
      } catch (eAfter) {
        console.error('[DX] return from frame failed', eAfter);
      }
    }, 0);
  }

  /* 記録を親へ写してから閉じる。写せなければ、残るか戻るかを選ばせる。 */
  function returnFromFrame(failMessage, afterClose) {
    const copied = copyFrameStorage();
    if (!copied.ok) {
      confirmLeaveWithoutStorage(failMessage, function () {
        finishReturnFromFrame(afterClose);
      });
      return;
    }
    finishReturnFromFrame(afterClose);
  }

  function returnFromNobiru() {
    returnFromFrame(
      'クリア報酬を本体に写せませんでした。この画面に残れば記録は残ります。ホームに戻ると、今回の報酬が反映されないことがあります。',
      function () {
        if (typeof window.showHome === 'function') window.showHome();
      }
    );
  }

  function showNobiruHtml(out, title) {
    /* タブに出るのは親の document.title。iframe の title 属性だけでは変わらない。 */
    let pageTitle = title || '';
    if (!pageTitle) {
      try {
        const parsed = new DOMParser().parseFromString(out || '', 'text/html');
        pageTitle = (parsed.title || '').trim();
      } catch (eTitleParse) {}
    }
    try {
      let host = window;
      if (window.parent && window.parent !== window) host = window.parent;
      if (pageTitle) {
        if (!host.__DX_HOST_TITLE__) host.__DX_HOST_TITLE__ = host.document.title;
        host.document.title = pageTitle;
      }
    } catch (eTitle) {}

    try {
      if (window.frameElement && window.frameElement.id === 'dx-nobiru-frame') {
        if (pageTitle) window.frameElement.title = pageTitle;
        /* 自分の navigate 監視に止められないよう印を立ててから差し替える */
        window.__DX_SRCDOC_SWITCHING__ = true;
        window.frameElement.srcdoc = out;
        return;
      }
    } catch (e1) {}

    /* toString で iframe に渡した複製は、この関数を持たない。中では frameElement 側で戻る。 */
    if (typeof dxNobiruFrame !== 'function') return;

    let f = dxNobiruFrame();
    if (!f) {
      f = document.createElement('iframe');
      f.id = 'dx-nobiru-frame';
      f.title = pageTitle || 'のびる読解';
      /* sandbox は付けない。記録の写しと戻りには同じオリジンとスクリプトの両方が要る。
         その二つを同時に許すと、中から sandbox 自体を外せてしまい、制限にならない。
         親タブへの遷移は、srcdoc 内のクリック監視と Navigation API で止める。 */
      f.setAttribute(
        'style',
        'position:fixed;inset:0;border:0;width:100%;height:100%;z-index:99999;background:#fff;'
      );
      nobiruFrameEl = f;
      document.documentElement.appendChild(f);
    }
    if (pageTitle) f.title = pageTitle;
    f.hidden = false;
    markSrcdocSwitch(f.contentWindow);
    f.srcdoc = out;
  }

  /* base と meta refresh は、文書の遷移先を外へずらす。src と同じく属性ごと外す。 */
  function removeNavigationTraps(root) {
    if (!root || !root.querySelectorAll) return;
    const nodes = root.querySelectorAll('base, meta[http-equiv]');
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      const tag = el.tagName.toLowerCase();
      if (tag === 'meta' && !/^refresh$/i.test(el.getAttribute('http-equiv') || '')) continue;
      if (el.parentNode) el.parentNode.removeChild(el);
    }
  }

  function absolutizeNobiruHtml(html, nobiruBase) {
    /* .toString() で iframe に注入するため、クロージャ名ではなく window 経由で呼ぶ */
    const doc = new DOMParser().parseFromString(html, 'text/html');
    window.__DX_REWRITE_ASSETS__(doc, nobiruBase, false);
    /* <base> は srcdoc の相対 URL を外へ逃す。<meta refresh> は遷移になる。 */
    window.__DX_REMOVE_TRAPS__(doc);
    /* ホームリンクはクリックで差し替える。相対 href のまま残すと変な遷移の元になる */
    const homes = doc.querySelectorAll('a.back, a.modesel-back');
    for (let h = 0; h < homes.length; h++) {
      homes[h].setAttribute('href', '#');
    }
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  }

  function showPageError(message, heading) {
    window.__DX_OVERLAY_CARD__('dx-page-error', heading || '読み込みに失敗しました', message, [{ label: '閉じる' }]);
  }

  function reportPageError(err) {
    const msg =
      (err && err.message) ||
      String(err) ||
      'ページを開けませんでした。ネットワーク接続を確認してください。';
    window.__DX_SHOW_PAGE_ERROR__(msg);
    console.error('[DX] page open failed', err);
  }

  /* 新しいページ取得と、ページを開かないクリックは、前の取得を捨てる。
     遅い応答が、あとから開いたページや移動先の上に被さらないようにする。 */
  function cancelPageOpen() {
    window.__DX_PAGE_TOKEN__ = (window.__DX_PAGE_TOKEN__ || 0) + 1;
    const ac = window.__DX_PAGE_ABORT__;
    window.__DX_PAGE_ABORT__ = null;
    try {
      if (ac) ac.abort();
    } catch (eAbort) {}
  }

  /* クリックの捕捉で先に呼ぶ。ページを開く処理がその後で ARMED を立てる。 */
  function armPageClick() {
    window.__DX_PAGE_ARMED__ = false;
    setTimeout(function () {
      if (window.__DX_PAGE_ARMED__) return;
      if (window.__DX_CANCEL_PAGE_OPEN__) window.__DX_CANCEL_PAGE_OPEN__();
    }, 0);
  }

  function fetchPageHtml(url, failLabel, onHtml) {
    /* このクリックはページを開く。直後の取り消しタイマーに消させない */
    window.__DX_PAGE_ARMED__ = true;
    const token = (window.__DX_PAGE_TOKEN__ = (window.__DX_PAGE_TOKEN__ || 0) + 1);
    const prev = window.__DX_PAGE_ABORT__;
    const ac = typeof AbortController === 'function' ? new AbortController() : null;
    window.__DX_PAGE_ABORT__ = ac;
    try {
      if (prev) prev.abort();
    } catch (ePrev) {}

    function stillCurrent() {
      return token === window.__DX_PAGE_TOKEN__;
    }

    const base = window.__DX_CDN_BASE__;
    const resolve = window.__DX_RESOLVE_NOBIRU__;
    const resolved = resolve && base ? resolve(String(url || ''), base) : null;
    if (!resolved) {
      if (stillCurrent()) window.__DX_REPORT_PAGE_ERROR__(new Error('許可されていない URL です'));
      return Promise.resolve();
    }
    return fetch(resolved, ac ? { signal: ac.signal } : undefined)
      .then(function (res) {
        if (!stillCurrent()) return null;
        if (!res.ok) {
          throw new Error(failLabel + ' (HTTP ' + res.status + ')');
        }
        if (!resolve(res.url, base)) {
          throw new Error('許可されていない URL へ転送されました');
        }
        return res.text();
      })
      .then(function (html) {
        /* null は「もう開かない」印。空の HTML は開く側に渡す */
        if (html == null || !stillCurrent()) return;
        return onHtml(html);
      })
      .catch(function (err) {
        if (!stillCurrent()) return;
        if (err && err.name === 'AbortError') return;
        window.__DX_REPORT_PAGE_ERROR__(err);
      });
  }

  /**
   * のびる読解とミニゲームで共有する srcdoc ブート。
   * toString で iframe に渡すため、ここでは window 上の関数だけを参照する。
   * kind: 'nobiru' | 'minigame'
   */
  function buildSrcdocDocument(html, opts) {
    const kind = opts.kind;
    const embed = window.__DX_JS_EMBED__;
    const storageSeed = window.__DX_FRAME_STORAGE_SEED__();
    const passBoot = opts.passId
      ? 'try{const __dxpo=JSON.parse(sessionStorage.getItem("kokugo_mg_pass_v1")||"{}");__dxpo[' +
        embed(opts.passId) +
        ']=1;sessionStorage.setItem("kokugo_mg_pass_v1",JSON.stringify(__dxpo));}catch(e){}'
      : '';

    let globals =
      'window.__DX_REPO__=' +
      embed(window.__DX_REPO__) +
      ';' +
      'window.__DX_JSDELIVR_HOST__=' +
      embed(window.__DX_JSDELIVR_HOST__) +
      ';' +
      'window.__DX_RAW_HOST__=' +
      embed(window.__DX_RAW_HOST__) +
      ';' +
      'window.__DX_FRAME_STORAGE_PROBE_KEY__=' +
      embed(window.__DX_FRAME_STORAGE_PROBE_KEY__) +
      ';' +
      'window.__DX_CDN_BASE__=' +
      embed(opts.base) +
      ';' +
      'window.__DX_HOME_URL__=' +
      embed(opts.home) +
      ';';
    if (kind === 'nobiru') {
      globals +=
        'window.__DX_NOBIRU_KEY__=' +
        embed(opts.htmlName) +
        ';' +
        'window.__DX_BOOT_SEARCH__=' +
        embed(opts.bootSearch || '') +
        ';';
    }

    /* location.search は LegacyUnforgeable で、prototype を差し替えても srcdoc の実値は空のまま。
       一日一読 / チェックモードは engine.js が __DX_BOOT_SEARCH__ を読む。 */

    /* 通信先は URL 許可と同じ定数から組む。dist/index.html の CSP も同じ 2 ホスト。 */
    const cdnHosts = 'https://' + window.__DX_JSDELIVR_HOST__ + ' https://' + window.__DX_RAW_HOST__;
    const cspMeta =
      '<meta http-equiv="Content-Security-Policy" content="' +
      "default-src 'none'; " +
      "script-src 'unsafe-inline' " + cdnHosts + '; ' +
      "style-src 'unsafe-inline' " + cdnHosts + '; ' +
      'img-src data: blob: ' + cdnHosts + '; ' +
      'media-src data: blob: ' + cdnHosts + '; ' +
      'font-src data: ' + cdnHosts + '; ' +
      'connect-src ' + cdnHosts + '; ' +
      "frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'" +
      '">';

    /* 大きな起動スクリプトが途中で失敗しても、一日一読の印と戻りだけは先に置く。
       engine.js はこの印を読んで、確認と「一日一読を終える」を出す。 */
    const dailyFlag =
      kind === 'nobiru'
        ? '<script>window.__DX_BOOT_SEARCH__=' +
          embed(opts.bootSearch || '') +
          ';window.__DX_GO_HOME__=function(){try{if(parent!==window){' +
          'if(typeof parent.__DX_RETURN_FROM_NOBIRU__==="function"){parent.__DX_RETURN_FROM_NOBIRU__();return;}' +
          'if(typeof parent.__DX_CLOSE_NOBIRU__==="function")parent.__DX_CLOSE_NOBIRU__();' +
          'if(typeof parent.showHome==="function"){parent.showHome();return;}' +
          '}}catch(e){}};' +
          'document.addEventListener("click",function(ev){const t=ev.target;if(!t||!t.closest)return;' +
          'const a=t.closest("a.back");if(a){ev.preventDefault();' +
          'const daily=/[?&]viaDaily=1(?:&|$)/.test(String(window.__DX_BOOT_SEARCH__||""));' +
          'const finished=window.__DX_NOBIRU_FINISHED__&&window.__DX_NOBIRU_FINISHED__();' +
          'if(!(daily&&!finished)){ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();}' +
          'return;}' +
          'const b=t.closest("button.again");if(!b)return;const tx=String(b.textContent||"");' +
          'if(!b.classList.contains("daily-end")&&tx.indexOf("一日一読を終える")===-1&&tx.indexOf("ホーム")===-1)return;' +
          'ev.preventDefault();ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();},true);</' +
          'script>'
        : '';

    /* 種類と assetBase が同じなら、関数の文字列は親に1回だけ置く。教材キーや bootSearch は毎回足す。 */
    function srcdocRest(kind, assetBase) {
      let host = window;
      try {
        if (window.parent && window.parent !== window) host = window.parent;
      } catch (eHost) {}
      const cache = host.__DX_BOOT_REST__ || (host.__DX_BOOT_REST__ = Object.create(null));
      const key = kind + '\n' + assetBase;
      if (cache[key]) return cache[key];
      const embed = window.__DX_JS_EMBED__;
      const openerName = kind === 'nobiru' ? '__DX_OPEN_NOBIRU__' : '__DX_OPEN_STANDALONE_HTML__';
      /* 親の関数を toString で iframe に写す。どれも window 上の名前だけを参照する。 */
      const copiedNames = [
        '__DX_OVERLAY_CARD__',
        '__DX_SHOW_PAGE_ERROR__',
        '__DX_REPORT_PAGE_ERROR__',
        '__DX_HOST_HOME_URL__',
        '__DX_BUILD_SRCDOC_BOOT__',
        '__DX_FETCH_PAGE__',
        '__DX_CANCEL_PAGE_OPEN__',
        '__DX_ARM_PAGE_CLICK__',
        '__DX_REMOVE_TRAPS__',
        '__DX_OPEN_SRCDOC_PAGE__',
        openerName,
        '__DX_SHOW_NOBIRU_HTML__',
        '__DX_RESOLVE_NOBIRU__',
        '__DX_REWRITE_ASSETS__',
        '__DX_ABS_NOBIRU__',
        '__DX_JS_EMBED__',
        '__DX_FRAME_STORAGE_SEED__',
        '__DX_COPY_BEFORE_SWITCH__',
      ];
      let openerSrc = '';
      for (let c = 0; c < copiedNames.length; c++) {
        /* </script> だけを逃す。すべての </ を変えると、/< /g のような正規表現の閉じが消える。 */
        const src = window[copiedNames[c]].toString().replace(/<\/script/gi, '<\\/script');
        openerSrc += 'window.' + copiedNames[c] + '=(' + src + ');';
      }
      openerSrc +=
        'window.__DX_CLOSE_NOBIRU__=function(){try{if(parent!==window&&parent.__DX_CLOSE_NOBIRU__)parent.__DX_CLOSE_NOBIRU__();}catch(e){}};';

      const scriptHook =
        '(function(){const nb=' +
        embed(assetBase) +
        ';const ce=document.createElement.bind(document);' +
        'document.createElement=function(tag){const el=ce(tag);' +
        'if(String(tag).toLowerCase()==="script"){el.async=false;const sa=el.setAttribute.bind(el);' +
        'el.setAttribute=function(n,v){if(String(n).toLowerCase()==="src"&&v){' +
        'const r=window.__DX_RESOLVE_NOBIRU__&&window.__DX_RESOLVE_NOBIRU__(String(v), nb);' +
        'if(!r){if(window.__DX_REPORT_PAGE_ERROR__)window.__DX_REPORT_PAGE_ERROR__(new Error("許可されていないスクリプト URL です"));return;}' +
        'v=r;}return sa(n,v);};' +
        'try{Object.defineProperty(el,"src",{configurable:true,enumerable:true,' +
        'get:function(){return el.getAttribute("src");},' +
        'set:function(v){el.setAttribute("src",v);}});}' +
        'catch(e2){}}return el;};})();';

      /* engine.js は起動後に document.title を教材名にする。iframe の題名はタブに出ないので親へ写す。
         title 要素は head にあるので head だけ見張る（body の描画では動かない）。 */
      const titleMirror =
        '(function(){let host=null;try{if(window.parent&&window.parent!==window)host=window.parent;}catch(eH){}' +
        'if(!host)return;let last="";' +
        'function sync(){let t="";try{t=String(document.title||"").trim();}catch(eT){}' +
        'if(!t||t===last)return;last=t;' +
        'try{if(!host.__DX_HOST_TITLE__)host.__DX_HOST_TITLE__=host.document.title;host.document.title=t;}catch(eS){}}' +
        'try{new MutationObserver(sync).observe(document.head||document.documentElement,{childList:true,subtree:true,characterData:true});}catch(eO){}' +
        'document.addEventListener("DOMContentLoaded",sync);})();';

      const goHome =
        'const __dxHome=String(window.__DX_HOME_URL__||"");' +
        (kind === 'nobiru'
          ? 'window.__DX_GO_HOME__=function(){try{if(parent!==window){' +
            'if(typeof parent.__DX_RETURN_FROM_NOBIRU__==="function"){parent.__DX_RETURN_FROM_NOBIRU__();return;}' +
            'if(typeof parent.__DX_CLOSE_NOBIRU__==="function")parent.__DX_CLOSE_NOBIRU__();' +
            'if(typeof parent.showHome==="function"){parent.showHome();return;}' +
            '}}catch(e){}' +
            'if(__dxHome)location.href=__dxHome;};'
          : 'window.__DX_GO_HOME__=function(){try{if(parent!==window&&parent.__DX_RETURN_FROM_MINIGAME__){parent.__DX_RETURN_FROM_MINIGAME__();return;}}catch(e){}' +
            'if(__dxHome)location.href=__dxHome;};');

      let locationHooks =
        '(function(){function dxNorm(u){let t=String(u||"").replace(/[\\u0000-\\u0020\\u007f]+/g,"");' +
        'for(let n=0;n<8;n++){let d;try{d=decodeURIComponent(t);}catch(e){return null;}if(d===t)break;t=d;}' +
        'if(/[\\u0000-\\u0020\\u007f]/.test(t)||/%(?:2e|2f|5c)/i.test(t))return null;return t.toLowerCase();}' +
        'function dxIsHashOnly(u){return String(u||"").charAt(0)==="#";}' +
        'function dxIsHomeNav(u){const raw=String(u||"");' +
        'if(/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)&&!/^file:/i.test(raw))return false;' +
        'if(raw.indexOf("//")===0)return false;' +
        'const norm=dxNorm(u);if(norm==null)return false;' +
        'if(/^(javascript|data|vbscript):/.test(norm))return false;' +
        'if(/^[a-z][a-z0-9+.-]*:/.test(norm)&&norm.indexOf("file:")!==0)return false;' +
        'if(norm.indexOf("//")===0)return false;' +
        'return /(?:^|\\/)kokugo_app\\.html(?:[?#]|$)/i.test(raw)||/(?:^|\\/)kokugo_app\\.html(?:[?#]|$)/i.test(norm);}' +
        'const dxLauncherHome=String(window.__DX_HOME_URL__||"");' +
        'function dxFilePath(u){try{const x=new URL(String(u||""),dxLauncherHome||"file:///");' +
        'if(x.protocol!=="file:"||x.username||x.password||x.search)return "";' +
        'const host=(x.hostname||"").toLowerCase();if(host&&host!=="localhost")return "";' +
        'return decodeURI(x.pathname).replace(/\\\\/g,"/").replace(/\\/+$/,"").toLowerCase();' +
        '}catch(eF){return "";}}' +
        'function dxSameLauncherFile(u){if(!dxLauncherHome||!/^file:/i.test(String(u||"")))return false;' +
        'const a=dxFilePath(dxLauncherHome);const b=dxFilePath(u);return !!a&&a===b;}' +
        'function dxIsLauncherHome(u){if(!dxLauncherHome)return false;const raw=String(u||"");if(raw===dxLauncherHome)return true;' +
        'if(dxSameLauncherFile(u))return true;' +
        'const hn=dxLauncherHome.toLowerCase().split("#")[0];const un=(dxNorm(u)||"").split("#")[0];return un===hn;}' +
        'function dxNavKind(u){if(dxIsHashOnly(u))return "hash";if(dxIsHomeNav(u))return "home";if(dxIsLauncherHome(u))return "launcher";return "block";}' +
        'let dxLauncherOnce=false;' +
        'function dxGoLauncher(){dxLauncherOnce=true;location.href=dxLauncherHome;}' +
        'function dxReopenNobiru(){if(!window.__DX_OPEN_NOBIRU__||!window.__DX_NOBIRU_KEY__)return false;' +
        'const o={};try{new URLSearchParams(window.__DX_BOOT_SEARCH__||"").forEach(function(v,k){o[k]=v;});}catch(eR){}' +
        'window.__DX_OPEN_NOBIRU__(window.__DX_NOBIRU_KEY__,o);return true;}' +
        /* location の href / assign / replace / reload は実体の own property（LegacyUnforgeable）で、
           Location.prototype を書き換えても呼ばれない。スクリプトからの遷移は Navigation API で止める。
           reload は srcdoc の再読み込み（白紙）になるので、のびる読解は同じ教材を開き直す。 */
        'try{if(window.navigation&&navigation.addEventListener){navigation.addEventListener("navigate",function(ev){' +
        'if(ev.hashChange)return;const u=ev.destination&&ev.destination.url||"";' +
        'if(dxLauncherOnce){dxLauncherOnce=false;if(String(u)===dxLauncherHome||dxSameLauncherFile(u))return;' +
        'if(ev.cancelable)ev.preventDefault();return;}' +
        'if(ev.navigationType==="reload"){if(ev.cancelable)ev.preventDefault();if(window.__DX_REOPEN_NOBIRU__)window.__DX_REOPEN_NOBIRU__();return;}' +
        /* ランチャーによる srcdoc の差し替え（モード選択・やり直し・閉じる）は通す。印のない about:srcdoc は止める */
        'if(/^about:srcdoc$/i.test(String(u))){if(window.__DX_SRCDOC_SWITCHING__)return;if(ev.cancelable)ev.preventDefault();return;}' +
        'const k=dxNavKind(u);' +
        'if(k==="hash")return;' +
        'if(k==="home"){if(ev.cancelable)ev.preventDefault();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();return;}' +
        'if(k==="launcher"){if(ev.cancelable)ev.preventDefault();dxGoLauncher();return;}' +
        'if(ev.cancelable)ev.preventDefault();});}}catch(eN){}' +
        'document.addEventListener("click",function(ev){const el=ev.target&&ev.target.closest&&ev.target.closest("a[href],area[href]");' +
        'if(!el)return;const href=el.getAttribute("href")||"";const k=dxNavKind(href);' +
        'if(k==="hash")return;' +
        'if(k==="home"){const dailyMid=/[?&]viaDaily=1(?:&|$)/.test(String(window.__DX_BOOT_SEARCH__||""))' +
        '&&!(window.__DX_NOBIRU_FINISHED__&&window.__DX_NOBIRU_FINISHED__());' +
        /* 一日一読の途中は engine.js の確認に任せる。既定の遷移は CSP で止まるので、ここでは止めるだけ */
        'if(dailyMid&&el.closest&&el.closest("a.back")){ev.preventDefault();return;}' +
        'ev.preventDefault();ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();return;}' +
        'ev.preventDefault();if(k==="launcher")dxGoLauncher();},true);';
      if (kind === 'nobiru') {
        locationHooks +=
          'window.__DX_REOPEN_NOBIRU__=dxReopenNobiru;' +
          'window.__DX_NOBIRU_FINISHED__=function(){return Array.prototype.some.call(document.querySelectorAll("button.again"),function(b){' +
          'const t=String(b.textContent||"");' +
          'return b.classList.contains("daily-end")||t.indexOf("ホーム")!==-1||t.indexOf("一日一読を終える")!==-1||t.indexOf("はじめからやり直す")!==-1;});};';
      }
      locationHooks += '})();';

      const nobiruClicks =
        kind === 'nobiru'
          ? 'document.addEventListener("click",function(ev){' +
            'const btn=ev.target&&ev.target.closest&&ev.target.closest(".modesel-card[data-mode]");' +
            'if(btn&&window.__DX_OPEN_NOBIRU__){ev.preventDefault();ev.stopImmediatePropagation();' +
            'window.__DX_OPEN_NOBIRU__(window.__DX_NOBIRU_KEY__,{mode:btn.getAttribute("data-mode")});return;}' +
            'const sw=ev.target&&ev.target.closest&&ev.target.closest("a.modeSwitch, #modeSwitch");' +
            'if(sw&&window.__DX_OPEN_NOBIRU__&&window.__DX_NOBIRU_KEY__){ev.preventDefault();ev.stopImmediatePropagation();' +
            'window.__DX_OPEN_NOBIRU__(window.__DX_NOBIRU_KEY__,{});return;}' +
            'const a=ev.target&&ev.target.closest&&ev.target.closest("a.back, a.modesel-back");' +
            'if(a){' +
            'if(a.classList.contains("back")&&/[?&]viaDaily=1(?:&|$)/.test(String(window.__DX_BOOT_SEARCH__||""))&&' +
            '!(window.__DX_NOBIRU_FINISHED__&&window.__DX_NOBIRU_FINISHED__())){ev.preventDefault();return;}' +
            'ev.preventDefault();ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();return;}' +
            'const again=ev.target&&ev.target.closest&&ev.target.closest("button.again");' +
            'if(again){const oc=String(again.getAttribute("onclick")||"");const tx=String(again.textContent||"");' +
            'if(again.classList.contains("daily-end")||oc.indexOf("kokugo_app")!==-1||tx.indexOf("ホーム")!==-1||tx.indexOf("一日一読を終える")!==-1){' +
            'ev.preventDefault();ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();return;}' +
            'if(oc.indexOf("location.reload")!==-1||tx.indexOf("はじめからやり直す")!==-1){' +
            'ev.preventDefault();ev.stopImmediatePropagation();' +
            'if(window.__DX_REOPEN_NOBIRU__){window.__DX_REOPEN_NOBIRU__();}return;}}' +
            '},true);'
          : '';

      const minigameClicks =
        kind === 'minigame'
          ? 'document.addEventListener("click",function(ev){' +
            'const back=ev.target&&ev.target.closest&&ev.target.closest("#backLink,.back-link,#bHome,#bMgList,a[href*=\\"kokugo_app\\"]");' +
            'if(back){ev.preventDefault();ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();}' +
            '},true);' +
            'document.addEventListener("DOMContentLoaded",function(){' +
            'window.backToApp=function(){if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();};' +
            'window.goBack=function(){if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();};' +
            '});'
          : '';

      const built =
        titleMirror +
        scriptHook +
        goHome +
        /* ページを開かないクリックは、取得中の応答を捨てる。開くクリックより先に登録する */
        'document.addEventListener("click",function(){if(window.__DX_ARM_PAGE_CLICK__)window.__DX_ARM_PAGE_CLICK__();},true);' +
        locationHooks +
        nobiruClicks +
        minigameClicks +
        openerSrc;
      cache[key] = built;
      return built;
    }

    const rest = srcdocRest(kind, String(opts.assetBase || ''));
    const boot =
      dailyFlag +
      '<script>(function(){' +
      storageSeed +
      passBoot +
      globals +
      rest +
      '})();<\/script>';

    const absHtml = window.__DX_ABS_NOBIRU__(html, opts.assetBase);
    if (/<head[^>]*>/i.test(absHtml)) {
      return absHtml.replace(/<head[^>]*>/i, function (m) {
        return m + cspMeta + boot;
      });
    }
    return cspMeta + boot + absHtml;
  }

  /* のびる読解とミニゲームの共通部分。取得 → 今の iframe の記録を親へ写す → srcdoc を組み立てて表示。
     写せなければページは切り替えない。toString で iframe に渡すため window の関数だけを使う。
     <base> は使わない（about:srcdoc → /nobiru/srcdoc 事故の原因）。 */
  function openSrcdocPage(pageUrl, failLabel, bootOpts) {
    /* toString で iframe に渡す。一日一読の判定も、この関数の中に含める。 */
    /* CDN の engine.js は location.search を見る。srcdoc では search が空なので、
       一日一読が通常の読解と同じ画面になる。nobiru/engine.js と同じく
       __DX_BOOT_SEARCH__ を先に読み、途中で戻るときは配布の戻り関数を使う。 */
    function patchNobiruEngine(src) {
      let out = String(src || '');
      if (out.indexOf('dxPageSearch') === -1 && /new URLSearchParams\(\s*location\.search\s*\)/.test(out)) {
        const helper =
          'function dxPageSearch(){try{const boot=window.__DX_BOOT_SEARCH__;if(typeof boot==="string"&&boot)return boot.charAt(0)==="?"?boot:("?"+boot);}catch(e){}return location.search||"";}\n';
        out =
          helper +
          out.replace(/new URLSearchParams\(\s*location\.search\s*\)/g, 'new URLSearchParams(dxPageSearch())');
      }
      /* 「一日一読を終える」は onclick で kokugo_app.html へ進む。srcdoc では CSP で止まる。 */
      out = out.replace(
        /location\.href\s*=\s*(['"])\.\.\/kokugo_app\.html\1/g,
        'window.__DX_GO_HOME__&&window.__DX_GO_HOME__()'
      );
      return out;
    }

    function nobiruHtmlWithEngine(html, assetBase) {
      if (!html || !assetBase) return Promise.resolve(html);
      const re = /<script\b[^>]*\bsrc\s*=\s*(["'])([^"']+)\1[^>]*>\s*<\/script>/gi;
      let found = null;
      let match;
      while ((match = re.exec(html))) {
        if (/(^|\/)engine\.js(?:[?#]|$)/i.test(match[2])) {
          found = { full: match[0], src: match[2] };
          break;
        }
      }
      if (!found) return Promise.resolve(html);
      const resolve = window.__DX_RESOLVE_NOBIRU__;
      const abs = resolve ? resolve(found.src, assetBase) : null;
      if (!abs) return Promise.resolve(html);
      const token = window.__DX_PAGE_TOKEN__;
      return loadPatchedEngine(abs, assetBase).then(function (engine) {
        if (token !== window.__DX_PAGE_TOKEN__) return null;
        if (!engine || !engine.inline) return html;
        return html.replace(found.full, function () {
          return '<script>' + engine.safe + '</script>';
        });
      });
    }

    /* 置換後の engine.js は、許可した絶対 URL ごとに親へ置く。
       ページの中止では捨てない。失敗は覚えない。コミットが変わると URL が変わる。 */
    function loadPatchedEngine(abs, assetBase) {
      let host = window;
      try {
        if (window.parent && window.parent !== window) host = window.parent;
      } catch (eHost) {}
      const cache = host.__DX_ENGINE_CACHE__ || (host.__DX_ENGINE_CACHE__ = Object.create(null));
      if (cache[abs]) return cache[abs];
      const resolve = window.__DX_RESOLVE_NOBIRU__;
      let pending;
      pending = fetch(abs)
        .then(function (res) {
          if (!res.ok) throw new Error('のびる読解エンジンの取得に失敗しました (HTTP ' + res.status + ')');
          /* 転送先が別ホストや別コミットなら、許可した URL の中身ではない */
          if (!resolve || !resolve(res.url, assetBase)) {
            throw new Error('許可されていない URL へ転送されました');
          }
          return res.text();
        })
        .then(function (src) {
          const patched = patchNobiruEngine(src);
          const inline = patched !== src;
          return {
            inline: inline,
            safe: inline ? patched.replace(/<\/script/gi, '<\\/script') : '',
          };
        })
        .catch(function (err) {
          if (cache[abs] === pending) delete cache[abs];
          throw err;
        });
      cache[abs] = pending;
      return pending;
    }

    const base = window.__DX_CDN_BASE__;
    if (!base) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('CDN の基点が未設定です'));
      return Promise.resolve();
    }
    if (!window.__DX_RESOLVE_NOBIRU__ || !window.__DX_RESOLVE_NOBIRU__(pageUrl, base)) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('許可されていないページ URL です'));
      return Promise.resolve();
    }
    bootOpts.base = base;
    bootOpts.home = window.__DX_HOST_HOME_URL__();
    return window.__DX_FETCH_PAGE__(pageUrl, failLabel, function (html) {
      if (!window.__DX_COPY_BEFORE_SWITCH__ || !window.__DX_COPY_BEFORE_SWITCH__()) {
        window.__DX_SHOW_PAGE_ERROR__(
          '記録を写せなかったので、ページを切り替えませんでした。',
          'ページを切り替えませんでした'
        );
        return;
      }
      const ready =
        bootOpts.kind === 'nobiru' ? nobiruHtmlWithEngine(html, bootOpts.assetBase) : Promise.resolve(html);
      return ready.then(function (docHtml) {
        if (docHtml == null) return;
        window.__DX_SHOW_NOBIRU_HTML__(window.__DX_BUILD_SRCDOC_BOOT__(docHtml, bootOpts));
      });
    });
  }

  function openNobiruPage(key, searchObj) {
    const htmlName = String(key || '').replace(/[^A-Za-z0-9_-]/g, '');
    if (!htmlName) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('不正な教材キーです'));
      return Promise.resolve();
    }
    const nobiruBase = String(window.__DX_CDN_BASE__ || '') + 'nobiru/';
    const bootParams = new URLSearchParams(searchObj || {});
    const bootSearch = bootParams.toString() ? '?' + bootParams.toString() : '';
    return window.__DX_OPEN_SRCDOC_PAGE__(nobiruBase + htmlName + '.html', 'のびる読解の取得に失敗しました', {
      kind: 'nobiru',
      assetBase: nobiruBase,
      htmlName: htmlName,
      bootSearch: bootSearch,
    });
  }

  /** ルート直下の別ページ HTML（九尾の化かし合い・炎狼ラン等）を srcdoc で開く。
   *  passId は本体 mgGoWithPass の第1引数（通行証キー）。新ミニゲーム追加時も対応表不要。 */
  function openStandaloneHtml(fileName, passId) {
    const safeName = String(fileName || '').trim();
    if (!/^[A-Za-z0-9_-]+\.html$/.test(safeName)) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('不正なページ名です'));
      return Promise.resolve();
    }
    const base = String(window.__DX_CDN_BASE__ || '');
    return window.__DX_OPEN_SRCDOC_PAGE__(base + safeName, 'ページの取得に失敗しました', {
      kind: 'minigame',
      assetBase: base,
      passId: /^[A-Za-z0-9_-]+$/.test(String(passId || '')) ? String(passId) : '',
    });
  }

  function dxHostHomeUrl() {
    let home = window.__DX_HOME_URL__ || '';
    try {
      if (!home && (!window.frameElement || window.frameElement.id !== 'dx-nobiru-frame')) {
        home = location.href;
      }
    } catch (e0) {
      home = home || location.href;
    }
    return home;
  }

  function returnFromMinigame() {
    returnFromFrame(
      'レベルの変化を本体に写せませんでした。この画面に残れば記録は残ります。ホームに戻ると、今回のレベルが反映されないことがあります。',
      function () {
        /* 通常版はページを読み直すので、起動のたびにプロローグが出る。
           配布は同じページのまま戻る。プロローグは起動時だけで、ミニゲームから戻ったときは出さない。
           レベルの反映は showHome、着地はミニゲーム一覧。 */
        if (typeof window.showHome === 'function' && typeof window.showSideQuestMenu === 'function') {
          window.showHome();
          window.showSideQuestMenu();
        } else {
          console.error('[DX] minigame return hooks missing');
        }
      }
    );
  }

  function installMinigameDistHooks() {
    /* 本体の mgGoWithPass（location.href）を、配布時だけ srcdoc 開きに差し替える。
       kokugo_app.html / ミニゲーム HTML は変更しない。 */
    function wrap() {
      if (typeof window.mgGoWithPass !== 'function' || window.mgGoWithPass.__dxWrapped) return;
      const orig = window.mgGoWithPass;
      const wrapped = function (id, url) {
        try {
          const key = 'kokugo_mg_pass_v1';
          const o = JSON.parse(sessionStorage.getItem(key) || '{}');
          o[id] = 1;
          sessionStorage.setItem(key, JSON.stringify(o));
        } catch (e) {}
        const name = String(url || '')
          .split('?')[0]
          .replace(/^.*\//, '');
        if (window.__DX_CDN_BASE__ && /^[A-Za-z0-9_-]+\.html$/.test(name)) {
          return openStandaloneHtml(name, id);
        }
        return orig.apply(this, arguments);
      };
      wrapped.__dxWrapped = true;
      window.mgGoWithPass = wrapped;
    }
    wrap();
    setTimeout(wrap, 0);
  }

  function installNobiruOpener() {
    window.__DX_JS_EMBED__ = jsEmbed;
    window.__DX_FRAME_STORAGE_SEED__ = frameStorageSeedScript;
    window.__DX_COPY_BEFORE_SWITCH__ = copyBeforeFrameSwitch;
    window.__DX_OVERLAY_CARD__ = overlayCard;
    window.__DX_SHOW_PAGE_ERROR__ = showPageError;
    window.__DX_REPORT_PAGE_ERROR__ = reportPageError;
    window.__DX_HOST_HOME_URL__ = dxHostHomeUrl;
    window.__DX_BUILD_SRCDOC_BOOT__ = buildSrcdocDocument;
    window.__DX_FETCH_PAGE__ = fetchPageHtml;
    window.__DX_OPEN_SRCDOC_PAGE__ = openSrcdocPage;
    window.__DX_CANCEL_PAGE_OPEN__ = cancelPageOpen;
    window.__DX_ARM_PAGE_CLICK__ = armPageClick;
    window.__DX_REMOVE_TRAPS__ = removeNavigationTraps;
    window.__DX_OPEN_NOBIRU__ = openNobiruPage;
    window.__DX_OPEN_STANDALONE_HTML__ = openStandaloneHtml;
    window.__DX_RETURN_FROM_MINIGAME__ = returnFromMinigame;
    window.__DX_RETURN_FROM_NOBIRU__ = returnFromNobiru;
    window.__DX_COPY_FRAME_STORAGE__ = copyFrameStorage;
    window.__DX_SHOW_NOBIRU_HTML__ = showNobiruHtml;
    window.__DX_CLOSE_NOBIRU__ = closeNobiruFrame;
    /* __DX_RESOLVE_NOBIRU__ は定義直後に window へ載せている（本体注入でも使うため） */
    window.__DX_REWRITE_ASSETS__ = rewriteAssetAttrs;
    window.__DX_ABS_NOBIRU__ = absolutizeNobiruHtml;
    document.addEventListener(
      'click',
      function () {
        if (window.__DX_ARM_PAGE_CLICK__) window.__DX_ARM_PAGE_CLICK__();
      },
      true
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

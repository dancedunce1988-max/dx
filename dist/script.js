/**
 * 知識ドリルDX — 生徒配布用ローダー
 * file:// で開き、CDN 上の本体を読み込む（classic script / no modules）
 *
 * フォールバックハッシュ: upstream main（2026-10-04）
 * 33026c5e9615742ce39f40200c2eeb485d341ee2
 */
(function () {
  'use strict';

  const FALLBACK_COMMIT_HASH = '33026c5e9615742ce39f40200c2eeb485d341ee2';
  const COMMIT_HASH_RE = /^[0-9a-f]{40}$/i;
  const REPO = 'dancedunce1988-max/dx';
  const JSDELIVR_HOST = 'cdn.jsdelivr.net';
  const RAW_HOST = 'raw.githubusercontent.com';
  window.__DX_REPO__ = REPO;
  window.__DX_JSDELIVR_HOST__ = JSDELIVR_HOST;
  window.__DX_RAW_HOST__ = RAW_HOST;

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

    const originalAbs = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s) || s.indexOf('//') === 0;
    const decodedAbs = /^[a-z][a-z0-9+.-]*:/.test(checked) || checked.indexOf('//') === 0;
    if (decodedAbs && !originalAbs) return null;
    if (originalAbs && /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s) && !/^https:/i.test(s)) return null;

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

  function resolveAssetUrl(src, commitHash) {
    return resolveCdnUrl(src, cdnBase(commitHash));
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

  function fetchText(url) {
    return fetch(url).then(function (res) {
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
    setBootStatus('最新の版を確認しています');

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
        setBootStatus('アプリ本体を取得しています');
        const requested = commitHash;
        return fetchText(rawHtmlUrl(requested)).then(
          function (htmlText) {
            return { hash: requested, htmlText: htmlText };
          },
          function (err) {
            if (requested === FALLBACK_COMMIT_HASH) throw err;
            console.warn('[DX] app html fetch failed, using fallback hash', err);
            commitHash = FALLBACK_COMMIT_HASH;
            setBootStatus('前回の版を取得しています');
            return fetchText(rawHtmlUrl(FALLBACK_COMMIT_HASH)).then(function (htmlText) {
              return { hash: FALLBACK_COMMIT_HASH, htmlText: htmlText };
            });
          }
        );
      })
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

        // ネスト回避: remote #app の中身だけを host #app へ
        const wrapper = document.createElement('div');
        wrapper.innerHTML = remoteApp.innerHTML;
        rewriteAssetAttrs(wrapper, commitHash);
        hostApp.innerHTML = '';
        while (wrapper.firstChild) {
          hostApp.appendChild(wrapper.firstChild);
        }

        const scripts = collectScripts(doc, commitHash);
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
  function closeNobiruFrame() {
    const f = document.getElementById('dx-nobiru-frame');
    if (!f) return;
    try {
      f.srcdoc = '';
    } catch (e) {}
    f.hidden = true;
    try {
      if (window.__DX_HOST_TITLE__) document.title = window.__DX_HOST_TITLE__;
    } catch (eTitle) {}
  }

  /* 親と srcdoc で storage が分かれるとき、子が読む／書くキー。
     本体セーブ（kokugoTrainingStats_v5 など）は含めない。 */
  const FRAME_STORAGE_KEYS = [
    'dd_daily_pending_reward_v1',
    'dd_daily_rewarded_keys_v1',
    'nobiru_records_v1',
    'kokugo_minigame_pending_lvups_v1',
    'enro_run_v1',
    'kitsune_bakashiai_v4',
    /* v4 が無い端末は iframe 側の移行が v3 を読む。分けた storage だと種がないと空の v4 で上書きする */
    'kitsune_bakashiai_v3'
  ];

  /* srcdoc に埋め込む JSON。`<` を残すと script タグを途中で閉じる。 */
  function jsEmbed(value) {
    return JSON.stringify(value)
      .replace(/</g, '\\u003c')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  }

  /* toString で iframe に渡す。キー一覧は window を見る（クロージャは toString に含まれない）。 */
  function frameStorageSeedScript() {
    const keys = window.__DX_FRAME_STORAGE_KEYS__;
    if (!keys || !keys.length) return '';
    const pairs = [];
    for (let i = 0; i < keys.length; i++) {
      let value = null;
      try {
        value = localStorage.getItem(keys[i]);
      } catch (e) {
        return '';
      }
      if (value != null) pairs.push([keys[i], value]);
    }
    if (!pairs.length) return '';
    const embed = window.__DX_JS_EMBED__;
    if (typeof embed !== 'function') return '';
    const json = embed(pairs);
    return (
      'try{var __dxls=' +
      json +
      ';for(var i=0;i<__dxls.length;i++)localStorage.setItem(__dxls[i][0],__dxls[i][1]);}catch(e){}'
    );
  }

  /* iframe を閉じる前に、子の localStorage を親へ写す。
     srcdoc と親で storage が分かれているときだけ必要。同じなら読み書きは同じ領域。
     失敗したら ok: false。呼び出し側は iframe を閉じずに知らせる。 */
  function copyFrameStorage() {
    const f = document.getElementById('dx-nobiru-frame');
    if (!f) return { ok: true };
    const keys = window.__DX_FRAME_STORAGE_KEYS__ || [];
    try {
      const cw = f.contentWindow;
      if (!cw) return { ok: false, error: new Error('frame window missing') };
      const store = cw.localStorage;
      for (let i = 0; i < keys.length; i++) {
        const value = store.getItem(keys[i]);
        if (value != null) localStorage.setItem(keys[i], value);
      }
      return { ok: true };
    } catch (eSync) {
      console.error('[DX] frame storage copy failed', eSync);
      return { ok: false, error: eSync };
    }
  }

  /* 写しに失敗したまま閉じると、iframe 側の報酬・レベルが消える。残るか戻るかを選ばせる。 */
  function confirmLeaveWithoutStorage(message, onLeave) {
    const old = document.getElementById('dx-storage-copy-error');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const wrap = document.createElement('div');
    wrap.id = 'dx-storage-copy-error';
    wrap.setAttribute('role', 'alert');
    wrap.setAttribute(
      'style',
      'position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(43,43,43,.35);'
    );
    const card = document.createElement('div');
    card.setAttribute(
      'style',
      'width:min(100%,360px);background:#fff;border:1px solid #e4ded3;border-radius:14px;padding:28px 28px 24px;text-align:center;font-family:"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;color:#2b2b2b;'
    );
    const title = document.createElement('p');
    title.setAttribute('style', 'margin:0 0 8px;color:#b00020;font-weight:bold;font-size:.95rem;');
    title.textContent = '記録を写せませんでした';
    const body = document.createElement('p');
    body.setAttribute('style', 'margin:0;text-align:left;white-space:pre-wrap;font-size:.88rem;line-height:1.6;');
    body.textContent = message;
    const stay = document.createElement('button');
    stay.type = 'button';
    stay.textContent = 'この画面に残る';
    const leave = document.createElement('button');
    leave.type = 'button';
    leave.textContent = 'ホームに戻る';
    const btnStyle =
      'margin-top:16px;padding:8px 18px;border:1px solid #e4ded3;border-radius:8px;background:#fff;font:inherit;cursor:pointer;';
    stay.setAttribute('style', btnStyle + 'margin-right:8px;');
    leave.setAttribute('style', btnStyle);
    stay.addEventListener('click', function () {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    });
    leave.addEventListener('click', function () {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      onLeave();
    });
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(stay);
    card.appendChild(leave);
    wrap.appendChild(card);
    (document.documentElement || document.body).appendChild(wrap);
  }

  /* 通常版は nobiru → kokugo_app.html へ遷移し直し、showHome でクリア報酬が出る。
     配布は同一ページのまま iframe を閉じるだけなので、明示的に showHome を呼ぶ。
     （閉じるだけだと、開く前の「読解Quest選択」が再表示され、ホームへ押すまで
      クリア画面が出ない） */
  function finishReturnFromNobiru() {
    closeNobiruFrame();
    const go = function () {
      try {
        if (typeof window.showHome === 'function') {
          window.showHome();
        }
      } catch (eHome) {
        console.error('[DX] showHome after nobiru failed', eHome);
      }
    };
    /* iframe 破棄と同フレームで DOM を書き換えると端末によって描画が残るため、次タスクへ */
    setTimeout(go, 0);
  }

  function returnFromNobiru() {
    const copied = copyFrameStorage();
    if (!copied.ok) {
      confirmLeaveWithoutStorage(
        'クリア報酬を本体に写せませんでした。この画面に残れば記録は残ります。ホームに戻ると、今回の報酬が反映されないことがあります。',
        finishReturnFromNobiru
      );
      return;
    }
    finishReturnFromNobiru();
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
        window.frameElement.srcdoc = out;
        return;
      }
    } catch (e1) {}

    let f = document.getElementById('dx-nobiru-frame');
    if (!f) {
      f = document.createElement('iframe');
      f.id = 'dx-nobiru-frame';
      f.title = pageTitle || 'のびる読解';
      /* 親タブの遷移は許さない。same-origin は記録の写しと戻り処理に必要。 */
      f.setAttribute(
        'sandbox',
        'allow-scripts allow-same-origin allow-modals allow-forms'
      );
      f.setAttribute(
        'style',
        'position:fixed;inset:0;border:0;width:100%;height:100%;z-index:99999;background:#fff;'
      );
      document.documentElement.appendChild(f);
    }
    if (pageTitle) f.title = pageTitle;
    f.hidden = false;
    f.srcdoc = out;
  }

  function absolutizeNobiruHtml(html, nobiruBase) {
    /* .toString() で iframe に注入するため、クロージャ名ではなく window 経由で解決する */
    const resolve = window.__DX_RESOLVE_NOBIRU__;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const nodes = doc.querySelectorAll('[src], link[href]');
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      if (el.hasAttribute('src')) {
        const src = el.getAttribute('src');
        const absSrc = resolve(src, nobiruBase);
        if (absSrc) el.setAttribute('src', absSrc);
        else if (src && String(src).trim()) el.removeAttribute('src');
      }
      if (el.hasAttribute('href') && el.tagName.toLowerCase() === 'link') {
        const href = el.getAttribute('href');
        const absHref = resolve(href, nobiruBase);
        if (absHref) el.setAttribute('href', absHref);
        else if (href && String(href).trim()) el.removeAttribute('href');
      }
    }
    /* <base> は srcdoc の相対 URL を外へ逃す。<meta refresh> は遷移になる。 */
    const bases = doc.querySelectorAll('base, meta[http-equiv]');
    for (let b = 0; b < bases.length; b++) {
      const tag = bases[b].tagName.toLowerCase();
      if (tag === 'meta' && !/^refresh$/i.test(bases[b].getAttribute('http-equiv') || '')) continue;
      if (bases[b].parentNode) bases[b].parentNode.removeChild(bases[b]);
    }
    /* ホームリンクはクリックで差し替える。相対 href のまま残すと変な遷移の元になる */
    const homes = doc.querySelectorAll('a.back, a.modesel-back');
    for (let h = 0; h < homes.length; h++) {
      homes[h].setAttribute('href', '#');
    }
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  }

  function showPageError(message) {
    const old = document.getElementById('dx-page-error');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const wrap = document.createElement('div');
    wrap.id = 'dx-page-error';
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
    title.textContent = '読み込みに失敗しました';
    const body = document.createElement('p');
    body.setAttribute('style', 'margin:0;text-align:left;white-space:pre-wrap;font-size:.88rem;line-height:1.6;');
    body.textContent = String(message || '');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '閉じる';
    btn.setAttribute(
      'style',
      'margin-top:16px;padding:8px 18px;border:1px solid #e4ded3;border-radius:8px;background:#fff;font:inherit;cursor:pointer;'
    );
    btn.addEventListener('click', function () {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    });
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(btn);
    wrap.appendChild(card);
    (document.documentElement || document.body).appendChild(wrap);
  }

  function reportPageError(err) {
    const msg =
      (err && err.message) ||
      String(err) ||
      'ページを開けませんでした。ネットワーク接続を確認してください。';
    window.__DX_SHOW_PAGE_ERROR__(msg);
    console.error('[DX] page open failed', err);
  }

  function fetchPageHtml(url, failLabel, onHtml) {
    const base = window.__DX_CDN_BASE__;
    const resolve = window.__DX_RESOLVE_NOBIRU__;
    const resolved = resolve && base ? resolve(String(url || ''), base) : null;
    if (!resolved) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('許可されていない URL です'));
      return Promise.resolve();
    }
    return fetch(resolved)
      .then(function (res) {
        if (!res.ok) {
          throw new Error(failLabel + ' (HTTP ' + res.status + ')');
        }
        return res.text();
      })
      .then(onHtml)
      .catch(function (err) {
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
    const openerName = kind === 'nobiru' ? '__DX_OPEN_NOBIRU__' : '__DX_OPEN_STANDALONE_HTML__';
    const openerFn = window[openerName];
    const openerSrc =
      'window.__DX_SHOW_PAGE_ERROR__=(' +
      window.__DX_SHOW_PAGE_ERROR__.toString() +
      ');' +
      'window.__DX_REPORT_PAGE_ERROR__=(' +
      window.__DX_REPORT_PAGE_ERROR__.toString() +
      ');' +
      'window.__DX_HOST_HOME_URL__=(' +
      window.__DX_HOST_HOME_URL__.toString() +
      ');' +
      'window.__DX_BUILD_SRCDOC_BOOT__=(' +
      window.__DX_BUILD_SRCDOC_BOOT__.toString() +
      ');' +
      'window.__DX_FETCH_PAGE__=(' +
      window.__DX_FETCH_PAGE__.toString() +
      ');' +
      'window.' +
      openerName +
      '=(' +
      openerFn.toString() +
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
      ');' +
      'window.__DX_JS_EMBED__=(' +
      window.__DX_JS_EMBED__.toString() +
      ');' +
      'window.__DX_FRAME_STORAGE_SEED__=(' +
      window.__DX_FRAME_STORAGE_SEED__.toString() +
      ');';

    const embed = window.__DX_JS_EMBED__;
    const storageSeed = window.__DX_FRAME_STORAGE_SEED__();
    const passBoot = opts.passId
      ? 'try{var __dxpo=JSON.parse(sessionStorage.getItem("kokugo_mg_pass_v1")||"{}");__dxpo[' +
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
      'window.__DX_FRAME_STORAGE_KEYS__=' +
      embed(window.__DX_FRAME_STORAGE_KEYS__) +
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
        'window.__DX_NOBIRU_BASE__=' +
        embed(opts.assetBase) +
        ';' +
        'window.__DX_BOOT_SEARCH__=' +
        embed(opts.bootSearch || '') +
        ';';
    } else {
      globals += 'window.__DX_STANDALONE_PAGE__=' + embed(opts.pageName) + ';';
    }

    /* location.search は LegacyUnforgeable で、prototype を差し替えても srcdoc の実値は空のまま。
       一日一読 / チェックモードは engine.js が __DX_BOOT_SEARCH__ を読む。 */

    const scriptHook =
      '(function(){const nb=' +
      embed(opts.assetBase) +
      ';const ce=document.createElement.bind(document);' +
      'document.createElement=function(tag){const el=ce(tag);' +
      'if(String(tag).toLowerCase()==="script"){el.async=false;const sa=el.setAttribute.bind(el);' +
      'el.setAttribute=function(n,v){if(String(n).toLowerCase()==="src"&&v){' +
      'var r=window.__DX_RESOLVE_NOBIRU__&&window.__DX_RESOLVE_NOBIRU__(String(v), nb);' +
      'if(!r){if(window.__DX_REPORT_PAGE_ERROR__)window.__DX_REPORT_PAGE_ERROR__(new Error("許可されていないスクリプト URL です"));return;}' +
      'v=r;}return sa(n,v);};' +
      'try{Object.defineProperty(el,"src",{configurable:true,enumerable:true,' +
      'get:function(){return el.getAttribute("src");},' +
      'set:function(v){el.setAttribute("src",v);}});}' +
      'catch(e2){}}return el;};})();';

    const goHome =
      'var __dxHome=String(window.__DX_HOME_URL__||"");' +
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
      '(function(){function dxNorm(u){var t=String(u||"").replace(/[\\u0000-\\u0020\\u007f]+/g,"");' +
      'for(var n=0;n<8;n++){try{var d=decodeURIComponent(t);}catch(e){return null;}if(d===t)break;t=d;}' +
      'if(/[\\u0000-\\u0020\\u007f]/.test(t)||/%(?:2e|2f|5c)/i.test(t))return null;return t.toLowerCase();}' +
      'function dxIsHashOnly(u){return String(u||"").charAt(0)==="#";}' +
      'function dxIsHomeNav(u){var raw=String(u||"");' +
      'if(/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)&&!/^file:/i.test(raw))return false;' +
      'if(raw.indexOf("//")===0)return false;' +
      'var norm=dxNorm(u);if(norm==null)return false;' +
      'if(/^(javascript|data|vbscript):/.test(norm))return false;' +
      'if(/^[a-z][a-z0-9+.-]*:/.test(norm)&&norm.indexOf("file:")!==0)return false;' +
      'if(norm.indexOf("//")===0)return false;' +
      'return /(?:^|\\/)kokugo_app\\.html(?:[?#]|$)/i.test(raw)||/(?:^|\\/)kokugo_app\\.html(?:[?#]|$)/i.test(norm);}' +
      'var dxLauncherHome=String(window.__DX_HOME_URL__||"");' +
      'function dxIsLauncherHome(u){if(!dxLauncherHome)return false;var raw=String(u||"");if(raw===dxLauncherHome)return true;' +
      'var hn=dxLauncherHome.toLowerCase().split("#")[0];var un=(dxNorm(u)||"").split("#")[0];return un===hn;}' +
      'function dxNavKind(u){if(dxIsHashOnly(u))return "hash";if(dxIsHomeNav(u))return "home";if(dxIsLauncherHome(u))return "launcher";return "block";}' +
      'var dxLauncherOnce=false;' +
      'function dxGoLauncher(){dxLauncherOnce=true;location.href=dxLauncherHome;}' +
      'function dxPass(u,pass){var k=dxNavKind(u);' +
      'if(k==="home"){if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();return;}' +
      'if(k==="launcher"){dxLauncherOnce=true;pass(dxLauncherHome);return;}' +
      'if(k==="block")return;pass(u);}' +
      'function dxReopenNobiru(){if(!window.__DX_OPEN_NOBIRU__||!window.__DX_NOBIRU_KEY__)return false;' +
      'const o={};try{new URLSearchParams(window.__DX_BOOT_SEARCH__||"").forEach(function(v,k){o[k]=v;});}catch(eR){}' +
      'window.__DX_OPEN_NOBIRU__(window.__DX_NOBIRU_KEY__,o);return true;}' +
      'try{const lr=Location.prototype.replace;Object.defineProperty(Location.prototype,"replace",{configurable:false,writable:false,value:function(u){' +
      'var self=this;dxPass(u,function(x){lr.call(self,x);});}});}catch(e4){}' +
      'try{const la=Location.prototype.assign;Object.defineProperty(Location.prototype,"assign",{configurable:false,writable:false,value:function(u){' +
      'var self=this;dxPass(u,function(x){la.call(self,x);});}});}catch(e5){}' +
      'try{const hd=Object.getOwnPropertyDescriptor(Location.prototype,"href");' +
      'if(hd&&hd.set){Object.defineProperty(Location.prototype,"href",{configurable:false,enumerable:true,' +
      'get:function(){return hd.get.call(this);},' +
      'set:function(v){var self=this;dxPass(v,function(x){hd.set.call(self,x);});}});}}catch(e6){}' +
      'try{if(window.navigation&&navigation.addEventListener){navigation.addEventListener("navigate",function(ev){' +
      'if(ev.hashChange)return;if(dxLauncherOnce){dxLauncherOnce=false;return;}' +
      'var u=ev.destination&&ev.destination.url||"";var k=dxNavKind(u);' +
      'if(k==="hash")return;' +
      'if(k==="home"){if(ev.cancelable)ev.preventDefault();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();return;}' +
      'if(k==="launcher"){if(String(u)===dxLauncherHome)return;' +
      'if(ev.cancelable)ev.preventDefault();dxGoLauncher();return;}' +
      'if(ev.cancelable)ev.preventDefault();});}}catch(eN){}' +
      'document.addEventListener("click",function(ev){var el=ev.target&&ev.target.closest&&ev.target.closest("a[href]");' +
      'if(!el)return;var href=el.getAttribute("href")||"";var k=dxNavKind(href);' +
      'if(k==="hash"||k==="home")return;ev.preventDefault();if(k==="launcher")dxGoLauncher();},true);';
    if (kind === 'nobiru') {
      locationHooks +=
        'try{const rl=Location.prototype.reload;Location.prototype.reload=function(){' +
        'if(dxReopenNobiru())return;return rl.apply(this,arguments);};}catch(e8){}' +
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
          '!(window.__DX_NOBIRU_FINISHED__&&window.__DX_NOBIRU_FINISHED__())){return;}' +
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
          'const back=ev.target&&ev.target.closest&&ev.target.closest("#backLink,.back-link,a[href*=\\"kokugo_app\\"]");' +
          'if(back){ev.preventDefault();ev.stopImmediatePropagation();if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();}' +
          '},true);' +
          'document.addEventListener("DOMContentLoaded",function(){' +
          'window.backToApp=function(){if(window.__DX_GO_HOME__)window.__DX_GO_HOME__();};' +
          '});'
        : '';

    const cspMeta =
      '<meta http-equiv="Content-Security-Policy" content="' +
      "default-src 'none'; " +
      "script-src 'unsafe-inline' https://cdn.jsdelivr.net https://raw.githubusercontent.com; " +
      "style-src 'unsafe-inline' https://cdn.jsdelivr.net https://raw.githubusercontent.com; " +
      "img-src data: blob: https://cdn.jsdelivr.net https://raw.githubusercontent.com; " +
      "media-src data: blob: https://cdn.jsdelivr.net https://raw.githubusercontent.com; " +
      "font-src data: https://cdn.jsdelivr.net https://raw.githubusercontent.com; " +
      "connect-src https://cdn.jsdelivr.net https://raw.githubusercontent.com; " +
      "frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'" +
      '">';

    const boot =
      '<script>(function(){' +
      storageSeed +
      passBoot +
      globals +
      scriptHook +
      goHome +
      locationHooks +
      nobiruClicks +
      minigameClicks +
      openerSrc +
      '})();<\/script>';

    const absHtml = window.__DX_ABS_NOBIRU__(html, opts.assetBase);
    if (/<head[^>]*>/i.test(absHtml)) {
      return absHtml.replace(/<head[^>]*>/i, function (m) {
        return m + cspMeta + boot;
      });
    }
    return cspMeta + boot + absHtml;
  }

  function openNobiruPage(key, searchObj) {
    const base = window.__DX_CDN_BASE__;
    const home = window.__DX_HOST_HOME_URL__();
    const htmlName = String(key || '').replace(/[^A-Za-z0-9_-]/g, '');
    if (!htmlName) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('不正な教材キーです'));
      return Promise.resolve();
    }

    if (!base) {
      const qsLocal = new URLSearchParams(searchObj || {});
      let localUrl = 'nobiru/' + htmlName + '.html';
      if (qsLocal.toString()) localUrl += '?' + qsLocal.toString();
      location.href = localUrl;
      return Promise.resolve();
    }

    const nobiruBase = base + 'nobiru/';
    const pageUrl = nobiruBase + htmlName + '.html';
    if (!window.__DX_RESOLVE_NOBIRU__ || !window.__DX_RESOLVE_NOBIRU__(pageUrl, base)) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('許可されていない教材 URL です'));
      return Promise.resolve();
    }
    const bootParams = new URLSearchParams(searchObj || {});
    const bootSearch = bootParams.toString() ? '?' + bootParams.toString() : '';

    /* <base> は使わない（about:srcdoc → /nobiru/srcdoc 事故の原因） */
    return window.__DX_FETCH_PAGE__(
      pageUrl,
      'のびる読解の取得に失敗しました',
      function (html) {
        window.__DX_SHOW_NOBIRU_HTML__(
          window.__DX_BUILD_SRCDOC_BOOT__(html, {
            kind: 'nobiru',
            base: base,
            home: home,
            assetBase: nobiruBase,
            htmlName: htmlName,
            bootSearch: bootSearch,
          })
        );
      }
    );
  }

  /** ルート直下の別ページ HTML（九尾の化かし合い・炎狼ラン等）を srcdoc で開く。
   *  passId は本体 mgGoWithPass の第1引数（通行証キー）。新ミニゲーム追加時も対応表不要。 */
  function openStandaloneHtml(fileName, passId) {
    const base = window.__DX_CDN_BASE__;
    const home = window.__DX_HOST_HOME_URL__();
    const safeName = String(fileName || '').trim();
    if (!/^[A-Za-z0-9_-]+\.html$/.test(safeName)) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('不正なページ名です'));
      return Promise.resolve();
    }
    const safePassId = /^[A-Za-z0-9_-]+$/.test(String(passId || '')) ? String(passId) : '';

    if (!base) {
      location.href = safeName;
      return Promise.resolve();
    }

    const pageUrl = base + safeName;
    if (!window.__DX_RESOLVE_NOBIRU__ || !window.__DX_RESOLVE_NOBIRU__(pageUrl, base)) {
      window.__DX_REPORT_PAGE_ERROR__(new Error('許可されていないページ URL です'));
      return Promise.resolve();
    }

    return window.__DX_FETCH_PAGE__(pageUrl, 'ページの取得に失敗しました', function (html) {
      window.__DX_SHOW_NOBIRU_HTML__(
        window.__DX_BUILD_SRCDOC_BOOT__(html, {
          kind: 'minigame',
          base: base,
          home: home,
          assetBase: base,
          pageName: safeName,
          passId: safePassId,
        })
      );
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

  function finishReturnFromMinigame() {
    closeNobiruFrame();
    const go = function () {
      try {
        if (
          typeof showPrologue === 'function' &&
          typeof showHome === 'function' &&
          typeof showSideQuestMenu === 'function'
        ) {
          showPrologue(function () {
            showHome();
            showSideQuestMenu();
          });
        } else {
          console.error('[DX] minigame return hooks missing');
        }
      } catch (e) {
        console.error('[DX] showHome after minigame failed', e);
      }
    };
    /* iframe 破棄と同フレームで DOM を書き換えると端末によって描画が残る */
    setTimeout(go, 0);
  }

  function returnFromMinigame() {
    const copied = copyFrameStorage();
    if (!copied.ok) {
      confirmLeaveWithoutStorage(
        'レベルの変化を本体に写せませんでした。この画面に残れば記録は残ります。ホームに戻ると、今回のレベルが反映されないことがあります。',
        finishReturnFromMinigame
      );
      return;
    }
    finishReturnFromMinigame();
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
    window.__DX_FRAME_STORAGE_KEYS__ = FRAME_STORAGE_KEYS;
    window.__DX_FRAME_STORAGE_SEED__ = frameStorageSeedScript;
    window.__DX_SHOW_PAGE_ERROR__ = showPageError;
    window.__DX_REPORT_PAGE_ERROR__ = reportPageError;
    window.__DX_HOST_HOME_URL__ = dxHostHomeUrl;
    window.__DX_BUILD_SRCDOC_BOOT__ = buildSrcdocDocument;
    window.__DX_FETCH_PAGE__ = fetchPageHtml;
    window.__DX_OPEN_NOBIRU__ = openNobiruPage;
    window.__DX_OPEN_STANDALONE_HTML__ = openStandaloneHtml;
    window.__DX_RETURN_FROM_MINIGAME__ = returnFromMinigame;
    window.__DX_RETURN_FROM_NOBIRU__ = returnFromNobiru;
    window.__DX_SHOW_NOBIRU_HTML__ = showNobiruHtml;
    window.__DX_CLOSE_NOBIRU__ = closeNobiruFrame;
    /* ABS が RESOLVE を参照するため、RESOLVE を先に載せる */
    window.__DX_RESOLVE_NOBIRU__ = resolveCdnUrl;
    window.__DX_ABS_NOBIRU__ = absolutizeNobiruHtml;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

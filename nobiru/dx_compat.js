/* ============================================================
   file:// 生徒ランチャー + CDN（__DX_CDN_BASE__）向けの最小ナビ互換。
   - アセット（style.css / texts/*.js / engine*.js）は、nobiru を CDN 絶対URLで
     開いていれば相対パスのままで足りる。
   - 「ホームに戻る」だけは ../kokugo_app.html だと CDN 上の本体へ行き、
     file:// のホストへ戻れない。そのため:
       1) window.__DX_GO_HOME__ があればそれを呼ぶ（ランチャー任意フック）
       2) ?dx_home= があればそこへ（ランチャーが付与。モード選択をまたいでも維持）
       3) それ以外（ローカル直開き / GitHub Pages）は従来どおり ../kokugo_app.html
   ============================================================ */
(function (global) {
  "use strict";

  function isCdnHost() {
    return /\.jsdelivr\.net$/i.test(location.hostname);
  }

  /** open-redirect 対策: file / http(s) のみ。javascript: 等は拒否 */
  function safeHomeUrl(raw) {
    if (!raw || typeof raw !== "string") return null;
    var s = raw.trim();
    if (!s) return null;
    try {
      var u = new URL(s, location.href);
      if (u.protocol !== "http:" && u.protocol !== "https:" && u.protocol !== "file:") {
        return null;
      }
      return u.href;
    } catch (e) {
      return null;
    }
  }

  function dxHomeFromQuery() {
    try {
      return safeHomeUrl(new URLSearchParams(location.search).get("dx_home"));
    } catch (e) {
      return null;
    }
  }

  function goHome(ev) {
    if (ev) ev.preventDefault();
    if (typeof global.__DX_GO_HOME__ === "function") {
      global.__DX_GO_HOME__();
      return;
    }
    if (typeof global.__DX_HOME_URL__ === "string" && global.__DX_HOME_URL__) {
      location.href = global.__DX_HOME_URL__;
      return;
    }
    var home = dxHomeFromQuery();
    if (home) {
      location.href = home;
      return;
    }
    location.href = "../kokugo_app.html";
  }

  function wireHomeLinks(root) {
    const scope = root || document;
    scope.querySelectorAll("a.back, a.modesel-back").forEach(function (a) {
      if (a.dataset.dxHomeWired) return;
      a.dataset.dxHomeWired = "1";
      a.addEventListener("click", goHome);
    });
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  global.DxCompat = {
    goHome: goHome,
    wireHomeLinks: wireHomeLinks,
    isCdnHost: isCdnHost,
    dxHomeFromQuery: dxHomeFromQuery
  };
  onReady(function () { wireHomeLinks(); });
})(window);

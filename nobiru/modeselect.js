/* ============================================================
   のびる読解　モード選択（2026-09-19〜）
   イージー（選択問題のみ）／ハード（記述式中心）を、開くたびに毎回選び直せる
   ようにする。固定的にどちらかへ割り振ることはしない。
   texts/<教材名>.js（window.NOBIRU_TEXT）・records.js（window.NobiruRecords、
   あれば）のあとに読み込む。engine.js／engine_hard.jsは、ここで選ばれたモード
   に応じて、このファイルが動的に読み込む（モードが決まるまでは読まない）。
   ============================================================ */
(function(){
"use strict";

const params = new URLSearchParams(location.search);
const raw = params.get("mode");
const mode = raw === "hard" ? "hard" : raw === "easy" ? "easy" : null;
window.NOBIRU_MODE = mode;

const modeRoot = document.getElementById("modeSelectRoot");
const readerRoot = document.getElementById("readerRoot");

function escHtml(s){
  return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
}

if(mode){
  modeRoot.hidden = true;
  readerRoot.hidden = false;
  const s = document.createElement("script");
  s.src = mode === "hard" ? "engine_hard.js" : "engine.js";
  document.body.appendChild(s);
} else {
  readerRoot.hidden = true;
  const TEXT = window.NOBIRU_TEXT;
  const key = TEXT.meta.key || TEXT.meta.title || document.title;
  const hasHard = !!TEXT.hard;

  function recLine(m){
    if(!window.NobiruRecords) return "";
    const r = NobiruRecords.get(key, m);
    return r
      ? `<div class="modesel-record">前回の累計経験値：${r.lastXp}（自己ベスト：${r.bestXp}／${r.plays}回目）</div>`
      : `<div class="modesel-record">まだ記録はありません。</div>`;
  }

  modeRoot.innerHTML = `
    <div class="modesel">
      <h2>${escHtml(TEXT.meta.title || "")}</h2>
      <p class="lead">読み方を選んでください。どちらも同じ文章を読みます。順位や他の人との比較はなく、自分の記録とだけ比べられます。何度でも選び直せます。</p>
      <div class="modesel-cards">
        <button class="modesel-card" data-mode="easy" type="button">
          <h3>イージーモード</h3>
          <p>段落ごとに本文がのびていきます。設問はすべて選択問題です。</p>
          ${recLine("easy")}
        </button>
        ${hasHard ? `
        <button class="modesel-card hard" data-mode="hard" type="button">
          <h3>ハードモード</h3>
          <p>本文は「前半」「後半」の2回に分けて出てきます。設問は記述式が中心で、最後に文章全体についての選択問題が出ます。ヒントボタンもあります。</p>
          ${recLine("hard")}
        </button>` : `
        <div class="modesel-card hard" style="opacity:.5;">
          <h3>ハードモード</h3>
          <p>この教材のハードモードは、まだ準備中です。</p>
        </div>`}
      </div>
      <a class="modesel-back ui" href="../kokugo_app.html">← ホームに戻る</a>
    </div>`;

  modeRoot.querySelectorAll(".modesel-card[data-mode]").forEach(btn => {
    btn.onclick = () => { location.href = location.pathname + "?mode=" + btn.dataset.mode; };
  });
}
})();

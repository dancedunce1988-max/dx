/* ============================================================
   のびる読解　モード選択（2026-09-19〜）

   ハードモードは一旦無効化（教員の指示、2026-09-22〜：「ハードモード、
   うまくいかないので、一旦無くしてください。1つのモードだけとします」）。
   イージー／ハードを選ばせる画面は出さず、読解Questからはモード選択なしで
   そのままengine.jsに入る。エンジン自体（engine_hard.js）・教材データ
   （texts/<教材名>.jsのhardキー）・採点ロジックは削除せずそのまま残してあり、
   下の「元のモード選択ロジック」を戻すだけで復活できる。
   ============================================================ */
(function(){
"use strict";

const readerRoot = document.getElementById("readerRoot");
const modeRoot = document.getElementById("modeSelectRoot");
if(modeRoot) modeRoot.hidden = true;
readerRoot.hidden = false;
window.NOBIRU_MODE = "easy";

/* engine.jsは動的にscriptタグを作って読み込むため、HTML側の
   <script src="...?v=...">のようなキャッシュ対策が効かない。
   modeselect.js自身のsrcに付いている?v=をそのまま引き継ぐ
   （教員の報告、2026-09-23〜：更新したはずの表示が反映されない問題への対応）。 */
const selfSrc = (document.currentScript && document.currentScript.src) || "";
const verMatch = selfSrc.match(/[?&]v=([^&]+)/);
const verQuery = verMatch ? ("?v=" + verMatch[1]) : "";
const s = document.createElement("script");
s.src = "engine.js" + verQuery;
document.body.appendChild(s);

/* ---- 元のモード選択ロジック（2026-09-19〜2026-09-22。ハードモードを
   復活させるときは、上のブロックを削除してこちらのコメントを外すだけでよい） ----

function escHtml(s){
  return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
}

const params = new URLSearchParams(location.search);
const raw = params.get("mode");
const mode = raw === "hard" ? "hard" : raw === "easy" ? "easy" : null;
window.NOBIRU_MODE = mode;

if(mode){
  modeRoot.hidden = true;
  readerRoot.hidden = false;
  const selfSrc2 = (document.currentScript && document.currentScript.src) || "";
  const verMatch2 = selfSrc2.match(/[?&]v=([^&]+)/);
  const verQuery2 = verMatch2 ? ("?v=" + verMatch2[1]) : "";
  const s2 = document.createElement("script");
  s2.src = (mode === "hard" ? "engine_hard.js" : "engine.js") + verQuery2;
  document.body.appendChild(s2);
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
          <h3>通常モード</h3>
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
---- ここまで元のモード選択ロジック ---- */
})();

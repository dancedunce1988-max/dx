/* ============================================================
   のびる読解 エンジン（engine.js）
   教材データは texts/<教材名>.js が window.NOBIRU_TEXT にセットしたものを読む。
   このファイル自体は特定の教材の内容を一切知らない。
   記法・データ構造は texts/_template.js のコメントを参照。
   ============================================================ */
(function(){
"use strict";

const TEXT = window.NOBIRU_TEXT;
const PARAS = TEXT.paras;
const TEXT_KEY = TEXT.meta.key || TEXT.meta.title || document.title;
const $ = id => document.getElementById(id);
const svgNS = "http://www.w3.org/2000/svg";
/* 「一日一読」（2026-09-23〜、教員の指示）：知識ドリルDXのホーム画面「一日一読」から
   ?viaDaily=1付きで開かれたかどうか。読み終わったとき（finish()）に、この文章の累計経験値を
   kokugo_app.html側へ伝える合図（DD_PENDING_REWARD_LSKEY）に含める。一日一読経由なら
   その全額、そうでなければ半額をkokugo_app.html側がst.stockXpへ加算する（ddCheckNobiruPendingReward参照）。
   同一オリジンなのでlocalStorageはkokugo_app.htmlと共有できるが、st（本体のセーブデータ）の
   複雑な形を直接ここで書き換えるのは危険なので、合図だけを置く簡単な仕組みにしてある。 */
const VIA_DAILY = new URLSearchParams(location.search).get("viaDaily") === "1";
const DD_PENDING_REWARD_LSKEY = "dd_daily_pending_reward_v1";
/* この教材が、以前すでにストック経験値を受け取り済みかどうか（2026-09-23〜、教員の指示：
   「2回目以降は経験値を獲得できないので、獲得していない経験値についてはポップアップ等で
   表示しないように」）。kokugo_app.html側がst.nobiruRewardGivenのキー一覧をそのまま
   ミラーしたものをDD_REWARDED_KEYS_LSKEYに書いている（ddCheckNobiruPendingReward参照）ので、
   ここではその配列にTEXT_KEYが含まれるかだけを見る。st本体（複雑な形）には一切触れない。 */
const DD_REWARDED_KEYS_LSKEY = "dd_daily_rewarded_keys_v1";
let ALREADY_REWARDED = false;
try{
  const raw = localStorage.getItem(DD_REWARDED_KEYS_LSKEY);
  const arr = raw ? JSON.parse(raw) : [];
  ALREADY_REWARDED = Array.isArray(arr) && arr.includes(TEXT_KEY);
}catch(e){ /* 読めない場合は「未受け取り」扱いのまま続行する */ }

let stage = 0, finalIdx = 0;
/* 累計経験値。設問ごとの内訳は画面に出さず、この合計だけをフッターに出し続ける
   （2026-09-19〜、当時はハードモード新設にあわせた経験値設計だったが、2026-09-22〜
   ハードモードは無効化済み）。NobiruRecordsが読み込まれている（records.js経由）教材だけ、
   自己ベストとの比較をlocalStorageに保存する。読み込まれていない教材は、これまでどおり
   保存はしない。 */
let totalXp = 0;
function addXp(n){
  totalXp += n;
  const el = $("xpTotal");
  if(el) el.innerHTML = `累計経験値　<b>${totalXp}</b>`;
}
/* 経験値ポップアップ（2026-09-23〜、教員の指示：「ポップアップするような感じで、3秒ほど、
   ストック経験値～獲得！と元気づけられるような演出」）。フッターの.xpTotal（小さく静かに
   更新するだけ）とは別に、正解した瞬間だけ画面中央上部へ大きく表示する。連続で正解しても
   前のポップアップを消してから出し直す（重ならないように）。 */
let xpGainPopupTimer = null;
function showXpGainPopup(n){
  const old = $("xpGainPopup");
  if(old) old.remove();
  if(xpGainPopupTimer) clearTimeout(xpGainPopupTimer);
  const el = document.createElement("div");
  el.id = "xpGainPopup";
  el.className = "xp-gain-popup";
  el.textContent = `🎉 ストック経験値＋${n}！`;
  document.body.appendChild(el);
  xpGainPopupTimer = setTimeout(() => { el.remove(); xpGainPopupTimer = null; }, 3000);
}
const record = [];
/* 設問の総数（教員の指示、2026-09-17〜：進み具合ゲージ用）。各段落のq、
   最終段落のqsの配列長を足し合わせるだけで、教材データには一切手を加えなくてよい。 */
const TOTAL_Q = PARAS.reduce((n, para) => n + (para.q ? 1 : 0) + (para.qs ? para.qs.length : 0), 0);
function updateQGauge(current){
  const label = $("qprogLabel"), fill = $("qprogFill");
  if(!label || !fill) return;
  label.textContent = `問題 ${current}／${TOTAL_Q}`;
  fill.style.width = Math.min(100, Math.round(current / TOTAL_Q * 100)) + "%";
}
let demLineSeq = 0;
let activeLineId = null;
let demRAF = null;
const checkedWords = [];
const checkedWordSet = new Set();

/* ---- 漢数字（段落数・記録の丸に使う。1〜99程度を想定） ---- */
const KJ = ["","一","二","三","四","五","六","七","八","九"];
function kanjiNum(n){
  if(n <= 0) return "〇";
  if(n < 10) return KJ[n];
  if(n < 20) return "十" + (n % 10 ? KJ[n % 10] : "");
  const j = Math.floor(n / 10), o = n % 10;
  return KJ[j] + "十" + (o ? KJ[o] : "");
}

/* ---- キーボードでも押せるようにする（本文中の語釈・指示語タップ） ---- */
function makeInteractive(el, handler){
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  el.onclick = e => { e.stopPropagation(); handler(e); };
  el.onkeydown = e => {
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault(); e.stopPropagation(); handler(e);
    }
  };
}

/* ---- 入れ子つき記法の解析 ----
   {テキスト|g:よみ/意味}        語釈（読みが不要なら g:―/意味）
   {テキスト|c:逆}               つなぎ言葉（逆・順・条・対）
   {テキスト|d:t3/指す内容}      指示語。t3は指し先のid
   {テキスト|t:t3}               指し先
   {テキスト|s:A}                対比の一方（A／B）
   {テキスト|u:Ａ}               傍線部（記号は全角英字）
   属性は縦棒で並べていくつでも足せる。 */
function splitTop(s){
  const out = []; let d = 0, cur = "";
  for(const ch of s){
    if(ch === "{") d++;
    if(ch === "}") d--;
    if(ch === "|" && d === 0){ out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur); return out;
}
function parseInto(str, parent, insideU){
  insideU = !!insideU;
  let i = 0, buf = "";
  const flush = () => { if(buf){ parent.appendChild(document.createTextNode(buf)); buf = ""; } };
  while(i < str.length){
    if(str[i] === "{"){
      let d = 0, j = i;
      for(; j < str.length; j++){ if(str[j] === "{") d++; else if(str[j] === "}"){ d--; if(d === 0) break; } }
      flush();
      const parts = splitTop(str.slice(i + 1, j));
      const sp = document.createElement("span");
      sp.className = "sp";
      let gAttr = null, dAttr = null, pAttr = null, hasU = false;
      parts.slice(1).forEach(at => {
        const k = at[0], v = at.slice(2);
        if(k === "g") gAttr = v;
        if(k === "c"){ sp.classList.add("conn"); sp.dataset.c = v; }
        if(k === "d") dAttr = v;
        if(k === "t"){ sp.classList.add("tgt"); sp.id = v; }
        if(k === "s"){ sp.dataset.s = v; }
        if(k === "u"){ hasU = true; sp.classList.add("u"); sp.dataset.u = v; sp.id = "u-" + v; }
        if(k === "p") pAttr = v;
      });
      /* クリック動作の優先順位：語釈(g) > 指示語(d) > 文節訳(p、ただし傍線部(u)の中には付けない)
         > 傍線部(u)自身は「タップしても何も起きない」ようにする。
         傍線部として下線が引かれている範囲（内側の入れ子ぶんも含めて）は設問の対象そのものなので、
         文節訳タップでヒントが漏れないよう、insideUを子の解析にも引き継いで判定する。 */
      const blockP = hasU || insideU;
      if(gAttr !== null){
        const [y, m, flag] = gAttr.split("/");
        const important = flag === "重要";
        sp.classList.add("g");
        makeInteractive(sp, () => openGloss(sp.textContent, y, m, important));
      } else if(dAttr !== null){
        const [tg, note] = dAttr.split("/");
        sp.classList.add("dem");
        sp.dataset.tgt = tg;
        sp.dataset.note = note;
        sp.dataset.lineId = "dl" + (demLineSeq++);
        makeInteractive(sp, () => showDem(sp));
      } else if(pAttr !== null && !blockP){
        sp.classList.add("p");
        makeInteractive(sp, () => openPhrase(sp.textContent, pAttr));
      } else if(hasU){
        sp.onclick = e => e.stopPropagation();
      }
      parseInto(parts[0], sp, blockP);
      parent.appendChild(sp);
      i = j + 1;
    } else { buf += str[i++]; }
  }
  flush();
}

/* ---- 本文描画 ---- */
function revealPara(i){
  const p = document.createElement("p");
  p.className = "para fresh";
  PARAS[i].s.forEach(sent => {
    const sp = document.createElement("span");
    sp.className = "s";
    if(sent.r) sp.dataset.r = sent.r;
    parseInto(sent.t, sp);
    p.appendChild(sp);
  });
  $("text").appendChild(p);
  $("prog").textContent = `第${kanjiNum(i + 1)}段落まで／全${kanjiNum(PARAS.length)}段落`;
  buildMap();
  renderFullTr();
  p.scrollIntoView({ behavior: "smooth", block: "nearest" });
  scheduleDemRedraw();
}

/* ---- 全文訳（sent.trがある教材だけ、下の方のボタンから一括で見られるようにする） ---- */
const hasTranslations = PARAS.some(para => para.s.some(sent => sent.tr));
function renderFullTr(){
  if(!hasTranslations) return;
  const list = $("fullTrList");
  let html = "";
  for(let i = 0; i <= stage && i < PARAS.length; i++){
    const trs = PARAS[i].s.filter(sent => sent.tr);
    if(!trs.length) continue;
    html += `<div class="fulltr-para"><div class="fulltr-para-title ui">第${kanjiNum(i + 1)}段落</div>`
      + trs.map(sent => /\|u:/.test(sent.t)
          ? `<p class="fulltr-sent fulltr-blank ui">（傍線部をふくむ文なので、ここでは伏せます。設問で確かめよう）</p>`
          : `<p class="fulltr-sent">${escHtml(sent.tr)}</p>`
        ).join("")
      + `</div>`;
  }
  list.innerHTML = html || `<p class="words-empty ui">まだ表示できる訳がありません。</p>`;
}

/* ---- 構造図 ---- */
function buildMap(){
  const m = $("map"); m.innerHTML = "";
  for(let i = 0; i <= stage && i < PARAS.length; i++){
    if(i > 0 && PARAS[i].rel){
      const r = document.createElement("div");
      r.className = "maprel ui"; r.textContent = "↓　" + PARAS[i].rel;
      m.appendChild(r);
    }
    const b = document.createElement("div");
    b.className = "mapbox ui";
    b.innerHTML = `<div class="mt">第${kanjiNum(i + 1)}段落　${escHtml(PARAS[i].title || "")}</div><div class="ms">${escHtml(PARAS[i].sum || "")}</div>`;
    m.appendChild(b);
  }
  const axis = TEXT.meta.axis;
  if(axis && stage >= axis.from){
    const ax = document.createElement("div");
    ax.className = "mapaxis ui";
    ax.innerHTML = `この文章をつらぬく対比<br><span class="a">${escHtml(axis.a)}</span>　⇔　<span class="b">${escHtml(axis.b)}</span>`;
    m.appendChild(ax);
  }
}
function escHtml(s){
  return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
}

/* ---- 指示語の線（SVG。文字の背面に、開示済みの指示語すべてを描く） ---- */
function renderDemLines(){
  const svg = $("demSvg");
  if(!document.body.classList.contains("v-dem")){ svg.innerHTML = ""; return; }
  const wrap = $("textWrap");
  const wrapRect = wrap.getBoundingClientRect();
  svg.setAttribute("width", wrap.offsetWidth);
  svg.setAttribute("height", wrap.offsetHeight);
  svg.setAttribute("viewBox", `0 0 ${wrap.offsetWidth} ${wrap.offsetHeight}`);
  let html = `<defs><marker id="dem-arrow" viewBox="0 0 10 10" refX="6" refY="5"
    markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0L10,5L0,10z"/></marker></defs>`;
  document.querySelectorAll(".dem").forEach(dem => {
    const tgt = document.getElementById(dem.dataset.tgt);
    if(!tgt) return;
    const dr = dem.getClientRects()[0];
    const tr = tgt.getClientRects()[0];
    if(!dr || !tr) return;
    const x1 = dr.left + dr.width / 2 - wrapRect.left, y1 = dr.top - wrapRect.top;
    const x2 = tr.left + tr.width / 2 - wrapRect.left, y2 = tr.bottom - wrapRect.top;
    const dy = y1 - y2;
    const c1x = x1 + (x2 - x1) * 0.18, c1y = y1 - Math.max(24, Math.abs(dy) * 0.35);
    const c2x = x2 + (x1 - x2) * 0.18, c2y = y2 + Math.max(24, Math.abs(dy) * 0.35);
    const active = dem.dataset.lineId === activeLineId;
    html += `<path class="dem-line${active ? " active" : ""}" marker-end="url(#dem-arrow)"
      d="M${x1.toFixed(1)},${y1.toFixed(1)} C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}"/>`;
    html += `<circle class="dem-dot${active ? " active" : ""}" cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="2.6"/>`;
  });
  svg.innerHTML = html;
}
function scheduleDemRedraw(){
  if(demRAF) return;
  demRAF = requestAnimationFrame(() => { demRAF = null; renderDemLines(); });
}

/* ---- 道具だて ---- */
const views = [
  ["b-conn", "v-conn", "つなぎ言葉に記号がつきます。<b>逆</b>＝前をひっくり返す／<b>順</b>＝前を受けて進む／<b>条</b>＝条件／<b>対</b>＝並べて比べる。どこで話が折れ曲がるかを見つけよう。"],
  ["b-dem", "v-dem", "こそあど言葉に囲みがつき、指し先まで薄い線がのびます。タップすると、その一本だけが濃くなり、指し先の語が光ります。"],
  ["b-role", "v-role", "文ごとに役割の色がつきます。" + roleLegend()],
  ["b-cont", "v-cont", "向かい合う二つのことがらに色がつきます。同じ色どうしをつないで読んでみよう。"],
  ["b-map", "", ""]
];
function roleLegend(){
  const labels = TEXT.meta.roleLabels;
  if(!labels) return "";
  return Object.keys(labels).map(k => `<b>${k}</b>＝${labels[k]}`).join("／");
}
function setLegend(){
  const on = views.find(v => v[1] && document.body.classList.contains(v[1]));
  const lg = $("legend");
  if(on){ lg.innerHTML = on[2]; lg.classList.add("on"); } else lg.classList.remove("on");
}
views.forEach(([bid, cls]) => {
  if(!cls) return;
  $(bid).onclick = () => {
    const on = document.body.classList.toggle(cls);
    $(bid).classList.toggle("on", on);
    if(on && (cls === "v-role" || cls === "v-cont")){
      const other = cls === "v-role" ? "v-cont" : "v-role";
      const ob = cls === "v-role" ? "b-cont" : "b-role";
      document.body.classList.remove(other); $(ob).classList.remove("on");
    }
    if(!on) $("demnote").classList.remove("on");
    setLegend();
    if(cls === "v-dem") scheduleDemRedraw();
  };
});
$("b-map").onclick = () => {
  const on = $("map").classList.toggle("on");
  $("b-map").classList.toggle("on", on);
  $("text").style.display = on ? "none" : "";
  $("legend").style.display = on ? "none" : "";
};
$("b-small").onclick = () => bump(-0.8);
$("b-large").onclick = () => bump(0.8);
function bump(d){
  const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs"));
  document.documentElement.style.setProperty("--fs", Math.min(20, Math.max(11.5, cur + d)) + "px");
  scheduleDemRedraw();
}
/* 設問側だけの文字サイズ（--qfs）。本文側の「小」「大」（--fs）とは独立に効く
   （教員の指示、2026-09-17〜。設問文・選択肢・フィードバック文がこの値を参照する）。 */
$("q-small").onclick = () => bumpQ(-0.8);
$("q-large").onclick = () => bumpQ(0.8);
function bumpQ(d){
  const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--qfs"));
  document.documentElement.style.setProperty("--qfs", Math.min(20, Math.max(11.5, cur + d)) + "px");
}

function showDem(el){
  document.querySelectorAll(".tgt.lit").forEach(e => e.classList.remove("lit"));
  const tgt = document.getElementById(el.dataset.tgt);
  if(tgt){ tgt.classList.add("lit"); tgt.scrollIntoView({ behavior: "smooth", block: "center" }); }
  activeLineId = el.dataset.lineId;
  const n = $("demnote");
  n.innerHTML = `この指示語がさしているのは ―― ${escHtml(el.dataset.note)}`;
  n.classList.add("on");
  if(!document.body.classList.contains("v-dem")){
    document.body.classList.add("v-dem"); $("b-dem").classList.add("on"); setLegend();
  }
  scheduleDemRedraw();
}

function openGloss(w, y, m, important){
  $("gWord").textContent = w;
  $("gYomi").textContent = (y && y !== "―") ? y : "";
  $("gMean").textContent = m;
  $("gBadge").hidden = !important;
  $("wordsSheet").classList.remove("open");
  $("fullTrSheet").classList.remove("open");
  $("gloss").classList.add("open");
  recordWordCheck(w, y, m, important);
}
$("glossClose").onclick = () => $("gloss").classList.remove("open");

/* ---- 文節ごとの現代語訳（g:と同じカードを使うが、語句として記録はしない） ---- */
function openPhrase(text, tr){
  $("gWord").textContent = text;
  $("gYomi").textContent = "現代語訳";
  $("gMean").textContent = tr;
  $("gBadge").hidden = true;
  $("wordsSheet").classList.remove("open");
  $("fullTrSheet").classList.remove("open");
  $("gloss").classList.add("open");
}

/* ---- 確認した語句（あとから振り返れるように記録する） ---- */
function recordWordCheck(w, y, m, important){
  if(checkedWordSet.has(w)) return;
  checkedWordSet.add(w);
  checkedWords.push({ w, y: (y && y !== "―") ? y : "", m, important: !!important });
  renderWordsList();
}
function renderWordsList(){
  $("wordsCount").textContent = checkedWords.length;
  const list = $("wordsList");
  if(!checkedWords.length){
    list.innerHTML = `<p class="words-empty ui">まだ確認した語句はありません。点線の語をタップすると、ここに記録されます。</p>`;
    return;
  }
  list.innerHTML = checkedWords.map(it => `
    <div class="word-item">
      <span class="w">${escHtml(it.w)}</span>${it.y ? `<span class="y ui">${escHtml(it.y)}</span>` : ""}${it.important ? `<span class="badge ui">重要語句</span>` : ""}
      <div class="m ui">${escHtml(it.m)}</div>
    </div>`).join("");
}
$("b-words").onclick = () => {
  $("gloss").classList.remove("open");
  $("fullTrSheet").classList.remove("open");
  $("wordsSheet").classList.toggle("open");
};
$("wordsClose").onclick = () => $("wordsSheet").classList.remove("open");
$("b-fulltr").onclick = () => {
  $("gloss").classList.remove("open");
  $("wordsSheet").classList.remove("open");
  $("fullTrSheet").classList.toggle("open");
};
$("fullTrClose").onclick = () => $("fullTrSheet").classList.remove("open");

/* ---- 記録 ---- */
function paintMarks(){
  const box = $("marks"); box.innerHTML = "";
  record.forEach((r, i) => {
    const d = document.createElement("div");
    let cls = "mark", txt;
    if(!r.done){ cls += r.miss ? " ng now" : " now"; txt = r.miss ? r.miss : "…"; }
    else if(r.miss === 0){ cls += " ok"; txt = "○"; }
    else { cls += " ng"; txt = r.miss; }
    d.className = cls; d.textContent = txt;
    d.title = `設問${kanjiNum(i + 1)}　` + (r.done ? (r.miss === 0 ? "一回目で正解" : `誤答${r.miss}回のあと正解`) : `解答中（誤答${r.miss}回）`);
    box.appendChild(d);
  });
  const clean = record.filter(r => r.done && r.miss === 0).length;
  const miss = record.reduce((n, r) => n + r.miss, 0);
  $("tally").textContent = `一回で正解 ${clean}問　／　誤答 のべ${miss}回`;
}

/* ---- 設問 ---- */
/* 誤答が連続したときの一時停止（教員の指示、2026-09-17〜）。教材をまたいで数える
   セッション全体の連続誤答数で、正解するたびに0に戻る。10回連続で誤答すると
   30秒間、画面全体を操作不能にする（「ホームに戻る」等も含めて何も押せなくする）。 */
let consecutiveWrong = 0;
let frozen = false;
/* オーバーレイのz-indexによる見た目のブロックだけでなく、キーボード操作（フォーカス済みの
   リンク／ボタンをEnterで押す）でも一切反応しないよう、クリックそのものを最上流（capture）で
   止める。「ホームに戻る」等のリンクにも個別の対策を入れずに済む、汎用的な安全策。 */
document.addEventListener("click", e => {
  if(frozen){ e.preventDefault(); e.stopPropagation(); }
}, true);
function freezeScreen(){
  if(frozen) return;
  frozen = true;
  let remain = 30;
  const ov = document.createElement("div");
  ov.className = "freeze-overlay ui";
  ov.innerHTML = `<div class="freeze-box">
    <p class="freeze-msg">間違いが多いため、一旦画面を停止しています。<br>よく考えて答えてみてください。</p>
    <p class="freeze-timer">あと<span id="freezeSec">${remain}</span>秒</p>
  </div>`;
  document.body.appendChild(ov);
  const timer = setInterval(() => {
    remain--;
    const s = $("freezeSec");
    if(s) s.textContent = remain;
    if(remain <= 0){
      clearInterval(timer);
      ov.remove();
      frozen = false;
      consecutiveWrong = 0;
    }
  }, 1000);
}

function showQuestion(q, onClear){
  const z = $("qzone"); z.innerHTML = "";
  const rec = { miss: 0, done: false }; record.push(rec); paintMarks();
  updateQGauge(record.length);
  document.querySelectorAll(".u.now").forEach(e => e.classList.remove("now"));
  (q.u || []).forEach(k => { const e = document.getElementById("u-" + k); if(e) e.classList.add("now"); });
  const h = document.createElement("div"); h.className = "q-head ui"; h.textContent = q.head;
  const p = document.createElement("p"); p.className = "q-text"; p.textContent = q.text;
  const ul = document.createElement("div"); ul.className = "choices";
  const fb = document.createElement("div");
  const marks = "アイウエオカ";

  /* 選択肢の並び順（教員の指示、2026-09-17〜：誤答するたびにシャッフルし直し、
     同じ位置を連打すれば進めてしまう抜け道をふさぐ）。誤答した選択肢も、シャッフル後は
     他と同じようにまた選べるようにする（教員の指示：分かっていなければ同じ間違いを
     もう一度させることで、消去法ではなく理解して選ばせるため。permanent disabledはしない）。 */
  let order = q.ch.map((c, i) => i);
  function shuffleOrder(){
    for(let i = order.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  function renderChoices(){
    ul.innerHTML = "";
    order.forEach((i, pos) => {
      const b = document.createElement("button");
      b.innerHTML = `<span class="mk ui">${marks[pos] || pos + 1}</span><span>${escHtml(q.ch[i])}</span>`;
      b.onclick = () => {
        if(frozen || rec.done) return;
        if(i === q.a){
          b.classList.add("right");
          [...ul.children].forEach(x => x.disabled = true);
          rec.done = true; paintMarks();
          consecutiveWrong = 0;
          fb.className = "fb ok"; fb.innerHTML = "";
          /* 経験値（2026-09-19〜）。1回目で正解＝10、以後誤答1回につき2ずつ減る。
             設問ごとの内訳（この10点）はここでは表示せず、addXp()でフッターの
             累計だけを更新する（内訳を見せない方針）。
             2026-09-23〜、教員の指示：フッターの小さな表示だけでは分かりにくいため、
             正解のたびに画面中央上部へ大きくポップアップさせる（showXpGainPopup）。
             ただしこの教材がすでにストック経験値を受け取り済み（ALREADY_REWARDED）なら、
             今回の正解は実際には加算されないので、ポップアップは出さない
             （教員の指示：「獲得していない経験値については表示しないように」）。 */
          const xp = Math.max(0, 10 - rec.miss * 2);
          addXp(xp);
          if(xp > 0 && !ALREADY_REWARDED) showXpGainPopup(xp);
          const expText = document.createElement("div");
          expText.textContent = "正解。" + q.exp;
          fb.appendChild(expText);
          const nx = document.createElement("button");
          nx.className = "next ui";
          nx.textContent = q.last ? "結果を見る" : "本文を先へ進める";
          nx.onclick = onClear;
          fb.appendChild(document.createElement("br"));
          fb.appendChild(nx);
        } else {
          rec.miss++; paintMarks();
          consecutiveWrong++;
          fb.className = "fb ng";
          const why = (q.why && q.why[i]) ? q.why[i] : "本文のその文を、もう一度前後ごと読んでみよう。";
          fb.textContent = (rec.miss === 1 ? "ちがいます。" : "まだちがいます。") + why
            + (rec.miss >= 2 ? "　ヒント：" + q.tip : "");
          /* シャッフルはすぐには行わず、「もう一度答える」を押させてから行う
             （教員の指示、2026-09-17〜）。選択肢はいったんすべて操作不能にし、
             ボタンを押すと選択肢そのものを完全に隠して（位置を覚えられないようにする
             ため、教員の指示で単なる操作不能表示から変更）「選択肢を配置し直します」を
             1秒表示したあとシャッフルして再表示する。
             ul.style.displayで直接消す（.choicesクラス側のdisplay:flexが優先されて
             しまうため、hidden属性だけでは消えない＝以前ハマった落とし穴と同じ対策）。 */
          [...ul.children].forEach(x => x.disabled = true);
          const retry = document.createElement("button");
          retry.className = "next ui";
          retry.textContent = "もう一度答える";
          retry.onclick = () => {
            if(frozen) return;
            retry.disabled = true;
            ul.style.display = "none";
            fb.className = "fb wait"; fb.textContent = "選択肢を配置し直します…";
            setTimeout(() => {
              fb.className = ""; fb.textContent = "";
              shuffleOrder();
              renderChoices();
              ul.style.display = "";
            }, 1000);
          };
          fb.appendChild(document.createElement("br"));
          fb.appendChild(retry);
          if(consecutiveWrong >= 10) freezeScreen();
        }
      };
      ul.appendChild(b);
    });
  }
  // 出題の直前に必ずシャッフルする（教員の指示、2026-09-23〜：「毎回同じ場所であることを
  // 防ぐため」）。以前は初回表示だけ本文データの並び順そのまま（誤答後の再シャッフルのみ）
  // だったが、それでは正解の位置が問題ごとに固定されてしまう。
  shuffleOrder();
  renderChoices();
  z.append(h, p, ul, fb);
  $("paneQ").scrollTo({ top: 0, behavior: "smooth" });
}

function step(){
  const total = PARAS.length;
  if(stage < total - 1){
    revealPara(stage);
    showQuestion(PARAS[stage].q, () => { stage++; step(); });
  } else {
    if(finalIdx === 0) revealPara(total - 1);
    const finalPara = PARAS[total - 1];
    const fq = finalPara.qs[finalIdx];
    fq.last = (finalIdx === finalPara.qs.length - 1);
    showQuestion(fq, () => { finalIdx++; finalIdx < finalPara.qs.length ? step() : finish(); });
  }
}

function finish(){
  updateQGauge(TOTAL_Q);
  /* 「一日一読」への合図（2026-09-23〜）。kokugo_app.htmlのst（本体セーブ）には触れず、
     専用のlocalStorageキーに書き置くだけ。ホーム画面（ddCheckNobiruPendingReward）が
     次に開かれたときに読み取り、初めての合図であればストック経験値に変換する。 */
  try{
    localStorage.setItem(DD_PENDING_REWARD_LSKEY, JSON.stringify({ textKey: TEXT_KEY, totalXp, viaDaily: VIA_DAILY, ts: Date.now() }));
  }catch(e){ /* privateモード等で保存できない場合は、合図なしで続行する */ }
  const clean = record.filter(r => r.miss === 0).length;
  const miss = record.reduce((n, r) => n + r.miss, 0);
  const rows = record.map((r, i) => `<tr><td>設問${kanjiNum(i + 1)}</td><td>${r.miss === 0 ? "○" : "誤答" + r.miss + "回"}</td></tr>`).join("");
  /* 自己ベストとの比較（他者比較・順位は出さない。前回の自分の記録とだけ比べる）。
     NobiruRecordsが読み込まれていない教材（records.jsを included していない教材HTML）
     では、比較を出さず今回の合計だけを表示する。 */
  let compareHtml = "";
  if(window.NobiruRecords){
    const { prev } = NobiruRecords.finish(TEXT_KEY, "easy", totalXp);
    compareHtml = prev
      ? `<p class="xp-compare">前回の累計経験値は${prev.lastXp}でした（自己ベスト${prev.bestXp}）。順位や他の人との比較はありません。自分の記録とだけ比べてみましょう。</p>`
      : `<p class="xp-compare">これが今回の記録です。次に読むときは、この累計経験値と比べてみましょう。</p>`;
  }
  $("qzone").innerHTML = `
    <div class="fin">
      <h2>読み終わりました</h2>
      <p>全${record.length}問のうち、一回目で正解できたのは${clean}問。誤答はのべ${miss}回でした。</p>
      <p>累計経験値　<b>${totalXp}</b></p>
      ${compareHtml}
      <table>${rows}</table>
      <p>本文はすべて出そろっています。「構造図」で全体のつながりを見てから、もう一度通して読んでみてください。</p>
      <button class="again ui" onclick="location.reload()">はじめからやり直す</button>
      ${VIA_DAILY ? `<button class="again ui daily-end" onclick="location.href='../kokugo_app.html'">一日一読を終える</button>` : ""}
    </div>`;
  $("paneQ").scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- 起動 ---- */
function boot(){
  document.title = (TEXT.meta.title || "のびる読解") + "　―　のびる読解";
  $("mainTitle").textContent = TEXT.meta.title || "";
  $("subTitle").textContent = TEXT.meta.sub || "答えると、本文が一段落のびる。点線の語はタップで意味が出る。";
  const theme = TEXT.meta.theme;
  if(theme) Object.keys(theme).forEach(k => document.documentElement.style.setProperty(k, theme[k]));
  window.addEventListener("resize", scheduleDemRedraw);
  $("b-fulltr").hidden = !hasTranslations;
  /* モードバッジ・モード切りかえリンク（この2つの要素を持つ教材HTMLだけにある）。
     ハードモード無効化（2026-09-22〜）でモードを選び直す意味自体が無くなっており、
     教員の指示（2026-09-23〜）で「イージーモード」という文言も含めて非表示にする。 */
  if($("modeBadge")) $("modeBadge").hidden = true;
  if($("modeSwitch")) $("modeSwitch").hidden = true;
  addXp(0);
  paintMarks();
  renderWordsList();
  step();
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
})();

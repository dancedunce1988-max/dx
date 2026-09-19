/* ============================================================
   のびる読解　ハードモード エンジン（engine_hard.js、2026-09-19〜）
   イージーモード（engine.js）と同じ教材データ（texts/<教材名>.js の
   window.NOBIRU_TEXT）を読むが、本文の開示は「前半」「後半」の2段階だけ、
   設問は記述式中心＋最後に全体についての選択問題、という別の進行にする。
   教材データのうち、ハードモード用の設問は TEXT.hard に持たせる
   （形式は texts/_template.js の末尾を参照）。TEXT.hard が無い教材では、
   このファイルは何もしない（イージーモードのみで遊べる）。
   本文そのもの（PARAS）はイージーモードと完全に共通で、一切変更しない。
   ============================================================ */
(function(){
"use strict";

const TEXT = window.NOBIRU_TEXT;
const PARAS = TEXT.paras;
const HARD = TEXT.hard;
if(!HARD) return;

const TEXT_KEY = TEXT.meta.key || TEXT.meta.title || document.title;
const $ = id => document.getElementById(id);

/* ---- 経験値の設計（教員の指示、2026-09-19〜）----
   ハードモードは全5問。1問満点21点×5問＝105点満点で、イージーモード
   （1問10点×教材ごとの設問総数、たいてい100点満点）とほぼ同じ、
   ハードモードの方がわずかに高いだけの合計になるようにしてある。
   ヒントを使った設問は満点に0.7を掛ける（ゼロにはしない）。
   内訳（設問ごとの点数）は画面に出さず、addXp()でフッターの累計だけ動かす。 */
const XP_MAX = 21;
const HINT_FACTOR = 0.7;
const MISS_STEP = 4;

let totalXp = 0;
function addXp(n){
  totalXp += Math.round(n);
  const el = $("xpTotal");
  if(el) el.innerHTML = `累計経験値　<b>${totalXp}</b>`;
}

document.body.classList.add("hardmode");

function escHtml(s){
  return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
}

/* ---- 入れ子つき記法の解析（engine.jsと同じ記法を読めるようにする。
   ただしハードモードでは「つなぎ」「指示語」「文の役割」「対比」「構造図」の
   可視化ボタンを出さないので、対応するクラス（conn/dem/sp[data-s]等）は
   ついても見た目には出ない。gloss（語釈）・傍線部(u)だけ、そのまま活きる）---- */
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
        makeInteractive(sp, () => showDem(sp));
      } else if(pAttr !== null && !blockP){
        sp.classList.add("p");
        makeInteractive(sp, () => openGloss(sp.textContent, "現代語訳", pAttr, false));
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

/* ---- 語釈カード（イージーモードと同じ#glossを使う） ---- */
const checkedWords = [];
const checkedWordSet = new Set();
function openGloss(w, y, m, important){
  $("gWord").textContent = w;
  $("gYomi").textContent = (y && y !== "―") ? y : "";
  $("gMean").textContent = m;
  $("gBadge").hidden = !important;
  $("wordsSheet").classList.remove("open");
  $("gloss").classList.add("open");
  if(!checkedWordSet.has(w) && y !== "現代語訳"){
    checkedWordSet.add(w);
    checkedWords.push({ w, y: (y && y !== "―") ? y : "", m, important: !!important });
    renderWordsList();
  }
}
if($("glossClose")) $("glossClose").onclick = () => $("gloss").classList.remove("open");
function renderWordsList(){
  if(!$("wordsList")) return;
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
if($("b-words")) $("b-words").onclick = () => {
  $("gloss").classList.remove("open");
  $("wordsSheet").classList.toggle("open");
};
if($("wordsClose")) $("wordsClose").onclick = () => $("wordsSheet").classList.remove("open");

/* ---- 指示語（線は引かず、指し先をハイライトして注釈だけ出す簡易版） ---- */
function showDem(el){
  document.querySelectorAll(".tgt.lit").forEach(e => e.classList.remove("lit"));
  const tgt = document.getElementById(el.dataset.tgt);
  if(tgt){ tgt.classList.add("lit"); tgt.scrollIntoView({ behavior: "smooth", block: "center" }); }
  const n = $("demnote");
  if(!n) return;
  n.innerHTML = `この指示語がさしているのは ―― ${escHtml(el.dataset.note)}`;
  n.classList.add("on");
}

/* ---- 文字サイズ（本文側。イージーモードと同じ--fsを使う） ---- */
if($("b-small")) $("b-small").onclick = () => bump(-0.8);
if($("b-large")) $("b-large").onclick = () => bump(0.8);
function bump(d){
  const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs"));
  document.documentElement.style.setProperty("--fs", Math.min(20, Math.max(11.5, cur + d)) + "px");
}
if($("q-small")) $("q-small").onclick = () => bumpQ(-0.8);
if($("q-large")) $("q-large").onclick = () => bumpQ(0.8);
function bumpQ(d){
  const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--qfs"));
  document.documentElement.style.setProperty("--qfs", Math.min(20, Math.max(11.5, cur + d)) + "px");
}

/* ---- 本文の開示（前半／後半の2段階のみ） ---- */
function revealRange(from, to){
  for(let i = from; i < to; i++){
    const p = document.createElement("p");
    p.className = "para fresh";
    PARAS[i].s.forEach(sent => {
      const sp = document.createElement("span");
      sp.className = "s";
      parseInto(sent.t, sp);
      p.appendChild(sp);
    });
    $("text").appendChild(p);
  }
}

const STEPS = [
  { key:"front", label:"前半" },
  { key:"back", label:"後半（全文）" },
  { key:"whole", label:"まとめ" }
];
function setStepUI(key){
  const bar = $("hprog");
  if(!bar) return;
  bar.innerHTML = STEPS.map(s => {
    const cls = s.key === key ? "now" : (STEPS.findIndex(x=>x.key===key) > STEPS.findIndex(x=>x.key===s.key) ? "done" : "");
    return `<div class="hprog-step ${cls}">${escHtml(s.label)}</div>`;
  }).join("");
}

/* ---- 記述式の部分点採点（キーワード充足度 × 字数の適切さ）----
   完全一致ではなく、模範解答に含まれるキーワード（同義の言い換えはaltsに）が
   どれだけ含まれているかで部分点にする。必須キーワード(required)を落とすと
   得点の上限を0.5に抑える。字数の下限・上限から外れているぶんも減点する
   （内容が合っていても、指定字数を意識させるため）。
   結果オブジェクトの evidenceRef は、将来「本文のどの部分を根拠にしたか」を
   採点に組み込みたくなったときのための予約フィールド（今回は採点に使わない）。 */
function scoreFreeText(raw, q){
  const text = String(raw || "").replace(/\s+/g, "");
  const len = text.length;
  if(!text) return { score: 0, coverage: 0, lenFactor: 0, len, evidenceRef: q.evidenceRef || null };
  let earned = 0, total = 0, missingRequired = false;
  const matched = [];
  (q.keywords || []).forEach(kw => {
    const w = kw.weight || 1;
    total += w;
    const alts = (kw.alts || []).concat(kw.text);
    const hit = alts.some(a => a && text.includes(a));
    if(hit){ earned += w; matched.push(kw.text); }
    else if(kw.required) missingRequired = true;
  });
  let coverage = total ? earned / total : (len ? 0.5 : 0);
  if(missingRequired) coverage = Math.min(coverage, 0.5);
  let lenFactor = 1;
  if(q.minLen && q.maxLen){
    if(len < q.minLen || len > q.maxLen){
      const over = len < q.minLen ? (q.minLen - len) : (len - q.maxLen);
      lenFactor = Math.max(0.55, 1 - over / q.maxLen);
    }
  }
  return { score: Math.max(0, Math.min(1, coverage * lenFactor)), coverage, lenFactor, len, matched, evidenceRef: q.evidenceRef || null };
}

/* ---- 傍線部のハイライト（設問が指す記号だけ.nowを付け、見える位置までスクロール） ---- */
function highlightU(letters){
  document.querySelectorAll(".u.now").forEach(e => e.classList.remove("now"));
  (letters || []).forEach(k => {
    const e = document.getElementById("u-" + k);
    if(e) e.classList.add("now");
  });
  const first = letters && letters[0] && document.getElementById("u-" + letters[0]);
  if(first) first.scrollIntoView({ behavior: "smooth", block: "center" });
}

let qNum = 0;
const TOTAL_Q = HARD.front.length + HARD.back.length + HARD.whole.length;
function updateQGauge(){
  const label = $("qprogLabel"), fill = $("qprogFill");
  if(!label || !fill) return;
  label.textContent = `問題 ${qNum}／${TOTAL_Q}`;
  fill.style.width = Math.min(100, Math.round(qNum / TOTAL_Q * 100)) + "%";
}

/* ---- 記述式の設問 ---- */
function renderFreeQuestion(q, onNext){
  qNum++; updateQGauge();
  highlightU(q.u);
  const z = $("qzone"); z.innerHTML = "";
  let hintUsed = false, graded = null;

  const h = document.createElement("div"); h.className = "q-head ui"; h.textContent = q.head;
  const p = document.createElement("p"); p.className = "q-text";
  p.textContent = q.text + (q.minLen && q.maxLen ? `（${q.minLen}〜${q.maxLen}字程度）` : "");
  z.append(h, p);

  const wrap = document.createElement("div"); wrap.className = "freeq";
  const ta = document.createElement("textarea");
  ta.placeholder = "ここに書き込みましょう。";
  wrap.appendChild(ta);
  const meta = document.createElement("div"); meta.className = "freeq-meta";
  meta.innerHTML = `<span class="freeq-len">0字</span><span></span>`;
  wrap.appendChild(meta);
  ta.addEventListener("input", () => {
    const len = ta.value.replace(/\s+/g, "").length;
    const lenEl = meta.querySelector(".freeq-len");
    lenEl.textContent = `${len}字`;
    const outOfRange = q.minLen && q.maxLen && (len < q.minLen || len > q.maxLen) && len > 0;
    meta.classList.toggle("over", !!outOfRange);
  });
  z.appendChild(wrap);

  const row = document.createElement("div"); row.className = "freeq-row";
  const hintBtn = document.createElement("button");
  hintBtn.className = "hintBtn ui"; hintBtn.type = "button"; hintBtn.textContent = "ヒントを見る";
  const hintBox = document.createElement("div"); hintBox.className = "hint-box"; hintBox.hidden = true;
  hintBtn.onclick = () => {
    hintUsed = true;
    hintBox.textContent = "ヒント：" + q.hint;
    hintBox.hidden = false;
    hintBtn.disabled = true;
  };
  const gradeBtn = document.createElement("button");
  gradeBtn.className = "next ui"; gradeBtn.type = "button"; gradeBtn.textContent = "採点する";
  row.append(hintBtn, gradeBtn);
  z.append(row, hintBox);

  const gradeBox = document.createElement("div");
  z.appendChild(gradeBox);

  gradeBtn.onclick = () => {
    graded = scoreFreeText(ta.value, q);
    let band = "g-low", msg = "本文をもう一度読み直してみましょう。";
    if(graded.score >= 0.75){ band = "g-good"; msg = "よく書けています。"; }
    else if(graded.score >= 0.4){ band = "g-mid"; msg = "方向性は合っています。もう少しくわしく書けるとさらによくなります。"; }
    let lenNote = "";
    if(q.minLen && q.maxLen && graded.lenFactor < 1){
      lenNote = graded.len < q.minLen
        ? `　指定の字数（${q.minLen}〜${q.maxLen}字）に対して短めです。`
        : `　指定の字数（${q.minLen}〜${q.maxLen}字）に対して長めです。`;
    }
    gradeBox.className = "grade-box " + band;
    gradeBox.innerHTML = `${msg}${lenNote}
      <div class="grade-model"><b>模範解答例</b>：${escHtml(q.model)}</div>`;
    gradeBtn.textContent = "採点し直す";
    if(!row.querySelector(".freeq-next")){
      const nextBtn = document.createElement("button");
      nextBtn.className = "next ui freeq-next"; nextBtn.type = "button"; nextBtn.textContent = "次へ";
      nextBtn.onclick = () => {
        const base = XP_MAX * (hintUsed ? HINT_FACTOR : 1);
        addXp(base * (graded ? graded.score : 0));
        onNext();
      };
      row.appendChild(nextBtn);
    }
  };
  $("paneQ").scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- 全体についての選択問題（全文開示後） ---- */
function renderChoiceQuestion(q, onNext){
  qNum++; updateQGauge();
  highlightU(q.u);
  const z = $("qzone"); z.innerHTML = "";
  let miss = 0, hintUsed = false, done = false;
  const marks = "アイウエオ";

  const h = document.createElement("div"); h.className = "q-head ui"; h.textContent = q.head;
  const p = document.createElement("p"); p.className = "q-text"; p.textContent = q.text;
  const ul = document.createElement("div"); ul.className = "choices";
  const fb = document.createElement("div");
  const row = document.createElement("div"); row.className = "freeq-row";
  const hintBtn = document.createElement("button");
  hintBtn.className = "hintBtn ui"; hintBtn.type = "button"; hintBtn.textContent = "ヒントを見る";
  const hintBox = document.createElement("div"); hintBox.className = "hint-box"; hintBox.hidden = true;
  hintBtn.onclick = () => {
    hintUsed = true;
    hintBox.textContent = "ヒント：" + q.hint;
    hintBox.hidden = false;
    hintBtn.disabled = true;
  };
  row.appendChild(hintBtn);

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
        if(done) return;
        if(i === q.a){
          b.classList.add("right");
          [...ul.children].forEach(x => x.disabled = true);
          done = true;
          fb.className = "fb ok";
          fb.textContent = "正解。" + q.exp;
          const nx = document.createElement("button");
          nx.className = "next ui"; nx.type = "button"; nx.textContent = q.last ? "結果を見る" : "次へ";
          nx.onclick = () => {
            const base = XP_MAX * (hintUsed ? HINT_FACTOR : 1);
            addXp(Math.max(0, base - miss * MISS_STEP));
            onNext();
          };
          fb.appendChild(document.createElement("br"));
          fb.appendChild(nx);
        } else {
          miss++;
          fb.className = "fb ng";
          fb.textContent = (miss === 1 ? "ちがいます。" : "まだちがいます。") + (q.why && q.why[i] ? q.why[i] : "本文を読み直してみましょう。");
          [...ul.children].forEach(x => x.disabled = true);
          const retry = document.createElement("button");
          retry.className = "next ui"; retry.type = "button"; retry.textContent = "もう一度答える";
          retry.onclick = () => {
            retry.disabled = true;
            ul.style.display = "none";
            fb.className = "fb wait"; fb.textContent = "選択肢を配置し直します…";
            setTimeout(() => {
              fb.className = ""; fb.textContent = "";
              shuffleOrder(); renderChoices();
              ul.style.display = "";
            }, 1000);
          };
          fb.appendChild(document.createElement("br"));
          fb.appendChild(retry);
        }
      };
      ul.appendChild(b);
    });
  }
  renderChoices();
  z.append(h, p, ul, fb, row, hintBox);
  $("paneQ").scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- 進行 ---- */
let idx = 0;
function askFront(){
  if(idx < HARD.front.length){ renderFreeQuestion(HARD.front[idx], () => { idx++; askFront(); }); }
  else { idx = 0; startBack(); }
}
function startBack(){
  setStepUI("back");
  $("prog").textContent = "後半を表示中（本文はこれで全文そろいました）";
  revealRange(HARD.splitAt, PARAS.length);
  askBack();
}
function askBack(){
  if(idx < HARD.back.length){ renderFreeQuestion(HARD.back[idx], () => { idx++; askBack(); }); }
  else { idx = 0; startWhole(); }
}
function startWhole(){
  setStepUI("whole");
  askWhole();
}
function askWhole(){
  if(idx < HARD.whole.length){
    const q = HARD.whole[idx];
    q.last = (idx === HARD.whole.length - 1);
    renderChoiceQuestion(q, () => { idx++; askWhole(); });
  } else { finish(); }
}

function finish(){
  updateQGauge();
  let compareHtml = "";
  if(window.NobiruRecords){
    const { prev } = NobiruRecords.finish(TEXT_KEY, "hard", totalXp);
    compareHtml = prev
      ? `<p class="xp-compare">前回の累計経験値は${prev.lastXp}でした（自己ベスト${prev.bestXp}）。順位や他の人との比較はありません。自分の記録とだけ比べてみましょう。</p>`
      : `<p class="xp-compare">これが今回の記録です。次に読むときは、この累計経験値と比べてみましょう。</p>`;
  }
  $("qzone").innerHTML = `
    <div class="fin">
      <h2>読み終わりました</h2>
      <p>累計経験値　<b>${totalXp}</b></p>
      ${compareHtml}
      <p>本文はすべて出そろっています。もう一度通して読んでみてください。</p>
      <button class="again ui" onclick="location.reload()">はじめからやり直す</button>
    </div>`;
  $("paneQ").scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- 起動 ---- */
function boot(){
  document.title = (TEXT.meta.title || "のびる読解") + "　―　のびる読解（ハードモード）";
  if($("mainTitle")) $("mainTitle").textContent = TEXT.meta.title || "";
  if($("subTitle")) $("subTitle").textContent = "前半・後半の2段階で全文が出ます。設問は記述式が中心です。";
  const theme = TEXT.meta.theme;
  if(theme) Object.keys(theme).forEach(k => document.documentElement.style.setProperty(k, theme[k]));
  if($("b-fulltr")) $("b-fulltr").hidden = true;
  if($("modeBadge")){ $("modeBadge").textContent = "ハードモード"; $("modeBadge").classList.add("hard"); }
  if($("modeSwitch")) $("modeSwitch").href = location.pathname;
  addXp(0);
  renderWordsList();
  setStepUI("front");
  $("prog").textContent = "前半を表示中";
  revealRange(0, HARD.splitAt);
  askFront();
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
})();

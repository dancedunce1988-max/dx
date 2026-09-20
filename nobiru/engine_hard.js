/* ============================================================
   のびる読解　ハードモード エンジン（engine_hard.js、2026-09-19〜）
   イージーモード（engine.js）と同じ教材データ（texts/<教材名>.js の
   window.NOBIRU_TEXT）を読むが、本文の開示は「前半」「後半」の2段階だけ、
   設問は記述式中心、という別の進行にする。
   教材データのうち、ハードモード用の設問は TEXT.hard = { splitAt, front, back }
   に持たせる（形式は texts/_template.js の末尾を参照）。front／backは
   それぞれ設問オブジェクトの配列で、type:"choice"（選択式）・
   type:"written"（記述式）・type:"guided"（選択式で段階的に内容を確定
   させてから一文に組み立てさせる、2026-09-21〜）のいずれかを設問ごとに
   自由に決めてよい。出題順は
   front→back の配列の並び順そのまま（例：1問目=選択、2問目=短い記述、
   3問目=記述、4問目=長い記述、5問目=全体を読んで答える選択、という
   構成にしたいときは、hard.frontに前半2問、hard.backに後半3問を
   その順で並べればよい）。TEXT.hard が無い教材では、このファイルは
   何もしない（イージーモードのみで遊べる）。
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
function htmlToNode(html){
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstChild;
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
  { key:"back", label:"後半（全文）" }
];
function setStepUI(key){
  const bar = $("hprog");
  if(!bar) return;
  bar.innerHTML = STEPS.map(s => {
    const cls = s.key === key ? "now" : (STEPS.findIndex(x=>x.key===key) > STEPS.findIndex(x=>x.key===s.key) ? "done" : "");
    return `<div class="hprog-step ${cls}">${escHtml(s.label)}</div>`;
  }).join("");
}

/* ---- 記述式の採点基準（2026-09-19〜、標準化。2026-09-19追記で文末チェックを追加）----
   すべての記述問題は、必ず3つの採点ポイント（keywords配列、必ず3項目）で
   できている：①必須ポイント(required:true・配点2)②重要ポイント(配点2)
   ③補助ポイント(配点1)の合計5点満点。同じ配点ルールをどの設問にも
   例外なく適用することで、「なぜその点数になったか」を毎回同じ形で
   説明できるようにしてある（教材ごとに基準がぶれない）。
   完全一致ではなく、模範解答に含まれるキーワード（同義の言い換えはaltsに）が
   含まれているかで部分点にする。必須ポイントを落とすと、得点の上限を
   0.5（5点満点中2.5点相当）に抑える。字数の下限・上限から外れているぶんも
   減点する（内容が合っていても、指定字数を意識させるため）。
   結果オブジェクトの evidenceRef は、将来「本文のどの部分を根拠にしたか」を
   採点に組み込みたくなったときのための予約フィールド（今回は採点に使わない）。

   文末チェック（教員の指摘、2026-09-19〜：「〜から。」で終えるべきか「〜こと。」で
   終えるべきかが生徒に厳密に伝わっておらず、答え方に迷う場面があった。また、文は
   「。」で終えるのが基本なので、今後の採点基準にもそれを反映すること、との指示）。
   設問オブジェクトの endForm（"から"｜"こと"｜"体言"｜省略）で、その設問が要求する
   文末の形を明示する。"体言"（「〜は何ですか」型）は正規表現で厳密な判定ができない
   ため、採点では句点チェックのみ行い、答え方の説明はヒント（endFormHintText）だけで
   示す。省略時は特定の形を要求しない（「どのように」型の設問など）が、「。」で
   終えることはendFormの有無にかかわらず必ずチェックする。 */
function checkEndForm(text, q){
  const maruOk = /。$/.test(text);
  let formOk = true, formLabel = null;
  if(q.endForm === "から"){
    formLabel = "文末が「〜から。」（または「〜ため。」）の形になっているか";
    formOk = /(から|ため)。$/.test(text);
  } else if(q.endForm === "こと"){
    formLabel = "文末が「〜こと。」の形になっているか";
    formOk = /こと。$/.test(text);
  }
  return { maruOk, formOk, formLabel };
}
function scoreFreeText(raw, q){
  const text = String(raw || "").replace(/\s+/g, "");
  const len = text.length;
  const details = (q.keywords || []).map(kw => {
    const alts = (kw.alts || []).concat(kw.text);
    const hit = !!text && alts.some(a => a && text.includes(a));
    return { label: kw.label || kw.text, weight: kw.weight || 1, required: !!kw.required, hit };
  });
  const endCheck = checkEndForm(text, q);
  if(!text) return { score: 0, coverage: 0, lenFactor: 0, punctFactor: 0, len, details, endCheck, evidenceRef: q.evidenceRef || null };
  let earned = 0, total = 0, missingRequired = false;
  details.forEach(d => {
    total += d.weight;
    if(d.hit) earned += d.weight;
    else if(d.required) missingRequired = true;
  });
  let coverage = total ? earned / total : 0;
  if(missingRequired) coverage = Math.min(coverage, 0.5);
  let lenFactor = 1;
  if(q.minLen && q.maxLen){
    if(len < q.minLen || len > q.maxLen){
      const over = len < q.minLen ? (q.minLen - len) : (len - q.maxLen);
      lenFactor = Math.max(0.55, 1 - over / q.maxLen);
    }
  }
  let punctFactor = 1;
  if(!endCheck.maruOk) punctFactor -= 0.15;
  if(endCheck.formLabel && !endCheck.formOk) punctFactor -= 0.15;
  punctFactor = Math.max(0.6, punctFactor);
  return { score: Math.max(0, Math.min(1, coverage * lenFactor * punctFactor)), coverage, lenFactor, punctFactor, len, details, endCheck, evidenceRef: q.evidenceRef || null };
}

/* 字数の目安バッジ（常時表示。設問の直後、解答欄より前に出す＝
   「まず字数の制限をはっきり書いてほしい」という指示への対応）。 */
function lenSpecHtml(q){
  const spec = (q.minLen && q.maxLen) ? `${q.minLen}〜${q.maxLen}字程度` : "字数の指定なし（自由な長さでよい）";
  return `<div class="lenspec ui">📏 字数の目安：<b>${escHtml(spec)}</b></div>`;
}
/* 文末の形の案内（2026-09-20〜、ヒントの中に移動。教員の指摘：「〜から。」で
   終えるのか「〜こと。」で終えるのかを答える前から常時表示してしまうと、設問文を
   読んで自分で答え方を判断する練習にならない。ヒントボタンを押したときだけ、
   「設問がこう聞いているから、こう答える」という理由つきで見せることにした。
   endForm："から"｜"こと"｜"体言"（「〜は何ですか」型。名詞で言い切る＝体言止め。
   正規表現での厳密な判定はできないため、採点では句点チェックのみ行い、
   ヒントの文だけで答え方を示す）｜省略（特定の形を要求しない）。 */
function endFormHintText(q){
  if(q.endForm === "から") return "この設問は「理由」をたずねているので、答えは「〜から。」（または「〜ため。」）の形で書きましょう。";
  if(q.endForm === "こと") return "この設問は「どのようなことか」をたずねているので、答えは「〜こと。」の形で書きましょう。";
  if(q.endForm === "体言") return "この設問は「〜は何ですか」と名前をたずねているので、名詞で言い切る形（体言止め）で書きましょう。「〜こと。」にする必要はありません。";
  return "文の終わりには、必ず「。」をつけましょう。";
}
/* 採点基準の説明（どの記述問題でも同じ文言にして、基準をそろえる）。 */
const GRADE_POLICY_HTML = `<div class="gradepolicy ui">採点について：①下の3つのポイントをどれだけふくんでいるか、②指定の字数の目安に収まっているか、③文の終わり方・「。」で終えているか、の3つで得点が決まります。★のポイントが無いと、点数は半分以下になります。ヒントを見ると、その設問の得点がやや下がります（0にはなりません）。</div>`;

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
const TOTAL_Q = HARD.front.length + HARD.back.length;
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
  const p = document.createElement("p"); p.className = "q-text"; p.textContent = q.text;
  z.append(h, p, htmlToNode(lenSpecHtml(q)));

  const wrap = document.createElement("div"); wrap.className = "freeq";
  const ta = document.createElement("textarea");
  ta.placeholder = "ここに書き込みましょう。";
  wrap.appendChild(ta);
  const meta = document.createElement("div"); meta.className = "freeq-meta";
  const specText = (q.minLen && q.maxLen) ? `（目安${q.minLen}〜${q.maxLen}字）` : "";
  meta.innerHTML = `<span class="freeq-len">0字${escHtml(specText)}</span><span></span>`;
  wrap.appendChild(meta);
  ta.addEventListener("input", () => {
    const len = ta.value.replace(/\s+/g, "").length;
    const lenEl = meta.querySelector(".freeq-len");
    lenEl.textContent = `${len}字${specText}`;
    const outOfRange = q.minLen && q.maxLen && (len < q.minLen || len > q.maxLen) && len > 0;
    meta.classList.toggle("over", !!outOfRange);
  });
  z.appendChild(wrap);

  z.appendChild(htmlToNode(GRADE_POLICY_HTML));

  const row = document.createElement("div"); row.className = "freeq-row";
  const hintBtn = document.createElement("button");
  hintBtn.className = "hintBtn ui"; hintBtn.type = "button"; hintBtn.textContent = "ヒントを見る";
  const hintBox = document.createElement("div"); hintBox.className = "hint-box"; hintBox.hidden = true;
  hintBtn.onclick = () => {
    hintUsed = true;
    hintBox.innerHTML = `ヒント：${escHtml(q.hint)}<br>${escHtml(endFormHintText(q))}`;
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
    const hitCount = graded.details.filter(d => d.hit).length;
    const total = graded.details.length;
    let band = "g-low", msg = "本文をもう一度読み直してみましょう。";
    if(graded.score >= 0.75){ band = "g-good"; msg = "よく書けています。"; }
    else if(graded.score >= 0.4){ band = "g-mid"; msg = "方向性は合っています。もう少しくわしく書けるとさらによくなります。"; }
    let lenNote = "";
    if(q.minLen && q.maxLen && graded.lenFactor < 1){
      lenNote = graded.len < q.minLen
        ? `　指定の字数（${q.minLen}〜${q.maxLen}字）に対して短めです。`
        : `　指定の字数（${q.minLen}〜${q.maxLen}字）に対して長めです。`;
    }
    const checklist = graded.details.map(d => `
      <div class="rubric-item ${d.hit ? "hit" : "miss"}">
        <span class="rubric-mark">${d.hit ? "✓" : "✗"}</span>
        <span>${d.required ? "★ " : ""}${escHtml(d.label)}</span>
      </div>`).join("");
    const endItems = [];
    if(graded.endCheck.formLabel) endItems.push({ ok: graded.endCheck.formOk, label: graded.endCheck.formLabel });
    endItems.push({ ok: graded.endCheck.maruOk, label: "文の終わりが「。」になっているか" });
    const endChecklist = endItems.map(d => `
      <div class="rubric-item ${d.ok ? "hit" : "miss"}">
        <span class="rubric-mark">${d.ok ? "✓" : "✗"}</span>
        <span>${escHtml(d.label)}</span>
      </div>`).join("");
    gradeBox.className = "grade-box " + band;
    gradeBox.innerHTML = `${msg}${lenNote}　（${hitCount}／${total}ポイント）
      <div class="rubric-list">${checklist}${endChecklist}</div>
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

/* ---- 選択式の設問（前半直後の1問目、全文を読んだあとの最後の1問、両方に使う） ---- */
function renderChoiceQuestion(q, isLast, onNext){
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
          nx.className = "next ui"; nx.type = "button"; nx.textContent = isLast ? "結果を見る" : "次へ";
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

/* ---- 段階選択→組み立て型の記述設問（type:"guided"、2026-09-21〜）----
   自由記述をいきなり書かせるのではなく、内容を選択式で段階的に確定させる
   （steps配列、各要素は選択式の設問と同じ形：text/ch/a/why/hint）。

   最後の組み立て方は2通りある。
   ① template方式（2026-09-21改訂、教員の指示：「選択問題を繰り返すことで、
      記述の回答が自然と組みあがる仕組みにしてほしい。今のキーワード採点は
      納得できない人が多くなりそう」／2026-09-22再改訂：「先に組み立て文を
      見せて書き写すだけでは勉強の意味が感じられない」）。templateは
      "{0}が、{1}。"のような文字列で、{0}{1}…にsteps[0]〜のconfirmed
      （選んだ選択肢の文言そのもの）をそのまま差し込んで文章を自動生成する。
      画面の流れは「先に生徒自身の言葉で一文を書かせる（runAssembleの
      textarea）→書けたらauthorのtemplate組み立て文を答え合わせとして
      見せて見比べさせる」の順（先に見せて書き写すだけの逆順にはしない）。
      生徒の自由記述そのものは一切採点しない＝内容の正誤はsteps時点の
      選択式だけで確定済みなので、キーワード漏れ・言い換え判定・文法
      （主語述語のねじれ）判定、いずれの自動採点も発生させない。それでいて
      「実際に文章を組み立てる」思考作業そのものは、書く順序を先にする
      ことで残している。
   ② written方式（旧・現在は未使用）。writeText・minLen・maxLen・endForm・
      keywords・model・writeHintをtype:"written"と同じ書式で持たせ、
      自由記述＋キーワード採点で仕上げる。templateが無いときはこちらに
      フォールバックする（自由記述で仕上げさせたい設問を将来作る場合の
      ための後方互換）。keywordsは「①・②で確認した内容がそれぞれ含まれて
      いるか」の2項目・両方required:trueにそろえ、scoreFreeTextを流用する。
      主語・述語のねじれは、AIを使わない静的なJSでは確実に判定できない
      ため自動採点の対象にせず、「声に出して読み返そう」を添えるのみ。 */
const GUIDED_POLICY_HTML = `<div class="gradepolicy ui">採点について：①・②で確認した内容が、それぞれ文章にふくまれているか、字数の目安に収まっているか、文の終わり方・「。」で終えているか、で得点が決まります。主語と述語がねじれていないかは自動では判定されないので、書き終えたら声に出して読み返しましょう。</div>`;
const CIRCLED = ["①","②","③","④","⑤"];
function assembleSentence(template, pieces){
  return escHtml(template).replace(/\{(\d+)\}/g, (m, i) => `<span class="asm-piece">${escHtml(pieces[+i] || "")}</span>`);
}
function renderGuidedQuestion(q, isLast, onNext){
  qNum++; updateQGauge();
  highlightU(q.u);
  let totalMiss = 0, hintUsed = false;
  const confirmed = [];
  const marks = "アイウエオ";

  function runStep(idx){
    if(idx >= q.steps.length){ if(q.template) runAssemble(); else runWrite(); return; }
    const step = q.steps[idx];
    const z = $("qzone"); z.innerHTML = "";
    const h = document.createElement("div"); h.className = "q-head ui";
    h.textContent = `${q.head}　（${idx + 1}／${q.steps.length + 1}）`;
    const p = document.createElement("p"); p.className = "q-text"; p.textContent = step.text;
    const ul = document.createElement("div"); ul.className = "choices";
    const fb = document.createElement("div");
    const row = document.createElement("div"); row.className = "freeq-row";
    const hintBtn = document.createElement("button");
    hintBtn.className = "hintBtn ui"; hintBtn.type = "button"; hintBtn.textContent = "ヒントを見る";
    const hintBox = document.createElement("div"); hintBox.className = "hint-box"; hintBox.hidden = true;
    hintBtn.onclick = () => {
      hintUsed = true;
      hintBox.textContent = "ヒント：" + step.hint;
      hintBox.hidden = false;
      hintBtn.disabled = true;
    };
    row.appendChild(hintBtn);

    let order = step.ch.map((c, i) => i);
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
        b.innerHTML = `<span class="mk ui">${marks[pos] || pos + 1}</span><span>${escHtml(step.ch[i])}</span>`;
        b.onclick = () => {
          if(i === step.a){
            b.classList.add("right");
            [...ul.children].forEach(x => x.disabled = true);
            confirmed.push(step.ch[step.a]);
            fb.className = "fb ok"; fb.textContent = "正解。";
            const nx = document.createElement("button");
            nx.className = "next ui"; nx.type = "button"; nx.textContent = "次へ";
            nx.onclick = () => runStep(idx + 1);
            fb.appendChild(document.createElement("br")); fb.appendChild(nx);
          } else {
            totalMiss++;
            fb.className = "fb ng";
            fb.textContent = (step.why && step.why[i]) ? step.why[i] : "ちがいます。本文を読み直してみましょう。";
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
            fb.appendChild(document.createElement("br")); fb.appendChild(retry);
          }
        };
        ul.appendChild(b);
      });
    }
    renderChoices();
    z.append(h, p, ul, fb, row, hintBox);
    $("paneQ").scrollTo({ top: 0, behavior: "smooth" });
  }

  /* template方式の組み立て画面（2026-09-22改訂：先に見せて書き写すだけでは
     「勉強の意味が感じられない」という教員の指摘を受け、順序を逆にした）。
     ①・②で確認した内容だけを手がかりに、まず生徒自身の言葉で一文を組み立てて
     もらい（＝実際に文章を作る思考作業はここで発生する）、そのあとで
     authorが用意したtemplate組み立て文（templateと選択肢の文言はセットで
     自然な日本語になるよう作者が用意している）を答え合わせとして見せ、
     見比べさせる。自由記述の内容は一切採点しない＝内容の正誤は選択式の
     時点で確定済みなので、ここでは「組み立てる力」を自己チェックさせる
     だけにとどめ、キーワード一致等の判定ミスが起きる余地を残さない。 */
  function runAssemble(){
    const z = $("qzone"); z.innerHTML = "";
    const h = document.createElement("div"); h.className = "q-head ui";
    h.textContent = `${q.head}　（${q.steps.length + 1}／${q.steps.length + 1}）`;
    const p = document.createElement("p"); p.className = "q-text";
    p.textContent = "①・②で確認した内容をつなげて、自分の言葉で一つの文章に書いてみましょう。";
    const chips = document.createElement("div"); chips.className = "guided-chips ui";
    chips.innerHTML = confirmed.map((c, i) => `<span class="guided-chip">${CIRCLED[i] || (i + 1)} ${escHtml(c)}</span>`).join("");
    z.append(h, p, chips);

    const wrap = document.createElement("div"); wrap.className = "freeq";
    const ta = document.createElement("textarea");
    ta.placeholder = "①・②をつなげて、一つの文章に書いてみましょう。";
    wrap.appendChild(ta);
    z.appendChild(wrap);

    const row = document.createElement("div"); row.className = "freeq-row";
    const compareBtn = document.createElement("button");
    compareBtn.className = "next ui"; compareBtn.type = "button"; compareBtn.textContent = "書けたら、組み立て文と比べる";
    row.appendChild(compareBtn);
    z.appendChild(row);

    const resultZone = document.createElement("div");
    z.appendChild(resultZone);

    compareBtn.onclick = () => {
      if(!ta.value.trim()){ alert("①・②の内容をつなげて、まず自分の文章を書いてみましょう。"); return; }
      ta.disabled = true;
      compareBtn.disabled = true;
      const asmBox = document.createElement("div"); asmBox.className = "asm-box";
      asmBox.innerHTML = assembleSentence(q.template, confirmed);
      const note = document.createElement("p"); note.className = "gradepolicy ui";
      note.textContent = "①・②の内容をもとに組み立てた文章です。自分の文章と見比べて、同じ内容が伝わるか、声に出して読み、主語と述語がつながっているかも確かめましょう（この文章の採点はありません）。";
      const nextRow = document.createElement("div"); nextRow.className = "freeq-row";
      const nextBtn = document.createElement("button");
      nextBtn.className = "next ui"; nextBtn.type = "button";
      nextBtn.textContent = isLast ? "結果を見る" : "次へ";
      nextBtn.onclick = () => {
        const base = XP_MAX * (hintUsed ? HINT_FACTOR : 1);
        addXp(Math.max(0, base - totalMiss * MISS_STEP));
        onNext();
      };
      nextRow.appendChild(nextBtn);
      resultZone.append(asmBox, note, nextRow);
      resultZone.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    $("paneQ").scrollTo({ top: 0, behavior: "smooth" });
  }

  function runWrite(){
    const z = $("qzone"); z.innerHTML = "";
    let graded = null, writeHintUsed = false;
    const h = document.createElement("div"); h.className = "q-head ui";
    h.textContent = `${q.head}　（${q.steps.length + 1}／${q.steps.length + 1}）`;
    const p = document.createElement("p"); p.className = "q-text"; p.textContent = q.writeText;
    const chips = document.createElement("div"); chips.className = "guided-chips ui";
    chips.innerHTML = confirmed.map((c, i) => `<span class="guided-chip">${CIRCLED[i] || (i + 1)} ${escHtml(c)}</span>`).join("");
    z.append(h, p, chips, htmlToNode(lenSpecHtml(q)));

    const wrap = document.createElement("div"); wrap.className = "freeq";
    const ta = document.createElement("textarea");
    ta.placeholder = "①・②の内容をつなげて、一つの文章に書きましょう。";
    wrap.appendChild(ta);
    const meta = document.createElement("div"); meta.className = "freeq-meta";
    const specText = (q.minLen && q.maxLen) ? `（目安${q.minLen}〜${q.maxLen}字）` : "";
    meta.innerHTML = `<span class="freeq-len">0字${escHtml(specText)}</span><span></span>`;
    wrap.appendChild(meta);
    ta.addEventListener("input", () => {
      const len = ta.value.replace(/\s+/g, "").length;
      meta.querySelector(".freeq-len").textContent = `${len}字${specText}`;
      const outOfRange = q.minLen && q.maxLen && (len < q.minLen || len > q.maxLen) && len > 0;
      meta.classList.toggle("over", !!outOfRange);
    });
    z.appendChild(wrap);
    z.appendChild(htmlToNode(GUIDED_POLICY_HTML));

    const row = document.createElement("div"); row.className = "freeq-row";
    const hintBtn = document.createElement("button");
    hintBtn.className = "hintBtn ui"; hintBtn.type = "button"; hintBtn.textContent = "ヒントを見る";
    const hintBox = document.createElement("div"); hintBox.className = "hint-box"; hintBox.hidden = true;
    hintBtn.onclick = () => {
      writeHintUsed = true;
      hintBox.innerHTML = `ヒント：${escHtml(q.writeHint || "①→②の順にそのままつなげてみよう。")}<br>${escHtml(endFormHintText(q))}`;
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
      const hitCount = graded.details.filter(d => d.hit).length;
      const total = graded.details.length;
      let band = "g-low", msg = "①・②の内容をもう一度読み返してみましょう。";
      if(graded.score >= 0.75){ band = "g-good"; msg = "よくつなげられています。"; }
      else if(graded.score >= 0.4){ band = "g-mid"; msg = "方向性は合っています。①・②の内容が両方入っているか確かめましょう。"; }
      let lenNote = "";
      if(q.minLen && q.maxLen && graded.lenFactor < 1){
        lenNote = graded.len < q.minLen
          ? `　指定の字数（${q.minLen}〜${q.maxLen}字）に対して短めです。`
          : `　指定の字数（${q.minLen}〜${q.maxLen}字）に対して長めです。`;
      }
      const checklist = graded.details.map(d => `
        <div class="rubric-item ${d.hit ? "hit" : "miss"}">
          <span class="rubric-mark">${d.hit ? "✓" : "✗"}</span>
          <span>${escHtml(d.label)}</span>
        </div>`).join("");
      const endItems = [];
      if(graded.endCheck.formLabel) endItems.push({ ok: graded.endCheck.formOk, label: graded.endCheck.formLabel });
      endItems.push({ ok: graded.endCheck.maruOk, label: "文の終わりが「。」になっているか" });
      const endChecklist = endItems.map(d => `
        <div class="rubric-item ${d.ok ? "hit" : "miss"}">
          <span class="rubric-mark">${d.ok ? "✓" : "✗"}</span>
          <span>${escHtml(d.label)}</span>
        </div>`).join("");
      gradeBox.className = "grade-box " + band;
      gradeBox.innerHTML = `${msg}${lenNote}　（${hitCount}／${total}ポイント）
        <div class="rubric-list">${checklist}${endChecklist}</div>
        <div class="grade-note ui">✏️ 主語と述語がねじれていないかは自動採点していません。声に出して読み返して確かめましょう。</div>
        <div class="grade-model"><b>文章の例</b>：${escHtml(q.model)}</div>`;
      gradeBtn.textContent = "採点し直す";
      if(!row.querySelector(".freeq-next")){
        const nextBtn = document.createElement("button");
        nextBtn.className = "next ui freeq-next"; nextBtn.type = "button";
        nextBtn.textContent = isLast ? "結果を見る" : "次へ";
        nextBtn.onclick = () => {
          const base = XP_MAX * ((hintUsed || writeHintUsed) ? HINT_FACTOR : 1);
          addXp(Math.max(0, base * (graded ? graded.score : 0) - totalMiss * MISS_STEP));
          onNext();
        };
        row.appendChild(nextBtn);
      }
    };
    $("paneQ").scrollTo({ top: 0, behavior: "smooth" });
  }

  runStep(0);
}

/* ---- 進行（前半の設問群→後半＝全文開示後の設問群、の2段階だけ。
   設問の種類（記述／選択）は各設問オブジェクトのtypeで指定し、この関数は
   タイプに応じて出し分けるだけにする＝設問の並び順（例：1問目は選択、
   2問目は短い記述…）はtexts/<教材名>.jsのhard.front／hard.backの並び順
   がそのまま出題順になる。） ---- */
function runQueue(list, onAllDone){
  let i = 0;
  function next(){
    if(i >= list.length){ onAllDone(); return; }
    const q = list[i];
    const isLast = (list === HARD.back) && (i === list.length - 1);
    const advance = () => { i++; next(); };
    if(q.type === "choice") renderChoiceQuestion(q, isLast, advance);
    else if(q.type === "guided") renderGuidedQuestion(q, isLast, advance);
    else renderFreeQuestion(q, advance);
  }
  next();
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
  runQueue(HARD.front, () => {
    setStepUI("back");
    $("prog").textContent = "後半を表示中（本文はこれで全文そろいました）";
    revealRange(HARD.splitAt, PARAS.length);
    runQueue(HARD.back, finish);
  });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
})();

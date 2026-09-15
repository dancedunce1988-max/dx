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
const $ = id => document.getElementById(id);
const svgNS = "http://www.w3.org/2000/svg";

let stage = 0, finalIdx = 0;
const record = [];
let demLineSeq = 0;
let activeLineId = null;
let demRAF = null;

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
function parseInto(str, parent){
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
      parts.slice(1).forEach(at => {
        const k = at[0], v = at.slice(2);
        if(k === "g"){
          const [y, m] = v.split("/");
          sp.classList.add("g");
          makeInteractive(sp, () => openGloss(sp.textContent, y, m));
        }
        if(k === "c"){ sp.classList.add("conn"); sp.dataset.c = v; }
        if(k === "d"){
          const [tg, note] = v.split("/");
          sp.classList.add("dem");
          sp.dataset.tgt = tg;
          sp.dataset.note = note;
          sp.dataset.lineId = "dl" + (demLineSeq++);
          makeInteractive(sp, () => showDem(sp));
        }
        if(k === "t"){ sp.classList.add("tgt"); sp.id = v; }
        if(k === "s"){ sp.dataset.s = v; }
        if(k === "u"){ sp.classList.add("u"); sp.dataset.u = v; sp.id = "u-" + v; }
      });
      parseInto(parts[0], sp);
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
  p.scrollIntoView({ behavior: "smooth", block: "nearest" });
  scheduleDemRedraw();
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

function openGloss(w, y, m){
  $("gWord").textContent = w;
  $("gYomi").textContent = (y && y !== "―") ? y : "";
  $("gMean").textContent = m;
  $("gloss").classList.add("open");
}
$("glossClose").onclick = () => $("gloss").classList.remove("open");

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
function showQuestion(q, onClear){
  const z = $("qzone"); z.innerHTML = "";
  const rec = { miss: 0, done: false }; record.push(rec); paintMarks();
  document.querySelectorAll(".u.now").forEach(e => e.classList.remove("now"));
  (q.u || []).forEach(k => { const e = document.getElementById("u-" + k); if(e) e.classList.add("now"); });
  const h = document.createElement("div"); h.className = "q-head ui"; h.textContent = q.head;
  const p = document.createElement("p"); p.className = "q-text"; p.textContent = q.text;
  const ul = document.createElement("div"); ul.className = "choices";
  const fb = document.createElement("div");
  const marks = "アイウエオカ";
  q.ch.forEach((c, i) => {
    const b = document.createElement("button");
    b.innerHTML = `<span class="mk ui">${marks[i] || i + 1}</span><span>${escHtml(c)}</span>`;
    b.onclick = () => {
      if(i === q.a){
        b.classList.add("right");
        [...ul.children].forEach(x => x.disabled = true);
        rec.done = true; paintMarks();
        fb.className = "fb ok"; fb.textContent = "正解。" + q.exp;
        const nx = document.createElement("button");
        nx.className = "next ui";
        nx.textContent = q.last ? "結果を見る" : "本文を先へ進める";
        nx.onclick = onClear;
        fb.appendChild(document.createElement("br"));
        fb.appendChild(nx);
      } else {
        rec.miss++; paintMarks();
        b.classList.add("wrong"); b.disabled = true;
        fb.className = "fb ng";
        fb.textContent = rec.miss === 1
          ? "ちがいます。本文のその文を、もう一度前後ごと読んでみよう。"
          : "まだちがいます。ヒント：" + q.tip;
      }
    };
    ul.appendChild(b);
  });
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
  const clean = record.filter(r => r.miss === 0).length;
  const miss = record.reduce((n, r) => n + r.miss, 0);
  const rows = record.map((r, i) => `<tr><td>設問${kanjiNum(i + 1)}</td><td>${r.miss === 0 ? "○" : "誤答" + r.miss + "回"}</td></tr>`).join("");
  $("qzone").innerHTML = `
    <div class="fin">
      <h2>読み終わりました</h2>
      <p>全${record.length}問のうち、一回目で正解できたのは${clean}問。誤答はのべ${miss}回でした。</p>
      <table>${rows}</table>
      <p>本文はすべて出そろっています。「構造図」で全体のつながりを見てから、もう一度通して読んでみてください。</p>
      <button class="again ui" onclick="location.reload()">はじめからやり直す</button>
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
  paintMarks();
  step();
}
document.addEventListener("DOMContentLoaded", boot);
})();

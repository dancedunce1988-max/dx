/* 「今日のミニゲーム」の共通部品（2026-11-06〜、試作。教員の指示）。
   本体（kokugo_app.html）と、別ページのミニゲーム（enro_run.html など）の両方で読みこむ。
   ・dailyMgEndBar(onClaim, delayMs)：1回の挑戦が終わったら、結果画面の上に「ごほうびを受け取る」の帯を出す。
     帯が出たあとは、帯の外のクリック・タップ・キー入力をすべて止める（＝「もう一度」などで2回目を遊べない）。
     結果画面のスクロールだけはできる。
   ・別ページでは dailyMgPage(backUrl, startFn)：URLに ?daily=1 がついて開かれたときだけ、
     startFn（そのゲームの「最後の挑戦」をいきなり始める）を呼び、window.dailyMgEnd / dailyMgQuit を用意する。
     backUrl はページ側で "kokugo_app.html?from=daily" と書く（zip作成時の書き換え先を、ページの中に置くため）。 */
(function(){
  const CSS = `
  #dailyMgTag{position:fixed;left:50%;top:6px;transform:translateX(-50%);z-index:2147483000;pointer-events:none;
    background:linear-gradient(135deg,#ff6f91,#ffb347);color:#fff;font-weight:bold;font-size:13px;letter-spacing:.05em;
    padding:4px 14px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.25);font-family:sans-serif;opacity:.95}
  #dailyMgBar{position:fixed;left:0;right:0;bottom:0;z-index:2147483001;display:flex;flex-direction:column;align-items:center;gap:8px;
    padding:14px 12px calc(14px + env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(40,20,60,.0),rgba(40,20,60,.92) 30%);
    font-family:sans-serif;animation:dailyMgBarIn .5s cubic-bezier(.2,.9,.3,1.2) both}
  #dailyMgBar .dmb-msg{color:#fff;font-weight:bold;font-size:15px;text-shadow:0 1px 3px rgba(0,0,0,.6)}
  #dailyMgBar button{font-size:18px;font-weight:bold;padding:12px 30px;border:none;border-radius:999px;cursor:pointer;color:#fff;
    background:linear-gradient(135deg,#ff6f91,#ff9671 50%,#ffc75f);box-shadow:0 4px 0 #b9506a,0 6px 14px rgba(0,0,0,.35);
    animation:dailyMgPulse 1.4s ease-in-out infinite}
  #dailyMgBar button:active{transform:translateY(3px);box-shadow:0 1px 0 #b9506a}
  @keyframes dailyMgBarIn{from{transform:translateY(100%)}to{transform:none}}
  @keyframes dailyMgPulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.15)}}`;
  function addCss(){
    if(document.getElementById("dailyMgCss")) return;
    const s = document.createElement("style"); s.id = "dailyMgCss"; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  let barShown = false;
  function block(e){
    const bar = document.getElementById("dailyMgBar");
    // 帯がまだ出ていない間（結果画面が出てから帯が出るまでの1秒ほど）も止める。止めないと、その間に「もう一度」を押して2回目を始められた（2026-11-09）
    if(bar && e.target && bar.contains(e.target)) return;
    if(!bar){ e.stopImmediatePropagation(); e.preventDefault(); return; }
    if(e.type === "keydown" && (e.key === "Enter" || e.key === " ")){ const b = bar.querySelector("button"); if(b) b.click(); }
    e.stopImmediatePropagation(); e.preventDefault();
  }
  window.dailyMgEndBar = function(onClaim, delayMs){
    if(barShown) return;
    barShown = true;
    addCss();
    ["click","mousedown","mouseup","pointerdown","pointerup","touchstart","touchend","keydown","keyup"].forEach(t =>
      window.addEventListener(t, block, {capture:true, passive:false}));
    setTimeout(() => {
      const bar = document.createElement("div");
      bar.id = "dailyMgBar";
      bar.innerHTML = `<div class="dmb-msg">🎈 今日のミニゲーム、おつかれさま！</div><button type="button">ごほうびを受け取る ▶</button>`;
      document.body.appendChild(bar);
      bar.querySelector("button").addEventListener("click", () => { bar.querySelector("button").disabled = true; onClaim(); });
    }, delayMs == null ? 1200 : delayMs);
  };
  window.dailyMgShowTag = function(){
    addCss();
    if(document.getElementById("dailyMgTag")) return;
    const t = document.createElement("div"); t.id = "dailyMgTag"; t.textContent = "🎈 今日のミニゲーム";
    document.body.appendChild(t);
  };
  window.dailyMgHideUi = function(){
    ["dailyMgTag","dailyMgBar"].forEach(id => { const el = document.getElementById(id); if(el) el.remove(); });
    if(barShown){
      ["click","mousedown","mouseup","pointerdown","pointerup","touchstart","touchend","keydown","keyup"].forEach(t =>
        window.removeEventListener(t, block, {capture:true}));
    }
    barShown = false;
  };
  /* ---- 遊び方の札（心の準備）と、5からの派手なカウントダウン（2026-11-06、教員の指示） ----
     brief＝{title, what, how:[...], note, banner}。本体は直接渡す。別ページは本体が sessionStorage（BRIEF_SSKEY）に置いたものを読む。 */
  const BRIEF_SSKEY = "kokugo_daily_mg_brief_v1";
  window.DAILY_MG_BRIEF_SSKEY = BRIEF_SSKEY;
  const CSS2 = `
  #dailyMgBrief{position:fixed;inset:0;z-index:2147483002;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;
    background:radial-gradient(circle at 50% 40%,rgba(60,30,90,.92),rgba(6,4,18,.97));font-family:sans-serif;animation:dmbFade .4s ease both}
  #dailyMgBrief .dmb-card{width:min(560px,100%);max-height:100%;overflow:auto;background:linear-gradient(170deg,#fffdf5,#fff1e0);border-radius:18px;
    padding:18px 18px 16px;box-sizing:border-box;box-shadow:0 0 0 4px #ffc75f,0 10px 40px rgba(0,0,0,.5);color:#3e2723;animation:dmbPop .55s cubic-bezier(.2,1.5,.4,1) both}
  #dailyMgBrief .dmb-head{text-align:center;font-weight:bold;color:#d84315;letter-spacing:.08em;font-size:14px}
  #dailyMgBrief .dmb-banner{display:block;width:100%;border-radius:10px;margin:8px 0}
  #dailyMgBrief .dmb-title{text-align:center;font-size:22px;font-weight:900;margin:6px 0 2px}
  #dailyMgBrief .dmb-what{text-align:center;color:#e64a19;font-weight:bold;margin-bottom:10px}
  #dailyMgBrief .dmb-how{margin:0;padding:10px 12px 10px 30px;background:#fff;border-radius:12px;border:2px dashed #ffcc80;line-height:1.7;font-size:15px}
  #dailyMgBrief .dmb-how li+li{margin-top:4px}
  #dailyMgBrief .dmb-limit{margin:10px 0 0;padding:8px 10px;border-radius:12px;background:#ffebee;border:2px solid #e53935;color:#c62828;text-align:center;font-weight:900;font-size:17px;line-height:1.5}
  #dailyMgBrief .dmb-limit small{display:block;font-size:12px;font-weight:bold;color:#b71c1c}
  #dailyMgBrief .dmb-note{font-size:12px;color:#8d6e63;margin:8px 2px 0}
  #dailyMgBrief .dmb-go{display:block;margin:14px auto 0;font-size:20px;font-weight:bold;padding:12px 40px;border:none;border-radius:999px;cursor:pointer;color:#fff;
    background:linear-gradient(135deg,#ff6f91,#ff9671 50%,#ffc75f);box-shadow:0 4px 0 #b9506a,0 6px 14px rgba(0,0,0,.3);animation:dailyMgPulse 1.4s ease-in-out infinite}
  #dailyMgBrief .dmb-ready{text-align:center;font-size:12px;color:#8d6e63;margin-top:6px}
  #dailyMgBrief .dmb-bonus{text-align:center;font-size:14px;color:#c62828;font-weight:bold;margin-top:6px}
  @keyframes dmbFade{from{opacity:0}to{opacity:1}}
  @keyframes dmbPop{from{transform:scale(.7);opacity:0}to{transform:none;opacity:1}}
  #dailyMgCd{position:fixed;inset:0;z-index:2147483003;overflow:hidden;display:flex;align-items:center;justify-content:center;font-family:sans-serif;
    background:radial-gradient(circle at 50% 50%,rgba(40,10,60,.86),rgba(0,0,0,.95))}
  #dailyMgCd .cd-rays{position:absolute;left:50%;top:50%;width:260vmax;height:260vmax;margin:-130vmax 0 0 -130vmax;opacity:.35;
    background:repeating-conic-gradient(from 0deg,var(--c,#ff6f91) 0 6deg,transparent 6deg 18deg);animation:cdSpin 6s linear infinite}
  #dailyMgCd .cd-ring{position:absolute;left:50%;top:50%;width:40vmin;height:40vmin;margin:-20vmin 0 0 -20vmin;border-radius:50%;border:10px solid var(--c,#ff6f91);opacity:0}
  #dailyMgCd .cd-ring.go{animation:cdRing .8s ease-out both}
  #dailyMgCd .cd-num{position:relative;font-size:min(46vmin,340px);font-weight:900;line-height:1;color:#fff;-webkit-text-stroke:6px var(--c,#ff6f91);
    text-shadow:0 0 30px var(--c,#ff6f91),0 0 80px var(--c,#ff6f91),0 12px 0 rgba(0,0,0,.35);font-family:"Arial Black",sans-serif}
  #dailyMgCd .cd-num.go{animation:cdNum .9s cubic-bezier(.15,1.4,.4,1) both}
  #dailyMgCd .cd-num.start{font-size:min(20vmin,170px);letter-spacing:.06em;-webkit-text-stroke:4px #ff4081;color:#fff59d;animation:cdStart 1.1s cubic-bezier(.15,1.6,.4,1) both}
  #dailyMgCd .cd-sub{position:absolute;bottom:12%;left:0;right:0;text-align:center;color:#ffe0b2;font-weight:bold;font-size:18px;letter-spacing:.2em}
  #dailyMgCd .cd-spark{position:absolute;left:50%;top:50%;width:12px;height:12px;border-radius:50%;background:var(--sc);animation:cdSpark .9s ease-out forwards}
  #dailyMgCd .cd-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
  #dailyMgCd .cd-flash.go{animation:cdFlash .5s ease-out}
  #dailyMgCd.shake{animation:cdShake .35s linear}
  @keyframes cdSpin{to{transform:rotate(360deg)}}
  @keyframes cdRing{0%{transform:scale(.3);opacity:.9}100%{transform:scale(3.2);opacity:0}}
  @keyframes cdNum{0%{transform:scale(4) rotate(-12deg);opacity:0}45%{transform:scale(.9) rotate(2deg);opacity:1}70%{transform:scale(1.06)}100%{transform:scale(1)}}
  @keyframes cdStart{0%{transform:scale(.2) rotate(-20deg);opacity:0}60%{transform:scale(1.2) rotate(3deg);opacity:1}100%{transform:scale(1)}}
  @keyframes cdSpark{to{transform:translate(var(--dx),var(--dy)) scale(.2);opacity:0}}
  @keyframes cdFlash{0%{opacity:.9}100%{opacity:0}}
  @keyframes cdShake{0%,100%{transform:none}20%{transform:translate(-10px,6px)}40%{transform:translate(9px,-7px)}60%{transform:translate(-7px,-5px)}80%{transform:translate(6px,7px)}}`;
  function addCss2(){
    addCss();
    if(document.getElementById("dailyMgCss2")) return;
    const s = document.createElement("style"); s.id = "dailyMgCss2"; s.textContent = CSS2;
    (document.head || document.documentElement).appendChild(s);
  }
  let AC = null;
  function tone(f, dur, type, vol, when, slideTo){
    try{
      if(!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if(AC.state === "suspended") AC.resume();
      const t = AC.currentTime + (when || 0), o = AC.createOscillator(), g = AC.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
      if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .15, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + .05);
    }catch(e){}
  }
  window.dailyMgTone = tone;
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  /* noCd＝そのゲームに、もとから自分のカウントダウンがある（そのときは5からの特別なカウントダウンは出さない、2026-11-07教員の指示） */
  window.dailyMgBrief = function(brief, onStart, noCd){
    addCss2();
    const el = document.createElement("div");
    el.id = "dailyMgBrief";
    el.innerHTML = `<div class="dmb-card">
      <div class="dmb-head">🎈 今日のミニゲーム　あそびかた 🎈</div>
      ${brief.banner ? `<img class="dmb-banner" src="${brief.banner}" alt="">` : ""}
      <div class="dmb-title">${esc(brief.title)}</div>
      <div class="dmb-what">${esc(brief.what)}</div>
      <ul class="dmb-how">${(brief.how || []).map(h => `<li>${esc(h)}</li>`).join("")}</ul>
      ${brief.limit ? `<div class="dmb-limit">${esc(brief.limit)}${brief.limitSub ? `<small>${esc(brief.limitSub)}</small>` : ""}</div>` : ""}
      ${brief.note ? `<div class="dmb-note">${esc(brief.note)}</div>` : ""}
      <button type="button" class="dmb-go">準備OK！ スタート ▶</button>
      <div class="dmb-ready">挑戦できるのは1回だけ。心の準備ができたら押そう！</div>
      ${brief.bonus ? `<div class="dmb-bonus">🏁 最後まで遊びきると、ボーナスでストック経験値 <b>＋${brief.bonus}</b>！</div>` : ""}</div>`;
    document.body.appendChild(el);
    el.querySelector(".dmb-go").addEventListener("click", () => { el.remove(); if(noCd) onStart(); else window.dailyMgCountdown(onStart); });
  };
  const CD_COLORS = ["#7ec8f8", "#a0e7a0", "#ffd54f", "#ff9671", "#ff4f8b"];   // 5→1 と、だんだん熱い色に
  window.dailyMgCountdown = function(done){
    addCss2();
    const el = document.createElement("div");
    el.id = "dailyMgCd";
    el.innerHTML = `<div class="cd-rays"></div><div class="cd-ring"></div><div class="cd-num"></div><div class="cd-sub">GET READY</div><div class="cd-flash"></div>`;
    document.body.appendChild(el);
    const num = el.querySelector(".cd-num"), ring = el.querySelector(".cd-ring"), flash = el.querySelector(".cd-flash"), sub = el.querySelector(".cd-sub");
    const sparks = (n, cols) => {
      for(let k = 0; k < n; k++){
        const s = document.createElement("i"); s.className = "cd-spark";
        const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 380;
        s.style.cssText = `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;--sc:${cols[k % cols.length]};animation-delay:${Math.random() * .1}s`;
        el.appendChild(s); setTimeout(() => s.remove(), 1100);
      }
    };
    const restart = (node, cls) => { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); };
    let n = 5;
    const step = () => {
      if(n > 0){
        const c = CD_COLORS[5 - n];
        el.style.setProperty("--c", c);
        num.className = "cd-num"; num.textContent = n;
        restart(num, "go"); restart(ring, "go"); restart(el, "shake");
        sparks(10 + (5 - n) * 6, [c, "#fff"]);
        tone(330 + (5 - n) * 110, .22, "square", .09); tone(165 + (5 - n) * 55, .35, "sawtooth", .06);
        tone(60, .25, "sine", .25);                                     // ドンッ
        if(n <= 3) tone(880 + (3 - n) * 220, .12, "triangle", .07, .45);  // 残り3からは裏拍も
        sub.textContent = "GET READY";
        n--;
        setTimeout(step, 1000);
        return;
      }
      el.style.setProperty("--c", "#ffeb3b");
      num.className = "cd-num start"; num.textContent = "スタート！！";
      sub.textContent = "";
      restart(flash, "go"); restart(ring, "go"); restart(el, "shake");
      sparks(60, ["#ff6f91", "#ffc75f", "#f9f871", "#7ee8fa", "#a0e7a0", "#fff"]);
      [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, "square", .07, i * .06));
      tone(1568, .9, "triangle", .08, .28); tone(70, .5, "sine", .3);
      setTimeout(() => { el.style.transition = "opacity .35s"; el.style.opacity = "0"; }, 750);
      setTimeout(() => { el.remove(); try{ done(); }catch(e){ console.error(e); } }, 1100);
    };
    step();
  };
  /* 別ページ用 */
  window.DAILY_MG = new URLSearchParams(location.search).get("daily") === "1";
  /* opt.ends＝1回の挑戦が終わって結果を出す関数の名前（呼ばれたあとに帯を出す）
     opt.quits＝途中でやめる関数の名前（呼ばれたあと、すぐ帯を出す）
     どちらもページの一番外側で function 名(){} と書いた関数だけ（window の上で包みなおせるもの） */
  function wrapAfter(name, after){
    const f = window[name];
    if(typeof f !== "function"){ console.warn("daily: 見つからない関数", name); return; }
    window[name] = function(){ const r = f.apply(this, arguments); try{ after(); }catch(e){ console.error(e); } return r; };
  }
  window.dailyMgWrapAfter = wrapAfter;
  /* 最後まで遊びきったか（2026-11-07、教員の指示：途中でやめずに最後まで遊びきったらボーナス）。
     本体の保存（kokugo_daily_minigame_v1）の completed に書く。結果画面まで来たら true、途中でやめたら false。 */
  const DAILY_LSKEY = "kokugo_daily_minigame_v1";
  window.dailyMgMarkCompleted = function(v){
    try{
      const d = JSON.parse(localStorage.getItem(DAILY_LSKEY) || "null");
      if(d && d.phase === "playing"){ d.completed = !!v; localStorage.setItem(DAILY_LSKEY, JSON.stringify(d)); }
    }catch(e){}
  };
  window.dailyMgBarShown = () => barShown;
  // 途中でやめる関数を包む：呼ばれる前にまだ結果の帯が出ていなければ「途中でやめた」（中で結果画面を出すものもあるので、あとで false にもどす）
  function wrapQuit(name){
    const f = window[name];
    if(typeof f !== "function"){ console.warn("daily: 見つからない関数", name); return; }
    window[name] = function(){
      const already = barShown;
      const r = f.apply(this, arguments);
      if(!already){ window.dailyMgMarkCompleted(false); window.dailyMgEnd(300, true); }
      return r;
    };
  }
  /* ---- 「スロットで決める」（2026-11-08、教員の指示）：ミニゲーム一覧の上のボタンから、スロットで遊ぶゲームを決める。
     「今日のミニゲーム」とは別もの：経験値の優遇なし・ごほうびの帯なし・何回でも。始め方（最後の挑戦をいきなり始める）だけ同じ。
     別ページのゲームは ?slot=1 で開く。カウントダウンは「今日のミニゲーム」と同じ5からだが、演出は控えめ（dailyMgCountdownLite）。 ---- */
  window.SLOT_MG = !window.DAILY_MG && new URLSearchParams(location.search).get("slot") === "1";
  const CSS3 = `
  #slotMgCd{position:fixed;inset:0;z-index:2147483003;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
    background:rgba(10,8,24,.78);font-family:sans-serif;animation:dmbFade .3s ease both}
  #slotMgCd .sc-num{font-size:min(30vmin,200px);font-weight:900;line-height:1;color:#fff;text-shadow:0 4px 16px rgba(0,0,0,.5);font-family:"Arial Black",sans-serif}
  #slotMgCd .sc-num.go{animation:scNum .55s ease-out both}
  #slotMgCd .sc-num.start{font-size:min(12vmin,90px);letter-spacing:.06em;color:#ffe082}
  #slotMgCd .sc-sub{color:rgba(255,255,255,.6);font-size:14px;letter-spacing:.2em}
  @keyframes scNum{0%{transform:scale(1.5);opacity:0}100%{transform:none;opacity:1}}
  #slotMgAgain{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483001;
    font-family:sans-serif;font-size:17px;font-weight:bold;padding:11px 26px;border:none;border-radius:999px;cursor:pointer;color:#fff;white-space:nowrap;
    background:linear-gradient(135deg,#7c4dff,#b388ff 55%,#ffd54f);box-shadow:0 4px 0 #4a2a99,0 6px 16px rgba(0,0,0,.35);
    animation:slotAgainIn .45s cubic-bezier(.2,1.4,.4,1) both, dailyMgPulse 1.4s 0.5s ease-in-out infinite}
  #slotMgAgain:active{transform:translateX(-50%) translateY(3px);box-shadow:0 1px 0 #4a2a99}
  @keyframes slotAgainIn{from{transform:translateX(-50%) translateY(140%)}to{transform:translateX(-50%)}}`;
  function addCss3(){
    addCss2();
    if(document.getElementById("slotMgCss")) return;
    const s = document.createElement("style"); s.id = "slotMgCss"; s.textContent = CSS3;
    (document.head || document.documentElement).appendChild(s);
  }
  window.dailyMgCountdownLite = function(done){
    addCss3();
    const el = document.createElement("div");
    el.id = "slotMgCd";
    el.innerHTML = `<div class="sc-num"></div><div class="sc-sub">GET READY</div>`;
    document.body.appendChild(el);
    const num = el.querySelector(".sc-num"), sub = el.querySelector(".sc-sub");
    let n = 5;
    const step = () => {
      if(n > 0){
        num.className = "sc-num"; num.textContent = n; void num.offsetWidth; num.classList.add("go");
        tone(520, .1, "sine", .07);
        n--; setTimeout(step, 1000); return;
      }
      num.className = "sc-num start"; num.textContent = "スタート！"; void num.offsetWidth; num.classList.add("go");
      sub.textContent = "";
      tone(784, .25, "triangle", .08);
      setTimeout(() => { el.style.transition = "opacity .25s"; el.style.opacity = "0"; }, 600);
      setTimeout(() => { el.remove(); try{ done(); }catch(e){ console.error(e); } }, 850);
    };
    step();
  };
  /* 「もう一度スロットする」ボタン（2026-11-08、教員の指示：スロットで行ったゲームを最後まで遊んだら出す）。
     結果画面の下に浮かべるだけで、ほかのボタン（ゲームの「もう一度」など）はふつうに押せる。
     ほかのボタンを押したら、そのゲームを続けることにしたとみなして消す。 */
  let againOff = null;
  window.slotMgHideAgain = function(){
    const el = document.getElementById("slotMgAgain");
    if(el) el.remove();
    if(againOff){ againOff(); againOff = null; }
  };
  window.slotMgShowAgain = function(onAgain, delayMs){
    window.slotMgHideAgain();
    const t = setTimeout(() => {
      addCss3();
      const b = document.createElement("button");
      b.type = "button"; b.id = "slotMgAgain"; b.textContent = "🎰 もう一度スロットする";
      b.addEventListener("click", () => { window.slotMgHideAgain(); onAgain(); });
      document.body.appendChild(b);
      const other = e => {
        const el = e.target && e.target.closest ? e.target.closest("button,a,[onclick]") : null;
        if(el && el !== b) window.slotMgHideAgain();
      };
      document.addEventListener("click", other, true);
      againOff = () => document.removeEventListener("click", other, true);
    }, delayMs == null ? 1200 : delayMs);
    againOff = () => clearTimeout(t);
  };
  function slotPage(backUrl, startFn, opt){
    // 読みなおしたときに、また始まらないように ?slot=1 を消す
    try{ history.replaceState(null, "", location.pathname + location.hash); }catch(e){}
    // ページ側が「今日のミニゲーム」用に dailyMgQuit を使っているところ（魔術道のボタンなど）は、ふつうにミニゲーム一覧へもどる
    window.dailyMgQuit = () => { location.href = String(backUrl).replace("from=daily", "from=minigame"); };
    // 最後まで遊んで結果画面が出たら「もう一度スロットする」（本体のミニゲーム一覧で、すぐスロットを回す：from=slot）。途中でやめたとき（isQuit）は出さない
    window.dailyMgEnd = (delayMs, isQuit) => { if(!isQuit) window.slotMgShowAgain(() => { location.href = String(backUrl).replace("from=daily", "from=slot"); }, delayMs); };
    (opt.ends || []).forEach(n => wrapAfter(n, () => window.dailyMgEnd()));
    const begin = () => { try{ startFn(); }catch(e){ console.error(e); } };
    const go = () => {
      const noCd = typeof opt.ownCountdown === "function" ? !!opt.ownCountdown() : !!opt.ownCountdown;
      if(noCd) begin(); else window.dailyMgCountdownLite(begin);
    };
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else setTimeout(go, 0);
  }
  /* 抜け道ふさぎ（2026-11-09、教員の指示「経験値を乱獲できる抜け道がないか」）。
     ごほうびは「挑戦を始めてから本体のホームにもどるまでに上がったレベル」で数えるので、その間にページを
     読みなおして何回も遊んだり、ふつうのモードで遊んだりすると、その分まで3倍になってしまう。そこで
     ・?daily=1 のページは、1回の挑戦につき1度だけ開ける（2度目以降・挑戦中でないときは、すぐ本体のホームへ＝そこで締めくくり）
     ・挑戦中（phase:"playing"）に、ふつうのモードやスロットでページを開いたときも、先に本体のホームへもどして締めくくる */
  function dailyState(){ try{ return JSON.parse(localStorage.getItem(DAILY_LSKEY) || "null"); }catch(e){ return null; } }
  window.dailyMgPage = function(backUrl, startFn, opt){
    const ds = dailyState(), playing = !!(ds && ds.phase === "playing");
    const home = () => { try{ location.replace(String(backUrl).replace("from=minigame", "from=daily")); }catch(e){ location.href = backUrl; } };
    if(window.DAILY_MG){
      if(!playing || ds.pageOpened){ home(); return; }
      ds.pageOpened = true;
      try{ localStorage.setItem(DAILY_LSKEY, JSON.stringify(ds)); }catch(e){}
    }else if(playing){ home(); return; }
    if(window.SLOT_MG){ slotPage(backUrl, startFn, opt || {}); return; }
    if(!window.DAILY_MG) return;
    opt = opt || {};
    // isQuit＝途中でやめた。それ以外（結果画面まで来た）は「最後まで遊びきった」。帯がもう出ていたら、あとから変えない
    window.dailyMgEnd = (delayMs, isQuit) => { if(!barShown) window.dailyMgMarkCompleted(!isQuit); dailyMgEndBar(() => { location.href = backUrl; }, delayMs); };
    window.dailyMgQuit = () => { location.href = backUrl; };
    // 「ミニゲーム一覧へ」などの戻るボタンも、今日のミニゲームのもどり先へ
    ["backToApp", "goBack"].forEach(n => { if(typeof window[n] === "function") window[n] = window.dailyMgQuit; });
    (opt.ends || []).forEach(n => wrapAfter(n, () => window.dailyMgEnd()));
    (opt.quits || []).forEach(n => wrapQuit(n));
    const begin = () => { try{ startFn(); }catch(e){ console.error(e); } };
    const go = () => {
      dailyMgShowTag();
      let brief = null;
      try{ brief = JSON.parse(sessionStorage.getItem(BRIEF_SSKEY) || "null"); }catch(e){}
      // 遊び方の札 →「スタート」を押すと5からのカウントダウン → 最後の挑戦が始まる（押すことで、ゲームの音も鳴らせるようになる）
      const noCd = typeof opt.ownCountdown === "function" ? !!opt.ownCountdown() : !!opt.ownCountdown;   // もとからカウントダウンがあるゲーム
      if(brief) window.dailyMgBrief(brief, begin, noCd); else if(noCd) begin(); else window.dailyMgCountdown(begin);
    };
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else setTimeout(go, 0);
  };
  // ふだん（?daily=1 なし）は、ページ側から呼んでも何もしない
  window.dailyMgEnd = window.dailyMgEnd || function(){};
})();

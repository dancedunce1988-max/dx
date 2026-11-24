/* ミニゲームの途中で「ことのは」が進化したときのお知らせ（2026-11-25、教員の指示）
   「ミニゲーム中にことのはの進化が起きたら、ミニゲームの途中でも進化のときにお知らせしてほしい。
     時間制限の問題中は行わず、時間制限が解除されたら進化演出」

   しくみ：
   ・本体（kokugo_app.html）は、別ページのミニゲームへ移るとき（mgGoWithPass）に、
     sessionStorage の "kokugo_mg_evolve_watch_v1" へ「次の進化まであと何点か」と、
     進化の前後の絵・文面を書いておく（mgEvolveWatchWrite）。
   ・このファイルは、ミニゲームが本体へ残す書き置き（ジャンルレベル・シューティングの得点・イベント経験値）を
     ときどき読み、増えた経験値が「あと何点」に届いたら、進化が起きたと判断する（本体の計算式と同じ）。
   ・演出は、各ミニゲームが「今なら出してよい」場所で呼ぶ
       mgEvolveInterrupt(続きの処理) … 次の問題へ進む前など。演出を出したら true（続きは「つづける」のあとで呼ぶ）
       mgEvolveSafePoint()         … 結果画面・メニューなど。出したあとはその画面のまま
     でだけ出す。時間制限のある問題の最中には出ない。
   ・ミニゲームで演出を見せたら、localStorage の "kokugo_mg_evolve_shown_v1" に書き置き、
     本体に戻ったとき（mgSyncFromMinigames）は同じ演出をくり返さない。
     ミニゲームの中で出せなかったときは、今までどおり本体のホームで演出が出る。 */
(function(){
  "use strict";
  var WATCH_SSKEY = "kokugo_mg_evolve_watch_v1";
  var SHOWN_LSKEY = "kokugo_mg_evolve_shown_v1";
  var LVUP_LSKEY = "kokugo_minigame_pending_lvups_v1";
  var EVENT_LSKEY = "kokugo_minigame_pending_event_v1";
  var VS_LSKEY = "kokugo_vs_pending_v1";

  function readJSON(store, key){ try{ var o = JSON.parse(store.getItem(key)); return o && typeof o === "object" ? o : null; }catch(e){ return null; } }
  function writeWatch(w){ try{ sessionStorage.setItem(WATCH_SSKEY, JSON.stringify(w)); }catch(e){} }
  var W = readJSON(sessionStorage, WATCH_SSKEY);

  // 本体の catExpPoints と同じ（レベル → それまでにたまった経験値）
  function catExpPoints(lv){
    var L = Math.max(1, lv || 1);
    if(L <= 100) return (L - 1) * 3;
    if(L <= 500) return 297 + (L - 100) * 2;
    if(L <= 1000) return 1097 + (L - 500);
    return 1597 + (L - 1000) * .2;
  }
  // ジャンルレベルの書き置きが増えた分を、経験値に直して足していく。
  // 本体が別のタブで書き置きを読み取って消したときも数えもらさないよう、前に見た値との差で数える。
  function poll(){
    if(!W || W.done || W.shown) return;
    var changed = false;
    var lv = readJSON(localStorage, LVUP_LSKEY) || {};
    if(!W.seen) W.seen = {};
    if(!W.got) W.got = {};
    Object.keys(W.cats || {}).forEach(function(cat){
      var cur = Math.trunc(Number(lv[cat]) || 0), prev = W.seen[cat] || 0;
      var d = cur >= prev ? cur - prev : cur;
      if(d > 0){ W.got[cat] = (W.got[cat] || 0) + d; changed = true; }
      if(cur !== prev){ W.seen[cat] = cur; changed = true; }
    });
    var ev = readJSON(localStorage, EVENT_LSKEY) || {};
    if(!W.seenEv) W.seenEv = {};
    Object.keys(ev).forEach(function(key){
      var m = /^([a-z]+)@(\d{4}-\d{2}-\d{2})$/.exec(key);
      if(!m || !W.event || !W.event[m[1]] || m[2] !== W.today) return;
      var cur = Math.trunc(Number(ev[key]) || 0), prev = W.seenEv[key] || 0;
      var d = cur >= prev ? cur - prev : cur;
      if(d > 0){ W.evXp = (W.evXp || 0) + d * W.event[m[1]]; changed = true; }
      if(cur !== prev){ W.seenEv[key] = cur; changed = true; }
    });
    if(W.vs){
      var vs = readJSON(localStorage, VS_LSKEY);
      var best = W.vs.best || 0;
      ((vs && vs.scores) || []).forEach(function(s){ s = Number(s) || 0; if(s > best) best = s; });
      if(best > (W.vsBest || W.vs.best || 0)){ W.vsBest = best; changed = true; }
    }
    if(changed){
      var xp = W.evXp || 0;
      Object.keys(W.got).forEach(function(cat){
        var c = W.cats[cat]; if(!c) return;
        var to = Math.min(c.max || 99999, c.lv + W.got[cat]);
        xp += catExpPoints(to) - catExpPoints(c.lv);
      });
      if(W.vs && W.vsBest > W.vs.best){
        var tier = Math.floor(W.vsBest / 100);
        if(tier > W.vs.tier) xp += (tier - W.vs.tier) * 10;
      }
      W.xp = xp;
      if(xp >= W.need) W.ready = true;
      writeWatch(W);
    }
  }

  // ---------- 演出（本体の showKotonohaEvolveCutscene と同じ流れ・見た目） ----------
  var CSS = ".mgevo{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;"
    + "background:radial-gradient(circle at 50% 45%,rgba(30,30,40,.92) 0%,rgba(4,4,8,.97) 78%);padding:24px;text-align:center;font-family:'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif;animation:mgevoIn .25s ease}"
    + ".mgevo img{width:min(48vw,220px);height:min(48vw,220px);object-fit:contain;box-sizing:border-box;background:rgba(255,255,255,.1);border-radius:14px;border:3px solid rgba(255,255,255,.5);box-shadow:0 0 30px rgba(255,255,255,.3)}"
    + ".mgevo img.fret{animation:mgevoFret .5s ease infinite}"
    + ".mgevo img.reveal{border-color:#d4a017;box-shadow:0 0 40px rgba(184,134,11,.85);animation:mgevoPop .5s cubic-bezier(.2,1.4,.4,1)}"
    + ".mgevo .egg{font-size:5rem}"
    + ".mgevo p{margin:0;color:#f0ece0;font-weight:bold;font-size:1.35rem;line-height:1.6;text-shadow:0 0 10px rgba(0,0,0,.8)}"
    + ".mgevo p.congrats{font-size:1.6rem;background:linear-gradient(90deg,#ffe08a,#ffd76a,#fff3c4,#ffd76a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 20px rgba(255,215,100,.8))}"
    + ".mgevo p.sub{font-size:1rem;color:#ffe08a;text-shadow:none}"
    + ".mgevo.shake{animation:mgevoShake .9s ease}"
    + ".mgevo .flash{position:absolute;inset:0;background:#fff;animation:mgevoFlash .45s ease forwards}"
    + ".mgevo button{font:inherit;font-size:1.1rem;font-weight:bold;padding:10px 34px;border-radius:999px;border:0;background:linear-gradient(180deg,#ffd76a,#d4a017);color:#3a2500;cursor:pointer;box-shadow:0 3px 0 #8a6200}"
    + "@keyframes mgevoIn{from{opacity:0}to{opacity:1}}"
    + "@keyframes mgevoFret{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-3px,1px) rotate(-1.5deg)}75%{transform:translate(3px,-1px) rotate(1.5deg)}}"
    + "@keyframes mgevoPop{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}}"
    + "@keyframes mgevoShake{0%,100%{transform:none}10%{transform:translate(-10px,4px)}20%{transform:translate(9px,-5px)}30%{transform:translate(-8px,5px)}40%{transform:translate(8px,-4px)}50%{transform:translate(-7px,3px)}60%{transform:translate(6px,-4px)}70%{transform:translate(-5px,3px)}80%{transform:translate(4px,-2px)}90%{transform:translate(-2px,1px)}}"
    + "@keyframes mgevoFlash{0%{opacity:0}25%{opacity:1}100%{opacity:1}}";
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function img(src, cls){ return src ? '<img src="' + src + '" alt="" class="' + (cls || "") + '">' : '<div class="egg">🥚</div>'; }
  var SHOWING = false;
  function play(onDone){
    SHOWING = true;
    W.shown = true; writeWatch(W);
    try{ localStorage.setItem(SHOWN_LSKEY, JSON.stringify({line:W.line, stage:W.to, key:W.key, at:Date.now()})); }catch(e){}
    if(!document.getElementById("mgevoCss")){ var st = document.createElement("style"); st.id = "mgevoCss"; st.textContent = CSS; document.head.appendChild(st); }
    var el = document.createElement("div"); el.className = "mgevo"; document.body.appendChild(el);
    var T = 1300;
    el.innerHTML = img(W.imgFrom) + "<p>あれ………？</p>";
    setTimeout(function(){
      el.innerHTML = img(W.imgFrom, "fret") + "<p>ことのはの様子が、おかしい…</p>";
      setTimeout(function(){
        el.classList.add("shake");
        setTimeout(function(){
          el.classList.remove("shake"); el.innerHTML = '<div class="flash"></div>';
          setTimeout(function(){
            el.innerHTML = img(W.imgTo, "reveal") + '<p class="congrats">おめでとう！<br>ことのはが、' + esc(W.label) + "に進化した！</p>"
              + (W.moveMsg ? '<p class="sub">' + esc(W.moveMsg) + "</p>" : "")
              + (W.unlockMsg ? '<p class="sub">' + esc(W.unlockMsg) + "</p>" : "")
              + "<button>つづける</button>";
            el.querySelector("button").onclick = function(){
              el.remove(); SHOWING = false;
              if(typeof onDone === "function") onDone();
            };
          }, 450);
        }, 900);
      }, T);
    }, T);
    // 効果音（ある程度の音量で短く。音を消しているゲームでも鳴らさない工夫はしない＝本体と同じ）
    try{
      var A = window.AudioContext || window.webkitAudioContext;
      if(A){ var ac = new A(), t0 = ac.currentTime + 2.6 + .9 + .45;
        [523, 659, 784, 1046].forEach(function(f, i){ var o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = f;
          g.gain.setValueAtTime(.08, t0 + i * .12); g.gain.exponentialRampToValueAtTime(.0001, t0 + i * .12 + .35); o.connect(g); g.connect(ac.destination); o.start(t0 + i * .12); o.stop(t0 + i * .12 + .4); });
        setTimeout(function(){ try{ ac.close(); }catch(e){} }, 6000); }
    }catch(e){}
  }
  function due(){ if(!W || W.shown || SHOWING) return false; poll(); return !!W.ready; }

  // 次の問題へ進む前などに呼ぶ。演出を出したら true（続きの処理 onDone は「つづける」のあとで呼ぶ）
  // 「今日のミニゲーム」（?daily=1・?slot=1）は時間制限つきのことがあるので、問題のあいだには出さない（結果画面だけ）
  var TIMED_RUN = /[?&](daily|slot)=1/.test(location.search);
  window.mgEvolveInterrupt = function(onDone){ if(TIMED_RUN || !due()) return false; play(onDone); return true; };
  // 結果画面・メニューなど、時間制限のない画面で呼ぶ。出したら true（そのあとは同じ画面にもどる）
  window.mgEvolveSafePoint = function(){ if(!due()) return false; play(null); return true; };
  // 結果画面を出したすぐあとに呼ぶ用（画面ができあがってから出す）
  window.mgEvolveSafePointSoon = function(ms){ setTimeout(function(){ window.mgEvolveSafePoint(); }, ms || 700); };
  // 書き置きは、ときどき読みにいく（演出はしない。数えるだけ）
  if(W && !W.shown && !W.done){
    // このページを開いた時点の書き置きは「もとからある分」として数えない
    if(!W.seen){
      W.seen = {}; var lv0 = readJSON(localStorage, LVUP_LSKEY) || {};
      Object.keys(W.cats || {}).forEach(function(c){ W.seen[c] = Math.trunc(Number(lv0[c]) || 0); });
      W.seenEv = {}; var ev0 = readJSON(localStorage, EVENT_LSKEY) || {};
      Object.keys(ev0).forEach(function(k){ W.seenEv[k] = Math.trunc(Number(ev0[k]) || 0); });
      writeWatch(W);
    }
    setInterval(poll, 1500);
  }
})();

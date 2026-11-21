/* ============================================================
   ミニゲームの記録の上書き防止（2026-11-21〜、教員の指示）
   ミニゲームのページは、開いたときに自分の記録をメモリに読み込み、答えるたびにメモリの中身を丸ごと保存する。
   そのため、ゲームの画面を開いたまま（別のタブ、またはブラウザの「戻る」で残った画面）、本体の管理者画面や
   「ファイルから戻す」で記録を直すと、次に答えた瞬間に「開いたときの古い記録」で上書きされてしまう
   （実例：管理者画面で魔術ステータスを100にしたのに、1問答えたら0に戻った）。
   ここでは、このページの記録が「ほかの画面で」書きかわったら、
   ・このページからその記録への保存を止め（古い中身で上書きしない）、
   ・表示されているならすぐ、隠れているなら次に表示されたときに、ページを読み込み直して最新の記録から続ける。
   「戻る」で残っていた画面（bfcache）も、表示された時点で読み込み直す。
   使い方：<script src="mg_save_guard.js" data-keys="キー1,キー2"></script> を、ゲームのスクリプトより前に置く。
   新しいミニゲームを足したら、そのページにもこの1行を入れる。
   ============================================================ */
(function(){
  var cs = document.currentScript;
  var keys = ((cs && cs.getAttribute("data-keys")) || "").split(",").map(function(s){ return s.trim(); }).filter(Boolean);
  if(!keys.length) return;
  var ls = null;
  try{ ls = window.localStorage; }catch(e){ return; }
  if(!ls) return;
  var stale = false, reloading = false;
  function reloadNow(){
    if(reloading) return;
    reloading = true;
    try{ location.reload(); }catch(e){}
  }
  function markStale(){
    stale = true;
    if(document.visibilityState !== "hidden") reloadNow();
  }
  // ほかの画面で書きかわったあとは、このページから古い中身を書かない
  try{
    var proto = Object.getPrototypeOf(ls);
    var origSet = proto.setItem, origRemove = proto.removeItem;
    proto.setItem = function(k, v){
      if(stale && this === ls && keys.indexOf(String(k)) >= 0) return;
      return origSet.apply(this, arguments);
    };
    proto.removeItem = function(k){
      if(stale && this === ls && keys.indexOf(String(k)) >= 0) return;
      return origRemove.apply(this, arguments);
    };
  }catch(e){}
  // storageイベントは「ほかのタブ・ほかのページ」が書いたときだけ届く（このページ自身の保存では来ない）
  window.addEventListener("storage", function(e){
    if(e.storageArea && e.storageArea !== ls) return;
    if(e.key === null || keys.indexOf(e.key) >= 0) markStale();   // key===null は localStorage.clear()
  });
  document.addEventListener("visibilitychange", function(){
    if(stale && document.visibilityState !== "hidden") reloadNow();
  });
  // ブラウザの「戻る／進む」で、前に開いていた画面がそのまま出てきたとき（中の記録が古いかもしれない）
  window.addEventListener("pageshow", function(e){ if(e.persisted) reloadNow(); });
})();

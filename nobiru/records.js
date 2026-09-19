/* ============================================================
   のびる読解　累計経験値の記録（2026-09-19〜）
   イージー／ハード、どちらのモードでも「自分の過去の記録との比較」だけを
   見せるための小さな保存庫。他の生徒との比較・順位は一切扱わない。
   知識ドリルDX本体のセーブ（st.dokkaiDungeon等）には触れず、
   のびる読解専用のlocalStorageキーに保存する。
   ============================================================ */
window.NobiruRecords = (function(){
  const LSKEY = "nobiru_records_v1";

  function loadAll(){
    try{ return JSON.parse(localStorage.getItem(LSKEY)) || {}; }
    catch(e){ return {}; }
  }
  function saveAll(all){
    try{ localStorage.setItem(LSKEY, JSON.stringify(all)); }
    catch(e){ /* privateモード等で保存できない場合は、比較なしで続行する */ }
  }

  /* 教材キー・モード（"easy"/"hard"）ごとの前回記録を返す。記録がなければnull。 */
  function get(textKey, mode){
    const all = loadAll();
    return (all[textKey] && all[textKey][mode]) || null;
  }

  /* 1周クリアしたときに呼ぶ。前回の記録と、更新後の記録の両方を返す
     （呼び出し側は prev を使って「前回との比較」だけを表示し、他人とは比べない）。 */
  function finish(textKey, mode, xp){
    const all = loadAll();
    if(!all[textKey]) all[textKey] = {};
    const prev = all[textKey][mode] || null;
    const rec = {
      lastXp: xp,
      bestXp: prev ? Math.max(prev.bestXp, xp) : xp,
      plays: prev ? prev.plays + 1 : 1
    };
    all[textKey][mode] = rec;
    saveAll(all);
    return { prev, rec };
  }

  return { get, finish };
})();

/* 「中学校の漢字を書く」トレーニング（とっくん内）専用データ。
   常用漢字表(2,136字, 文化庁)から小学校配当漢字(1,026字)を除いた1,110字を、教員が
   「中学漢字レベル分けツール.html」で「主要（ぜひ覚える）／できれば覚える／レベルが高い」の
   3段階に手動確認・分類した結果（kanji_chugaku_level_data.js参照）にもとづく全1,110字を収録。
   grade:1=主要(371字) / grade:2=できれば(369字) / grade:3=レベルが高い(370字)。
   2026-09-02 21:09、教員が32字のレベルを入れ替えた最新版に対応（該当字のgradeのみ更新。
   id・kanji・sentence・radicalsは変更なし。kanji_write_chugaku_stroke_data.js側のgradeも
   同時に更新している＝実行時のレベル判定はストロークデータ側のgradeを見るため）。

   出典：漢検4級/3級/準2級の級別配当(kanji.jitenon.jp)と高校入試頻出漢字データによる
   AIの初期分類を土台に、2026-09-02に教員が全1,110字を手動で確認・修正して確定
   （詳細な選定経緯はkanji_chugaku_level_data.js参照）。例文は複数の並列エージェントに
   バッチ分けして作成を依頼し、統合後に答えの言葉（kanji欄）が重複していた14件のうち
   12件を教員に確認せず机上判断で別の語に作り直して解消した。ただし「挨／拶」→「挨拶」
   「脊／椎」→「脊椎」の2件は、現代日本語にそれ以外の一般的な用例が無いため重複のまま許容している。

   ch      : 対象の1字（レベル判定・進捗表示に使う）。
   kanji   : 実際に書けるようになってほしい答え（送り仮名を含めてよい。kwsSentenceFor等の
             実装はkanji_write_elem_data.jsと共通のため、送り仮名込みの語もそのまま扱える）。
   sentence: 例文。対象の読み方を《カタカナ》で囲むと、太字＋下線の強調表示になる
             （markQuestionHtml関数）。送り仮名（活用語尾等）は、カタカナにせずそのまま残す。
   grade   : 出題目標レベル（1〜3。1=主要／2=できれば／3=レベルが高い）。elemモードの
             配当学年(1〜6)と同じ仕組みをレベル(1〜3)に読み替えて流用する
             （kokugo_app.htmlのkwsMode='chugaku'参照）。
   radicals: 書く文字数ぶんの部首表記の配列（KanjiVGのkvg:radical注記＋部首名テーブルから
             機械的に生成。kanji_write_elem_data.js作成時と同じ手法・同じ部首名テーブルを
             再利用し、中学漢字セットで新たに必要になった21種の部首を追加した。量が多いため、
             まれに教科書の部首分類と食い違う可能性がある）。 */
window.KANJI_WRITE_CHUGAKU_DATA = [
 {
  "id": "kwc0001",
  "ch": "挨",
  "kanji": "挨拶",
  "sentence": "朝、大きな声で《アイサツ》をする。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0002",
  "ch": "握",
  "kanji": "握る",
  "sentence": "バスの中でつり革を《ニギ》る。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0003",
  "ch": "扱",
  "kanji": "扱う",
  "sentence": "機械を丁寧に《アツカ》う。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0004",
  "ch": "嵐",
  "kanji": "嵐",
  "sentence": "昨夜、大きな《アラシ》が来た。",
  "grade": 1,
  "radicals": [
   "山"
  ]
 },
 {
  "id": "kwc0005",
  "ch": "依",
  "kanji": "依頼",
  "sentence": "友達に手伝いを《イライ》する。",
  "grade": 1,
  "radicals": [
   "人（にんべん）",
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc0006",
  "ch": "威",
  "kanji": "威力",
  "sentence": "台風の《イリョク》はすさまじい。",
  "grade": 1,
  "radicals": [
   "女",
   "力"
  ]
 },
 {
  "id": "kwc0007",
  "ch": "為",
  "kanji": "行為",
  "sentence": "それは危険な《コウイ》だ。",
  "grade": 1,
  "radicals": [
   "行（ぎょうがまえ）",
   "火"
  ]
 },
 {
  "id": "kwc0008",
  "ch": "偉",
  "kanji": "偉い",
  "sentence": "毎日勉強するなんて《エラ》いね。",
  "grade": 1,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0009",
  "ch": "違",
  "kanji": "違う",
  "sentence": "二人の意見は《チガ》う。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0010",
  "ch": "維",
  "kanji": "維持",
  "sentence": "健康を《イジ》するために運動する。",
  "grade": 1,
  "radicals": [
   "糸（いとへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0011",
  "ch": "緯",
  "kanji": "緯度",
  "sentence": "地図で《イド》を調べる。",
  "grade": 1,
  "radicals": [
   "糸（いとへん）",
   "广（まだれ）"
  ]
 },
 {
  "id": "kwc0012",
  "ch": "逸",
  "kanji": "逸話",
  "sentence": "先生から面白い《イツワ》を聞いた。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0013",
  "ch": "陰",
  "kanji": "陰",
  "sentence": "木の《カゲ》で休む。",
  "grade": 1,
  "radicals": [
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0014",
  "ch": "隠",
  "kanji": "隠す",
  "sentence": "大事な物を引き出しに《カク》す。",
  "grade": 1,
  "radicals": [
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0015",
  "ch": "影",
  "kanji": "影",
  "sentence": "夕方、長い《カゲ》ができる。",
  "grade": 1,
  "radicals": [
   "彡（さんづくり）"
  ]
 },
 {
  "id": "kwc0016",
  "ch": "鋭",
  "kanji": "鋭い",
  "sentence": "ナイフの刃が《スルド》い。",
  "grade": 1,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0017",
  "ch": "越",
  "kanji": "越える",
  "sentence": "山を《コ》えて隣町へ行く。",
  "grade": 1,
  "radicals": [
   "走（そうにょう）"
  ]
 },
 {
  "id": "kwc0018",
  "ch": "援",
  "kanji": "応援",
  "sentence": "大声でチームを《オウエン》する。",
  "grade": 1,
  "radicals": [
   "心",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0019",
  "ch": "煙",
  "kanji": "煙",
  "sentence": "工場から《ケムリ》が出ている。",
  "grade": 1,
  "radicals": [
   "火（ひへん）"
  ]
 },
 {
  "id": "kwc0020",
  "ch": "鉛",
  "kanji": "鉛筆",
  "sentence": "新しい《エンピツ》で字を書く。",
  "grade": 1,
  "radicals": [
   "金（かねへん）",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0021",
  "ch": "縁",
  "kanji": "縁側",
  "sentence": "祖父母の家の《エンガワ》で昼寝をする。",
  "grade": 1,
  "radicals": [
   "糸（いとへん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0022",
  "ch": "汚",
  "kanji": "汚い",
  "sentence": "靴が泥で《キタナ》い。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0023",
  "ch": "押",
  "kanji": "押す",
  "sentence": "ドアを強く《オ》す。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0024",
  "ch": "奥",
  "kanji": "奥",
  "sentence": "部屋の《オク》に机がある。",
  "grade": 1,
  "radicals": [
   "大"
  ]
 },
 {
  "id": "kwc0025",
  "ch": "憶",
  "kanji": "記憶",
  "sentence": "昔の《キオク》がよみがえる。",
  "grade": 1,
  "radicals": [
   "言（ごんべん）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0026",
  "ch": "乙",
  "kanji": "乙女",
  "sentence": "彼女は《オトメ》のような性格だ。",
  "grade": 1,
  "radicals": [
   "乙",
   "女"
  ]
 },
 {
  "id": "kwc0027",
  "ch": "菓",
  "kanji": "菓子",
  "sentence": "おやつに《カシ》を食べる。",
  "grade": 1,
  "radicals": [
   "艸（くさかんむり）",
   "子"
  ]
 },
 {
  "id": "kwc0028",
  "ch": "暇",
  "kanji": "暇",
  "sentence": "今日は一日《ヒマ》だ。",
  "grade": 1,
  "radicals": [
   "日（ひへん）"
  ]
 },
 {
  "id": "kwc0029",
  "ch": "禍",
  "kanji": "禍",
  "sentence": "油断が《ワザワイ》を招いた。",
  "grade": 1,
  "radicals": [
   "示（しめすへん）"
  ]
 },
 {
  "id": "kwc0030",
  "ch": "靴",
  "kanji": "靴",
  "sentence": "新しい《クツ》を買った。",
  "grade": 1,
  "radicals": [
   "革"
  ]
 },
 {
  "id": "kwc0031",
  "ch": "箇",
  "kanji": "箇所",
  "sentence": "間違えた《カショ》を直す。",
  "grade": 1,
  "radicals": [
   "竹（たけかんむり）",
   "戸"
  ]
 },
 {
  "id": "kwc0032",
  "ch": "稼",
  "kanji": "稼ぐ",
  "sentence": "アルバイトでお金を《カセ》ぐ。",
  "grade": 1,
  "radicals": [
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0033",
  "ch": "蚊",
  "kanji": "蚊",
  "sentence": "夏の夜は《カ》に刺される。",
  "grade": 1,
  "radicals": [
   "虫（むしへん）"
  ]
 },
 {
  "id": "kwc0034",
  "ch": "雅",
  "kanji": "優雅",
  "sentence": "白鳥が《ユウガ》に泳ぐ。",
  "grade": 1,
  "radicals": [
   "人（にんべん）",
   "隹（ふるとり）"
  ]
 },
 {
  "id": "kwc0035",
  "ch": "介",
  "kanji": "介護",
  "sentence": "祖父の《カイゴ》をする。",
  "grade": 1,
  "radicals": [
   "人",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0036",
  "ch": "戒",
  "kanji": "警戒",
  "sentence": "台風に《ケイカイ》する。",
  "grade": 1,
  "radicals": [
   "言",
   "戈（ほこ）"
  ]
 },
 {
  "id": "kwc0037",
  "ch": "皆",
  "kanji": "皆",
  "sentence": "クラスの《ミナ》で協力する。",
  "grade": 1,
  "radicals": [
   "白"
  ]
 },
 {
  "id": "kwc0038",
  "ch": "潰",
  "kanji": "潰れる",
  "sentence": "空き缶が《ツブ》れる。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0039",
  "ch": "壊",
  "kanji": "壊れる",
  "sentence": "時計が《コワ》れる。",
  "grade": 1,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0040",
  "ch": "懐",
  "kanji": "懐かしい",
  "sentence": "昔の写真を見て《ナツ》かしい気持ちになる。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0041",
  "ch": "蓋",
  "kanji": "蓋",
  "sentence": "瓶の《フタ》を開ける。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0042",
  "ch": "概",
  "kanji": "概要",
  "sentence": "レポートの《ガイヨウ》をまとめる。",
  "grade": 1,
  "radicals": [
   "木（きへん）",
   "襾"
  ]
 },
 {
  "id": "kwc0043",
  "ch": "柿",
  "kanji": "柿",
  "sentence": "庭で《カキ》の実がなった。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0044",
  "ch": "較",
  "kanji": "比較",
  "sentence": "二つの案を《ヒカク》する。",
  "grade": 1,
  "radicals": [
   "比",
   "車（くるまへん）"
  ]
 },
 {
  "id": "kwc0045",
  "ch": "獲",
  "kanji": "獲得",
  "sentence": "大会で優勝を《カクトク》した。",
  "grade": 1,
  "radicals": [
   "犬",
   "彳（ぎょうにんべん）"
  ]
 },
 {
  "id": "kwc0046",
  "ch": "滑",
  "kanji": "滑る",
  "sentence": "雪の道で《スベ》って転んだ。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0047",
  "ch": "刈",
  "kanji": "刈る",
  "sentence": "庭の草を《カ》る。",
  "grade": 1,
  "radicals": [
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0048",
  "ch": "甘",
  "kanji": "甘い",
  "sentence": "このケーキはとても《アマ》い。",
  "grade": 1,
  "radicals": [
   "甘"
  ]
 },
 {
  "id": "kwc0049",
  "ch": "汗",
  "kanji": "汗",
  "sentence": "運動して《アセ》をかいた。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0050",
  "ch": "乾",
  "kanji": "乾く",
  "sentence": "洗濯物が《カワ》く。",
  "grade": 1,
  "radicals": [
   "乙"
  ]
 },
 {
  "id": "kwc0051",
  "ch": "勧",
  "kanji": "勧める",
  "sentence": "友達に良い本を《スス》める。",
  "grade": 1,
  "radicals": [
   "力（ちから）"
  ]
 },
 {
  "id": "kwc0052",
  "ch": "歓",
  "kanji": "歓迎",
  "sentence": "新入生を《カンゲイ》する。",
  "grade": 1,
  "radicals": [
   "欠（あくび）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0053",
  "ch": "監",
  "kanji": "監督",
  "sentence": "野球部の《カントク》に相談する。",
  "grade": 1,
  "radicals": [
   "皿（さら）",
   "目"
  ]
 },
 {
  "id": "kwc0054",
  "ch": "環",
  "kanji": "環境",
  "sentence": "学校の《カンキョウ》を整える。",
  "grade": 1,
  "radicals": [
   "玉",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0055",
  "ch": "鑑",
  "kanji": "鑑賞",
  "sentence": "美術館で絵画を《カンショウ》する。",
  "grade": 1,
  "radicals": [
   "金（かねへん）",
   "貝（かい）"
  ]
 },
 {
  "id": "kwc0056",
  "ch": "含",
  "kanji": "含む",
  "sentence": "消費税を《フク》む値段だ。",
  "grade": 1,
  "radicals": [
   "口"
  ]
 },
 {
  "id": "kwc0057",
  "ch": "頑",
  "kanji": "頑張る",
  "sentence": "試験に向けて《ガンバ》る。",
  "grade": 1,
  "radicals": [
   "頁（おおがい）",
   "弓（ゆみへん）"
  ]
 },
 {
  "id": "kwc0058",
  "ch": "奇",
  "kanji": "奇跡",
  "sentence": "逆転勝利は《キセキ》だった。",
  "grade": 1,
  "radicals": [
   "大",
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0059",
  "ch": "祈",
  "kanji": "祈る",
  "sentence": "合格を《イノ》る。",
  "grade": 1,
  "radicals": [
   "示（しめすへん）"
  ]
 },
 {
  "id": "kwc0060",
  "ch": "鬼",
  "kanji": "鬼",
  "sentence": "節分に《オニ》のお面をかぶる。",
  "grade": 1,
  "radicals": [
   "鬼"
  ]
 },
 {
  "id": "kwc0061",
  "ch": "幾",
  "kanji": "幾つ",
  "sentence": "りんごを《イク》つか買う。",
  "grade": 1,
  "radicals": [
   "幺"
  ]
 },
 {
  "id": "kwc0062",
  "ch": "輝",
  "kanji": "輝く",
  "sentence": "星が夜空に《カガヤ》く。",
  "grade": 1,
  "radicals": [
   "車"
  ]
 },
 {
  "id": "kwc0063",
  "ch": "儀",
  "kanji": "儀式",
  "sentence": "卒業式は厳かな《ギシキ》だ。",
  "grade": 1,
  "radicals": [
   "人（にんべん）",
   "弋"
  ]
 },
 {
  "id": "kwc0064",
  "ch": "詰",
  "kanji": "詰",
  "sentence": "かばんに荷物を《ツ》める。",
  "grade": 1,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0065",
  "ch": "却",
  "kanji": "却下",
  "sentence": "提案が《キャッカ》された。",
  "grade": 1,
  "radicals": [
   "卩（ふしづくり）",
   "一"
  ]
 },
 {
  "id": "kwc0066",
  "ch": "脚",
  "kanji": "脚",
  "sentence": "机の《アシ》が一本折れた。",
  "grade": 1,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0067",
  "ch": "及",
  "kanji": "及",
  "sentence": "台風の被害は広範囲に《オヨ》んだ。",
  "grade": 1,
  "radicals": [
   "丿"
  ]
 },
 {
  "id": "kwc0068",
  "ch": "丘",
  "kanji": "丘",
  "sentence": "《オカ》の上から街を眺める。",
  "grade": 1,
  "radicals": [
   "一"
  ]
 },
 {
  "id": "kwc0069",
  "ch": "朽",
  "kanji": "朽",
  "sentence": "古い木の橋が《ク》ちている。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0070",
  "ch": "巨",
  "kanji": "巨大",
  "sentence": "《キョダイ》な岩が道をふさぐ。",
  "grade": 1,
  "radicals": [
   "工",
   "大"
  ]
 },
 {
  "id": "kwc0071",
  "ch": "拠",
  "kanji": "根拠",
  "sentence": "意見には《コンキョ》が必要だ。",
  "grade": 1,
  "radicals": [
   "木（きへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0072",
  "ch": "距",
  "kanji": "距離",
  "sentence": "学校までの《キョリ》を測る。",
  "grade": 1,
  "radicals": [
   "足（あしへん）",
   "隹（ふるとり）"
  ]
 },
 {
  "id": "kwc0073",
  "ch": "御",
  "kanji": "防御",
  "sentence": "バレーボールで《ボウギョ》を固める。",
  "grade": 1,
  "radicals": [
   "阜（こざとへん）",
   "彳（ぎょうにんべん）"
  ]
 },
 {
  "id": "kwc0074",
  "ch": "凶",
  "kanji": "凶作",
  "sentence": "天候不順で米が《キョウサク》になった。",
  "grade": 1,
  "radicals": [
   "凵",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0075",
  "ch": "叫",
  "kanji": "叫",
  "sentence": "山の上で大声で《サケ》ぶ。",
  "grade": 1,
  "radicals": [
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0076",
  "ch": "狂",
  "kanji": "熱狂",
  "sentence": "観客が試合に《ネッキョウ》する。",
  "grade": 1,
  "radicals": [
   "火（ひ）",
   "犬"
  ]
 },
 {
  "id": "kwc0077",
  "ch": "況",
  "kanji": "状況",
  "sentence": "今の《ジョウキョウ》を先生に説明する。",
  "grade": 1,
  "radicals": [
   "犬",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0078",
  "ch": "狭",
  "kanji": "狭",
  "sentence": "この部屋はとても《セマ》い。",
  "grade": 1,
  "radicals": [
   "犬"
  ]
 },
 {
  "id": "kwc0079",
  "ch": "恐",
  "kanji": "恐",
  "sentence": "暗闇を《オソ》れる。",
  "grade": 1,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0080",
  "ch": "響",
  "kanji": "響",
  "sentence": "教室に笑い声が《ヒビ》く。",
  "grade": 1,
  "radicals": [
   "音"
  ]
 },
 {
  "id": "kwc0081",
  "ch": "驚",
  "kanji": "驚",
  "sentence": "突然の知らせに《オドロ》く。",
  "grade": 1,
  "radicals": [
   "馬"
  ]
 },
 {
  "id": "kwc0082",
  "ch": "仰",
  "kanji": "仰",
  "sentence": "空を《アオ》いで深呼吸する。",
  "grade": 1,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0083",
  "ch": "駆",
  "kanji": "駆",
  "sentence": "校庭を全力で《カ》ける。",
  "grade": 1,
  "radicals": [
   "馬（うまへん）"
  ]
 },
 {
  "id": "kwc0084",
  "ch": "遇",
  "kanji": "待遇",
  "sentence": "アルバイトの《タイグウ》を調べる。",
  "grade": 1,
  "radicals": [
   "彳（ぎょうにんべん）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0085",
  "ch": "屈",
  "kanji": "屈伸",
  "sentence": "準備運動で《クッシン》をする。",
  "grade": 1,
  "radicals": [
   "尸（しかばね）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0086",
  "ch": "掘",
  "kanji": "掘",
  "sentence": "砂浜に穴を《ホ》る。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0087",
  "ch": "繰",
  "kanji": "繰",
  "sentence": "同じ問題を何度も《ク》り返す。",
  "grade": 1,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0088",
  "ch": "契",
  "kanji": "契約",
  "sentence": "携帯電話の新しい《ケイヤク》をする。",
  "grade": 1,
  "radicals": [
   "大",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0089",
  "ch": "恵",
  "kanji": "恵",
  "sentence": "自然の《メグ》みに感謝する。",
  "grade": 1,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0090",
  "ch": "傾",
  "kanji": "傾",
  "sentence": "台風で木が《カタム》いた。",
  "grade": 1,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0091",
  "ch": "携",
  "kanji": "携帯",
  "sentence": "《ケイタイ》電話で友達に連絡する。",
  "grade": 1,
  "radicals": [
   "手（てへん）",
   "巾（はば）"
  ]
 },
 {
  "id": "kwc0092",
  "ch": "継",
  "kanji": "継",
  "sentence": "祖父の店を父が《ツ》ぐ。",
  "grade": 1,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0093",
  "ch": "迎",
  "kanji": "迎",
  "sentence": "駅で友達を《ムカ》える。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0094",
  "ch": "撃",
  "kanji": "攻撃",
  "sentence": "相手チームの《コウゲキ》を防ぐ。",
  "grade": 1,
  "radicals": [
   "攴（ぼくにょう）",
   "手"
  ]
 },
 {
  "id": "kwc0095",
  "ch": "肩",
  "kanji": "肩",
  "sentence": "重い荷物で《カタ》が痛い。",
  "grade": 1,
  "radicals": [
   "肉"
  ]
 },
 {
  "id": "kwc0096",
  "ch": "兼",
  "kanji": "兼",
  "sentence": "部長が副部長を《カ》ねる。",
  "grade": 1,
  "radicals": [
   "八"
  ]
 },
 {
  "id": "kwc0097",
  "ch": "剣",
  "kanji": "剣道",
  "sentence": "週に二回《ケンドウ》を習う。",
  "grade": 1,
  "radicals": [
   "刀（りっとう）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0098",
  "ch": "軒",
  "kanji": "軒",
  "sentence": "《ノキ》先で雨宿りをする。",
  "grade": 1,
  "radicals": [
   "車（くるまへん）"
  ]
 },
 {
  "id": "kwc0099",
  "ch": "圏",
  "kanji": "圏内",
  "sentence": "電波の《ケンナイ》に入った。",
  "grade": 1,
  "radicals": [
   "囗（くにがまえ）",
   "冂（くにがまえ）"
  ]
 },
 {
  "id": "kwc0100",
  "ch": "堅",
  "kanji": "堅",
  "sentence": "このクルミの殻はとても《カタ》い。",
  "grade": 1,
  "radicals": [
   "土"
  ]
 },
 {
  "id": "kwc0101",
  "ch": "嫌",
  "kanji": "嫌",
  "sentence": "苦い野菜が《キラ》いだ。",
  "grade": 1,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0102",
  "ch": "遣",
  "kanji": "派遣",
  "sentence": "会社から《ハケン》社員が来る。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0103",
  "ch": "鍵",
  "kanji": "鍵",
  "sentence": "玄関の《カギ》をかける。",
  "grade": 1,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0104",
  "ch": "顕",
  "kanji": "顕著",
  "sentence": "練習の効果が《ケンチョ》に表れた。",
  "grade": 1,
  "radicals": [
   "頁（おおがい）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0105",
  "ch": "玄",
  "kanji": "玄関",
  "sentence": "《ゲンカン》で靴をそろえる。",
  "grade": 1,
  "radicals": [
   "玄",
   "門（もんがまえ）"
  ]
 },
 {
  "id": "kwc0106",
  "ch": "虎",
  "kanji": "虎",
  "sentence": "動物園で《トラ》を見る。",
  "grade": 1,
  "radicals": [
   "虍（とらかんむり）"
  ]
 },
 {
  "id": "kwc0107",
  "ch": "枯",
  "kanji": "枯",
  "sentence": "庭の花が《カ》れてしまった。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0108",
  "ch": "誇",
  "kanji": "誇",
  "sentence": "地元の祭りを《ホコ》りに思う。",
  "grade": 1,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0109",
  "ch": "鼓",
  "kanji": "太鼓",
  "sentence": "祭りで《タイコ》をたたく。",
  "grade": 1,
  "radicals": [
   "大",
   "鼓"
  ]
 },
 {
  "id": "kwc0110",
  "ch": "互",
  "kanji": "互",
  "sentence": "困ったときは《タガ》いに助け合う。",
  "grade": 1,
  "radicals": [
   "二"
  ]
 },
 {
  "id": "kwc0111",
  "ch": "悟",
  "kanji": "悟",
  "sentence": "失敗して自分の間違いを《サト》る。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0112",
  "ch": "巧",
  "kanji": "巧妙",
  "sentence": "犯人の手口は《コウミョウ》だった。",
  "grade": 1,
  "radicals": [
   "工",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0113",
  "ch": "抗",
  "kanji": "抗議",
  "sentence": "校則の変更に《コウギ》する。",
  "grade": 1,
  "radicals": [
   "手（てへん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0114",
  "ch": "攻",
  "kanji": "攻略",
  "sentence": "ゲームの《コウリャク》法を調べる。",
  "grade": 1,
  "radicals": [
   "攴（ぼくにょう）",
   "田"
  ]
 },
 {
  "id": "kwc0115",
  "ch": "更",
  "kanji": "更新",
  "sentence": "ホームページを《コウシン》する。",
  "grade": 1,
  "radicals": [
   "曰",
   "斤（おのづくり）"
  ]
 },
 {
  "id": "kwc0116",
  "ch": "肯",
  "kanji": "肯定",
  "sentence": "友達の意見を《コウテイ》する。",
  "grade": 1,
  "radicals": [
   "肉",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0117",
  "ch": "恒",
  "kanji": "恒例",
  "sentence": "これは毎年《コウレイ》の行事だ。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0118",
  "ch": "荒",
  "kanji": "荒",
  "sentence": "台風で天気が《アレ》る。",
  "grade": 1,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0119",
  "ch": "郊",
  "kanji": "郊外",
  "sentence": "《コウガイ》に新しい家が建った。",
  "grade": 1,
  "radicals": [
   "邑（おおざと）",
   "夕"
  ]
 },
 {
  "id": "kwc0120",
  "ch": "項",
  "kanji": "項目",
  "sentence": "契約書の《コウモク》を確認する。",
  "grade": 1,
  "radicals": [
   "頁（おおがい）",
   "目"
  ]
 },
 {
  "id": "kwc0121",
  "ch": "稿",
  "kanji": "原稿",
  "sentence": "作文の《ゲンコウ》を書き直す。",
  "grade": 1,
  "radicals": [
   "厂（がんだれ）",
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0122",
  "ch": "豪",
  "kanji": "豪雨",
  "sentence": "《ゴウウ》で川が増水した。",
  "grade": 1,
  "radicals": [
   "豕",
   "雨"
  ]
 },
 {
  "id": "kwc0123",
  "ch": "込",
  "kanji": "込",
  "sentence": "朝の電車はいつも《コ》んでいる。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0124",
  "ch": "頃",
  "kanji": "頃",
  "sentence": "子どもの《コロ》の思い出を話す。",
  "grade": 1,
  "radicals": [
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc0125",
  "ch": "婚",
  "kanji": "結婚",
  "sentence": "来年、姉が《ケッコン》する。",
  "grade": 1,
  "radicals": [
   "糸（いとへん）",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0126",
  "ch": "鎖",
  "kanji": "鎖",
  "sentence": "犬を《クサリ》でつないだ。",
  "grade": 1,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0127",
  "ch": "砕",
  "kanji": "砕く",
  "sentence": "岩をハンマーで《クダ》く。",
  "grade": 1,
  "radicals": [
   "石（いしへん）"
  ]
 },
 {
  "id": "kwc0128",
  "ch": "彩",
  "kanji": "彩る",
  "sentence": "紅葉が山を《イロド》る。",
  "grade": 1,
  "radicals": [
   "彡（さんづくり）"
  ]
 },
 {
  "id": "kwc0129",
  "ch": "歳",
  "kanji": "歳",
  "sentence": "弟は今年で十《サイ》になる。",
  "grade": 1,
  "radicals": [
   "止"
  ]
 },
 {
  "id": "kwc0130",
  "ch": "載",
  "kanji": "掲載",
  "sentence": "作文が新聞に《ケイサイ》された。",
  "grade": 1,
  "radicals": [
   "手（てへん）",
   "車"
  ]
 },
 {
  "id": "kwc0131",
  "ch": "剤",
  "kanji": "洗剤",
  "sentence": "食器を《センザイ》で洗う。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0132",
  "ch": "咲",
  "kanji": "咲く",
  "sentence": "桜の花が《サ》く。",
  "grade": 1,
  "radicals": [
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0133",
  "ch": "拶",
  "kanji": "挨拶",
  "sentence": "近所の人に元気よく《アイサツ》する。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0134",
  "ch": "撮",
  "kanji": "撮影",
  "sentence": "修学旅行で写真を《サツエイ》した。",
  "grade": 1,
  "radicals": [
   "手（てへん）",
   "彡（さんづくり）"
  ]
 },
 {
  "id": "kwc0135",
  "ch": "旨",
  "kanji": "趣旨",
  "sentence": "説明の《シュシ》をまとめる。",
  "grade": 1,
  "radicals": [
   "走（そうにょう）",
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0136",
  "ch": "伺",
  "kanji": "伺う",
  "sentence": "先生に用件を《ウカガ》う。",
  "grade": 1,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0137",
  "ch": "刺",
  "kanji": "刺す",
  "sentence": "蜂が腕を《サ》した。",
  "grade": 1,
  "radicals": [
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0138",
  "ch": "脂",
  "kanji": "脂",
  "sentence": "この料理は《アブラ》が多い。",
  "grade": 1,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0139",
  "ch": "紫",
  "kanji": "紫",
  "sentence": "夕方、空が《ムラサキ》に染まった。",
  "grade": 1,
  "radicals": [
   "糸"
  ]
 },
 {
  "id": "kwc0140",
  "ch": "執",
  "kanji": "執筆",
  "sentence": "作家が小説を《シッピツ》する。",
  "grade": 1,
  "radicals": [
   "土",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0141",
  "ch": "芝",
  "kanji": "芝生",
  "sentence": "公園の《シバフ》で遊んだ。",
  "grade": 1,
  "radicals": [
   "艸（くさかんむり）",
   "生"
  ]
 },
 {
  "id": "kwc0142",
  "ch": "斜",
  "kanji": "斜め",
  "sentence": "線を《ナナ》めに引く。",
  "grade": 1,
  "radicals": [
   "斗"
  ]
 },
 {
  "id": "kwc0143",
  "ch": "煮",
  "kanji": "煮る",
  "sentence": "鍋で野菜を《ニ》る。",
  "grade": 1,
  "radicals": [
   "火（ひ）"
  ]
 },
 {
  "id": "kwc0144",
  "ch": "遮",
  "kanji": "遮る",
  "sentence": "カーテンで日差しを《サエギ》る。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0145",
  "ch": "釈",
  "kanji": "解釈",
  "sentence": "詩の意味を自分なりに《カイシャク》する。",
  "grade": 1,
  "radicals": [
   "角（つのへん）",
   "釆（のごめへん）"
  ]
 },
 {
  "id": "kwc0146",
  "ch": "寂",
  "kanji": "寂しい",
  "sentence": "一人で留守番するのは《サビ》しい。",
  "grade": 1,
  "radicals": [
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0147",
  "ch": "朱",
  "kanji": "朱色",
  "sentence": "夕焼けが《シュイロ》に染まる。",
  "grade": 1,
  "radicals": [
   "木",
   "色"
  ]
 },
 {
  "id": "kwc0148",
  "ch": "狩",
  "kanji": "狩り",
  "sentence": "山でウサギの《カリ》をする。",
  "grade": 1,
  "radicals": [
   "犬"
  ]
 },
 {
  "id": "kwc0149",
  "ch": "趣",
  "kanji": "趣味",
  "sentence": "私の《シュミ》は読書だ。",
  "grade": 1,
  "radicals": [
   "走（そうにょう）",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0150",
  "ch": "需",
  "kanji": "需要",
  "sentence": "この商品は《ジュヨウ》が高い。",
  "grade": 1,
  "radicals": [
   "雨（あめかんむり）",
   "襾"
  ]
 },
 {
  "id": "kwc0151",
  "ch": "囚",
  "kanji": "囚人",
  "sentence": "昔の物語に《シュウジン》が登場する。",
  "grade": 1,
  "radicals": [
   "囗（くにがまえ）",
   "人"
  ]
 },
 {
  "id": "kwc0152",
  "ch": "舟",
  "kanji": "舟",
  "sentence": "川で《フネ》に乗って渡った。",
  "grade": 1,
  "radicals": [
   "舟"
  ]
 },
 {
  "id": "kwc0153",
  "ch": "秀",
  "kanji": "優秀",
  "sentence": "兄はクラスで《ユウシュウ》な生徒だ。",
  "grade": 1,
  "radicals": [
   "人（にんべん）",
   "禾"
  ]
 },
 {
  "id": "kwc0154",
  "ch": "襲",
  "kanji": "襲う",
  "sentence": "台風が町を《オソ》った。",
  "grade": 2,
  "radicals": [
   "衣（ころも）"
  ]
 },
 {
  "id": "kwc0155",
  "ch": "柔",
  "kanji": "柔道",
  "sentence": "兄は《ジュウドウ》部に入っている。",
  "grade": 1,
  "radicals": [
   "木（き）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0156",
  "ch": "渋",
  "kanji": "渋い",
  "sentence": "このお茶は少し《シブ》い。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0157",
  "ch": "獣",
  "kanji": "怪獣",
  "sentence": "弟は《カイジュウ》の映画が好きだ。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）",
   "犬"
  ]
 },
 {
  "id": "kwc0158",
  "ch": "瞬",
  "kanji": "瞬間",
  "sentence": "シャッターを切る《シュンカン》を待つ。",
  "grade": 1,
  "radicals": [
   "目（めへん）",
   "門（もんがまえ）"
  ]
 },
 {
  "id": "kwc0159",
  "ch": "旬",
  "kanji": "旬",
  "sentence": "今は桃が《シュン》の果物だ。",
  "grade": 1,
  "radicals": [
   "日"
  ]
 },
 {
  "id": "kwc0160",
  "ch": "巡",
  "kanji": "巡る",
  "sentence": "バスで観光地を《メグ》る。",
  "grade": 1,
  "radicals": [
   "巛"
  ]
 },
 {
  "id": "kwc0161",
  "ch": "盾",
  "kanji": "盾",
  "sentence": "昔の武士は《タテ》を持って戦った。",
  "grade": 1,
  "radicals": [
   "目"
  ]
 },
 {
  "id": "kwc0162",
  "ch": "循",
  "kanji": "循環",
  "sentence": "血液が体内を《ジュンカン》する。",
  "grade": 1,
  "radicals": [
   "彳（ぎょうにんべん）",
   "玉"
  ]
 },
 {
  "id": "kwc0163",
  "ch": "潤",
  "kanji": "潤う",
  "sentence": "雨で乾いた畑が《ウルオ》う。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0164",
  "ch": "庶",
  "kanji": "庶民",
  "sentence": "江戸時代の《ショミン》の暮らしを調べた。",
  "grade": 1,
  "radicals": [
   "广（まだれ）",
   "氏"
  ]
 },
 {
  "id": "kwc0165",
  "ch": "如",
  "kanji": "突如",
  "sentence": "晴れていた空が、《トツジョ》曇り始めた。",
  "grade": 1,
  "radicals": [
   "穴（あなかんむり）",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0166",
  "ch": "召",
  "kanji": "召集",
  "sentence": "委員会のために全員が《ショウシュウ》された。",
  "grade": 1,
  "radicals": [
   "口",
   "隹"
  ]
 },
 {
  "id": "kwc0167",
  "ch": "床",
  "kanji": "床",
  "sentence": "教室の《ユカ》をきれいに掃除した。",
  "grade": 1,
  "radicals": [
   "广（まだれ）"
  ]
 },
 {
  "id": "kwc0168",
  "ch": "尚",
  "kanji": "尚更",
  "sentence": "雨が降り出し、《ナオサラ》寒く感じた。",
  "grade": 1,
  "radicals": [
   "小",
   "曰"
  ]
 },
 {
  "id": "kwc0169",
  "ch": "昇",
  "kanji": "上昇",
  "sentence": "気温がぐんぐん《ジョウショウ》する。",
  "grade": 1,
  "radicals": [
   "一",
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0170",
  "ch": "沼",
  "kanji": "沼",
  "sentence": "森の奥に大きな《ヌマ》があった。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0171",
  "ch": "症",
  "kanji": "症状",
  "sentence": "風邪の《ショウジョウ》が出てきた。",
  "grade": 1,
  "radicals": [
   "疒（やまいだれ）",
   "犬"
  ]
 },
 {
  "id": "kwc0172",
  "ch": "称",
  "kanji": "名称",
  "sentence": "新しい部活動の《メイショウ》を決めた。",
  "grade": 1,
  "radicals": [
   "口",
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0173",
  "ch": "紹",
  "kanji": "紹介",
  "sentence": "クラスの前で自己《ショウカイ》をした。",
  "grade": 1,
  "radicals": [
   "糸（いとへん）",
   "人"
  ]
 },
 {
  "id": "kwc0174",
  "ch": "詳",
  "kanji": "詳細",
  "sentence": "行事の《ショウサイ》をプリントで確認する。",
  "grade": 1,
  "radicals": [
   "言（ごんべん）",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0175",
  "ch": "丈",
  "kanji": "丈夫",
  "sentence": "このかばんはとても《ジョウブ》だ。",
  "grade": 1,
  "radicals": [
   "一",
   "大"
  ]
 },
 {
  "id": "kwc0176",
  "ch": "冗",
  "kanji": "冗談",
  "sentence": "友達が《ジョウダン》を言って笑わせた。",
  "grade": 1,
  "radicals": [
   "冖（わかんむり）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0177",
  "ch": "剰",
  "kanji": "過剰",
  "sentence": "荷物が《カジョウ》にならないよう気をつけた。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）",
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0178",
  "ch": "醸",
  "kanji": "醸造",
  "sentence": "この蔵では日本酒を《ジョウゾウ》している。",
  "grade": 1,
  "radicals": [
   "酉（とりへん）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0179",
  "ch": "殖",
  "kanji": "繁殖",
  "sentence": "メダカが水槽の中で《ハンショク》した。",
  "grade": 1,
  "radicals": [
   "糸",
   "歹"
  ]
 },
 {
  "id": "kwc0180",
  "ch": "飾",
  "kanji": "飾る",
  "sentence": "教室を花で《カザ》る。",
  "grade": 1,
  "radicals": [
   "食（しょくへん）"
  ]
 },
 {
  "id": "kwc0181",
  "ch": "触",
  "kanji": "触る",
  "sentence": "展示品には《サワ》らないでください。",
  "grade": 1,
  "radicals": [
   "角（つのへん）"
  ]
 },
 {
  "id": "kwc0182",
  "ch": "侵",
  "kanji": "侵入",
  "sentence": "泥棒が家に《シンニュウ》した。",
  "grade": 1,
  "radicals": [
   "人（にんべん）",
   "入"
  ]
 },
 {
  "id": "kwc0183",
  "ch": "津",
  "kanji": "津波",
  "sentence": "地震のあと《ツナミ》の警報が出た。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0184",
  "ch": "振",
  "kanji": "振る",
  "sentence": "手を大きく《フ》って別れを告げた。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0185",
  "ch": "浸",
  "kanji": "浸す",
  "sentence": "タオルを水に《ヒタ》す。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0186",
  "ch": "診",
  "kanji": "診察",
  "sentence": "熱があったので病院で《シンサツ》を受けた。",
  "grade": 1,
  "radicals": [
   "言（ごんべん）",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0187",
  "ch": "寝",
  "kanji": "寝る",
  "sentence": "夜の十時に《ネ》る。",
  "grade": 1,
  "radicals": [
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0188",
  "ch": "慎",
  "kanji": "慎重",
  "sentence": "テストの前に《シンチョウ》に見直す。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）",
   "里"
  ]
 },
 {
  "id": "kwc0189",
  "ch": "震",
  "kanji": "震える",
  "sentence": "寒くて体が《フル》える。",
  "grade": 1,
  "radicals": [
   "雨（あめかんむり）"
  ]
 },
 {
  "id": "kwc0190",
  "ch": "尽",
  "kanji": "尽くす",
  "sentence": "チームのために力を《ツ》くす。",
  "grade": 1,
  "radicals": [
   "尸"
  ]
 },
 {
  "id": "kwc0191",
  "ch": "迅",
  "kanji": "迅速",
  "sentence": "先生は《ジンソク》に対応した。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0192",
  "ch": "陣",
  "kanji": "陣地",
  "sentence": "味方の《ジンチ》を守る。",
  "grade": 1,
  "radicals": [
   "阜（こざとへん）",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0193",
  "ch": "吹",
  "kanji": "吹く",
  "sentence": "強い風が《フ》く。",
  "grade": 1,
  "radicals": [
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0194",
  "ch": "衰",
  "kanji": "衰える",
  "sentence": "けがをしてから体力が《オトロ》える。",
  "grade": 1,
  "radicals": [
   "衣（ころも）"
  ]
 },
 {
  "id": "kwc0195",
  "ch": "酔",
  "kanji": "酔う",
  "sentence": "バスに乗って《ヨ》う。",
  "grade": 1,
  "radicals": [
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0196",
  "ch": "遂",
  "kanji": "遂げる",
  "sentence": "部活の目標を《ト》げる。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0197",
  "ch": "随",
  "kanji": "随筆",
  "sentence": "国語の授業で《ズイヒツ》を書く。",
  "grade": 1,
  "radicals": [
   "阜",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0198",
  "ch": "杉",
  "kanji": "杉",
  "sentence": "庭に《スギ》の木を植える。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0199",
  "ch": "是",
  "kanji": "是非",
  "sentence": "《ゼヒ》一度、文化祭に来てください。",
  "grade": 1,
  "radicals": [
   "日（ひ）",
   "非"
  ]
 },
 {
  "id": "kwc0200",
  "ch": "姓",
  "kanji": "姓名",
  "sentence": "用紙に《セイメイ》を書く。",
  "grade": 1,
  "radicals": [
   "女（おんなへん）",
   "口"
  ]
 },
 {
  "id": "kwc0201",
  "ch": "征",
  "kanji": "征服",
  "sentence": "物語の中で王が国を《セイフク》した。",
  "grade": 1,
  "radicals": [
   "彳（ぎょうにんべん）",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0202",
  "ch": "誓",
  "kanji": "誓う",
  "sentence": "友達と友情を《チカ》う。",
  "grade": 1,
  "radicals": [
   "言"
  ]
 },
 {
  "id": "kwc0203",
  "ch": "析",
  "kanji": "分析",
  "sentence": "アンケートの結果を《ブンセキ》する。",
  "grade": 1,
  "radicals": [
   "刀",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0204",
  "ch": "跡",
  "kanji": "足跡",
  "sentence": "雪の上に《アシアト》が残る。",
  "grade": 1,
  "radicals": [
   "足",
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0205",
  "ch": "仙",
  "kanji": "仙人",
  "sentence": "山の奥に《センニン》が住むという伝説がある。",
  "grade": 1,
  "radicals": [
   "人（にんべん）",
   "人"
  ]
 },
 {
  "id": "kwc0206",
  "ch": "占",
  "kanji": "占う",
  "sentence": "友達が今日の運勢を《ウラナ》う。",
  "grade": 1,
  "radicals": [
   "卜"
  ]
 },
 {
  "id": "kwc0207",
  "ch": "扇",
  "kanji": "扇",
  "sentence": "夏祭りで《オウギ》であおぐ。",
  "grade": 1,
  "radicals": [
   "戸（とだれ）"
  ]
 },
 {
  "id": "kwc0208",
  "ch": "腺",
  "kanji": "汗腺",
  "sentence": "運動すると《カンセン》から汗が出る。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0209",
  "ch": "践",
  "kanji": "実践",
  "sentence": "習った勉強法を《ジッセン》する。",
  "grade": 1,
  "radicals": [
   "宀（うかんむり）",
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0210",
  "ch": "潜",
  "kanji": "潜る",
  "sentence": "プールに《モグ》る。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0211",
  "ch": "鮮",
  "kanji": "新鮮",
  "sentence": "朝どれの《シンセン》な野菜を食べる。",
  "grade": 1,
  "radicals": [
   "斤（おのづくり）",
   "魚（うおへん）"
  ]
 },
 {
  "id": "kwc0212",
  "ch": "狙",
  "kanji": "狙う",
  "sentence": "バスケでゴールを《ネラ》う。",
  "grade": 1,
  "radicals": [
   "犬"
  ]
 },
 {
  "id": "kwc0213",
  "ch": "阻",
  "kanji": "阻止",
  "sentence": "相手のシュートを《ソシ》する。",
  "grade": 1,
  "radicals": [
   "阜（こざとへん）",
   "止"
  ]
 },
 {
  "id": "kwc0214",
  "ch": "租",
  "kanji": "租税",
  "sentence": "社会の授業で《ソゼイ》について学ぶ。",
  "grade": 1,
  "radicals": [
   "禾（のぎへん）",
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0215",
  "ch": "疎",
  "kanji": "疎か",
  "sentence": "部活を理由に勉強を《オロソカ》にしない。",
  "grade": 1,
  "radicals": [
   "疋"
  ]
 },
 {
  "id": "kwc0216",
  "ch": "訴",
  "kanji": "訴える",
  "sentence": "体の痛みを先生に《ウッタ》える。",
  "grade": 1,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0217",
  "ch": "僧",
  "kanji": "僧侶",
  "sentence": "旅行先のお寺で《ソウリョ》に会った。",
  "grade": 1,
  "radicals": [
   "人（にんべん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0218",
  "ch": "遭",
  "kanji": "遭遇",
  "sentence": "山道でシカに《ソウグウ》した。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0219",
  "ch": "燥",
  "kanji": "乾燥",
  "sentence": "冬は空気が《カンソウ》する。",
  "grade": 1,
  "radicals": [
   "乙",
   "火（ひへん）"
  ]
 },
 {
  "id": "kwc0220",
  "ch": "騒",
  "kanji": "騒ぐ",
  "sentence": "教室で大きな声で《サワ》ぐと注意される。",
  "grade": 1,
  "radicals": [
   "馬（うまへん）"
  ]
 },
 {
  "id": "kwc0221",
  "ch": "贈",
  "kanji": "贈る",
  "sentence": "友達に誕生日プレゼントを《オク》る。",
  "grade": 1,
  "radicals": [
   "貝（かいへん）"
  ]
 },
 {
  "id": "kwc0222",
  "ch": "即",
  "kanji": "即答",
  "sentence": "質問にすぐ《ソクトウ》する。",
  "grade": 1,
  "radicals": [
   "卩（ふしづくり）",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0223",
  "ch": "促",
  "kanji": "促す",
  "sentence": "先生が提出物の提出を《ウナガ》す。",
  "grade": 1,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0224",
  "ch": "捉",
  "kanji": "捉える",
  "sentence": "文章の要点を《トラ》える。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0225",
  "ch": "俗",
  "kanji": "俗語",
  "sentence": "友達同士で《ゾクゴ》を使う。",
  "grade": 1,
  "radicals": [
   "人（にんべん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0226",
  "ch": "妥",
  "kanji": "妥当",
  "sentence": "この意見は《ダトウ》だと思う。",
  "grade": 1,
  "radicals": [
   "女（おんな）",
   "小"
  ]
 },
 {
  "id": "kwc0227",
  "ch": "耐",
  "kanji": "耐える",
  "sentence": "苦しい練習に《タ》える。",
  "grade": 1,
  "radicals": [
   "而"
  ]
 },
 {
  "id": "kwc0228",
  "ch": "替",
  "kanji": "替える",
  "sentence": "玄関で上履きに《カ》える。",
  "grade": 1,
  "radicals": [
   "曰"
  ]
 },
 {
  "id": "kwc0229",
  "ch": "滞",
  "kanji": "渋滞",
  "sentence": "駅前の道路が《ジュウタイ》している。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0230",
  "ch": "沢",
  "kanji": "沢山",
  "sentence": "今日は宿題が《タクサン》ある。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "山"
  ]
 },
 {
  "id": "kwc0231",
  "ch": "卓",
  "kanji": "卓球",
  "sentence": "放課後に体育館で《タッキュウ》をする。",
  "grade": 1,
  "radicals": [
   "十",
   "玉"
  ]
 },
 {
  "id": "kwc0232",
  "ch": "拓",
  "kanji": "開拓",
  "sentence": "新しい趣味の分野を《カイタク》する。",
  "grade": 1,
  "radicals": [
   "門（もんがまえ）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0233",
  "ch": "脱",
  "kanji": "脱ぐ",
  "sentence": "玄関で靴を《ヌ》ぐ。",
  "grade": 1,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0234",
  "ch": "誰",
  "kanji": "誰",
  "sentence": "《ダレ》がこの本を書いたのか調べる。",
  "grade": 1,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0235",
  "ch": "丹",
  "kanji": "丹念",
  "sentence": "ノートを《タンネン》にまとめる。",
  "grade": 1,
  "radicals": [
   "丶",
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0236",
  "ch": "淡",
  "kanji": "淡い",
  "sentence": "夕方の空が《アワ》い色に染まる。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0237",
  "ch": "嘆",
  "kanji": "嘆く",
  "sentence": "試合に負けたことを《ナゲ》く。",
  "grade": 1,
  "radicals": [
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0238",
  "ch": "端",
  "kanji": "端",
  "sentence": "廊下の《ハシ》を静かに歩く。",
  "grade": 1,
  "radicals": [
   "立"
  ]
 },
 {
  "id": "kwc0239",
  "ch": "弾",
  "kanji": "弾む",
  "sentence": "新しいボールはよく《ハズ》む。",
  "grade": 1,
  "radicals": [
   "弓（ゆみへん）"
  ]
 },
 {
  "id": "kwc0240",
  "ch": "恥",
  "kanji": "恥ずかしい",
  "sentence": "人前で転んで《ハズ》かしい。",
  "grade": 1,
  "radicals": [
   "心"
  ]
 },
 {
  "id": "kwc0241",
  "ch": "致",
  "kanji": "一致",
  "sentence": "クラス全員の意見が《イッチ》した。",
  "grade": 1,
  "radicals": [
   "一",
   "至"
  ]
 },
 {
  "id": "kwc0242",
  "ch": "遅",
  "kanji": "遅れる",
  "sentence": "事故で電車が《オク》れる。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0243",
  "ch": "蓄",
  "kanji": "蓄える",
  "sentence": "災害に備えて非常食を《タクワ》える。",
  "grade": 1,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0244",
  "ch": "抽",
  "kanji": "抽選",
  "sentence": "イベントの《チュウセン》に当たった。",
  "grade": 1,
  "radicals": [
   "手（てへん）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0245",
  "ch": "挑",
  "kanji": "挑戦",
  "sentence": "自己ベストの記録に《チョウセン》する。",
  "grade": 1,
  "radicals": [
   "手（てへん）",
   "戈（ほこ）"
  ]
 },
 {
  "id": "kwc0246",
  "ch": "眺",
  "kanji": "眺める",
  "sentence": "教室の窓から景色を《ナガ》める。",
  "grade": 1,
  "radicals": [
   "目（めへん）"
  ]
 },
 {
  "id": "kwc0247",
  "ch": "跳",
  "kanji": "跳ぶ",
  "sentence": "体育の授業で高く《ト》ぶ練習をする。",
  "grade": 1,
  "radicals": [
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0248",
  "ch": "徴",
  "kanji": "特徴",
  "sentence": "この動物の《トクチョウ》を調べる。",
  "grade": 1,
  "radicals": [
   "牛（うしへん）",
   "彳（ぎょうにんべん）"
  ]
 },
 {
  "id": "kwc0249",
  "ch": "澄",
  "kanji": "澄む",
  "sentence": "山の空気が《ス》んでいる。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0250",
  "ch": "沈",
  "kanji": "沈む",
  "sentence": "夕日が海に《シズ》む。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0251",
  "ch": "珍",
  "kanji": "珍しい",
  "sentence": "図書館で《メズラ》しい本を見つけた。",
  "grade": 1,
  "radicals": [
   "玉"
  ]
 },
 {
  "id": "kwc0252",
  "ch": "抵",
  "kanji": "抵抗",
  "sentence": "新しい規則に《テイコウ》を感じる。",
  "grade": 1,
  "radicals": [
   "手（てへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0253",
  "ch": "堤",
  "kanji": "堤防",
  "sentence": "台風に備えて《テイボウ》を点検する。",
  "grade": 1,
  "radicals": [
   "土（つちへん）",
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0254",
  "ch": "摘",
  "kanji": "摘む",
  "sentence": "花を《ツ》む。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0255",
  "ch": "滴",
  "kanji": "滴る",
  "sentence": "汗が額から《シタタ》る。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0256",
  "ch": "添",
  "kanji": "添える",
  "sentence": "手紙にカードを《ソ》える。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0257",
  "ch": "殿",
  "kanji": "殿様",
  "sentence": "昔話に《トノサマ》が登場する。",
  "grade": 1,
  "radicals": [
   "殳",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0258",
  "ch": "吐",
  "kanji": "吐く",
  "sentence": "大きく息を《ハ》く。",
  "grade": 1,
  "radicals": [
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0259",
  "ch": "途",
  "kanji": "途中",
  "sentence": "帰り道の《トチュウ》で雨が降った。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）",
   "丨"
  ]
 },
 {
  "id": "kwc0260",
  "ch": "渡",
  "kanji": "渡る",
  "sentence": "横断歩道を《ワタ》る。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0261",
  "ch": "奴",
  "kanji": "奴隷",
  "sentence": "歴史の授業で《ドレイ》制度を学んだ。",
  "grade": 1,
  "radicals": [
   "女（おんなへん）",
   "隶（れいづくり）"
  ]
 },
 {
  "id": "kwc0262",
  "ch": "怒",
  "kanji": "怒る",
  "sentence": "先生が《オコ》る。",
  "grade": 1,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0263",
  "ch": "到",
  "kanji": "到着",
  "sentence": "電車が駅に《トウチャク》する。",
  "grade": 1,
  "radicals": [
   "刀（りっとう）",
   "目"
  ]
 },
 {
  "id": "kwc0264",
  "ch": "逃",
  "kanji": "逃げる",
  "sentence": "犬から《ニ》げる。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0265",
  "ch": "倒",
  "kanji": "倒れる",
  "sentence": "強風で木が《タオ》れる。",
  "grade": 1,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0266",
  "ch": "唐",
  "kanji": "唐突",
  "sentence": "彼の《トウトツ》な発言に驚いた。",
  "grade": 1,
  "radicals": [
   "口",
   "穴（あなかんむり）"
  ]
 },
 {
  "id": "kwc0267",
  "ch": "桃",
  "kanji": "桃",
  "sentence": "おやつに《モモ》を食べた。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0268",
  "ch": "透",
  "kanji": "透明",
  "sentence": "水槽の水はとても《トウメイ》だ。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）",
   "日（ひへん）"
  ]
 },
 {
  "id": "kwc0269",
  "ch": "盗",
  "kanji": "盗む",
  "sentence": "財布を《ヌス》む。",
  "grade": 1,
  "radicals": [
   "皿（さら）"
  ]
 },
 {
  "id": "kwc0270",
  "ch": "陶",
  "kanji": "陶器",
  "sentence": "お店で《トウキ》のお皿を買った。",
  "grade": 2,
  "radicals": [
   "阜（こざとへん）",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0271",
  "ch": "稲",
  "kanji": "稲",
  "sentence": "田んぼの《イネ》が育った。",
  "grade": 1,
  "radicals": [
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0272",
  "ch": "踏",
  "kanji": "踏む",
  "sentence": "電車で人に足を《フ》まれた。",
  "grade": 1,
  "radicals": [
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0273",
  "ch": "闘",
  "kanji": "闘う",
  "sentence": "病気と《タタカ》う。",
  "grade": 1,
  "radicals": [
   "門（もんがまえ）"
  ]
 },
 {
  "id": "kwc0274",
  "ch": "胴",
  "kanji": "胴",
  "sentence": "剣道の練習で《ドウ》を打つ。",
  "grade": 1,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0275",
  "ch": "突",
  "kanji": "突然",
  "sentence": "《トツゼン》大声で笑いだした。",
  "grade": 1,
  "radicals": [
   "穴（あなかんむり）",
   "火（ひ）"
  ]
 },
 {
  "id": "kwc0276",
  "ch": "鈍",
  "kanji": "鈍い",
  "sentence": "反応が《ニブ》い。",
  "grade": 1,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0277",
  "ch": "弐",
  "kanji": "弐",
  "sentence": "お祝いの袋に「金《ニ》万円」と書く。",
  "grade": 2,
  "radicals": [
   "弋"
  ]
 },
 {
  "id": "kwc0278",
  "ch": "悩",
  "kanji": "悩む",
  "sentence": "進路について《ナヤ》む。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0279",
  "ch": "濃",
  "kanji": "濃い",
  "sentence": "今日は霧が《コ》い。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0280",
  "ch": "杯",
  "kanji": "乾杯",
  "sentence": "誕生日会で《カンパイ》をした。",
  "grade": 1,
  "radicals": [
   "乙",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0281",
  "ch": "廃",
  "kanji": "廃止",
  "sentence": "古い校則が《ハイシ》された。",
  "grade": 1,
  "radicals": [
   "广（まだれ）",
   "止"
  ]
 },
 {
  "id": "kwc0282",
  "ch": "輩",
  "kanji": "先輩",
  "sentence": "部活の《センパイ》に相談した。",
  "grade": 1,
  "radicals": [
   "八",
   "車"
  ]
 },
 {
  "id": "kwc0283",
  "ch": "培",
  "kanji": "培う",
  "sentence": "経験を《ツチカ》う。",
  "grade": 1,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0284",
  "ch": "拍",
  "kanji": "拍手",
  "sentence": "発表のあとに《ハクシュ》が起きた。",
  "grade": 1,
  "radicals": [
   "手（てへん）",
   "手"
  ]
 },
 {
  "id": "kwc0285",
  "ch": "泊",
  "kanji": "泊まる",
  "sentence": "友達の家に《ト》まる。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0286",
  "ch": "迫",
  "kanji": "迫力",
  "sentence": "映画の《ハクリョク》に驚いた。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）",
   "力"
  ]
 },
 {
  "id": "kwc0287",
  "ch": "薄",
  "kanji": "薄い",
  "sentence": "みそ汁の味が《ウス》い。",
  "grade": 1,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0288",
  "ch": "爆",
  "kanji": "爆発",
  "sentence": "実験中に風船が《バクハツ》した。",
  "grade": 1,
  "radicals": [
   "火（ひへん）",
   "癶（はつがしら）"
  ]
 },
 {
  "id": "kwc0289",
  "ch": "抜",
  "kanji": "抜く",
  "sentence": "雑草を《ヌ》く。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0290",
  "ch": "罰",
  "kanji": "罰",
  "sentence": "遅刻すると《バツ》を受ける。",
  "grade": 1,
  "radicals": [
   "网（あみがしら）"
  ]
 },
 {
  "id": "kwc0291",
  "ch": "般",
  "kanji": "一般",
  "sentence": "これは《イッパン》的なやり方だ。",
  "grade": 1,
  "radicals": [
   "一",
   "舟（ふねへん）"
  ]
 },
 {
  "id": "kwc0292",
  "ch": "販",
  "kanji": "販売",
  "sentence": "文化祭でジュースを《ハンバイ》する。",
  "grade": 1,
  "radicals": [
   "貝（かいへん）",
   "土"
  ]
 },
 {
  "id": "kwc0293",
  "ch": "範",
  "kanji": "範囲",
  "sentence": "テストの《ハンイ》を確認する。",
  "grade": 1,
  "radicals": [
   "竹（たけかんむり）",
   "囗（くにがまえ）"
  ]
 },
 {
  "id": "kwc0294",
  "ch": "盤",
  "kanji": "円盤",
  "sentence": "空に《エンバン》のような雲を見た。",
  "grade": 1,
  "radicals": [
   "囗（くにがまえ）",
   "皿（さら）"
  ]
 },
 {
  "id": "kwc0295",
  "ch": "彼",
  "kanji": "彼",
  "sentence": "《カレ》はサッカー部だ。",
  "grade": 1,
  "radicals": [
   "彳（ぎょうにんべん）"
  ]
 },
 {
  "id": "kwc0296",
  "ch": "疲",
  "kanji": "疲れる",
  "sentence": "部活で《ツカ》れた。",
  "grade": 1,
  "radicals": [
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc0297",
  "ch": "被",
  "kanji": "被害",
  "sentence": "台風で《ヒガイ》が出た。",
  "grade": 1,
  "radicals": [
   "衣（ころもへん）",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0298",
  "ch": "避",
  "kanji": "避ける",
  "sentence": "人混みを《サ》ける。",
  "grade": 1,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0299",
  "ch": "尾",
  "kanji": "尾",
  "sentence": "犬が《オ》を振る。",
  "grade": 1,
  "radicals": [
   "尸（しかばね）"
  ]
 },
 {
  "id": "kwc0300",
  "ch": "微",
  "kanji": "微妙",
  "sentence": "テストの結果は《ビミョウ》だった。",
  "grade": 1,
  "radicals": [
   "彳（ぎょうにんべん）",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0301",
  "ch": "匹",
  "kanji": "匹",
  "sentence": "猫が三《ビキ》いる。",
  "grade": 1,
  "radicals": [
   "匸"
  ]
 },
 {
  "id": "kwc0302",
  "ch": "描",
  "kanji": "描く",
  "sentence": "絵を《カ》く。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0303",
  "ch": "浜",
  "kanji": "浜辺",
  "sentence": "家族で《ハマベ》を歩いた。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0304",
  "ch": "敏",
  "kanji": "敏感",
  "sentence": "肌が《ビンカン》になる。",
  "grade": 1,
  "radicals": [
   "攴（ぼくにょう）",
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0305",
  "ch": "怖",
  "kanji": "怖い",
  "sentence": "暗い夜道は《コワ》い。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0306",
  "ch": "赴",
  "kanji": "赴任",
  "sentence": "先生が新しい学校に《フニン》した。",
  "grade": 1,
  "radicals": [
   "走（そうにょう）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0307",
  "ch": "浮",
  "kanji": "浮く",
  "sentence": "木の葉が水に《ウ》く。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0308",
  "ch": "普",
  "kanji": "普通",
  "sentence": "これは《フツウ》サイズだ。",
  "grade": 1,
  "radicals": [
   "日（ひ）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0309",
  "ch": "舞",
  "kanji": "舞う",
  "sentence": "桜の花びらが《マ》う。",
  "grade": 1,
  "radicals": [
   "舛"
  ]
 },
 {
  "id": "kwc0310",
  "ch": "幅",
  "kanji": "幅",
  "sentence": "道路の《ハバ》を測る。",
  "grade": 1,
  "radicals": [
   "巾（はば）"
  ]
 },
 {
  "id": "kwc0311",
  "ch": "払",
  "kanji": "払う",
  "sentence": "レジでお金を《ハラ》う。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0312",
  "ch": "噴",
  "kanji": "噴水",
  "sentence": "公園の《フンスイ》で水遊びをした。",
  "grade": 1,
  "radicals": [
   "口（くちへん）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0313",
  "ch": "柄",
  "kanji": "柄",
  "sentence": "このシャツの《ガラ》が気に入っている。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0314",
  "ch": "壁",
  "kanji": "壁",
  "sentence": "部屋の《カベ》にポスターをはった。",
  "grade": 1,
  "radicals": [
   "土"
  ]
 },
 {
  "id": "kwc0315",
  "ch": "捕",
  "kanji": "捕まえる",
  "sentence": "網で虫を《ツカ》まえる。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0316",
  "ch": "抱",
  "kanji": "抱く",
  "sentence": "母が赤ちゃんを《ダ》く。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0317",
  "ch": "泡",
  "kanji": "泡",
  "sentence": "せっけんで《アワ》を立てて洗う。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0318",
  "ch": "峰",
  "kanji": "峰",
  "sentence": "山の《ミネ》から景色をながめる。",
  "grade": 1,
  "radicals": [
   "山"
  ]
 },
 {
  "id": "kwc0319",
  "ch": "砲",
  "kanji": "大砲",
  "sentence": "博物館で古い《タイホウ》を見た。",
  "grade": 1,
  "radicals": [
   "大",
   "石（いしへん）"
  ]
 },
 {
  "id": "kwc0320",
  "ch": "蜂",
  "kanji": "蜂",
  "sentence": "庭に《ハチ》が飛んできた。",
  "grade": 1,
  "radicals": [
   "虫（むしへん）"
  ]
 },
 {
  "id": "kwc0321",
  "ch": "忙",
  "kanji": "忙しい",
  "sentence": "テスト前で毎日《イソガ》しい。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0322",
  "ch": "坊",
  "kanji": "寝坊",
  "sentence": "今朝は《ネボウ》して遅刻しそうになった。",
  "grade": 1,
  "radicals": [
   "宀（うかんむり）",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0323",
  "ch": "妨",
  "kanji": "妨げる",
  "sentence": "大きな音が勉強を《サマタ》げる。",
  "grade": 1,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0324",
  "ch": "肪",
  "kanji": "脂肪",
  "sentence": "運動して《シボウ》を減らす。",
  "grade": 1,
  "radicals": [
   "肉（にくづき）",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0325",
  "ch": "冒",
  "kanji": "冒険",
  "sentence": "森の中を《ボウケン》する物語を読んだ。",
  "grade": 1,
  "radicals": [
   "冂（くにがまえ）",
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0326",
  "ch": "帽",
  "kanji": "帽子",
  "sentence": "日差しが強いので《ボウシ》をかぶる。",
  "grade": 1,
  "radicals": [
   "巾（はば）",
   "子"
  ]
 },
 {
  "id": "kwc0327",
  "ch": "僕",
  "kanji": "僕",
  "sentence": "《ボク》は毎朝六時に起きる。",
  "grade": 1,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0328",
  "ch": "堀",
  "kanji": "堀",
  "sentence": "城の周りには《ホリ》がある。",
  "grade": 1,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0329",
  "ch": "凡",
  "kanji": "平凡",
  "sentence": "今日は特に何もない《ヘイボン》な一日だった。",
  "grade": 1,
  "radicals": [
   "干",
   "几"
  ]
 },
 {
  "id": "kwc0330",
  "ch": "盆",
  "kanji": "盆",
  "sentence": "夏休みにお《ボン》で祖母の家に行く。",
  "grade": 1,
  "radicals": [
   "皿（さら）"
  ]
 },
 {
  "id": "kwc0331",
  "ch": "枕",
  "kanji": "枕",
  "sentence": "夜は柔らかい《マクラ》で眠る。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0332",
  "ch": "慢",
  "kanji": "我慢",
  "sentence": "眠くても《ガマン》して勉強を続けた。",
  "grade": 1,
  "radicals": [
   "戈（ほこ）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0333",
  "ch": "漫",
  "kanji": "漫画",
  "sentence": "休み時間に《マンガ》を読んだ。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "田"
  ]
 },
 {
  "id": "kwc0334",
  "ch": "妙",
  "kanji": "妙",
  "sentence": "夜中に《ミョウ》な物音がした。",
  "grade": 1,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0335",
  "ch": "眠",
  "kanji": "眠る",
  "sentence": "疲れてすぐに《ネム》ってしまった。",
  "grade": 1,
  "radicals": [
   "目（めへん）"
  ]
 },
 {
  "id": "kwc0336",
  "ch": "矛",
  "kanji": "矛盾",
  "sentence": "彼の話には《ムジュン》がある。",
  "grade": 1,
  "radicals": [
   "矛",
   "目"
  ]
 },
 {
  "id": "kwc0337",
  "ch": "霧",
  "kanji": "霧",
  "sentence": "朝の山道に《キリ》が立ちこめていた。",
  "grade": 1,
  "radicals": [
   "雨（あめかんむり）"
  ]
 },
 {
  "id": "kwc0338",
  "ch": "娘",
  "kanji": "娘",
  "sentence": "隣の家の《ムスメ》さんはとても優しい。",
  "grade": 1,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0339",
  "ch": "猛",
  "kanji": "猛暑",
  "sentence": "今年の夏は《モウショ》が続いている。",
  "grade": 1,
  "radicals": [
   "犬",
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0340",
  "ch": "網",
  "kanji": "網",
  "sentence": "川で魚を《アミ》ですくった。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0341",
  "ch": "黙",
  "kanji": "黙る",
  "sentence": "先生が来ると教室が急に《ダマ》る。",
  "grade": 1,
  "radicals": [
   "黑"
  ]
 },
 {
  "id": "kwc0342",
  "ch": "躍",
  "kanji": "躍る",
  "sentence": "合格の知らせに心が《オド》る。",
  "grade": 1,
  "radicals": [
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0343",
  "ch": "与",
  "kanji": "与える",
  "sentence": "犬にえさを《アタ》える。",
  "grade": 1,
  "radicals": [
   "一"
  ]
 },
 {
  "id": "kwc0344",
  "ch": "誉",
  "kanji": "名誉",
  "sentence": "クラス代表に選ばれるのは《メイヨ》なことだ。",
  "grade": 1,
  "radicals": [
   "口",
   "言"
  ]
 },
 {
  "id": "kwc0345",
  "ch": "溶",
  "kanji": "溶ける",
  "sentence": "氷が水に《ト》ける。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0346",
  "ch": "腰",
  "kanji": "腰",
  "sentence": "重い荷物を持って《コシ》が痛くなった。",
  "grade": 1,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0347",
  "ch": "踊",
  "kanji": "踊る",
  "sentence": "文化祭でみんなで《オド》る。",
  "grade": 1,
  "radicals": [
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0348",
  "ch": "抑",
  "kanji": "抑える",
  "sentence": "怒りを《オサ》えて話し合う。",
  "grade": 1,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0349",
  "ch": "羅",
  "kanji": "羅列",
  "sentence": "単語をただ《ラレツ》しただけの文章。",
  "grade": 1,
  "radicals": [
   "网（あみがしら）",
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0350",
  "ch": "雷",
  "kanji": "雷",
  "sentence": "遠くで《カミナリ》の音が聞こえた。",
  "grade": 1,
  "radicals": [
   "雨（あめかんむり）"
  ]
 },
 {
  "id": "kwc0351",
  "ch": "頼",
  "kanji": "頼む",
  "sentence": "友達に宿題を手伝ってと《タノ》む。",
  "grade": 1,
  "radicals": [
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc0352",
  "ch": "絡",
  "kanji": "絡む",
  "sentence": "糸が複雑に《カラ》んでほどけない。",
  "grade": 1,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0353",
  "ch": "欄",
  "kanji": "欄",
  "sentence": "答えを解答《ラン》に書く。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0354",
  "ch": "離",
  "kanji": "離れる",
  "sentence": "家族と《ハナ》れて暮らす。",
  "grade": 1,
  "radicals": [
   "隹（ふるとり）"
  ]
 },
 {
  "id": "kwc0355",
  "ch": "粒",
  "kanji": "粒",
  "sentence": "米の《ツブ》を数える。",
  "grade": 1,
  "radicals": [
   "米（こめへん）"
  ]
 },
 {
  "id": "kwc0356",
  "ch": "療",
  "kanji": "治療",
  "sentence": "歯医者で虫歯の《チリョウ》を受けた。",
  "grade": 1,
  "radicals": [
   "水（さんずい）",
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc0357",
  "ch": "隣",
  "kanji": "隣",
  "sentence": "《トナリ》の席の友達と話す。",
  "grade": 1,
  "radicals": [
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0358",
  "ch": "涙",
  "kanji": "涙",
  "sentence": "感動して《ナミダ》が出た。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0359",
  "ch": "暦",
  "kanji": "暦",
  "sentence": "古い《コヨミ》を見ると昔の行事がわかる。",
  "grade": 1,
  "radicals": [
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0360",
  "ch": "劣",
  "kanji": "劣る",
  "sentence": "体力ではみんなに《オト》る。",
  "grade": 1,
  "radicals": [
   "力（ちから）"
  ]
 },
 {
  "id": "kwc0361",
  "ch": "烈",
  "kanji": "強烈",
  "sentence": "真夏の日差しは《キョウレツ》だ。",
  "grade": 1,
  "radicals": [
   "弓（ゆみへん）",
   "火（ひ）"
  ]
 },
 {
  "id": "kwc0362",
  "ch": "恋",
  "kanji": "恋",
  "sentence": "クラスの誰かに《コイ》をしているらしい。",
  "grade": 1,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0363",
  "ch": "露",
  "kanji": "露",
  "sentence": "朝の草花に《ツユ》がついていた。",
  "grade": 1,
  "radicals": [
   "雨（あめかんむり）"
  ]
 },
 {
  "id": "kwc0364",
  "ch": "郎",
  "kanji": "新郎",
  "sentence": "結婚式で《シンロウ》が挨拶をした。",
  "grade": 1,
  "radicals": [
   "斤（おのづくり）",
   "邑（おおざと）"
  ]
 },
 {
  "id": "kwc0365",
  "ch": "脇",
  "kanji": "脇",
  "sentence": "かばんを《ワキ》にかかえて歩く。",
  "grade": 1,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0366",
  "ch": "惑",
  "kanji": "惑星",
  "sentence": "太陽系には八つの《ワクセイ》がある。",
  "grade": 1,
  "radicals": [
   "心（したごころ）",
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0367",
  "ch": "枠",
  "kanji": "枠",
  "sentence": "写真を《ワク》に入れて飾る。",
  "grade": 1,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0368",
  "ch": "腕",
  "kanji": "腕",
  "sentence": "重い荷物を持って《ウデ》が疲れた。",
  "grade": 1,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0369",
  "ch": "亜",
  "kanji": "亜熱帯",
  "sentence": "沖縄は《アネッタイ》の気候だ。",
  "grade": 2,
  "radicals": [
   "二",
   "火（ひ）",
   "巾（はば）"
  ]
 },
 {
  "id": "kwc0370",
  "ch": "哀",
  "kanji": "哀れ",
  "sentence": "《アワ》れな話を聞いた。",
  "grade": 2,
  "radicals": [
   "口"
  ]
 },
 {
  "id": "kwc0371",
  "ch": "宛",
  "kanji": "宛先",
  "sentence": "手紙に《アテサキ》を書く。",
  "grade": 2,
  "radicals": [
   "宀（うかんむり）",
   "八"
  ]
 },
 {
  "id": "kwc0372",
  "ch": "椅",
  "kanji": "椅子",
  "sentence": "教室の《イス》に座る。",
  "grade": 2,
  "radicals": [
   "木（きへん）",
   "子"
  ]
 },
 {
  "id": "kwc0373",
  "ch": "彙",
  "kanji": "語彙",
  "sentence": "本を読んで《ゴイ》を増やす。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）",
   "彑（けいがしら）"
  ]
 },
 {
  "id": "kwc0374",
  "ch": "慰",
  "kanji": "慰める",
  "sentence": "泣いている友達を《ナグサ》める。",
  "grade": 2,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0375",
  "ch": "壱",
  "kanji": "壱万円",
  "sentence": "領収書に《イチマンエン》と書く。",
  "grade": 2,
  "radicals": [
   "土",
   "一",
   "囗（くにがまえ）"
  ]
 },
 {
  "id": "kwc0376",
  "ch": "芋",
  "kanji": "芋",
  "sentence": "畑で《イモ》を掘る。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0377",
  "ch": "浦",
  "kanji": "浦",
  "sentence": "漁師たちは《ウラ》で魚を獲る。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0378",
  "ch": "詠",
  "kanji": "詠む",
  "sentence": "俳句を《ヨ》む。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0379",
  "ch": "疫",
  "kanji": "疫病",
  "sentence": "昔、《エキビョウ》が広がった。",
  "grade": 2,
  "radicals": [
   "疒（やまいだれ）",
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc0380",
  "ch": "悦",
  "kanji": "悦ぶ",
  "sentence": "合格の知らせに《ヨロコ》ぶ。",
  "grade": 2,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0381",
  "ch": "閲",
  "kanji": "閲覧",
  "sentence": "図書館で新聞を《エツラン》する。",
  "grade": 2,
  "radicals": [
   "門（もんがまえ）",
   "見"
  ]
 },
 {
  "id": "kwc0382",
  "ch": "炎",
  "kanji": "炎",
  "sentence": "ろうそくの《ホノオ》が揺れる。",
  "grade": 2,
  "radicals": [
   "火"
  ]
 },
 {
  "id": "kwc0383",
  "ch": "宴",
  "kanji": "宴会",
  "sentence": "卒業の《エンカイ》が開かれた。",
  "grade": 2,
  "radicals": [
   "宀（うかんむり）",
   "人"
  ]
 },
 {
  "id": "kwc0384",
  "ch": "旺",
  "kanji": "旺盛",
  "sentence": "彼は食欲が《オウセイ》だ。",
  "grade": 2,
  "radicals": [
   "日（ひへん）",
   "皿（さら）"
  ]
 },
 {
  "id": "kwc0385",
  "ch": "欧",
  "kanji": "欧州",
  "sentence": "夏休みに《オウシュウ》を旅行した。",
  "grade": 2,
  "radicals": [
   "欠（あくび）",
   "巛"
  ]
 },
 {
  "id": "kwc0386",
  "ch": "殴",
  "kanji": "殴る",
  "sentence": "けんかで友達を《ナグ》ってしまった。",
  "grade": 2,
  "radicals": [
   "殳"
  ]
 },
 {
  "id": "kwc0387",
  "ch": "俺",
  "kanji": "俺",
  "sentence": "《オレ》は毎朝走っている。",
  "grade": 2,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0388",
  "ch": "卸",
  "kanji": "卸売",
  "sentence": "市場で野菜の《オロシウリ》をする。",
  "grade": 2,
  "radicals": [
   "卩（ふしづくり）",
   "土"
  ]
 },
 {
  "id": "kwc0389",
  "ch": "穏",
  "kanji": "穏やか",
  "sentence": "今日は《オダ》やかな天気だ。",
  "grade": 2,
  "radicals": [
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0390",
  "ch": "佳",
  "kanji": "佳作",
  "sentence": "絵のコンクールで《カサク》に選ばれた。",
  "grade": 2,
  "radicals": [
   "人（にんべん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0391",
  "ch": "架",
  "kanji": "架空",
  "sentence": "これは《カクウ》の物語だ。",
  "grade": 2,
  "radicals": [
   "木（き）",
   "穴（あなかんむり）"
  ]
 },
 {
  "id": "kwc0392",
  "ch": "華",
  "kanji": "華やか",
  "sentence": "会場が《ハナ》やかに飾られた。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0393",
  "ch": "渦",
  "kanji": "渦",
  "sentence": "川に《ウズ》ができていた。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0394",
  "ch": "嫁",
  "kanji": "花嫁",
  "sentence": "姉は美しい《ハナヨメ》になった。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0395",
  "ch": "牙",
  "kanji": "牙",
  "sentence": "オオカミの《キバ》は鋭い。",
  "grade": 2,
  "radicals": [
   "牙"
  ]
 },
 {
  "id": "kwc0396",
  "ch": "瓦",
  "kanji": "瓦",
  "sentence": "台風で屋根の《カワラ》が飛んだ。",
  "grade": 2,
  "radicals": [
   "瓦（かわら）"
  ]
 },
 {
  "id": "kwc0397",
  "ch": "餓",
  "kanji": "飢餓",
  "sentence": "世界には《キガ》に苦しむ人々がいる。",
  "grade": 2,
  "radicals": [
   "食（しょくへん）",
   "食（しょくへん）"
  ]
 },
 {
  "id": "kwc0398",
  "ch": "怪",
  "kanji": "怪しい",
  "sentence": "《アヤ》しい物音がした。",
  "grade": 2,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0399",
  "ch": "悔",
  "kanji": "悔しい",
  "sentence": "試合に負けて《クヤ》しかった。",
  "grade": 2,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0400",
  "ch": "塊",
  "kanji": "塊",
  "sentence": "肉の《カタマリ》を焼く。",
  "grade": 2,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0401",
  "ch": "楷",
  "kanji": "楷書",
  "sentence": "習字で《カイショ》を練習する。",
  "grade": 2,
  "radicals": [
   "木（きへん）",
   "曰"
  ]
 },
 {
  "id": "kwc0402",
  "ch": "崖",
  "kanji": "崖",
  "sentence": "《ガケ》の上から海を見た。",
  "grade": 2,
  "radicals": [
   "山"
  ]
 },
 {
  "id": "kwc0403",
  "ch": "涯",
  "kanji": "生涯",
  "sentence": "祖父は《ショウガイ》現役で働いた。",
  "grade": 2,
  "radicals": [
   "生",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0404",
  "ch": "慨",
  "kanji": "感慨",
  "sentence": "卒業式で《カンガイ》深い気持ちになった。",
  "grade": 2,
  "radicals": [
   "心（したごころ）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0405",
  "ch": "該",
  "kanji": "該当",
  "sentence": "《ガイトウ》する番号に丸をつける。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）",
   "小"
  ]
 },
 {
  "id": "kwc0406",
  "ch": "垣",
  "kanji": "垣根",
  "sentence": "庭の《カキネ》を修理した。",
  "grade": 2,
  "radicals": [
   "土（つちへん）",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0407",
  "ch": "核",
  "kanji": "核",
  "sentence": "理科の授業で細胞の《カク》を観察した。",
  "grade": 2,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0408",
  "ch": "郭",
  "kanji": "輪郭",
  "sentence": "鉛筆で顔の《リンカク》を描いた。",
  "grade": 2,
  "radicals": [
   "車（くるまへん）",
   "邑（おおざと）"
  ]
 },
 {
  "id": "kwc0409",
  "ch": "隔",
  "kanji": "隔てる",
  "sentence": "川が二つの町を《ヘダ》てている。",
  "grade": 2,
  "radicals": [
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0410",
  "ch": "穫",
  "kanji": "収穫",
  "sentence": "秋に米を《シュウカク》する。",
  "grade": 2,
  "radicals": [
   "又（また）",
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0411",
  "ch": "岳",
  "kanji": "山岳",
  "sentence": "部活で《サンガク》地帯を登った。",
  "grade": 2,
  "radicals": [
   "山",
   "山"
  ]
 },
 {
  "id": "kwc0412",
  "ch": "掛",
  "kanji": "掛ける",
  "sentence": "壁に時計を《カ》ける。",
  "grade": 2,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0413",
  "ch": "且",
  "kanji": "且つ",
  "sentence": "彼は明るく、《カ》つ真面目だ。",
  "grade": 2,
  "radicals": [
   "一"
  ]
 },
 {
  "id": "kwc0414",
  "ch": "鎌",
  "kanji": "鎌",
  "sentence": "《カマ》で庭の草を刈った。",
  "grade": 2,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0415",
  "ch": "肝",
  "kanji": "肝心",
  "sentence": "そこが《カンジン》な部分だ。",
  "grade": 2,
  "radicals": [
   "肉（にくづき）",
   "心"
  ]
 },
 {
  "id": "kwc0416",
  "ch": "冠",
  "kanji": "王冠",
  "sentence": "劇で《オウカン》をかぶる役をした。",
  "grade": 2,
  "radicals": [
   "玉",
   "冖（わかんむり）"
  ]
 },
 {
  "id": "kwc0417",
  "ch": "勘",
  "kanji": "勘",
  "sentence": "兄は《カン》が鋭い。",
  "grade": 2,
  "radicals": [
   "力（ちから）"
  ]
 },
 {
  "id": "kwc0418",
  "ch": "患",
  "kanji": "患者",
  "sentence": "病院で《カンジャ》さんを見かけた。",
  "grade": 2,
  "radicals": [
   "心（したごころ）",
   "老"
  ]
 },
 {
  "id": "kwc0419",
  "ch": "貫",
  "kanji": "貫く",
  "sentence": "最後まで自分の意志を《ツラヌ》いた。",
  "grade": 2,
  "radicals": [
   "貝（かい）"
  ]
 },
 {
  "id": "kwc0420",
  "ch": "喚",
  "kanji": "喚起",
  "sentence": "先生が注意を《カンキ》した。",
  "grade": 2,
  "radicals": [
   "口（くちへん）",
   "走（そうにょう）"
  ]
 },
 {
  "id": "kwc0421",
  "ch": "換",
  "kanji": "交換",
  "sentence": "友達とカードを《コウカン》した。",
  "grade": 2,
  "radicals": [
   "亠（なべぶた）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0422",
  "ch": "敢",
  "kanji": "敢えて",
  "sentence": "彼は《アエ》て難しい問題に挑戦した。",
  "grade": 2,
  "radicals": [
   "攴（ぼくにょう）"
  ]
 },
 {
  "id": "kwc0423",
  "ch": "緩",
  "kanji": "緩い",
  "sentence": "このロープは少し《ユル》い。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0424",
  "ch": "企",
  "kanji": "企業",
  "sentence": "父は大きな《キギョウ》で働いている。",
  "grade": 2,
  "radicals": [
   "人",
   "木"
  ]
 },
 {
  "id": "kwc0425",
  "ch": "忌",
  "kanji": "一周忌",
  "sentence": "祖父の《イッシュウキ》の法要をした。",
  "grade": 2,
  "radicals": [
   "一",
   "口",
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0426",
  "ch": "軌",
  "kanji": "軌道",
  "sentence": "ロケットが《キドウ》に乗った。",
  "grade": 2,
  "radicals": [
   "車（くるまへん）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0427",
  "ch": "既",
  "kanji": "既に",
  "sentence": "宿題は《スデ》に終わらせた。",
  "grade": 2,
  "radicals": [
   "无"
  ]
 },
 {
  "id": "kwc0428",
  "ch": "飢",
  "kanji": "飢える",
  "sentence": "戦争中、人々は《ウ》えて苦しんだ。",
  "grade": 2,
  "radicals": [
   "食（しょくへん）"
  ]
 },
 {
  "id": "kwc0429",
  "ch": "棋",
  "kanji": "棋士",
  "sentence": "彼は有名な《キシ》になった。",
  "grade": 2,
  "radicals": [
   "木（きへん）",
   "士"
  ]
 },
 {
  "id": "kwc0430",
  "ch": "棄",
  "kanji": "棄権",
  "sentence": "けがのため試合を《キケン》した。",
  "grade": 2,
  "radicals": [
   "木（き）",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0431",
  "ch": "騎",
  "kanji": "騎士",
  "sentence": "物語に《キシ》が登場する。",
  "grade": 2,
  "radicals": [
   "馬（うまへん）",
   "士"
  ]
 },
 {
  "id": "kwc0432",
  "ch": "欺",
  "kanji": "欺く",
  "sentence": "敵を《アザム》く作戦を立てる。",
  "grade": 2,
  "radicals": [
   "欠（あくび）"
  ]
 },
 {
  "id": "kwc0433",
  "ch": "戯",
  "kanji": "遊戯",
  "sentence": "幼稚園で《ユウギ》をして遊ぶ。",
  "grade": 2,
  "radicals": [
   "辵（しんにょう）",
   "戈（ほこ）"
  ]
 },
 {
  "id": "kwc0434",
  "ch": "擬",
  "kanji": "擬人法",
  "sentence": "詩に《ギジンホウ》が使われている。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "人",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0435",
  "ch": "犠",
  "kanji": "犠打",
  "sentence": "《ギダ》で走者を先の塁に進める作戦だ。",
  "grade": 2,
  "radicals": [
   "牛（うしへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0436",
  "ch": "菊",
  "kanji": "菊",
  "sentence": "庭に《キク》の花が咲いた。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0437",
  "ch": "吉",
  "kanji": "大吉",
  "sentence": "おみくじで《ダイキチ》を引いた。",
  "grade": 2,
  "radicals": [
   "大",
   "口"
  ]
 },
 {
  "id": "kwc0438",
  "ch": "虐",
  "kanji": "虐待",
  "sentence": "動物《ギャクタイ》は許されない。",
  "grade": 2,
  "radicals": [
   "虍（とらかんむり）",
   "彳（ぎょうにんべん）"
  ]
 },
 {
  "id": "kwc0439",
  "ch": "拒",
  "kanji": "拒む",
  "sentence": "友達の誘いを《コバ》む。",
  "grade": 2,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0440",
  "ch": "虚",
  "kanji": "空虚",
  "sentence": "試合に負けて心が《クウキョ》になった。",
  "grade": 2,
  "radicals": [
   "穴（あなかんむり）",
   "虍（とらかんむり）"
  ]
 },
 {
  "id": "kwc0441",
  "ch": "峡",
  "kanji": "海峡",
  "sentence": "船で《カイキョウ》を渡る。",
  "grade": 2,
  "radicals": [
   "水（さんずい）",
   "山"
  ]
 },
 {
  "id": "kwc0442",
  "ch": "脅",
  "kanji": "脅す",
  "sentence": "大声で相手を《オド》す。",
  "grade": 2,
  "radicals": [
   "肉"
  ]
 },
 {
  "id": "kwc0443",
  "ch": "凝",
  "kanji": "凝る",
  "sentence": "最近は絵を描くことに《コ》っている。",
  "grade": 2,
  "radicals": [
   "冫（にすい）"
  ]
 },
 {
  "id": "kwc0444",
  "ch": "巾",
  "kanji": "布巾",
  "sentence": "食器を《フキン》で拭く。",
  "grade": 2,
  "radicals": [
   "巾（はば）",
   "巾（はば）"
  ]
 },
 {
  "id": "kwc0445",
  "ch": "斤",
  "kanji": "一斤",
  "sentence": "パンを《イッキン》買った。",
  "grade": 2,
  "radicals": [
   "一",
   "斤"
  ]
 },
 {
  "id": "kwc0446",
  "ch": "菌",
  "kanji": "細菌",
  "sentence": "手を洗って《サイキン》を防ぐ。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0447",
  "ch": "緊",
  "kanji": "緊張",
  "sentence": "発表会の前に《キンチョウ》する。",
  "grade": 2,
  "radicals": [
   "糸",
   "弓（ゆみへん）"
  ]
 },
 {
  "id": "kwc0448",
  "ch": "愚",
  "kanji": "愚か",
  "sentence": "同じ失敗を繰り返すのは《オロ》かだ。",
  "grade": 2,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0449",
  "ch": "偶",
  "kanji": "偶然",
  "sentence": "駅で友達に《グウゼン》会った。",
  "grade": 2,
  "radicals": [
   "人（にんべん）",
   "火（ひ）"
  ]
 },
 {
  "id": "kwc0450",
  "ch": "串",
  "kanji": "串",
  "sentence": "焼き鳥を《クシ》に刺す。",
  "grade": 2,
  "radicals": [
   "丨"
  ]
 },
 {
  "id": "kwc0451",
  "ch": "刑",
  "kanji": "刑罰",
  "sentence": "法律に違反すると《ケイバツ》が科される。",
  "grade": 2,
  "radicals": [
   "刀（りっとう）",
   "网（あみがしら）"
  ]
 },
 {
  "id": "kwc0452",
  "ch": "啓",
  "kanji": "啓発",
  "sentence": "講演会で《ケイハツ》を受けた。",
  "grade": 2,
  "radicals": [
   "口",
   "癶（はつがしら）"
  ]
 },
 {
  "id": "kwc0453",
  "ch": "掲",
  "kanji": "掲示",
  "sentence": "廊下の《ケイジ》板を見る。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "示"
  ]
 },
 {
  "id": "kwc0454",
  "ch": "蛍",
  "kanji": "蛍",
  "sentence": "川辺で《ホタル》を観察した。",
  "grade": 2,
  "radicals": [
   "虫"
  ]
 },
 {
  "id": "kwc0455",
  "ch": "憩",
  "kanji": "休憩",
  "sentence": "十分間の《キュウケイ》を取る。",
  "grade": 2,
  "radicals": [
   "人（にんべん）",
   "心"
  ]
 },
 {
  "id": "kwc0456",
  "ch": "鶏",
  "kanji": "鶏肉",
  "sentence": "夕食に《ケイニク》を食べる。",
  "grade": 2,
  "radicals": [
   "鳥",
   "肉"
  ]
 },
 {
  "id": "kwc0457",
  "ch": "鯨",
  "kanji": "鯨",
  "sentence": "海で《クジラ》の群れを見た。",
  "grade": 2,
  "radicals": [
   "魚（うおへん）"
  ]
 },
 {
  "id": "kwc0458",
  "ch": "傑",
  "kanji": "傑作",
  "sentence": "この映画は監督の《ケッサク》だ。",
  "grade": 2,
  "radicals": [
   "人（にんべん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0459",
  "ch": "倹",
  "kanji": "倹約",
  "sentence": "将来のためにお金を《ケンヤク》する。",
  "grade": 2,
  "radicals": [
   "人（にんべん）",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0460",
  "ch": "拳",
  "kanji": "拳",
  "sentence": "気合を入れて《コブシ》を握る。",
  "grade": 2,
  "radicals": [
   "手"
  ]
 },
 {
  "id": "kwc0461",
  "ch": "賢",
  "kanji": "賢い",
  "sentence": "妹はとても《カシコ》い。",
  "grade": 2,
  "radicals": [
   "貝（かい）"
  ]
 },
 {
  "id": "kwc0462",
  "ch": "幻",
  "kanji": "幻",
  "sentence": "夢か《マボロシ》か分からない光景だった。",
  "grade": 2,
  "radicals": [
   "幺（いとがしら）"
  ]
 },
 {
  "id": "kwc0463",
  "ch": "孤",
  "kanji": "孤独",
  "sentence": "一人で過ごす《コドク》を感じた。",
  "grade": 2,
  "radicals": [
   "子",
   "犬"
  ]
 },
 {
  "id": "kwc0464",
  "ch": "弧",
  "kanji": "円弧",
  "sentence": "コンパスで《エンコ》を描く。",
  "grade": 2,
  "radicals": [
   "囗（くにがまえ）",
   "弓（ゆみへん）"
  ]
 },
 {
  "id": "kwc0465",
  "ch": "雇",
  "kanji": "雇う",
  "sentence": "店がアルバイトを《ヤト》う。",
  "grade": 2,
  "radicals": [
   "隹"
  ]
 },
 {
  "id": "kwc0466",
  "ch": "顧",
  "kanji": "顧問",
  "sentence": "部活の《コモン》の先生に相談する。",
  "grade": 2,
  "radicals": [
   "頁（おおがい）",
   "口"
  ]
 },
 {
  "id": "kwc0467",
  "ch": "娯",
  "kanji": "娯楽",
  "sentence": "休日は《ゴラク》で過ごす。",
  "grade": 2,
  "radicals": [
   "女（おんなへん）",
   "木（き）"
  ]
 },
 {
  "id": "kwc0468",
  "ch": "孔",
  "kanji": "気孔",
  "sentence": "植物の葉には《キコウ》がある。",
  "grade": 2,
  "radicals": [
   "气",
   "子"
  ]
 },
 {
  "id": "kwc0469",
  "ch": "甲",
  "kanji": "甲羅",
  "sentence": "亀の《コウラ》を観察する。",
  "grade": 2,
  "radicals": [
   "日",
   "网（あみがしら）"
  ]
 },
 {
  "id": "kwc0470",
  "ch": "坑",
  "kanji": "炭坑",
  "sentence": "昔この町には《タンコウ》があった。",
  "grade": 2,
  "radicals": [
   "火",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0471",
  "ch": "拘",
  "kanji": "拘束",
  "sentence": "時間に《コウソク》されるのが苦手だ。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "木"
  ]
 },
 {
  "id": "kwc0472",
  "ch": "貢",
  "kanji": "貢献",
  "sentence": "チームの勝利に《コウケン》する。",
  "grade": 2,
  "radicals": [
   "貝（かい）",
   "犬"
  ]
 },
 {
  "id": "kwc0473",
  "ch": "控",
  "kanji": "控える",
  "sentence": "試験前は間食を《ヒカ》える。",
  "grade": 2,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0474",
  "ch": "慌",
  "kanji": "慌てる",
  "sentence": "遅刻しそうで《アワ》てて家を出た。",
  "grade": 2,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0475",
  "ch": "硬",
  "kanji": "硬い",
  "sentence": "このパンはとても《カタ》い。",
  "grade": 2,
  "radicals": [
   "石（いしへん）"
  ]
 },
 {
  "id": "kwc0476",
  "ch": "絞",
  "kanji": "絞る",
  "sentence": "タオルを固く《シボ》る。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0477",
  "ch": "綱",
  "kanji": "綱引き",
  "sentence": "運動会で《ツナ》引きをした。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）",
   "弓（ゆみへん）"
  ]
 },
 {
  "id": "kwc0478",
  "ch": "酵",
  "kanji": "酵素",
  "sentence": "消化を助ける《コウソ》の働きを学ぶ。",
  "grade": 2,
  "radicals": [
   "酉（とりへん）",
   "糸"
  ]
 },
 {
  "id": "kwc0479",
  "ch": "購",
  "kanji": "購入",
  "sentence": "新しい靴を《コウニュウ》する。",
  "grade": 2,
  "radicals": [
   "貝（かいへん）",
   "入"
  ]
 },
 {
  "id": "kwc0480",
  "ch": "克",
  "kanji": "克服",
  "sentence": "苦手な科目を《コクフク》する。",
  "grade": 2,
  "radicals": [
   "八",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0481",
  "ch": "獄",
  "kanji": "地獄",
  "sentence": "漫画で《ジゴク》の世界が描かれる。",
  "grade": 2,
  "radicals": [
   "土（つちへん）",
   "犬"
  ]
 },
 {
  "id": "kwc0482",
  "ch": "恨",
  "kanji": "恨む",
  "sentence": "友達を《ウラ》むのはやめよう。",
  "grade": 2,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0483",
  "ch": "紺",
  "kanji": "紺色",
  "sentence": "制服は《コンイロ》のブレザーだ。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）",
   "色"
  ]
 },
 {
  "id": "kwc0484",
  "ch": "魂",
  "kanji": "魂",
  "sentence": "選手たちは《タマシイ》を込めて戦った。",
  "grade": 2,
  "radicals": [
   "鬼"
  ]
 },
 {
  "id": "kwc0485",
  "ch": "墾",
  "kanji": "開墾",
  "sentence": "荒れ地を《カイコン》して畑にする。",
  "grade": 2,
  "radicals": [
   "門（もんがまえ）",
   "土"
  ]
 },
 {
  "id": "kwc0486",
  "ch": "債",
  "kanji": "負債",
  "sentence": "会社が多額の《フサイ》を抱える。",
  "grade": 2,
  "radicals": [
   "貝（かい）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0487",
  "ch": "催",
  "kanji": "催す",
  "sentence": "文化祭で催し物を《モヨオ》す。",
  "grade": 2,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0488",
  "ch": "削",
  "kanji": "削る",
  "sentence": "ナイフで鉛筆を《ケズ》る。",
  "grade": 2,
  "radicals": [
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0489",
  "ch": "搾",
  "kanji": "搾る",
  "sentence": "牛から乳を《シボ》る。",
  "grade": 2,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0490",
  "ch": "錯",
  "kanji": "錯覚",
  "sentence": "目の《サッカク》で線が曲がって見える。",
  "grade": 2,
  "radicals": [
   "金（かねへん）",
   "見"
  ]
 },
 {
  "id": "kwc0491",
  "ch": "擦",
  "kanji": "擦る",
  "sentence": "消しゴムで字を《コス》って消す。",
  "grade": 2,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0492",
  "ch": "惨",
  "kanji": "悲惨",
  "sentence": "事故現場は《ヒサン》な状況だった。",
  "grade": 2,
  "radicals": [
   "心（したごころ）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0493",
  "ch": "暫",
  "kanji": "暫く",
  "sentence": "友達を《シバラ》く待つ。",
  "grade": 2,
  "radicals": [
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0494",
  "ch": "祉",
  "kanji": "福祉",
  "sentence": "《フクシ》委員会に入る。",
  "grade": 2,
  "radicals": [
   "示（しめすへん）",
   "示（しめすへん）"
  ]
 },
 {
  "id": "kwc0495",
  "ch": "肢",
  "kanji": "選択肢",
  "sentence": "テストの《センタクシ》を選ぶ。",
  "grade": 2,
  "radicals": [
   "辵（しんにょう）",
   "手（てへん）",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0496",
  "ch": "施",
  "kanji": "施設",
  "sentence": "新しい《シセツ》を利用する。",
  "grade": 2,
  "radicals": [
   "方（ほうへん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0497",
  "ch": "雌",
  "kanji": "雌",
  "sentence": "《メス》のねこを飼う。",
  "grade": 2,
  "radicals": [
   "隹（ふるとり）"
  ]
 },
 {
  "id": "kwc0498",
  "ch": "諮",
  "kanji": "諮る",
  "sentence": "学級会に《ハカ》る。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0499",
  "ch": "侍",
  "kanji": "侍",
  "sentence": "《サムライ》の映画を見る。",
  "grade": 2,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0500",
  "ch": "慈",
  "kanji": "慈善",
  "sentence": "《ジゼン》活動に参加する。",
  "grade": 2,
  "radicals": [
   "心（したごころ）",
   "口"
  ]
 },
 {
  "id": "kwc0501",
  "ch": "軸",
  "kanji": "軸",
  "sentence": "コンパスの《ジク》を持つ。",
  "grade": 2,
  "radicals": [
   "車（くるまへん）"
  ]
 },
 {
  "id": "kwc0502",
  "ch": "疾",
  "kanji": "疾走",
  "sentence": "全力で《シッソウ》する。",
  "grade": 2,
  "radicals": [
   "疒（やまいだれ）",
   "走"
  ]
 },
 {
  "id": "kwc0503",
  "ch": "湿",
  "kanji": "湿度",
  "sentence": "今日は《シツド》が高い。",
  "grade": 2,
  "radicals": [
   "水（さんずい）",
   "广（まだれ）"
  ]
 },
 {
  "id": "kwc0504",
  "ch": "赦",
  "kanji": "容赦",
  "sentence": "《ヨウシャ》なく叱られた。",
  "grade": 2,
  "radicals": [
   "宀（うかんむり）",
   "赤"
  ]
 },
 {
  "id": "kwc0505",
  "ch": "邪",
  "kanji": "邪魔",
  "sentence": "勉強の《ジャマ》をしない。",
  "grade": 2,
  "radicals": [
   "邑（おおざと）",
   "鬼"
  ]
 },
 {
  "id": "kwc0506",
  "ch": "殊",
  "kanji": "特殊",
  "sentence": "《トクシュ》な能力を持つ。",
  "grade": 2,
  "radicals": [
   "牛（うしへん）",
   "歹"
  ]
 },
 {
  "id": "kwc0507",
  "ch": "珠",
  "kanji": "真珠",
  "sentence": "《シンジュ》のネックレス。",
  "grade": 2,
  "radicals": [
   "目",
   "玉"
  ]
 },
 {
  "id": "kwc0508",
  "ch": "寿",
  "kanji": "寿命",
  "sentence": "電池の《ジュミョウ》が切れる。",
  "grade": 2,
  "radicals": [
   "寸",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0509",
  "ch": "呪",
  "kanji": "呪文",
  "sentence": "《ジュモン》を唱える。",
  "grade": 2,
  "radicals": [
   "口（くちへん）",
   "文"
  ]
 },
 {
  "id": "kwc0510",
  "ch": "臭",
  "kanji": "臭い",
  "sentence": "変な《ニオ》いがする。",
  "grade": 2,
  "radicals": [
   "自"
  ]
 },
 {
  "id": "kwc0511",
  "ch": "袖",
  "kanji": "袖",
  "sentence": "シャツの《ソデ》をまくる。",
  "grade": 2,
  "radicals": [
   "衣（ころもへん）"
  ]
 },
 {
  "id": "kwc0512",
  "ch": "醜",
  "kanji": "醜い",
  "sentence": "争いは《ミニク》い。",
  "grade": 2,
  "radicals": [
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0513",
  "ch": "遵",
  "kanji": "遵守",
  "sentence": "規則を《ジュンシュ》する。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0514",
  "ch": "徐",
  "kanji": "徐々に",
  "sentence": "《ジョジョ》に慣れてきた。",
  "grade": 1,
  "radicals": [
   "彳（ぎょうにんべん）",
   "々"
  ]
 },
 {
  "id": "kwc0515",
  "ch": "匠",
  "kanji": "巨匠",
  "sentence": "《キョショウ》の作品を見る。",
  "grade": 2,
  "radicals": [
   "工",
   "匚（はこがまえ）"
  ]
 },
 {
  "id": "kwc0516",
  "ch": "訟",
  "kanji": "訴訟",
  "sentence": "《ソショウ》を起こす。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0517",
  "ch": "掌",
  "kanji": "車掌",
  "sentence": "《シャショウ》さんに切符を見せる。",
  "grade": 2,
  "radicals": [
   "車",
   "手"
  ]
 },
 {
  "id": "kwc0518",
  "ch": "晶",
  "kanji": "結晶",
  "sentence": "雪の《ケッショウ》を観察する。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）",
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0519",
  "ch": "焦",
  "kanji": "焦る",
  "sentence": "試験前で《アセ》る。",
  "grade": 2,
  "radicals": [
   "火（ひ）"
  ]
 },
 {
  "id": "kwc0520",
  "ch": "奨",
  "kanji": "奨励",
  "sentence": "読書を《ショウレイ》する。",
  "grade": 2,
  "radicals": [
   "大",
   "力（ちから）"
  ]
 },
 {
  "id": "kwc0521",
  "ch": "憧",
  "kanji": "憧れる",
  "sentence": "先輩に《アコガ》れる。",
  "grade": 2,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0522",
  "ch": "衝",
  "kanji": "衝撃",
  "sentence": "《ショウゲキ》的なニュースを聞く。",
  "grade": 2,
  "radicals": [
   "行（ぎょうがまえ）",
   "手"
  ]
 },
 {
  "id": "kwc0523",
  "ch": "償",
  "kanji": "弁償",
  "sentence": "壊した物を《ベンショウ》する。",
  "grade": 2,
  "radicals": [
   "廾",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0524",
  "ch": "鐘",
  "kanji": "鐘",
  "sentence": "お寺の《カネ》をつく。",
  "grade": 2,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0525",
  "ch": "畳",
  "kanji": "畳",
  "sentence": "和室の《タタミ》に座る。",
  "grade": 2,
  "radicals": [
   "田"
  ]
 },
 {
  "id": "kwc0526",
  "ch": "嬢",
  "kanji": "お嬢さん",
  "sentence": "隣のお《ジョウ》さんに会う。",
  "grade": 2,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0527",
  "ch": "錠",
  "kanji": "錠",
  "sentence": "ドアに《ジョウ》をかける。",
  "grade": 2,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0528",
  "ch": "譲",
  "kanji": "譲る",
  "sentence": "席を《ユズ》る。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0529",
  "ch": "嘱",
  "kanji": "嘱託",
  "sentence": "《ショクタク》の先生が来る。",
  "grade": 2,
  "radicals": [
   "口（くちへん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0530",
  "ch": "辱",
  "kanji": "屈辱",
  "sentence": "《クツジョク》を味わう。",
  "grade": 2,
  "radicals": [
   "尸（しかばね）",
   "辰"
  ]
 },
 {
  "id": "kwc0531",
  "ch": "尻",
  "kanji": "尻",
  "sentence": "《シリ》もちをつく。",
  "grade": 2,
  "radicals": [
   "尸（しかばね）"
  ]
 },
 {
  "id": "kwc0532",
  "ch": "伸",
  "kanji": "伸びる",
  "sentence": "身長が《ノ》びる。",
  "grade": 2,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0533",
  "ch": "芯",
  "kanji": "芯",
  "sentence": "鉛筆の《シン》が折れる。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0534",
  "ch": "辛",
  "kanji": "辛い",
  "sentence": "カレーが《カラ》い。",
  "grade": 2,
  "radicals": [
   "辛"
  ]
 },
 {
  "id": "kwc0535",
  "ch": "審",
  "kanji": "審判",
  "sentence": "《シンパン》の判定に従う。",
  "grade": 2,
  "radicals": [
   "宀（うかんむり）",
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0536",
  "ch": "薪",
  "kanji": "薪",
  "sentence": "キャンプで《マキ》を集める。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0537",
  "ch": "尋",
  "kanji": "尋ねる",
  "sentence": "道を《タズ》ねる。",
  "grade": 2,
  "radicals": [
   "寸（すん）"
  ]
 },
 {
  "id": "kwc0538",
  "ch": "炊",
  "kanji": "炊く",
  "sentence": "ご飯を《タ》く。",
  "grade": 2,
  "radicals": [
   "火（ひへん）"
  ]
 },
 {
  "id": "kwc0539",
  "ch": "粋",
  "kanji": "純粋",
  "sentence": "《ジュンスイ》な気持ち。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）",
   "米（こめへん）"
  ]
 },
 {
  "id": "kwc0540",
  "ch": "穂",
  "kanji": "穂",
  "sentence": "稲の《ホ》が実る。",
  "grade": 2,
  "radicals": [
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0541",
  "ch": "髄",
  "kanji": "骨髄",
  "sentence": "友達が《コツズイ》バンクに登録した。",
  "grade": 2,
  "radicals": [
   "骨",
   "骨"
  ]
 },
 {
  "id": "kwc0542",
  "ch": "瀬",
  "kanji": "瀬",
  "sentence": "川の《セ》で魚を捕る。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0543",
  "ch": "斉",
  "kanji": "一斉",
  "sentence": "《イッセイ》に立ち上がる。",
  "grade": 2,
  "radicals": [
   "一",
   "齊"
  ]
 },
 {
  "id": "kwc0544",
  "ch": "牲",
  "kanji": "犠牲",
  "sentence": "《ギセイ》になった動物を守る。",
  "grade": 2,
  "radicals": [
   "牛（うしへん）",
   "牛（うしへん）"
  ]
 },
 {
  "id": "kwc0545",
  "ch": "婿",
  "kanji": "婿",
  "sentence": "娘の《ムコ》に会う。",
  "grade": 2,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0546",
  "ch": "請",
  "kanji": "請求",
  "sentence": "《セイキュウ》書が届く。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0547",
  "ch": "斥",
  "kanji": "排斥",
  "sentence": "彼の意見を《ハイセキ》する。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "斤"
  ]
 },
 {
  "id": "kwc0548",
  "ch": "隻",
  "kanji": "一隻",
  "sentence": "港に《イッセキ》の船が着く。",
  "grade": 2,
  "radicals": [
   "一",
   "隹"
  ]
 },
 {
  "id": "kwc0549",
  "ch": "惜",
  "kanji": "惜しい",
  "sentence": "負けて《オ》しい。",
  "grade": 2,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0550",
  "ch": "籍",
  "kanji": "書籍",
  "sentence": "図書館で《ショセキ》を借りる。",
  "grade": 2,
  "radicals": [
   "曰",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0551",
  "ch": "摂",
  "kanji": "摂取",
  "sentence": "水分を《セッシュ》する。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "又（また）"
  ]
 },
 {
  "id": "kwc0552",
  "ch": "羨",
  "kanji": "羨ましい",
  "sentence": "友達が《ウラヤ》ましい。",
  "grade": 2,
  "radicals": [
   "羊"
  ]
 },
 {
  "id": "kwc0553",
  "ch": "繕",
  "kanji": "繕う",
  "sentence": "服を《ツクロ》う。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0554",
  "ch": "措",
  "kanji": "措置",
  "sentence": "適切な《ソチ》をとる。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "网（あみがしら）"
  ]
 },
 {
  "id": "kwc0555",
  "ch": "粗",
  "kanji": "粗い",
  "sentence": "この布は目が《アラ》い。",
  "grade": 2,
  "radicals": [
   "米（こめへん）"
  ]
 },
 {
  "id": "kwc0556",
  "ch": "礎",
  "kanji": "基礎",
  "sentence": "算数の《キソ》を固める。",
  "grade": 1,
  "radicals": [
   "土",
   "石（いしへん）"
  ]
 },
 {
  "id": "kwc0557",
  "ch": "双",
  "kanji": "双子",
  "sentence": "クラスに《フタゴ》の姉妹がいる。",
  "grade": 1,
  "radicals": [
   "又（また）",
   "子"
  ]
 },
 {
  "id": "kwc0558",
  "ch": "壮",
  "kanji": "壮大",
  "sentence": "《ソウダイ》な景色に感動した。",
  "grade": 2,
  "radicals": [
   "士",
   "大"
  ]
 },
 {
  "id": "kwc0559",
  "ch": "荘",
  "kanji": "別荘",
  "sentence": "夏休みに祖父の《ベッソウ》へ行く。",
  "grade": 2,
  "radicals": [
   "刀（りっとう）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0560",
  "ch": "桑",
  "kanji": "桑",
  "sentence": "カイコは《クワ》の葉を食べる。",
  "grade": 2,
  "radicals": [
   "木（き）"
  ]
 },
 {
  "id": "kwc0561",
  "ch": "掃",
  "kanji": "掃除",
  "sentence": "放課後に教室を《ソウジ》する。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0562",
  "ch": "曽",
  "kanji": "曽祖父",
  "sentence": "《ソウソフ》は百歳を超えている。",
  "grade": 2,
  "radicals": [
   "日（ひ）",
   "示（しめすへん）",
   "父"
  ]
 },
 {
  "id": "kwc0563",
  "ch": "喪",
  "kanji": "喪服",
  "sentence": "祖父の葬式で《モフク》を着た。",
  "grade": 2,
  "radicals": [
   "口",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0564",
  "ch": "葬",
  "kanji": "葬式",
  "sentence": "近所のお寺で《ソウシキ》が行われた。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）",
   "弋"
  ]
 },
 {
  "id": "kwc0565",
  "ch": "霜",
  "kanji": "霜",
  "sentence": "今朝は庭に《シモ》が降りていた。",
  "grade": 2,
  "radicals": [
   "雨（あめかんむり）"
  ]
 },
 {
  "id": "kwc0566",
  "ch": "憎",
  "kanji": "憎む",
  "sentence": "彼を《ニク》む気持ちはない。",
  "grade": 2,
  "radicals": [
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0567",
  "ch": "賊",
  "kanji": "海賊",
  "sentence": "映画で《カイゾク》の物語を見た。",
  "grade": 2,
  "radicals": [
   "水（さんずい）",
   "貝（かいへん）"
  ]
 },
 {
  "id": "kwc0568",
  "ch": "怠",
  "kanji": "怠ける",
  "sentence": "宿題を《ナマ》けてはいけない。",
  "grade": 2,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0569",
  "ch": "胎",
  "kanji": "胎児",
  "sentence": "母のおなかの中には《タイジ》がいる。",
  "grade": 2,
  "radicals": [
   "肉（にくづき）",
   "八"
  ]
 },
 {
  "id": "kwc0570",
  "ch": "泰",
  "kanji": "安泰",
  "sentence": "会社の経営は《アンタイ》だそうだ。",
  "grade": 2,
  "radicals": [
   "宀（うかんむり）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0571",
  "ch": "袋",
  "kanji": "袋",
  "sentence": "買った物を《フクロ》に入れる。",
  "grade": 2,
  "radicals": [
   "衣（ころも）"
  ]
 },
 {
  "id": "kwc0572",
  "ch": "逮",
  "kanji": "逮捕",
  "sentence": "事件の犯人が《タイホ》された。",
  "grade": 2,
  "radicals": [
   "辵（しんにょう）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0573",
  "ch": "滝",
  "kanji": "滝",
  "sentence": "山の中に大きな《タキ》がある。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0574",
  "ch": "択",
  "kanji": "選択",
  "sentence": "入りたい部活を《センタク》する。",
  "grade": 2,
  "radicals": [
   "辵（しんにょう）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0575",
  "ch": "託",
  "kanji": "託す",
  "sentence": "友人に手紙を《タク》す。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0576",
  "ch": "諾",
  "kanji": "承諾",
  "sentence": "参加のお願いを《ショウダク》した。",
  "grade": 2,
  "radicals": [
   "手",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0577",
  "ch": "濁",
  "kanji": "濁る",
  "sentence": "大雨で川の水が《ニゴ》る。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0578",
  "ch": "但",
  "kanji": "但し",
  "sentence": "参加できる。《タダ》し、予約が必要だ。",
  "grade": 2,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0579",
  "ch": "奪",
  "kanji": "奪う",
  "sentence": "強い風が帽子を《ウバ》う。",
  "grade": 2,
  "radicals": [
   "大"
  ]
 },
 {
  "id": "kwc0580",
  "ch": "旦",
  "kanji": "元旦",
  "sentence": "《ガンタン》に家族で初詣に行く。",
  "grade": 2,
  "radicals": [
   "八",
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0581",
  "ch": "胆",
  "kanji": "大胆",
  "sentence": "彼は《ダイタン》な行動をとった。",
  "grade": 2,
  "radicals": [
   "大",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0582",
  "ch": "鍛",
  "kanji": "鍛える",
  "sentence": "部活で毎日体を《キタ》える。",
  "grade": 2,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0583",
  "ch": "壇",
  "kanji": "花壇",
  "sentence": "校庭の《カダン》に花を植えた。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0584",
  "ch": "稚",
  "kanji": "幼稚",
  "sentence": "その考え方は少し《ヨウチ》だ。",
  "grade": 2,
  "radicals": [
   "幺（いとがしら）",
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0585",
  "ch": "畜",
  "kanji": "家畜",
  "sentence": "牧場で《カチク》を育てている。",
  "grade": 2,
  "radicals": [
   "宀（うかんむり）",
   "田"
  ]
 },
 {
  "id": "kwc0586",
  "ch": "逐",
  "kanji": "逐一",
  "sentence": "実験の経過を《チクイチ》記録する。",
  "grade": 2,
  "radicals": [
   "辵（しんにょう）",
   "一"
  ]
 },
 {
  "id": "kwc0587",
  "ch": "窒",
  "kanji": "窒息",
  "sentence": "煙で《チッソク》しそうになった。",
  "grade": 2,
  "radicals": [
   "穴（あなかんむり）",
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0588",
  "ch": "鋳",
  "kanji": "鋳造",
  "sentence": "工場で金属を《チュウゾウ》する。",
  "grade": 2,
  "radicals": [
   "金（かねへん）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0589",
  "ch": "駐",
  "kanji": "駐車",
  "sentence": "車を公園の前に《チュウシャ》する。",
  "grade": 2,
  "radicals": [
   "馬（うまへん）",
   "車"
  ]
 },
 {
  "id": "kwc0590",
  "ch": "彫",
  "kanji": "彫刻",
  "sentence": "美術の授業で木の《チョウコク》を作った。",
  "grade": 2,
  "radicals": [
   "彡（さんづくり）",
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0591",
  "ch": "超",
  "kanji": "超える",
  "sentence": "気温が三十度を《コ》える。",
  "grade": 2,
  "radicals": [
   "走（そうにょう）"
  ]
 },
 {
  "id": "kwc0592",
  "ch": "聴",
  "kanji": "聴く",
  "sentence": "音楽室で静かに曲を《キ》く。",
  "grade": 2,
  "radicals": [
   "耳（みみへん）"
  ]
 },
 {
  "id": "kwc0593",
  "ch": "陳",
  "kanji": "陳列",
  "sentence": "店員が新商品を棚に《チンレツ》する。",
  "grade": 2,
  "radicals": [
   "阜（こざとへん）",
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0594",
  "ch": "鎮",
  "kanji": "鎮める",
  "sentence": "深呼吸して怒りを《シズ》める。",
  "grade": 2,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0595",
  "ch": "墜",
  "kanji": "墜落",
  "sentence": "小型飛行機が山に《ツイラク》した。",
  "grade": 2,
  "radicals": [
   "土",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0596",
  "ch": "塚",
  "kanji": "塚",
  "sentence": "村はずれに古い《ツカ》がある。",
  "grade": 2,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0597",
  "ch": "漬",
  "kanji": "漬ける",
  "sentence": "きゅうりを塩に《ツ》ける。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0598",
  "ch": "爪",
  "kanji": "爪",
  "sentence": "寝る前に《ツメ》を短く切る。",
  "grade": 2,
  "radicals": [
   "爪"
  ]
 },
 {
  "id": "kwc0599",
  "ch": "帝",
  "kanji": "皇帝",
  "sentence": "歴史の授業で《コウテイ》について学んだ。",
  "grade": 2,
  "radicals": [
   "白",
   "巾（はば）"
  ]
 },
 {
  "id": "kwc0600",
  "ch": "訂",
  "kanji": "訂正",
  "sentence": "作文の間違いを《テイセイ》する。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）",
   "止"
  ]
 },
 {
  "id": "kwc0601",
  "ch": "締",
  "kanji": "締める",
  "sentence": "ネクタイをしっかり《シ》める。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0602",
  "ch": "諦",
  "kanji": "諦める",
  "sentence": "最後まで《アキラ》めないで走った。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0603",
  "ch": "泥",
  "kanji": "泥",
  "sentence": "雨で運動場が《ドロ》だらけになった。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0604",
  "ch": "哲",
  "kanji": "哲学",
  "sentence": "図書室で《テツガク》の本を読んだ。",
  "grade": 2,
  "radicals": [
   "口",
   "子"
  ]
 },
 {
  "id": "kwc0605",
  "ch": "徹",
  "kanji": "徹底",
  "sentence": "手洗いを《テッテイ》的に行う。",
  "grade": 2,
  "radicals": [
   "彳（ぎょうにんべん）",
   "广（まだれ）"
  ]
 },
 {
  "id": "kwc0606",
  "ch": "撤",
  "kanji": "撤去",
  "sentence": "古くなった看板が《テッキョ》された。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "厶"
  ]
 },
 {
  "id": "kwc0607",
  "ch": "斗",
  "kanji": "北斗七星",
  "sentence": "夜空に《ホクトシチセイ》を見つけた。",
  "grade": 2,
  "radicals": [
   "匕",
   "斗",
   "一",
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0608",
  "ch": "塗",
  "kanji": "塗る",
  "sentence": "木の壁にペンキを《ヌ》る。",
  "grade": 2,
  "radicals": [
   "土"
  ]
 },
 {
  "id": "kwc0609",
  "ch": "凍",
  "kanji": "凍る",
  "sentence": "寒い朝、池の水が《コオ》る。",
  "grade": 1,
  "radicals": [
   "冫（にすい）"
  ]
 },
 {
  "id": "kwc0610",
  "ch": "塔",
  "kanji": "塔",
  "sentence": "遠くに高い《トウ》が見える。",
  "grade": 2,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0611",
  "ch": "痘",
  "kanji": "天然痘",
  "sentence": "社会の授業で《テンネントウ》について学んだ。",
  "grade": 2,
  "radicals": [
   "大",
   "火（ひ）",
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc0612",
  "ch": "筒",
  "kanji": "筒",
  "sentence": "画用紙を丸めて《ツツ》を作った。",
  "grade": 2,
  "radicals": [
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0613",
  "ch": "峠",
  "kanji": "峠",
  "sentence": "自転車で急な《トウゲ》を越えた。",
  "grade": 2,
  "radicals": [
   "山"
  ]
 },
 {
  "id": "kwc0614",
  "ch": "匿",
  "kanji": "匿名",
  "sentence": "アンケートに《トクメイ》で意見を書いた。",
  "grade": 2,
  "radicals": [
   "匸",
   "口"
  ]
 },
 {
  "id": "kwc0615",
  "ch": "篤",
  "kanji": "危篤",
  "sentence": "入院中の祖父が《キトク》になったと聞いた。",
  "grade": 2,
  "radicals": [
   "卩（ふしづくり）",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0616",
  "ch": "豚",
  "kanji": "豚肉",
  "sentence": "夕食に《ブタニク》のしょうが焼きが出た。",
  "grade": 2,
  "radicals": [
   "豕",
   "肉"
  ]
 },
 {
  "id": "kwc0617",
  "ch": "曇",
  "kanji": "曇る",
  "sentence": "明日は天気が《クモ》るらしい。",
  "grade": 2,
  "radicals": [
   "日（ひ）"
  ]
 },
 {
  "id": "kwc0618",
  "ch": "丼",
  "kanji": "牛丼",
  "sentence": "昼食に《ギュウドン》を食べた。",
  "grade": 2,
  "radicals": [
   "牛（うし）",
   "丶"
  ]
 },
 {
  "id": "kwc0619",
  "ch": "匂",
  "kanji": "匂い",
  "sentence": "花の甘い《ニオ》いがする。",
  "grade": 2,
  "radicals": [
   "勹（つつみがまえ）"
  ]
 },
 {
  "id": "kwc0620",
  "ch": "尿",
  "kanji": "尿検査",
  "sentence": "健康診断で《ニョウケンサ》をした。",
  "grade": 2,
  "radicals": [
   "尸（しかばね）",
   "木（きへん）",
   "木"
  ]
 },
 {
  "id": "kwc0621",
  "ch": "粘",
  "kanji": "粘る",
  "sentence": "試合の最後まで《ネバ》る。",
  "grade": 2,
  "radicals": [
   "米（こめへん）"
  ]
 },
 {
  "id": "kwc0622",
  "ch": "把",
  "kanji": "把握",
  "sentence": "状況を正しく《ハアク》する。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0623",
  "ch": "婆",
  "kanji": "老婆",
  "sentence": "昔話に《ロウバ》が登場する。",
  "grade": 2,
  "radicals": [
   "老",
   "女（おんな）"
  ]
 },
 {
  "id": "kwc0624",
  "ch": "排",
  "kanji": "排除",
  "sentence": "ごみを《ハイジョ》する作業を行った。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0625",
  "ch": "陪",
  "kanji": "陪審員",
  "sentence": "アメリカには《バイシンイン》制度がある。",
  "grade": 2,
  "radicals": [
   "阜（こざとへん）",
   "宀（うかんむり）",
   "口"
  ]
 },
 {
  "id": "kwc0626",
  "ch": "縛",
  "kanji": "縛る",
  "sentence": "新聞紙をひもで《シバ》る。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0627",
  "ch": "髪",
  "kanji": "髪",
  "sentence": "妹は長い《カミ》をしている。",
  "grade": 2,
  "radicals": [
   "髟（かみがしら）"
  ]
 },
 {
  "id": "kwc0628",
  "ch": "伐",
  "kanji": "伐採",
  "sentence": "山の木を《バッサイ》する計画がある。",
  "grade": 2,
  "radicals": [
   "人（にんべん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0629",
  "ch": "帆",
  "kanji": "帆",
  "sentence": "船の《ホ》が風を受けて進む。",
  "grade": 2,
  "radicals": [
   "巾（はば）"
  ]
 },
 {
  "id": "kwc0630",
  "ch": "伴",
  "kanji": "伴う",
  "sentence": "台風は強い雨を《トモナ》う。",
  "grade": 2,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0631",
  "ch": "畔",
  "kanji": "湖畔",
  "sentence": "《コハン》のホテルに泊まった。",
  "grade": 2,
  "radicals": [
   "水（さんずい）",
   "田"
  ]
 },
 {
  "id": "kwc0632",
  "ch": "搬",
  "kanji": "運搬",
  "sentence": "トラックで荷物を《ウンパン》する。",
  "grade": 2,
  "radicals": [
   "辵（しんにょう）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0633",
  "ch": "繁",
  "kanji": "繁栄",
  "sentence": "この町は昔から《ハンエイ》してきた。",
  "grade": 2,
  "radicals": [
   "糸",
   "木（き）"
  ]
 },
 {
  "id": "kwc0634",
  "ch": "藩",
  "kanji": "藩",
  "sentence": "江戸時代、各地に《ハン》があった。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0635",
  "ch": "蛮",
  "kanji": "野蛮",
  "sentence": "その行動は《ヤバン》だと非難された。",
  "grade": 2,
  "radicals": [
   "里",
   "虫"
  ]
 },
 {
  "id": "kwc0636",
  "ch": "卑",
  "kanji": "卑怯",
  "sentence": "うそをつくのは《ヒキョウ》だ。",
  "grade": 2,
  "radicals": [
   "十",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0637",
  "ch": "碑",
  "kanji": "石碑",
  "sentence": "公園に古い《セキヒ》が立っている。",
  "grade": 2,
  "radicals": [
   "石",
   "石（いしへん）"
  ]
 },
 {
  "id": "kwc0638",
  "ch": "眉",
  "kanji": "眉",
  "sentence": "驚いて《マユ》を上げた。",
  "grade": 2,
  "radicals": [
   "目"
  ]
 },
 {
  "id": "kwc0639",
  "ch": "泌",
  "kanji": "分泌",
  "sentence": "汗が体から《ブンピツ》される。",
  "grade": 2,
  "radicals": [
   "刀",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0640",
  "ch": "姫",
  "kanji": "姫",
  "sentence": "物語には美しい《ヒメ》が登場する。",
  "grade": 2,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0641",
  "ch": "漂",
  "kanji": "漂う",
  "sentence": "海に木の葉が《タダヨ》う。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0642",
  "ch": "苗",
  "kanji": "苗",
  "sentence": "畑に稲の《ナエ》を植えた。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0643",
  "ch": "頻",
  "kanji": "頻繁",
  "sentence": "最近、地震が《ヒンパン》に起こる。",
  "grade": 2,
  "radicals": [
   "頁（おおがい）",
   "糸"
  ]
 },
 {
  "id": "kwc0644",
  "ch": "附",
  "kanji": "附属",
  "sentence": "大学の《フゾク》高校に通う。",
  "grade": 2,
  "radicals": [
   "阜（こざとへん）",
   "尸（しかばね）"
  ]
 },
 {
  "id": "kwc0645",
  "ch": "符",
  "kanji": "音符",
  "sentence": "楽譜に《オンプ》を書き込む。",
  "grade": 2,
  "radicals": [
   "音",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0646",
  "ch": "腐",
  "kanji": "腐る",
  "sentence": "暑さで野菜が《クサ》る。",
  "grade": 2,
  "radicals": [
   "肉"
  ]
 },
 {
  "id": "kwc0647",
  "ch": "敷",
  "kanji": "敷く",
  "sentence": "床に布団を《シ》く。",
  "grade": 2,
  "radicals": [
   "攴（ぼくにょう）"
  ]
 },
 {
  "id": "kwc0648",
  "ch": "封",
  "kanji": "封筒",
  "sentence": "手紙を《フウトウ》に入れる。",
  "grade": 2,
  "radicals": [
   "寸",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0649",
  "ch": "伏",
  "kanji": "伏せる",
  "sentence": "合図で床に体を《フ》せる。",
  "grade": 2,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0650",
  "ch": "覆",
  "kanji": "覆う",
  "sentence": "雪が町全体を《オオ》う。",
  "grade": 2,
  "radicals": [
   "襾"
  ]
 },
 {
  "id": "kwc0651",
  "ch": "紛",
  "kanji": "紛失",
  "sentence": "財布を《フンシツ》してしまった。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）",
   "大"
  ]
 },
 {
  "id": "kwc0652",
  "ch": "雰",
  "kanji": "雰囲気",
  "sentence": "教室は明るい《フンイキ》だ。",
  "grade": 2,
  "radicals": [
   "雨（あめかんむり）",
   "囗（くにがまえ）",
   "气"
  ]
 },
 {
  "id": "kwc0653",
  "ch": "墳",
  "kanji": "古墳",
  "sentence": "社会科見学で《コフン》を見学した。",
  "grade": 2,
  "radicals": [
   "口",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0654",
  "ch": "璧",
  "kanji": "完璧",
  "sentence": "テストで《カンペキ》な点数を取った。",
  "grade": 2,
  "radicals": [
   "宀（うかんむり）",
   "玉"
  ]
 },
 {
  "id": "kwc0655",
  "ch": "癖",
  "kanji": "癖",
  "sentence": "彼には髪を触る《クセ》がある。",
  "grade": 3,
  "radicals": [
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc0656",
  "ch": "遍",
  "kanji": "普遍",
  "sentence": "それは人類に《フヘン》的な考え方だ。",
  "grade": 2,
  "radicals": [
   "日（ひ）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0657",
  "ch": "舗",
  "kanji": "舗装",
  "sentence": "この道路は《ホソウ》されている。",
  "grade": 2,
  "radicals": [
   "人",
   "衣（ころも）"
  ]
 },
 {
  "id": "kwc0658",
  "ch": "募",
  "kanji": "募集",
  "sentence": "部活動でメンバーを《ボシュウ》する。",
  "grade": 2,
  "radicals": [
   "力（ちから）",
   "隹"
  ]
 },
 {
  "id": "kwc0659",
  "ch": "慕",
  "kanji": "慕う",
  "sentence": "後輩は先輩を《シタ》っている。",
  "grade": 2,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0660",
  "ch": "簿",
  "kanji": "帳簿",
  "sentence": "店の《チョウボ》をつける。",
  "grade": 2,
  "radicals": [
   "巾（はば）",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0661",
  "ch": "芳",
  "kanji": "芳香",
  "sentence": "部屋に《ホウコウ》剤を置く。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）",
   "香"
  ]
 },
 {
  "id": "kwc0662",
  "ch": "邦",
  "kanji": "邦楽",
  "sentence": "授業で《ホウガク》を鑑賞した。",
  "grade": 2,
  "radicals": [
   "邑（おおざと）",
   "木（き）"
  ]
 },
 {
  "id": "kwc0663",
  "ch": "奉",
  "kanji": "奉仕",
  "sentence": "地域の《ホウシ》活動に参加した。",
  "grade": 2,
  "radicals": [
   "大",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0664",
  "ch": "胞",
  "kanji": "細胞",
  "sentence": "理科で《サイボウ》について学んだ。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0665",
  "ch": "倣",
  "kanji": "倣う",
  "sentence": "先生のやり方に《ナラ》う。",
  "grade": 2,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0666",
  "ch": "崩",
  "kanji": "崩れる",
  "sentence": "大雨で山が《クズ》れる。",
  "grade": 2,
  "radicals": [
   "山"
  ]
 },
 {
  "id": "kwc0667",
  "ch": "飽",
  "kanji": "飽きる",
  "sentence": "同じゲームに《ア》きる。",
  "grade": 2,
  "radicals": [
   "食（しょくへん）"
  ]
 },
 {
  "id": "kwc0668",
  "ch": "縫",
  "kanji": "縫う",
  "sentence": "家庭科でボタンを《ヌ》う。",
  "grade": 2,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0669",
  "ch": "乏",
  "kanji": "乏しい",
  "sentence": "この地域は水が《トボ》しい。",
  "grade": 2,
  "radicals": [
   "丿"
  ]
 },
 {
  "id": "kwc0670",
  "ch": "房",
  "kanji": "冷房",
  "sentence": "夏は教室の《レイボウ》をつける。",
  "grade": 2,
  "radicals": [
   "冫（にすい）",
   "戸（とだれ）"
  ]
 },
 {
  "id": "kwc0671",
  "ch": "某",
  "kanji": "某国",
  "sentence": "《ボウコク》で新しい制度が始まった。",
  "grade": 2,
  "radicals": [
   "木（き）",
   "囗（くにがまえ）"
  ]
 },
 {
  "id": "kwc0672",
  "ch": "傍",
  "kanji": "傍観",
  "sentence": "けんかを《ボウカン》するだけだった。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "見（みる）"
  ]
 },
 {
  "id": "kwc0673",
  "ch": "膨",
  "kanji": "膨らむ",
  "sentence": "風船が大きく《フク》らむ。",
  "grade": 2,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0674",
  "ch": "謀",
  "kanji": "陰謀",
  "sentence": "物語の中で《インボウ》が明らかになる。",
  "grade": 2,
  "radicals": [
   "阜（こざとへん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0675",
  "ch": "朴",
  "kanji": "素朴",
  "sentence": "彼は《ソボク》な人柄で好かれている。",
  "grade": 2,
  "radicals": [
   "糸",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0676",
  "ch": "墨",
  "kanji": "墨",
  "sentence": "習字で《スミ》をすった。",
  "grade": 2,
  "radicals": [
   "土"
  ]
 },
 {
  "id": "kwc0677",
  "ch": "没",
  "kanji": "没頭",
  "sentence": "読書に《ボットウ》する。",
  "grade": 2,
  "radicals": [
   "水（さんずい）",
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc0678",
  "ch": "翻",
  "kanji": "翻訳",
  "sentence": "英語の本を《ホンヤク》する。",
  "grade": 2,
  "radicals": [
   "羽",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0679",
  "ch": "魔",
  "kanji": "魔法",
  "sentence": "アニメの《マホウ》使いにあこがれる。",
  "grade": 2,
  "radicals": [
   "鬼",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0680",
  "ch": "昧",
  "kanji": "三昧",
  "sentence": "休日は読書《ザンマイ》で過ごした。",
  "grade": 2,
  "radicals": [
   "一",
   "日（ひへん）"
  ]
 },
 {
  "id": "kwc0681",
  "ch": "埋",
  "kanji": "埋める",
  "sentence": "校庭にタイムカプセルを《ウ》める。",
  "grade": 2,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0682",
  "ch": "膜",
  "kanji": "鼓膜",
  "sentence": "大きな音で《コマク》が痛くなった。",
  "grade": 2,
  "radicals": [
   "鼓",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0683",
  "ch": "又",
  "kanji": "又は",
  "sentence": "ペン《マタ》はえんぴつを用意する。",
  "grade": 1,
  "radicals": [
   "又（また）"
  ]
 },
 {
  "id": "kwc0684",
  "ch": "魅",
  "kanji": "魅力",
  "sentence": "この本には不思議な《ミリョク》がある。",
  "grade": 2,
  "radicals": [
   "鬼",
   "力"
  ]
 },
 {
  "id": "kwc0685",
  "ch": "岬",
  "kanji": "岬",
  "sentence": "《ミサキ》の先から海をながめた。",
  "grade": 2,
  "radicals": [
   "山"
  ]
 },
 {
  "id": "kwc0686",
  "ch": "蜜",
  "kanji": "蜂蜜",
  "sentence": "パンに《ハチミツ》をぬって食べる。",
  "grade": 2,
  "radicals": [
   "虫（むしへん）",
   "虫"
  ]
 },
 {
  "id": "kwc0687",
  "ch": "滅",
  "kanji": "滅びる",
  "sentence": "恐竜は大昔に《ホロ》びたと言われている。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0688",
  "ch": "免",
  "kanji": "免許",
  "sentence": "兄は先週、車の《メンキョ》を取った。",
  "grade": 2,
  "radicals": [
   "八",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0689",
  "ch": "茂",
  "kanji": "茂る",
  "sentence": "夏になると庭の木がよく《シゲ》る。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0690",
  "ch": "紋",
  "kanji": "指紋",
  "sentence": "ガラスに残った《シモン》を調べる。",
  "grade": 2,
  "radicals": [
   "手（てへん）",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0691",
  "ch": "厄",
  "kanji": "厄年",
  "sentence": "父は今年《ヤクドシ》だと言っていた。",
  "grade": 2,
  "radicals": [
   "厂（がんだれ）",
   "干"
  ]
 },
 {
  "id": "kwc0692",
  "ch": "喩",
  "kanji": "比喩",
  "sentence": "詩の中で《ヒユ》表現を見つけた。",
  "grade": 2,
  "radicals": [
   "比",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0693",
  "ch": "諭",
  "kanji": "諭す",
  "sentence": "先生が優しく生徒を《サト》した。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0694",
  "ch": "唯",
  "kanji": "唯一",
  "sentence": "これがクラスで《ユイイツ》の正解だった。",
  "grade": 2,
  "radicals": [
   "口（くちへん）",
   "一"
  ]
 },
 {
  "id": "kwc0695",
  "ch": "幽",
  "kanji": "幽霊",
  "sentence": "《ユウレイ》が出るとうわさの校舎がある。",
  "grade": 2,
  "radicals": [
   "幺",
   "雨（あめかんむり）"
  ]
 },
 {
  "id": "kwc0696",
  "ch": "悠",
  "kanji": "悠々",
  "sentence": "彼は試験に《ユウユウ》と合格した。",
  "grade": 2,
  "radicals": [
   "心（したごころ）",
   "々"
  ]
 },
 {
  "id": "kwc0697",
  "ch": "雄",
  "kanji": "雄大",
  "sentence": "北海道の《ユウダイ》な景色に感動した。",
  "grade": 2,
  "radicals": [
   "隹（ふるとり）",
   "大"
  ]
 },
 {
  "id": "kwc0698",
  "ch": "誘",
  "kanji": "誘う",
  "sentence": "友達を映画に《サソ》う。",
  "grade": 2,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0699",
  "ch": "憂",
  "kanji": "憂い",
  "sentence": "この地域には水害の《ウレ》いがある。",
  "grade": 2,
  "radicals": [
   "心"
  ]
 },
 {
  "id": "kwc0700",
  "ch": "融",
  "kanji": "融合",
  "sentence": "和と洋の文化が《ユウゴウ》した料理を食べた。",
  "grade": 3,
  "radicals": [
   "虫",
   "口"
  ]
 },
 {
  "id": "kwc0701",
  "ch": "揚",
  "kanji": "揚げる",
  "sentence": "から揚げを油で《ア》げる。",
  "grade": 2,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0702",
  "ch": "揺",
  "kanji": "揺れる",
  "sentence": "地震で家がひどく《ユ》れた。",
  "grade": 2,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0703",
  "ch": "擁",
  "kanji": "擁護",
  "sentence": "動物《ヨウゴ》団体の活動に参加した。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0704",
  "ch": "謡",
  "kanji": "童謡",
  "sentence": "祖母がなつかしい《ドウヨウ》を歌ってくれた。",
  "grade": 3,
  "radicals": [
   "立（にんにょう）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0705",
  "ch": "翼",
  "kanji": "翼",
  "sentence": "鳥が大きな《ツバサ》を広げて飛んだ。",
  "grade": 2,
  "radicals": [
   "羽"
  ]
 },
 {
  "id": "kwc0706",
  "ch": "裸",
  "kanji": "裸",
  "sentence": "お風呂に入る前に《ハダカ》になる。",
  "grade": 2,
  "radicals": [
   "衣（ころもへん）"
  ]
 },
 {
  "id": "kwc0707",
  "ch": "濫",
  "kanji": "濫用",
  "sentence": "権力の《ランヨウ》は許されない。",
  "grade": 2,
  "radicals": [
   "水（さんずい）",
   "用"
  ]
 },
 {
  "id": "kwc0708",
  "ch": "吏",
  "kanji": "官吏",
  "sentence": "昔の《カンリ》は国のために働いた。",
  "grade": 2,
  "radicals": [
   "宀（うかんむり）",
   "口"
  ]
 },
 {
  "id": "kwc0709",
  "ch": "竜",
  "kanji": "竜",
  "sentence": "伝説の《リュウ》が空を舞う物語を読んだ。",
  "grade": 2,
  "radicals": [
   "龍"
  ]
 },
 {
  "id": "kwc0710",
  "ch": "隆",
  "kanji": "隆盛",
  "sentence": "町の商店街はかつて《リュウセイ》を極めた。",
  "grade": 2,
  "radicals": [
   "阜（こざとへん）",
   "皿（さら）"
  ]
 },
 {
  "id": "kwc0711",
  "ch": "硫",
  "kanji": "硫黄",
  "sentence": "温泉から《イオウ》のにおいがした。",
  "grade": 2,
  "radicals": [
   "石（いしへん）",
   "黄"
  ]
 },
 {
  "id": "kwc0712",
  "ch": "慮",
  "kanji": "配慮",
  "sentence": "先生は生徒の気持ちに《ハイリョ》してくれる。",
  "grade": 2,
  "radicals": [
   "酉（とりへん）",
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0713",
  "ch": "了",
  "kanji": "了解",
  "sentence": "その説明でよく《リョウカイ》した。",
  "grade": 2,
  "radicals": [
   "亅",
   "角（つのへん）"
  ]
 },
 {
  "id": "kwc0714",
  "ch": "涼",
  "kanji": "涼しい",
  "sentence": "木陰は日なたより《スズ》しい。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0715",
  "ch": "猟",
  "kanji": "狩猟",
  "sentence": "山で《シュリョウ》をする人に出会った。",
  "grade": 2,
  "radicals": [
   "犬",
   "犬"
  ]
 },
 {
  "id": "kwc0716",
  "ch": "陵",
  "kanji": "丘陵",
  "sentence": "なだらかな《キュウリョウ》地帯が広がる。",
  "grade": 2,
  "radicals": [
   "一",
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0717",
  "ch": "糧",
  "kanji": "食糧",
  "sentence": "台風に備えて《ショクリョウ》を買っておく。",
  "grade": 2,
  "radicals": [
   "食",
   "米（こめへん）"
  ]
 },
 {
  "id": "kwc0718",
  "ch": "厘",
  "kanji": "一厘",
  "sentence": "彼の演技には《イチリン》の乱れもなかった。",
  "grade": 2,
  "radicals": [
   "一",
   "厂（がんだれ）"
  ]
 },
 {
  "id": "kwc0719",
  "ch": "倫",
  "kanji": "倫理",
  "sentence": "道徳の授業で《リンリ》について考えた。",
  "grade": 2,
  "radicals": [
   "人（にんべん）",
   "玉"
  ]
 },
 {
  "id": "kwc0720",
  "ch": "塁",
  "kanji": "塁",
  "sentence": "ランナーが《ルイ》に出た。",
  "grade": 2,
  "radicals": [
   "土"
  ]
 },
 {
  "id": "kwc0721",
  "ch": "励",
  "kanji": "励む",
  "sentence": "毎日練習に《ハゲ》む。",
  "grade": 2,
  "radicals": [
   "力（ちから）"
  ]
 },
 {
  "id": "kwc0722",
  "ch": "戻",
  "kanji": "戻る",
  "sentence": "忘れ物を取りに教室へ《モド》る。",
  "grade": 2,
  "radicals": [
   "戸"
  ]
 },
 {
  "id": "kwc0723",
  "ch": "鈴",
  "kanji": "鈴",
  "sentence": "自転車の《スズ》を鳴らして合図した。",
  "grade": 2,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0724",
  "ch": "零",
  "kanji": "零下",
  "sentence": "今朝の気温は《レイカ》まで下がった。",
  "grade": 3,
  "radicals": [
   "雨（あめかんむり）",
   "一"
  ]
 },
 {
  "id": "kwc0725",
  "ch": "霊",
  "kanji": "精霊",
  "sentence": "祭りで森の《セイレイ》の話を聞いた。",
  "grade": 3,
  "radicals": [
   "米（こめへん）",
   "雨（あめかんむり）"
  ]
 },
 {
  "id": "kwc0726",
  "ch": "齢",
  "kanji": "年齢",
  "sentence": "参加者の《ネンレイ》を確認する。",
  "grade": 2,
  "radicals": [
   "干",
   "齒"
  ]
 },
 {
  "id": "kwc0727",
  "ch": "麗",
  "kanji": "華麗",
  "sentence": "選手の《カレイ》な演技に拍手が起きた。",
  "grade": 2,
  "radicals": [
   "艸（くさかんむり）",
   "鹿"
  ]
 },
 {
  "id": "kwc0728",
  "ch": "裂",
  "kanji": "裂ける",
  "sentence": "強い風で紙が《サ》けてしまった。",
  "grade": 2,
  "radicals": [
   "衣（ころも）"
  ]
 },
 {
  "id": "kwc0729",
  "ch": "廉",
  "kanji": "廉価",
  "sentence": "この店は《レンカ》な商品を多く扱う。",
  "grade": 2,
  "radicals": [
   "广（まだれ）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0730",
  "ch": "錬",
  "kanji": "鍛錬",
  "sentence": "毎日の練習で心と体を《タンレン》する。",
  "grade": 2,
  "radicals": [
   "金（かねへん）",
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0731",
  "ch": "呂",
  "kanji": "風呂",
  "sentence": "疲れたので早めに《フロ》に入った。",
  "grade": 2,
  "radicals": [
   "風",
   "口"
  ]
 },
 {
  "id": "kwc0732",
  "ch": "炉",
  "kanji": "暖炉",
  "sentence": "冬は《ダンロ》の前で温まる。",
  "grade": 2,
  "radicals": [
   "日（ひへん）",
   "火（ひへん）"
  ]
 },
 {
  "id": "kwc0733",
  "ch": "浪",
  "kanji": "浪人",
  "sentence": "兄は一年間《ロウニン》して大学に合格した。",
  "grade": 2,
  "radicals": [
   "水（さんずい）",
   "人"
  ]
 },
 {
  "id": "kwc0734",
  "ch": "廊",
  "kanji": "廊下",
  "sentence": "《ロウカ》を走ってはいけません。",
  "grade": 2,
  "radicals": [
   "广（まだれ）",
   "一"
  ]
 },
 {
  "id": "kwc0735",
  "ch": "楼",
  "kanji": "摩天楼",
  "sentence": "都会の《マテンロウ》を見上げた。",
  "grade": 2,
  "radicals": [
   "手",
   "大",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0736",
  "ch": "漏",
  "kanji": "漏れる",
  "sentence": "屋根から雨水が《モ》れる。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0737",
  "ch": "湾",
  "kanji": "湾",
  "sentence": "船がゆっくりと《ワン》に入ってきた。",
  "grade": 2,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0738",
  "ch": "曖",
  "kanji": "曖昧",
  "sentence": "質問に《アイマイ》な返事をした。",
  "grade": 3,
  "radicals": [
   "日（ひへん）",
   "日（ひへん）"
  ]
 },
 {
  "id": "kwc0739",
  "ch": "畏",
  "kanji": "畏敬",
  "sentence": "先生の生き方に《イケイ》の念を抱いた。",
  "grade": 3,
  "radicals": [
   "田",
   "攴（ぼくにょう）"
  ]
 },
 {
  "id": "kwc0740",
  "ch": "尉",
  "kanji": "大尉",
  "sentence": "祖父は軍隊で《タイイ》という階級だった。",
  "grade": 3,
  "radicals": [
   "大",
   "寸"
  ]
 },
 {
  "id": "kwc0741",
  "ch": "萎",
  "kanji": "萎縮",
  "sentence": "叱られて体が《イシュク》した。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0742",
  "ch": "咽",
  "kanji": "咽喉",
  "sentence": "《インコウ》の痛みで病院に行った。",
  "grade": 3,
  "radicals": [
   "口（くちへん）",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0743",
  "ch": "姻",
  "kanji": "婚姻",
  "sentence": "二人は《コンイン》届を提出した。",
  "grade": 3,
  "radicals": [
   "女（おんなへん）",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0744",
  "ch": "淫",
  "kanji": "淫雨",
  "sentence": "《インウ》が続き、川の水位が上がった。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "雨"
  ]
 },
 {
  "id": "kwc0745",
  "ch": "韻",
  "kanji": "韻",
  "sentence": "詩は言葉の最後で同じ音の《イン》を踏むことがある。",
  "grade": 2,
  "radicals": [
   "音"
  ]
 },
 {
  "id": "kwc0746",
  "ch": "唄",
  "kanji": "子守唄",
  "sentence": "母が《コモリウタ》を歌ってくれた。",
  "grade": 2,
  "radicals": [
   "子",
   "宀（うかんむり）",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0747",
  "ch": "鬱",
  "kanji": "憂鬱",
  "sentence": "テストの結果に《ユウウツ》な気分になった。",
  "grade": 3,
  "radicals": [
   "心",
   "鬯"
  ]
 },
 {
  "id": "kwc0748",
  "ch": "畝",
  "kanji": "畝",
  "sentence": "農家の人が畑に《ウネ》を作った。",
  "grade": 3,
  "radicals": [
   "田"
  ]
 },
 {
  "id": "kwc0749",
  "ch": "謁",
  "kanji": "謁見",
  "sentence": "使者は王に《エッケン》した。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）",
   "見"
  ]
 },
 {
  "id": "kwc0750",
  "ch": "怨",
  "kanji": "怨念",
  "sentence": "物語の主人公は《オンネン》を抱えていた。",
  "grade": 3,
  "radicals": [
   "心（したごころ）",
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0751",
  "ch": "猿",
  "kanji": "猿",
  "sentence": "動物園で《サル》を観察した。",
  "grade": 3,
  "radicals": [
   "犬"
  ]
 },
 {
  "id": "kwc0752",
  "ch": "艶",
  "kanji": "艶",
  "sentence": "磨いた床に《ツヤ》が出た。",
  "grade": 3,
  "radicals": [
   "色"
  ]
 },
 {
  "id": "kwc0753",
  "ch": "凹",
  "kanji": "凹凸",
  "sentence": "道路の《オウトツ》に気をつけて歩く。",
  "grade": 3,
  "radicals": [
   "凵",
   "凵"
  ]
 },
 {
  "id": "kwc0754",
  "ch": "翁",
  "kanji": "翁",
  "sentence": "昔話には《オキナ》がよく登場する。",
  "grade": 3,
  "radicals": [
   "羽"
  ]
 },
 {
  "id": "kwc0755",
  "ch": "臆",
  "kanji": "臆病",
  "sentence": "弟は《オクビョウ》で犬を怖がる。",
  "grade": 3,
  "radicals": [
   "肉（にくづき）",
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc0756",
  "ch": "虞",
  "kanji": "虞",
  "sentence": "大雨で川が氾濫する《オソレ》がある。",
  "grade": 3,
  "radicals": [
   "虍（とらかんむり）"
  ]
 },
 {
  "id": "kwc0757",
  "ch": "苛",
  "kanji": "苛立つ",
  "sentence": "電車が遅れて《イラダ》った。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）",
   "立"
  ]
 },
 {
  "id": "kwc0758",
  "ch": "寡",
  "kanji": "寡黙",
  "sentence": "兄は《カモク》な性格だ。",
  "grade": 3,
  "radicals": [
   "宀（うかんむり）",
   "黑"
  ]
 },
 {
  "id": "kwc0759",
  "ch": "拐",
  "kanji": "誘拐",
  "sentence": "ニュースで《ユウカイ》事件が報じられた。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0760",
  "ch": "諧",
  "kanji": "俳諧",
  "sentence": "松尾芭蕉は《ハイカイ》の名人だった。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0761",
  "ch": "劾",
  "kanji": "弾劾",
  "sentence": "大統領が《ダンガイ》される可能性が出てきた。",
  "grade": 3,
  "radicals": [
   "弓（ゆみへん）",
   "力（ちから）"
  ]
 },
 {
  "id": "kwc0762",
  "ch": "骸",
  "kanji": "死骸",
  "sentence": "道端で虫の《シガイ》を見つけた。",
  "grade": 3,
  "radicals": [
   "歹",
   "骨"
  ]
 },
 {
  "id": "kwc0763",
  "ch": "殻",
  "kanji": "殻",
  "sentence": "卵の《カラ》をむいて食べる。",
  "grade": 3,
  "radicals": [
   "殳"
  ]
 },
 {
  "id": "kwc0764",
  "ch": "嚇",
  "kanji": "威嚇",
  "sentence": "犬が《イカク》するようにほえた。",
  "grade": 3,
  "radicals": [
   "女",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0765",
  "ch": "顎",
  "kanji": "顎",
  "sentence": "転んで《アゴ》を強く打った。",
  "grade": 3,
  "radicals": [
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc0766",
  "ch": "括",
  "kanji": "括弧",
  "sentence": "大事な言葉を《カッコ》でくくる。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "弓（ゆみへん）"
  ]
 },
 {
  "id": "kwc0767",
  "ch": "喝",
  "kanji": "一喝",
  "sentence": "先生に《イッカツ》されて教室が静かになった。",
  "grade": 3,
  "radicals": [
   "一",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0768",
  "ch": "渇",
  "kanji": "渇く",
  "sentence": "喉が《カワ》いたので水を飲んだ。",
  "grade": 3,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0769",
  "ch": "葛",
  "kanji": "葛藤",
  "sentence": "友情と正直さの間で《カットウ》した。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0770",
  "ch": "褐",
  "kanji": "褐色",
  "sentence": "日に焼けて肌が《カッショク》になった。",
  "grade": 3,
  "radicals": [
   "衣（ころもへん）",
   "色"
  ]
 },
 {
  "id": "kwc0771",
  "ch": "轄",
  "kanji": "管轄",
  "sentence": "この地域は市の《カンカツ》だ。",
  "grade": 3,
  "radicals": [
   "竹（たけかんむり）",
   "車（くるまへん）"
  ]
 },
 {
  "id": "kwc0772",
  "ch": "釜",
  "kanji": "釜",
  "sentence": "《カマ》でご飯を炊く。",
  "grade": 3,
  "radicals": [
   "金"
  ]
 },
 {
  "id": "kwc0773",
  "ch": "缶",
  "kanji": "缶詰",
  "sentence": "非常用に《カンヅメ》を買っておく。",
  "grade": 3,
  "radicals": [
   "缶",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0774",
  "ch": "陥",
  "kanji": "陥る",
  "sentence": "危険な状態に《オチイ》った。",
  "grade": 3,
  "radicals": [
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0775",
  "ch": "堪",
  "kanji": "堪能",
  "sentence": "旅行先で温泉料理を《タンノウ》した。",
  "grade": 3,
  "radicals": [
   "土（つちへん）",
   "肉"
  ]
 },
 {
  "id": "kwc0776",
  "ch": "棺",
  "kanji": "石棺",
  "sentence": "古墳から《セッカン》が見つかった。",
  "grade": 3,
  "radicals": [
   "石",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0777",
  "ch": "款",
  "kanji": "定款",
  "sentence": "会社の《テイカン》を確認する。",
  "grade": 3,
  "radicals": [
   "宀（うかんむり）",
   "欠（あくび）"
  ]
 },
 {
  "id": "kwc0778",
  "ch": "閑",
  "kanji": "閑静",
  "sentence": "この辺りは《カンセイ》な住宅街だ。",
  "grade": 3,
  "radicals": [
   "門（もんがまえ）",
   "青"
  ]
 },
 {
  "id": "kwc0779",
  "ch": "寛",
  "kanji": "寛大",
  "sentence": "先生は失敗にも《カンダイ》だった。",
  "grade": 3,
  "radicals": [
   "宀（うかんむり）",
   "大"
  ]
 },
 {
  "id": "kwc0780",
  "ch": "憾",
  "kanji": "遺憾",
  "sentence": "その結果をとても《イカン》に思う。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0781",
  "ch": "還",
  "kanji": "帰還",
  "sentence": "宇宙飛行士が無事に《キカン》した。",
  "grade": 3,
  "radicals": [
   "巾（はば）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0782",
  "ch": "韓",
  "kanji": "韓国",
  "sentence": "夏休みに《カンコク》へ旅行した。",
  "grade": 3,
  "radicals": [
   "韋",
   "囗（くにがまえ）"
  ]
 },
 {
  "id": "kwc0783",
  "ch": "艦",
  "kanji": "軍艦",
  "sentence": "博物館で《グンカン》の模型を見た。",
  "grade": 3,
  "radicals": [
   "車",
   "舟（ふねへん）"
  ]
 },
 {
  "id": "kwc0784",
  "ch": "玩",
  "kanji": "玩具",
  "sentence": "弟は《ガング》で遊ぶのが好きだ。",
  "grade": 3,
  "radicals": [
   "玉",
   "八"
  ]
 },
 {
  "id": "kwc0785",
  "ch": "伎",
  "kanji": "歌舞伎",
  "sentence": "家族で《カブキ》を観に行った。",
  "grade": 3,
  "radicals": [
   "欠（あくび）",
   "舛",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0786",
  "ch": "亀",
  "kanji": "亀",
  "sentence": "池で《カメ》がのんびり泳いでいた。",
  "grade": 3,
  "radicals": [
   "龜"
  ]
 },
 {
  "id": "kwc0787",
  "ch": "毀",
  "kanji": "毀損",
  "sentence": "運送中の《キソン》に注意する。",
  "grade": 3,
  "radicals": [
   "殳",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0788",
  "ch": "畿",
  "kanji": "近畿",
  "sentence": "修学旅行で《キンキ》地方を訪れた。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）",
   "田"
  ]
 },
 {
  "id": "kwc0789",
  "ch": "宜",
  "kanji": "適宜",
  "sentence": "《テキギ》休憩を取りながら勉強する。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0790",
  "ch": "偽",
  "kanji": "偽物",
  "sentence": "それは《ニセモノ》のブランド品だった。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "牛（うしへん）"
  ]
 },
 {
  "id": "kwc0791",
  "ch": "喫",
  "kanji": "喫茶店",
  "sentence": "駅前の《キッサテン》でお茶を飲んだ。",
  "grade": 3,
  "radicals": [
   "口（くちへん）",
   "艸（くさかんむり）",
   "广（まだれ）"
  ]
 },
 {
  "id": "kwc0792",
  "ch": "臼",
  "kanji": "石臼",
  "sentence": "《イシウス》で豆をひいた。",
  "grade": 3,
  "radicals": [
   "石",
   "臼"
  ]
 },
 {
  "id": "kwc0793",
  "ch": "糾",
  "kanji": "紛糾",
  "sentence": "会議は意見が分かれて《フンキュウ》した。",
  "grade": 3,
  "radicals": [
   "糸（いとへん）",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0794",
  "ch": "嗅",
  "kanji": "嗅覚",
  "sentence": "犬は《キュウカク》が優れている。",
  "grade": 3,
  "radicals": [
   "口（くちへん）",
   "見"
  ]
 },
 {
  "id": "kwc0795",
  "ch": "窮",
  "kanji": "窮屈",
  "sentence": "小さい靴で足が《キュウクツ》だ。",
  "grade": 3,
  "radicals": [
   "穴（あなかんむり）",
   "尸（しかばね）"
  ]
 },
 {
  "id": "kwc0796",
  "ch": "享",
  "kanji": "享受",
  "sentence": "平和な暮らしを《キョウジュ》する。",
  "grade": 3,
  "radicals": [
   "亠（なべぶた）",
   "又（また）"
  ]
 },
 {
  "id": "kwc0797",
  "ch": "挟",
  "kanji": "挟む",
  "sentence": "ノートにしおりを《ハサ》む。",
  "grade": 3,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0798",
  "ch": "恭",
  "kanji": "恭しい",
  "sentence": "客を《ウヤウヤ》しく迎えた。",
  "grade": 3,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0799",
  "ch": "矯",
  "kanji": "矯正",
  "sentence": "歯の《キョウセイ》をしている。",
  "grade": 3,
  "radicals": [
   "矢（やへん）",
   "止"
  ]
 },
 {
  "id": "kwc0800",
  "ch": "暁",
  "kanji": "暁",
  "sentence": "《アカツキ》の空が赤く染まった。",
  "grade": 3,
  "radicals": [
   "日（ひへん）"
  ]
 },
 {
  "id": "kwc0801",
  "ch": "琴",
  "kanji": "琴",
  "sentence": "音楽室に《コト》が置いてある。",
  "grade": 3,
  "radicals": [
   "玉"
  ]
 },
 {
  "id": "kwc0802",
  "ch": "僅",
  "kanji": "僅か",
  "sentence": "残り時間は《ワズ》かだった。",
  "grade": 3,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0803",
  "ch": "錦",
  "kanji": "錦",
  "sentence": "紅葉が山を《ニシキ》のように染めた。",
  "grade": 3,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0804",
  "ch": "謹",
  "kanji": "謹む",
  "sentence": "先生の話を《ツツシ》んで聞く。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0805",
  "ch": "襟",
  "kanji": "襟",
  "sentence": "シャツの《エリ》を正す。",
  "grade": 3,
  "radicals": [
   "衣（ころもへん）"
  ]
 },
 {
  "id": "kwc0806",
  "ch": "吟",
  "kanji": "吟味",
  "sentence": "資料を《ギンミ》してから発表する。",
  "grade": 3,
  "radicals": [
   "口（くちへん）",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0807",
  "ch": "惧",
  "kanji": "危惧",
  "sentence": "絶滅が《キグ》される動物がいる。",
  "grade": 3,
  "radicals": [
   "卩（ふしづくり）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0808",
  "ch": "隅",
  "kanji": "隅",
  "sentence": "教室の《スミ》に机を置く。",
  "grade": 3,
  "radicals": [
   "阜（こざとへん）"
  ]
 },
 {
  "id": "kwc0809",
  "ch": "窟",
  "kanji": "洞窟",
  "sentence": "探検隊が《ドウクツ》を調べた。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "穴（あなかんむり）"
  ]
 },
 {
  "id": "kwc0810",
  "ch": "勲",
  "kanji": "勲章",
  "sentence": "祖父は《クンショウ》をもらった。",
  "grade": 3,
  "radicals": [
   "力（ちから）",
   "立"
  ]
 },
 {
  "id": "kwc0811",
  "ch": "薫",
  "kanji": "薫る",
  "sentence": "風が《カオ》る五月になった。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0812",
  "ch": "茎",
  "kanji": "茎",
  "sentence": "花の《クキ》を切って花瓶に生けた。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0813",
  "ch": "渓",
  "kanji": "渓谷",
  "sentence": "夏休みに《ケイコク》へ遊びに行った。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "谷"
  ]
 },
 {
  "id": "kwc0814",
  "ch": "詣",
  "kanji": "初詣",
  "sentence": "元旦に神社へ《ハツモウデ》に行く。",
  "grade": 3,
  "radicals": [
   "刀（りっとう）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0815",
  "ch": "慶",
  "kanji": "慶事",
  "sentence": "結婚は一族の《ケイジ》だ。",
  "grade": 3,
  "radicals": [
   "心",
   "亅"
  ]
 },
 {
  "id": "kwc0816",
  "ch": "憬",
  "kanji": "憧憬",
  "sentence": "画家に《ドウケイ》の念を抱く。",
  "grade": 3,
  "radicals": [
   "心（りっしんべん）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0817",
  "ch": "稽",
  "kanji": "稽古",
  "sentence": "毎朝剣道の《ケイコ》をする。",
  "grade": 3,
  "radicals": [
   "禾（のぎへん）",
   "口"
  ]
 },
 {
  "id": "kwc0818",
  "ch": "隙",
  "kanji": "隙間",
  "sentence": "ドアの《スキマ》から風が入る。",
  "grade": 3,
  "radicals": [
   "阜（こざとへん）",
   "門（もんがまえ）"
  ]
 },
 {
  "id": "kwc0819",
  "ch": "桁",
  "kanji": "桁",
  "sentence": "大きな数の《ケタ》を数える。",
  "grade": 3,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0820",
  "ch": "献",
  "kanji": "献立",
  "sentence": "給食の《コンダテ》を確認する。",
  "grade": 3,
  "radicals": [
   "犬",
   "立"
  ]
 },
 {
  "id": "kwc0821",
  "ch": "謙",
  "kanji": "謙虚",
  "sentence": "彼はいつも《ケンキョ》な態度だ。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）",
   "虍（とらかんむり）"
  ]
 },
 {
  "id": "kwc0822",
  "ch": "繭",
  "kanji": "繭",
  "sentence": "蚕が《マユ》を作った。",
  "grade": 3,
  "radicals": [
   "糸"
  ]
 },
 {
  "id": "kwc0823",
  "ch": "懸",
  "kanji": "懸命",
  "sentence": "一生《ケンメイ》に走った。",
  "grade": 3,
  "radicals": [
   "心（したごころ）",
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0824",
  "ch": "弦",
  "kanji": "弦",
  "sentence": "バイオリンの《ゲン》が切れた。",
  "grade": 3,
  "radicals": [
   "弓（ゆみへん）"
  ]
 },
 {
  "id": "kwc0825",
  "ch": "舷",
  "kanji": "右舷",
  "sentence": "船の《ウゲン》から海を見る。",
  "grade": 3,
  "radicals": [
   "口",
   "舟（ふねへん）"
  ]
 },
 {
  "id": "kwc0826",
  "ch": "股",
  "kanji": "股",
  "sentence": "転んで《マタ》を強く打った。",
  "grade": 3,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0827",
  "ch": "錮",
  "kanji": "禁錮",
  "sentence": "罪を犯すと《キンコ》刑になることがある。",
  "grade": 3,
  "radicals": [
   "示",
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0828",
  "ch": "呉",
  "kanji": "呉服",
  "sentence": "祖母は《ゴフク》店で着物を選んだ。",
  "grade": 3,
  "radicals": [
   "口",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0829",
  "ch": "碁",
  "kanji": "碁",
  "sentence": "祖父と縁側で《ゴ》を打つ。",
  "grade": 3,
  "radicals": [
   "石"
  ]
 },
 {
  "id": "kwc0830",
  "ch": "勾",
  "kanji": "勾配",
  "sentence": "この坂は《コウバイ》が急だ。",
  "grade": 3,
  "radicals": [
   "勹（つつみがまえ）",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0831",
  "ch": "江",
  "kanji": "江戸",
  "sentence": "《エド》時代の暮らしを学んだ。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "戸"
  ]
 },
 {
  "id": "kwc0832",
  "ch": "侯",
  "kanji": "侯爵",
  "sentence": "彼の祖先は《コウシャク》だった。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "爪（つめかんむり）"
  ]
 },
 {
  "id": "kwc0833",
  "ch": "洪",
  "kanji": "洪水",
  "sentence": "大雨で川が《コウズイ》を起こした。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0834",
  "ch": "梗",
  "kanji": "梗塞",
  "sentence": "祖父は心筋《コウソク》で入院した。",
  "grade": 3,
  "radicals": [
   "木（きへん）",
   "土"
  ]
 },
 {
  "id": "kwc0835",
  "ch": "喉",
  "kanji": "喉",
  "sentence": "風邪で《ノド》が痛い。",
  "grade": 3,
  "radicals": [
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0836",
  "ch": "溝",
  "kanji": "溝",
  "sentence": "道路の《ミゾ》に落ち葉がたまる。",
  "grade": 3,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0837",
  "ch": "衡",
  "kanji": "均衡",
  "sentence": "予算の《キンコウ》を保つ。",
  "grade": 3,
  "radicals": [
   "土（つちへん）",
   "行（ぎょうがまえ）"
  ]
 },
 {
  "id": "kwc0838",
  "ch": "乞",
  "kanji": "乞う",
  "sentence": "神に晴天を《コ》う。",
  "grade": 3,
  "radicals": [
   "乙"
  ]
 },
 {
  "id": "kwc0839",
  "ch": "拷",
  "kanji": "拷問",
  "sentence": "昔の刑罰には《ゴウモン》があった。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "口"
  ]
 },
 {
  "id": "kwc0840",
  "ch": "剛",
  "kanji": "剛速球",
  "sentence": "投手が《ゴウソッキュウ》を投げた。",
  "grade": 3,
  "radicals": [
   "刀（りっとう）",
   "辵（しんにょう）",
   "玉"
  ]
 },
 {
  "id": "kwc0841",
  "ch": "傲",
  "kanji": "傲慢",
  "sentence": "彼の《ゴウマン》な態度に驚いた。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0842",
  "ch": "酷",
  "kanji": "残酷",
  "sentence": "その物語は《ザンコク》な結末だった。",
  "grade": 3,
  "radicals": [
   "歹",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0843",
  "ch": "駒",
  "kanji": "駒",
  "sentence": "将棋の《コマ》を並べる。",
  "grade": 3,
  "radicals": [
   "馬（うまへん）"
  ]
 },
 {
  "id": "kwc0844",
  "ch": "昆",
  "kanji": "昆虫",
  "sentence": "夏休みに《コンチュウ》採集をした。",
  "grade": 3,
  "radicals": [
   "日（ひ）",
   "虫"
  ]
 },
 {
  "id": "kwc0845",
  "ch": "痕",
  "kanji": "痕跡",
  "sentence": "事件現場に《コンセキ》が残る。",
  "grade": 3,
  "radicals": [
   "疒（やまいだれ）",
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0846",
  "ch": "懇",
  "kanji": "懇親会",
  "sentence": "卒業生の《コンシンカイ》が開かれた。",
  "grade": 3,
  "radicals": [
   "心（したごころ）",
   "見（みる）",
   "人"
  ]
 },
 {
  "id": "kwc0847",
  "ch": "沙",
  "kanji": "無沙汰",
  "sentence": "先生に《ブサタ》のお詫びを伝えた。",
  "grade": 3,
  "radicals": [
   "火（ひ）",
   "水（さんずい）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0848",
  "ch": "唆",
  "kanji": "唆す",
  "sentence": "友人を悪事に《ソソノカ》す。",
  "grade": 3,
  "radicals": [
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0849",
  "ch": "詐",
  "kanji": "詐欺",
  "sentence": "高齢者を狙った《サギ》事件が増えている。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）",
   "欠（あくび）"
  ]
 },
 {
  "id": "kwc0850",
  "ch": "挫",
  "kanji": "挫折",
  "sentence": "計画は途中で《ザセツ》した。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0851",
  "ch": "采",
  "kanji": "采配",
  "sentence": "監督がチームに《サイハイ》を振る。",
  "grade": 3,
  "radicals": [
   "爪（つめかんむり）",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0852",
  "ch": "宰",
  "kanji": "主宰",
  "sentence": "先生が読書クラブを《シュサイ》している。",
  "grade": 3,
  "radicals": [
   "丶",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0853",
  "ch": "栽",
  "kanji": "栽培",
  "sentence": "畑でトマトを《サイバイ》する。",
  "grade": 3,
  "radicals": [
   "木",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0854",
  "ch": "斎",
  "kanji": "書斎",
  "sentence": "父は《ショサイ》で本を読む。",
  "grade": 3,
  "radicals": [
   "曰",
   "文"
  ]
 },
 {
  "id": "kwc0855",
  "ch": "塞",
  "kanji": "塞ぐ",
  "sentence": "穴を布で《フサ》ぐ。",
  "grade": 3,
  "radicals": [
   "土"
  ]
 },
 {
  "id": "kwc0856",
  "ch": "柵",
  "kanji": "柵",
  "sentence": "動物園の《サク》の中にライオンがいた。",
  "grade": 3,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0857",
  "ch": "索",
  "kanji": "索引",
  "sentence": "辞典の《サクイン》で言葉を調べる。",
  "grade": 3,
  "radicals": [
   "糸",
   "弓（ゆみへん）"
  ]
 },
 {
  "id": "kwc0858",
  "ch": "酢",
  "kanji": "酢",
  "sentence": "サラダに《ス》をかける。",
  "grade": 3,
  "radicals": [
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0859",
  "ch": "刹",
  "kanji": "古刹",
  "sentence": "京都には歴史ある《コサツ》が多い。",
  "grade": 3,
  "radicals": [
   "口",
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc0860",
  "ch": "桟",
  "kanji": "桟橋",
  "sentence": "船が《サンバシ》に着いた。",
  "grade": 3,
  "radicals": [
   "木（きへん）",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0861",
  "ch": "傘",
  "kanji": "傘",
  "sentence": "雨の日は《カサ》を差す。",
  "grade": 3,
  "radicals": [
   "人"
  ]
 },
 {
  "id": "kwc0862",
  "ch": "斬",
  "kanji": "斬新",
  "sentence": "彼のアイデアは《ザンシン》だった。",
  "grade": 3,
  "radicals": [
   "斤（おのづくり）",
   "斤（おのづくり）"
  ]
 },
 {
  "id": "kwc0863",
  "ch": "恣",
  "kanji": "恣意的",
  "sentence": "規則を《シイテキ》に変えてはいけない。",
  "grade": 3,
  "radicals": [
   "心（したごころ）",
   "心（したごころ）",
   "白"
  ]
 },
 {
  "id": "kwc0864",
  "ch": "嗣",
  "kanji": "嗣子",
  "sentence": "彼はこの家の《シシ》として育てられた。",
  "grade": 3,
  "radicals": [
   "口",
   "子"
  ]
 },
 {
  "id": "kwc0865",
  "ch": "摯",
  "kanji": "真摯",
  "sentence": "彼は《シンシ》な態度で謝罪した。",
  "grade": 3,
  "radicals": [
   "目",
   "手"
  ]
 },
 {
  "id": "kwc0866",
  "ch": "賜",
  "kanji": "賜る",
  "sentence": "陛下から言葉を《タマワ》る。",
  "grade": 3,
  "radicals": [
   "貝（かいへん）"
  ]
 },
 {
  "id": "kwc0867",
  "ch": "餌",
  "kanji": "餌",
  "sentence": "毎朝、金魚に《エサ》をやる。",
  "grade": 3,
  "radicals": [
   "食（しょくへん）"
  ]
 },
 {
  "id": "kwc0868",
  "ch": "璽",
  "kanji": "御璽",
  "sentence": "天皇の《ギョジ》が押された文書だ。",
  "grade": 3,
  "radicals": [
   "彳（ぎょうにんべん）",
   "玉"
  ]
 },
 {
  "id": "kwc0869",
  "ch": "𠮟",
  "kanji": "𠮟る",
  "sentence": "宿題を忘れて先生に《シカ》られた。",
  "grade": 3,
  "radicals": [
   "口（くちへん）"
  ]
 },
 {
  "id": "kwc0870",
  "ch": "嫉",
  "kanji": "嫉む",
  "sentence": "人の幸せを《ソネ》むのはよくない。",
  "grade": 3,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0871",
  "ch": "漆",
  "kanji": "漆",
  "sentence": "この器には《ウルシ》が塗られている。",
  "grade": 3,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0872",
  "ch": "蛇",
  "kanji": "蛇",
  "sentence": "草むらで《ヘビ》を見つけて驚いた。",
  "grade": 3,
  "radicals": [
   "虫（むしへん）"
  ]
 },
 {
  "id": "kwc0873",
  "ch": "酌",
  "kanji": "晩酌",
  "sentence": "父は毎晩《バンシャク》を楽しんでいる。",
  "grade": 3,
  "radicals": [
   "日（ひへん）",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0874",
  "ch": "爵",
  "kanji": "爵位",
  "sentence": "物語の主人公は《シャクイ》を持つ貴族だ。",
  "grade": 3,
  "radicals": [
   "爪（つめかんむり）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0875",
  "ch": "腫",
  "kanji": "腫れる",
  "sentence": "転んで足首が《ハ》れてしまった。",
  "grade": 3,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0876",
  "ch": "儒",
  "kanji": "儒教",
  "sentence": "《ジュキョウ》は中国から伝わった教えだ。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "攴（ぼくにょう）"
  ]
 },
 {
  "id": "kwc0877",
  "ch": "羞",
  "kanji": "羞恥",
  "sentence": "失敗して強い《シュウチ》心を感じた。",
  "grade": 3,
  "radicals": [
   "羊",
   "心"
  ]
 },
 {
  "id": "kwc0878",
  "ch": "愁",
  "kanji": "哀愁",
  "sentence": "夕暮れの町に《アイシュウ》を感じた。",
  "grade": 3,
  "radicals": [
   "口",
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0879",
  "ch": "酬",
  "kanji": "報酬",
  "sentence": "手伝いの《ホウシュウ》としてお菓子をもらった。",
  "grade": 3,
  "radicals": [
   "土",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0880",
  "ch": "蹴",
  "kanji": "蹴る",
  "sentence": "サッカーでボールを強く《ケ》った。",
  "grade": 3,
  "radicals": [
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0881",
  "ch": "汁",
  "kanji": "汁",
  "sentence": "温かい《シル》を一口飲んだ。",
  "grade": 1,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0882",
  "ch": "充",
  "kanji": "充実",
  "sentence": "部活動での経験がとても《ジュウジツ》している。",
  "grade": 1,
  "radicals": [
   "儿",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0883",
  "ch": "銃",
  "kanji": "銃",
  "sentence": "警察官は《ジュウ》を携帯している。",
  "grade": 3,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0884",
  "ch": "叔",
  "kanji": "叔父",
  "sentence": "夏休みに《オジ》の家へ遊びに行った。",
  "grade": 3,
  "radicals": [
   "又（また）",
   "父"
  ]
 },
 {
  "id": "kwc0885",
  "ch": "淑",
  "kanji": "淑女",
  "sentence": "彼女は《シュクジョ》のように上品にふるまう。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "女"
  ]
 },
 {
  "id": "kwc0886",
  "ch": "粛",
  "kanji": "厳粛",
  "sentence": "卒業式は《ゲンシュク》な雰囲気で行われた。",
  "grade": 3,
  "radicals": [
   "厂（がんだれ）",
   "聿"
  ]
 },
 {
  "id": "kwc0887",
  "ch": "塾",
  "kanji": "塾",
  "sentence": "毎週水曜日は《ジュク》に通っている。",
  "grade": 3,
  "radicals": [
   "土"
  ]
 },
 {
  "id": "kwc0888",
  "ch": "俊",
  "kanji": "俊敏",
  "sentence": "彼の《シュンビン》な動きに驚いた。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "攴（ぼくにょう）"
  ]
 },
 {
  "id": "kwc0889",
  "ch": "准",
  "kanji": "准教授",
  "sentence": "大学で《ジュンキョウジュ》の講義を聞いた。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "攴（ぼくにょう）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0890",
  "ch": "殉",
  "kanji": "殉職",
  "sentence": "その消防士は火災現場で《ジュンショク》した。",
  "grade": 3,
  "radicals": [
   "歹",
   "耳（みみへん）"
  ]
 },
 {
  "id": "kwc0891",
  "ch": "緒",
  "kanji": "情緒",
  "sentence": "この町には昔ながらの《ジョウチョ》がある。",
  "grade": 1,
  "radicals": [
   "心（りっしんべん）",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0892",
  "ch": "叙",
  "kanji": "叙情",
  "sentence": "この詩には豊かな《ジョジョウ》が表れている。",
  "grade": 3,
  "radicals": [
   "又（また）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0893",
  "ch": "升",
  "kanji": "升",
  "sentence": "お米を《マス》で量って炊いた。",
  "grade": 3,
  "radicals": [
   "十"
  ]
 },
 {
  "id": "kwc0894",
  "ch": "抄",
  "kanji": "抄訳",
  "sentence": "この本は原作の《ショウヤク》だ。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0895",
  "ch": "肖",
  "kanji": "肖像",
  "sentence": "美術館で王の《ショウゾウ》画を見た。",
  "grade": 3,
  "radicals": [
   "肉",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0896",
  "ch": "宵",
  "kanji": "宵",
  "sentence": "祭りの《ヨイ》の口から人が集まり始めた。",
  "grade": 3,
  "radicals": [
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0897",
  "ch": "祥",
  "kanji": "発祥",
  "sentence": "このお祭りは江戸時代に《ハッショウ》した。",
  "grade": 3,
  "radicals": [
   "癶（はつがしら）",
   "示（しめすへん）"
  ]
 },
 {
  "id": "kwc0898",
  "ch": "渉",
  "kanji": "交渉",
  "sentence": "値段について店員と《コウショウ》した。",
  "grade": 3,
  "radicals": [
   "亠（なべぶた）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0899",
  "ch": "硝",
  "kanji": "硝酸",
  "sentence": "理科の実験で《ショウサン》を使った。",
  "grade": 3,
  "radicals": [
   "石（いしへん）",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0900",
  "ch": "粧",
  "kanji": "化粧",
  "sentence": "姉は毎朝ていねいに《ケショウ》をする。",
  "grade": 3,
  "radicals": [
   "匕",
   "米（こめへん）"
  ]
 },
 {
  "id": "kwc0901",
  "ch": "詔",
  "kanji": "詔書",
  "sentence": "歴史の授業で昔の《ショウショ》について学んだ。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）",
   "曰"
  ]
 },
 {
  "id": "kwc0902",
  "ch": "彰",
  "kanji": "表彰",
  "sentence": "大会で優勝して《ヒョウショウ》状をもらった。",
  "grade": 3,
  "radicals": [
   "衣（ころも）",
   "彡（さんづくり）"
  ]
 },
 {
  "id": "kwc0903",
  "ch": "礁",
  "kanji": "サンゴ礁",
  "sentence": "南の海には美しいサンゴ《ショウ》が広がる。",
  "grade": 3,
  "radicals": [
   "石（いしへん）"
  ]
 },
 {
  "id": "kwc0904",
  "ch": "浄",
  "kanji": "浄化",
  "sentence": "この装置は空気を《ジョウカ》する。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "匕"
  ]
 },
 {
  "id": "kwc0905",
  "ch": "壌",
  "kanji": "土壌",
  "sentence": "野菜作りには良い《ドジョウ》が必要だ。",
  "grade": 3,
  "radicals": [
   "土",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0906",
  "ch": "拭",
  "kanji": "拭く",
  "sentence": "汗をタオルで《フ》いた。",
  "grade": 2,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0907",
  "ch": "唇",
  "kanji": "唇",
  "sentence": "寒さで《クチビル》が乾いてしまった。",
  "grade": 3,
  "radicals": [
   "口"
  ]
 },
 {
  "id": "kwc0908",
  "ch": "娠",
  "kanji": "妊娠",
  "sentence": "姉は《ニンシン》していることが分かった。",
  "grade": 3,
  "radicals": [
   "女（おんなへん）",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0909",
  "ch": "紳",
  "kanji": "紳士",
  "sentence": "彼は《シンシ》的な態度で接してくれた。",
  "grade": 3,
  "radicals": [
   "糸（いとへん）",
   "士"
  ]
 },
 {
  "id": "kwc0910",
  "ch": "刃",
  "kanji": "刃",
  "sentence": "包丁の《ハ》がとても鋭い。",
  "grade": 3,
  "radicals": [
   "刀"
  ]
 },
 {
  "id": "kwc0911",
  "ch": "甚",
  "kanji": "甚大",
  "sentence": "台風は《ジンダイ》な被害をもたらした。",
  "grade": 3,
  "radicals": [
   "甘",
   "大"
  ]
 },
 {
  "id": "kwc0912",
  "ch": "腎",
  "kanji": "腎臓",
  "sentence": "理科の授業で《ジンゾウ》の働きを学んだ。",
  "grade": 3,
  "radicals": [
   "肉",
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0913",
  "ch": "須",
  "kanji": "必須",
  "sentence": "この科目は進級に《ヒッス》の条件だ。",
  "grade": 3,
  "radicals": [
   "心",
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc0914",
  "ch": "帥",
  "kanji": "元帥",
  "sentence": "歴史の本に《ゲンスイ》という位が出てきた。",
  "grade": 3,
  "radicals": [
   "八",
   "巾（はば）"
  ]
 },
 {
  "id": "kwc0915",
  "ch": "睡",
  "kanji": "睡眠",
  "sentence": "十分な《スイミン》をとることが大切だ。",
  "grade": 3,
  "radicals": [
   "目（めへん）",
   "目（めへん）"
  ]
 },
 {
  "id": "kwc0916",
  "ch": "枢",
  "kanji": "中枢",
  "sentence": "脳は体の《チュウスウ》神経を担っている。",
  "grade": 3,
  "radicals": [
   "丨",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0917",
  "ch": "崇",
  "kanji": "崇拝",
  "sentence": "彼はその選手を《スウハイ》している。",
  "grade": 3,
  "radicals": [
   "山",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0918",
  "ch": "据",
  "kanji": "据える",
  "sentence": "新しい机を部屋に《ス》えた。",
  "grade": 3,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0919",
  "ch": "裾",
  "kanji": "裾",
  "sentence": "スカートの《スソ》が少し汚れた。",
  "grade": 3,
  "radicals": [
   "衣（ころもへん）"
  ]
 },
 {
  "id": "kwc0920",
  "ch": "凄",
  "kanji": "凄い",
  "sentence": "その花火は本当に《スゴ》かった。",
  "grade": 3,
  "radicals": [
   "冫（にすい）"
  ]
 },
 {
  "id": "kwc0921",
  "ch": "逝",
  "kanji": "逝去",
  "sentence": "校長先生の恩師が《セイキョ》されたと聞いた。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）",
   "厶"
  ]
 },
 {
  "id": "kwc0922",
  "ch": "醒",
  "kanji": "覚醒",
  "sentence": "強い光を浴びて眠気が《カクセイ》した。",
  "grade": 3,
  "radicals": [
   "見",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0923",
  "ch": "脊",
  "kanji": "脊椎",
  "sentence": "体育の授業で《セキツイ》の役割を学んだ。",
  "grade": 3,
  "radicals": [
   "肉",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0924",
  "ch": "戚",
  "kanji": "親戚",
  "sentence": "お正月には《シンセキ》が家に集まる。",
  "grade": 3,
  "radicals": [
   "見（みる）",
   "戈（ほこ）"
  ]
 },
 {
  "id": "kwc0925",
  "ch": "拙",
  "kanji": "拙い",
  "sentence": "私の《ツタナ》い説明を聞いてくれた。",
  "grade": 3,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0926",
  "ch": "窃",
  "kanji": "窃盗",
  "sentence": "店で《セットウ》事件が起きたらしい。",
  "grade": 3,
  "radicals": [
   "穴（あなかんむり）",
   "皿（さら）"
  ]
 },
 {
  "id": "kwc0927",
  "ch": "栓",
  "kanji": "栓",
  "sentence": "お風呂の《セン》を抜く。",
  "grade": 3,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0928",
  "ch": "旋",
  "kanji": "旋回",
  "sentence": "飛行機が空港の上空で《センカイ》した。",
  "grade": 3,
  "radicals": [
   "方（ほうへん）",
   "囗（くにがまえ）"
  ]
 },
 {
  "id": "kwc0929",
  "ch": "煎",
  "kanji": "煎餅",
  "sentence": "祖母から《センベイ》をもらった。",
  "grade": 3,
  "radicals": [
   "火（ひ）",
   "食（しょくへん）"
  ]
 },
 {
  "id": "kwc0930",
  "ch": "詮",
  "kanji": "所詮",
  "sentence": "《ショセン》は言い訳にすぎない。",
  "grade": 3,
  "radicals": [
   "戸",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc0931",
  "ch": "箋",
  "kanji": "便箋",
  "sentence": "祖父に《ビンセン》で手紙を書いた。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0932",
  "ch": "遷",
  "kanji": "変遷",
  "sentence": "時代とともに文化は《ヘンセン》してきた。",
  "grade": 3,
  "radicals": [
   "夂",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0933",
  "ch": "薦",
  "kanji": "推薦",
  "sentence": "先生から《スイセン》をもらって受験する。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0934",
  "ch": "繊",
  "kanji": "繊維",
  "sentence": "このシャツは天然《センイ》でできている。",
  "grade": 3,
  "radicals": [
   "糸（いとへん）",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0935",
  "ch": "禅",
  "kanji": "座禅",
  "sentence": "お寺で《ザゼン》を体験した。",
  "grade": 3,
  "radicals": [
   "广（まだれ）",
   "示（しめすへん）"
  ]
 },
 {
  "id": "kwc0936",
  "ch": "漸",
  "kanji": "漸く",
  "sentence": "待っていたバスが《ヨウヤ》く来た。",
  "grade": 3,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0937",
  "ch": "膳",
  "kanji": "膳",
  "sentence": "旅館で《ゼン》に料理が並んだ。",
  "grade": 3,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0938",
  "ch": "塑",
  "kanji": "塑像",
  "sentence": "美術の時間に粘土で《ソゾウ》を作った。",
  "grade": 3,
  "radicals": [
   "土",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0939",
  "ch": "遡",
  "kanji": "遡る",
  "sentence": "歴史を《サカノボ》って調べる。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0940",
  "ch": "捜",
  "kanji": "捜す",
  "sentence": "迷子になった犬を《サガ》す。",
  "grade": 3,
  "radicals": [
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0941",
  "ch": "挿",
  "kanji": "挿入",
  "sentence": "新しいページを《ソウニュウ》する。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "入"
  ]
 },
 {
  "id": "kwc0942",
  "ch": "曹",
  "kanji": "軍曹",
  "sentence": "映画に《グンソウ》という役の兵士が登場した。",
  "grade": 3,
  "radicals": [
   "車",
   "曰"
  ]
 },
 {
  "id": "kwc0943",
  "ch": "爽",
  "kanji": "爽やか",
  "sentence": "今朝は《サワ》やかな風が吹いた。",
  "grade": 3,
  "radicals": [
   "爻"
  ]
 },
 {
  "id": "kwc0944",
  "ch": "痩",
  "kanji": "痩せる",
  "sentence": "病気で少し《ヤ》せてしまった。",
  "grade": 3,
  "radicals": [
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc0945",
  "ch": "槽",
  "kanji": "水槽",
  "sentence": "教室の《スイソウ》で金魚を飼っている。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0946",
  "ch": "踪",
  "kanji": "失踪",
  "sentence": "飼い犬が《シッソウ》してしまった。",
  "grade": 3,
  "radicals": [
   "大",
   "足（あしへん）"
  ]
 },
 {
  "id": "kwc0947",
  "ch": "藻",
  "kanji": "海藻",
  "sentence": "海岸で《カイソウ》を拾い集めた。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0948",
  "ch": "遜",
  "kanji": "謙遜",
  "sentence": "彼はほめられても《ケンソン》する性格だ。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0949",
  "ch": "汰",
  "kanji": "淘汰",
  "sentence": "自然界では弱い生き物が《トウタ》される。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0950",
  "ch": "唾",
  "kanji": "唾液",
  "sentence": "レモンを見ると《ダエキ》が出てきた。",
  "grade": 3,
  "radicals": [
   "口（くちへん）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0951",
  "ch": "堕",
  "kanji": "堕落",
  "sentence": "怠けた生活は《ダラク》につながる。",
  "grade": 3,
  "radicals": [
   "土",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0952",
  "ch": "惰",
  "kanji": "惰性",
  "sentence": "自転車は《ダセイ》で少し進んだ。",
  "grade": 3,
  "radicals": [
   "心（りっしんべん）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0953",
  "ch": "駄",
  "kanji": "無駄",
  "sentence": "時間を《ムダ》にしないよう計画を立てる。",
  "grade": 2,
  "radicals": [
   "火（ひ）",
   "馬（うまへん）"
  ]
 },
 {
  "id": "kwc0954",
  "ch": "堆",
  "kanji": "堆積",
  "sentence": "川底に砂が《タイセキ》している。",
  "grade": 3,
  "radicals": [
   "土（つちへん）",
   "禾（のぎへん）"
  ]
 },
 {
  "id": "kwc0955",
  "ch": "戴",
  "kanji": "頂戴",
  "sentence": "先生から本を《チョウダイ》した。",
  "grade": 3,
  "radicals": [
   "頁（おおがい）",
   "戈（ほこ）"
  ]
 },
 {
  "id": "kwc0956",
  "ch": "濯",
  "kanji": "洗濯",
  "sentence": "休日に家族の《センタク》を手伝った。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0957",
  "ch": "棚",
  "kanji": "本棚",
  "sentence": "《ホンダナ》に教科書を並べた。",
  "grade": 3,
  "radicals": [
   "木",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0958",
  "ch": "綻",
  "kanji": "綻びる",
  "sentence": "シャツの袖が《ホコロ》びてしまった。",
  "grade": 3,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc0959",
  "ch": "痴",
  "kanji": "音痴",
  "sentence": "兄は歌が下手で《オンチ》だと言われる。",
  "grade": 3,
  "radicals": [
   "音",
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc0960",
  "ch": "緻",
  "kanji": "緻密",
  "sentence": "この機械は《チミツ》な設計でできている。",
  "grade": 3,
  "radicals": [
   "糸（いとへん）",
   "宀"
  ]
 },
 {
  "id": "kwc0961",
  "ch": "秩",
  "kanji": "秩序",
  "sentence": "みんなが並んで《チツジョ》を守る。",
  "grade": 3,
  "radicals": [
   "禾（のぎへん）",
   "广（まだれ）"
  ]
 },
 {
  "id": "kwc0962",
  "ch": "嫡",
  "kanji": "嫡男",
  "sentence": "武将の《チャクナン》が家を継いだ。",
  "grade": 3,
  "radicals": [
   "女（おんなへん）",
   "田"
  ]
 },
 {
  "id": "kwc0963",
  "ch": "衷",
  "kanji": "折衷",
  "sentence": "この建物は和洋《セッチュウ》の様式だ。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "衣"
  ]
 },
 {
  "id": "kwc0964",
  "ch": "酎",
  "kanji": "焼酎",
  "sentence": "祖父は夕食に《ショウチュウ》を飲む。",
  "grade": 3,
  "radicals": [
   "火（ひへん）",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc0965",
  "ch": "弔",
  "kanji": "弔う",
  "sentence": "亡くなった人を《トムラ》う式が行われた。",
  "grade": 3,
  "radicals": [
   "弓"
  ]
 },
 {
  "id": "kwc0966",
  "ch": "釣",
  "kanji": "釣る",
  "sentence": "川で魚を《ツ》る。",
  "grade": 3,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc0967",
  "ch": "貼",
  "kanji": "貼る",
  "sentence": "壁にポスターを《ハ》る。",
  "grade": 1,
  "radicals": [
   "貝（かいへん）"
  ]
 },
 {
  "id": "kwc0968",
  "ch": "嘲",
  "kanji": "嘲笑",
  "sentence": "失敗を《チョウショウ》されて悲しかった。",
  "grade": 3,
  "radicals": [
   "口（くちへん）",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0969",
  "ch": "懲",
  "kanji": "懲りる",
  "sentence": "叱られて二度としないと《コ》りた。",
  "grade": 3,
  "radicals": [
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc0970",
  "ch": "勅",
  "kanji": "勅令",
  "sentence": "天皇の《チョクレイ》が出された。",
  "grade": 3,
  "radicals": [
   "力（ちから）",
   "人"
  ]
 },
 {
  "id": "kwc0971",
  "ch": "捗",
  "kanji": "進捗",
  "sentence": "宿題の《シンチョク》を先生に報告する。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc0972",
  "ch": "朕",
  "kanji": "朕",
  "sentence": "天皇は詔の中で自分を《チン》と呼んだ。",
  "grade": 3,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc0973",
  "ch": "椎",
  "kanji": "脊椎",
  "sentence": "理科の授業で人間の《セキツイ》について学んだ。",
  "grade": 3,
  "radicals": [
   "肉",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0974",
  "ch": "坪",
  "kanji": "坪",
  "sentence": "この土地は百《ツボ》の広さがある。",
  "grade": 3,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0975",
  "ch": "鶴",
  "kanji": "鶴",
  "sentence": "池のそばで《ツル》が飛んでいるのを見た。",
  "grade": 3,
  "radicals": [
   "鳥"
  ]
 },
 {
  "id": "kwc0976",
  "ch": "呈",
  "kanji": "贈呈",
  "sentence": "優勝者に賞状が《ゾウテイ》された。",
  "grade": 3,
  "radicals": [
   "貝（かいへん）",
   "口"
  ]
 },
 {
  "id": "kwc0977",
  "ch": "廷",
  "kanji": "法廷",
  "sentence": "裁判は《ホウテイ》で行われる。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "廴"
  ]
 },
 {
  "id": "kwc0978",
  "ch": "邸",
  "kanji": "邸宅",
  "sentence": "郊外に大きな《テイタク》が建っている。",
  "grade": 3,
  "radicals": [
   "邑（おおざと）",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc0979",
  "ch": "亭",
  "kanji": "料亭",
  "sentence": "祖父母と《リョウテイ》で食事をした。",
  "grade": 3,
  "radicals": [
   "斗",
   "亠（なべぶた）"
  ]
 },
 {
  "id": "kwc0980",
  "ch": "貞",
  "kanji": "貞節",
  "sentence": "昔の物語には《テイセツ》な人物がよく描かれる。",
  "grade": 3,
  "radicals": [
   "貝（かい）",
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc0981",
  "ch": "逓",
  "kanji": "逓減",
  "sentence": "この地域の人口は年々《テイゲン》している。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0982",
  "ch": "偵",
  "kanji": "探偵",
  "sentence": "彼は《タンテイ》のように事件を推理した。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0983",
  "ch": "艇",
  "kanji": "潜水艇",
  "sentence": "深海を《センスイテイ》で探索する。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "水（さんずい）",
   "舟（ふねへん）"
  ]
 },
 {
  "id": "kwc0984",
  "ch": "溺",
  "kanji": "溺れる",
  "sentence": "海で《オボ》れそうになった人を助けた。",
  "grade": 3,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0985",
  "ch": "迭",
  "kanji": "更迭",
  "sentence": "監督が《コウテツ》されてチームは変わった。",
  "grade": 3,
  "radicals": [
   "曰",
   "辵（しんにょう）"
  ]
 },
 {
  "id": "kwc0986",
  "ch": "塡",
  "kanji": "補塡",
  "sentence": "不足した分を《ホテン》する。",
  "grade": 3,
  "radicals": [
   "衣（ころもへん）",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc0987",
  "ch": "妬",
  "kanji": "妬む",
  "sentence": "友達の成功を《ネタ》んでしまった。",
  "grade": 3,
  "radicals": [
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc0988",
  "ch": "賭",
  "kanji": "賭ける",
  "sentence": "彼は夢の実現に人生を《カ》けた。",
  "grade": 3,
  "radicals": [
   "貝（かいへん）"
  ]
 },
 {
  "id": "kwc0989",
  "ch": "悼",
  "kanji": "追悼",
  "sentence": "亡くなった方の《ツイトウ》式に参加した。",
  "grade": 3,
  "radicals": [
   "辵（しんにょう）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc0990",
  "ch": "搭",
  "kanji": "搭乗",
  "sentence": "飛行機に《トウジョウ》する。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "丿"
  ]
 },
 {
  "id": "kwc0991",
  "ch": "棟",
  "kanji": "病棟",
  "sentence": "祖父は病院の《ビョウトウ》で治療を受けている。",
  "grade": 3,
  "radicals": [
   "疒（やまいだれ）",
   "木（きへん）"
  ]
 },
 {
  "id": "kwc0992",
  "ch": "謄",
  "kanji": "謄本",
  "sentence": "市役所で戸籍《トウホン》をもらう。",
  "grade": 3,
  "radicals": [
   "言",
   "木"
  ]
 },
 {
  "id": "kwc0993",
  "ch": "藤",
  "kanji": "藤",
  "sentence": "公園の《フジ》の花が満開だ。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc0994",
  "ch": "騰",
  "kanji": "高騰",
  "sentence": "野菜の値段が《コウトウ》している。",
  "grade": 3,
  "radicals": [
   "高",
   "馬"
  ]
 },
 {
  "id": "kwc0995",
  "ch": "洞",
  "kanji": "空洞",
  "sentence": "木の幹に大きな《クウドウ》ができていた。",
  "grade": 3,
  "radicals": [
   "穴（あなかんむり）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc0996",
  "ch": "瞳",
  "kanji": "瞳",
  "sentence": "彼女の《ヒトミ》はとても澄んでいる。",
  "grade": 2,
  "radicals": [
   "目（めへん）"
  ]
 },
 {
  "id": "kwc0997",
  "ch": "督",
  "kanji": "督促",
  "sentence": "税金の《トクソク》状が届いた。",
  "grade": 3,
  "radicals": [
   "目",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc0998",
  "ch": "凸",
  "kanji": "凸レンズ",
  "sentence": "理科の授業で《トツ》レンズを使った。",
  "grade": 3,
  "radicals": [
   "凵"
  ]
 },
 {
  "id": "kwc0999",
  "ch": "屯",
  "kanji": "駐屯地",
  "sentence": "近くに自衛隊の《チュウトンチ》がある。",
  "grade": 3,
  "radicals": [
   "馬（うまへん）",
   "屮",
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc1000",
  "ch": "頓",
  "kanji": "整頓",
  "sentence": "机の上を《セイトン》する。",
  "grade": 3,
  "radicals": [
   "攴（ぼくにょう）",
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc1001",
  "ch": "貪",
  "kanji": "貪欲",
  "sentence": "彼は知識に《ドンヨク》だ。",
  "grade": 3,
  "radicals": [
   "貝（かい）",
   "欠（あくび）"
  ]
 },
 {
  "id": "kwc1002",
  "ch": "那",
  "kanji": "那覇",
  "sentence": "沖縄県の県庁所在地は《ナハ》市だ。",
  "grade": 3,
  "radicals": [
   "邑（おおざと）",
   "襾"
  ]
 },
 {
  "id": "kwc1003",
  "ch": "謎",
  "kanji": "謎",
  "sentence": "この事件には《ナゾ》が多い。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc1004",
  "ch": "鍋",
  "kanji": "鍋",
  "sentence": "冬は家族で《ナベ》を囲む。",
  "grade": 3,
  "radicals": [
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc1005",
  "ch": "軟",
  "kanji": "柔軟",
  "sentence": "体を《ジュウナン》に保つ。",
  "grade": 3,
  "radicals": [
   "木（き）",
   "車（くるまへん）"
  ]
 },
 {
  "id": "kwc1006",
  "ch": "尼",
  "kanji": "尼",
  "sentence": "彼女は出家して《アマ》になった。",
  "grade": 3,
  "radicals": [
   "尸（しかばね）"
  ]
 },
 {
  "id": "kwc1007",
  "ch": "虹",
  "kanji": "虹",
  "sentence": "雨上がりに《ニジ》がかかった。",
  "grade": 1,
  "radicals": [
   "虫（むしへん）"
  ]
 },
 {
  "id": "kwc1008",
  "ch": "妊",
  "kanji": "妊婦",
  "sentence": "電車で《ニンプ》に席を譲った。",
  "grade": 3,
  "radicals": [
   "女（おんなへん）",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc1009",
  "ch": "忍",
  "kanji": "忍者",
  "sentence": "彼は《ニンジャ》の映画が好きだ。",
  "grade": 3,
  "radicals": [
   "心（したごころ）",
   "老"
  ]
 },
 {
  "id": "kwc1010",
  "ch": "寧",
  "kanji": "丁寧",
  "sentence": "先生は《テイネイ》に説明してくれた。",
  "grade": 3,
  "radicals": [
   "一",
   "宀"
  ]
 },
 {
  "id": "kwc1011",
  "ch": "捻",
  "kanji": "捻挫",
  "sentence": "走っていて足首を《ネンザ》した。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc1012",
  "ch": "覇",
  "kanji": "制覇",
  "sentence": "チームは大会で《セイハ》を果たした。",
  "grade": 3,
  "radicals": [
   "刀（りっとう）",
   "襾"
  ]
 },
 {
  "id": "kwc1013",
  "ch": "罵",
  "kanji": "罵倒",
  "sentence": "人前で《バトウ》するのはよくない。",
  "grade": 3,
  "radicals": [
   "网（あみがしら）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc1014",
  "ch": "媒",
  "kanji": "媒体",
  "sentence": "新聞は情報の《バイタイ》だ。",
  "grade": 3,
  "radicals": [
   "女（おんなへん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc1015",
  "ch": "賠",
  "kanji": "賠償",
  "sentence": "事故の《バイショウ》を求められた。",
  "grade": 3,
  "radicals": [
   "貝（かいへん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc1016",
  "ch": "伯",
  "kanji": "伯父",
  "sentence": "夏休みに《オジ》の家へ行った。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "父"
  ]
 },
 {
  "id": "kwc1017",
  "ch": "剝",
  "kanji": "剝がす",
  "sentence": "壁のポスターを《ハ》がす。",
  "grade": 3,
  "radicals": [
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc1018",
  "ch": "舶",
  "kanji": "船舶",
  "sentence": "この港には大きな《センパク》が並ぶ。",
  "grade": 3,
  "radicals": [
   "舟（ふねへん）",
   "舟（ふねへん）"
  ]
 },
 {
  "id": "kwc1019",
  "ch": "漠",
  "kanji": "砂漠",
  "sentence": "ラクダは《サバク》を歩く動物だ。",
  "grade": 3,
  "radicals": [
   "石（いしへん）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc1020",
  "ch": "箸",
  "kanji": "箸",
  "sentence": "日本人は《ハシ》を使って食事する。",
  "grade": 3,
  "radicals": [
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc1021",
  "ch": "肌",
  "kanji": "肌",
  "sentence": "冬は《ハダ》が乾燥しやすい。",
  "grade": 2,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc1022",
  "ch": "鉢",
  "kanji": "植木鉢",
  "sentence": "ベランダに《ウエキバチ》を置いた。",
  "grade": 3,
  "radicals": [
   "木（きへん）",
   "木",
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc1023",
  "ch": "閥",
  "kanji": "派閥",
  "sentence": "政治の世界には《ハバツ》がある。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "門（もんがまえ）"
  ]
 },
 {
  "id": "kwc1024",
  "ch": "氾",
  "kanji": "氾濫",
  "sentence": "大雨で川が《ハンラン》した。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc1025",
  "ch": "汎",
  "kanji": "汎用",
  "sentence": "このソフトは《ハンヨウ》性が高い。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "用"
  ]
 },
 {
  "id": "kwc1026",
  "ch": "斑",
  "kanji": "斑点",
  "sentence": "犬の背中に白い《ハンテン》がある。",
  "grade": 3,
  "radicals": [
   "文",
   "火（ひ）"
  ]
 },
 {
  "id": "kwc1027",
  "ch": "煩",
  "kanji": "煩わしい",
  "sentence": "手続きが《ワズラ》わしい。",
  "grade": 3,
  "radicals": [
   "火（ひへん）"
  ]
 },
 {
  "id": "kwc1028",
  "ch": "頒",
  "kanji": "頒布",
  "sentence": "部活動で会報を《ハンプ》した。",
  "grade": 3,
  "radicals": [
   "頁（おおがい）",
   "巾（はば）"
  ]
 },
 {
  "id": "kwc1029",
  "ch": "妃",
  "kanji": "王妃",
  "sentence": "童話に美しい《オウヒ》が登場する。",
  "grade": 3,
  "radicals": [
   "玉",
   "女（おんなへん）"
  ]
 },
 {
  "id": "kwc1030",
  "ch": "披",
  "kanji": "披露",
  "sentence": "結婚式で歌を《ヒロウ》した。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "雨（あめかんむり）"
  ]
 },
 {
  "id": "kwc1031",
  "ch": "扉",
  "kanji": "扉",
  "sentence": "教室の《トビラ》を静かに開けた。",
  "grade": 3,
  "radicals": [
   "戸（とだれ）"
  ]
 },
 {
  "id": "kwc1032",
  "ch": "罷",
  "kanji": "罷免",
  "sentence": "大臣が《ヒメン》された。",
  "grade": 3,
  "radicals": [
   "网（あみがしら）",
   "八"
  ]
 },
 {
  "id": "kwc1033",
  "ch": "膝",
  "kanji": "膝",
  "sentence": "転んで《ヒザ》をすりむいた。",
  "grade": 3,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc1034",
  "ch": "肘",
  "kanji": "肘",
  "sentence": "机に《ヒジ》をついて考える。",
  "grade": 3,
  "radicals": [
   "肉（にくづき）"
  ]
 },
 {
  "id": "kwc1035",
  "ch": "猫",
  "kanji": "猫",
  "sentence": "家で《ネコ》を飼っている。",
  "grade": 3,
  "radicals": [
   "犬"
  ]
 },
 {
  "id": "kwc1036",
  "ch": "賓",
  "kanji": "来賓",
  "sentence": "卒業式に《ライヒン》が出席した。",
  "grade": 3,
  "radicals": [
   "木",
   "貝（かい）"
  ]
 },
 {
  "id": "kwc1037",
  "ch": "瓶",
  "kanji": "花瓶",
  "sentence": "教室の《カビン》に花を飾る。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）",
   "瓦（かわら）"
  ]
 },
 {
  "id": "kwc1038",
  "ch": "扶",
  "kanji": "扶養",
  "sentence": "祖母は父の《フヨウ》家族だ。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "食"
  ]
 },
 {
  "id": "kwc1039",
  "ch": "訃",
  "kanji": "訃報",
  "sentence": "恩師の《フホウ》が届いた。",
  "grade": 3,
  "radicals": [
   "言（ごんべん）",
   "土"
  ]
 },
 {
  "id": "kwc1040",
  "ch": "膚",
  "kanji": "皮膚",
  "sentence": "日焼けで《ヒフ》がひりひりする。",
  "grade": 3,
  "radicals": [
   "皮",
   "肉"
  ]
 },
 {
  "id": "kwc1041",
  "ch": "賦",
  "kanji": "天賦",
  "sentence": "彼女は《テンプ》の才能を持つ。",
  "grade": 3,
  "radicals": [
   "大",
   "貝（かいへん）"
  ]
 },
 {
  "id": "kwc1042",
  "ch": "譜",
  "kanji": "楽譜",
  "sentence": "音楽の授業で《ガクフ》を読む。",
  "grade": 3,
  "radicals": [
   "木（き）",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc1043",
  "ch": "侮",
  "kanji": "侮辱",
  "sentence": "友達を《ブジョク》してはいけない。",
  "grade": 2,
  "radicals": [
   "人（にんべん）",
   "辰"
  ]
 },
 {
  "id": "kwc1044",
  "ch": "沸",
  "kanji": "沸騰",
  "sentence": "やかんの湯が《フットウ》した。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "馬"
  ]
 },
 {
  "id": "kwc1045",
  "ch": "憤",
  "kanji": "憤慨",
  "sentence": "不公平な扱いに《フンガイ》した。",
  "grade": 3,
  "radicals": [
   "心（りっしんべん）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc1046",
  "ch": "丙",
  "kanji": "丙",
  "sentence": "契約書には甲・乙・《ヘイ》と書かれていた。",
  "grade": 3,
  "radicals": [
   "一"
  ]
 },
 {
  "id": "kwc1047",
  "ch": "併",
  "kanji": "合併",
  "sentence": "二つの町が《ガッペイ》した。",
  "grade": 3,
  "radicals": [
   "口",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc1048",
  "ch": "塀",
  "kanji": "塀",
  "sentence": "家の周りに《ヘイ》を作った。",
  "grade": 3,
  "radicals": [
   "土（つちへん）"
  ]
 },
 {
  "id": "kwc1049",
  "ch": "幣",
  "kanji": "紙幣",
  "sentence": "財布に《シヘイ》を入れる。",
  "grade": 3,
  "radicals": [
   "糸（いとへん）",
   "巾（はば）"
  ]
 },
 {
  "id": "kwc1050",
  "ch": "弊",
  "kanji": "弊害",
  "sentence": "便利さには《ヘイガイ》もある。",
  "grade": 3,
  "radicals": [
   "廾",
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc1051",
  "ch": "蔽",
  "kanji": "隠蔽",
  "sentence": "会社が不正を《インペイ》した。",
  "grade": 3,
  "radicals": [
   "阜（こざとへん）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc1052",
  "ch": "餅",
  "kanji": "餅",
  "sentence": "正月に《モチ》を食べる。",
  "grade": 3,
  "radicals": [
   "食（しょくへん）"
  ]
 },
 {
  "id": "kwc1053",
  "ch": "蔑",
  "kanji": "軽蔑",
  "sentence": "うそをつく人を《ケイベツ》する。",
  "grade": 3,
  "radicals": [
   "車（くるまへん）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc1054",
  "ch": "偏",
  "kanji": "偏る",
  "sentence": "彼の意見は少し《カタヨ》っている。",
  "grade": 3,
  "radicals": [
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc1055",
  "ch": "哺",
  "kanji": "哺乳類",
  "sentence": "クジラは《ホニュウルイ》の仲間だ。",
  "grade": 3,
  "radicals": [
   "口（くちへん）",
   "乙",
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc1056",
  "ch": "俸",
  "kanji": "俸給",
  "sentence": "父は毎月《ホウキュウ》をもらう。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc1057",
  "ch": "褒",
  "kanji": "褒める",
  "sentence": "先生が私のがんばりを《ホ》める。",
  "grade": 3,
  "radicals": [
   "衣"
  ]
 },
 {
  "id": "kwc1058",
  "ch": "剖",
  "kanji": "解剖",
  "sentence": "理科の授業でカエルを《カイボウ》した。",
  "grade": 3,
  "radicals": [
   "角（つのへん）",
   "刀（りっとう）"
  ]
 },
 {
  "id": "kwc1059",
  "ch": "紡",
  "kanji": "紡ぐ",
  "sentence": "祖母が糸を《ツム》ぐ姿を見た。",
  "grade": 3,
  "radicals": [
   "糸（いとへん）"
  ]
 },
 {
  "id": "kwc1060",
  "ch": "貌",
  "kanji": "変貌",
  "sentence": "町の様子が大きく《ヘンボウ》した。",
  "grade": 3,
  "radicals": [
   "夂",
   "豸（むじなへん）"
  ]
 },
 {
  "id": "kwc1061",
  "ch": "頰",
  "kanji": "頰",
  "sentence": "寒さで《ホオ》が赤くなった。",
  "grade": 3,
  "radicals": [
   "頁（おおがい）"
  ]
 },
 {
  "id": "kwc1062",
  "ch": "睦",
  "kanji": "親睦",
  "sentence": "クラスで《シンボク》を深める会を開く。",
  "grade": 3,
  "radicals": [
   "見（みる）",
   "目（めへん）"
  ]
 },
 {
  "id": "kwc1063",
  "ch": "撲",
  "kanji": "相撲",
  "sentence": "兄は《スモウ》が得意だ。",
  "grade": 3,
  "radicals": [
   "目（め）",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc1064",
  "ch": "勃",
  "kanji": "勃発",
  "sentence": "戦争が突然《ボッパツ》した。",
  "grade": 3,
  "radicals": [
   "力（ちから）",
   "癶（はつがしら）"
  ]
 },
 {
  "id": "kwc1065",
  "ch": "奔",
  "kanji": "奔走",
  "sentence": "兄は準備に《ホンソウ》した。",
  "grade": 3,
  "radicals": [
   "大",
   "走"
  ]
 },
 {
  "id": "kwc1066",
  "ch": "麻",
  "kanji": "麻酔",
  "sentence": "手術の前に《マスイ》をかける。",
  "grade": 3,
  "radicals": [
   "麻",
   "酉（とりへん）"
  ]
 },
 {
  "id": "kwc1067",
  "ch": "摩",
  "kanji": "摩擦",
  "sentence": "二つの布が《マサツ》で熱くなる。",
  "grade": 3,
  "radicals": [
   "手",
   "手（てへん）"
  ]
 },
 {
  "id": "kwc1068",
  "ch": "磨",
  "kanji": "磨く",
  "sentence": "毎日歯を《ミガ》く。",
  "grade": 3,
  "radicals": [
   "石"
  ]
 },
 {
  "id": "kwc1069",
  "ch": "抹",
  "kanji": "抹茶",
  "sentence": "京都で《マッチャ》を飲んだ。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "艸（くさかんむり）"
  ]
 },
 {
  "id": "kwc1070",
  "ch": "冥",
  "kanji": "冥福",
  "sentence": "亡くなった人の《メイフク》を祈る。",
  "grade": 3,
  "radicals": [
   "冖（わかんむり）",
   "示（しめすへん）"
  ]
 },
 {
  "id": "kwc1071",
  "ch": "銘",
  "kanji": "感銘",
  "sentence": "彼の言葉に深く《カンメイ》を受けた。",
  "grade": 3,
  "radicals": [
   "心（したごころ）",
   "金（かねへん）"
  ]
 },
 {
  "id": "kwc1072",
  "ch": "麺",
  "kanji": "麺",
  "sentence": "夕食に《メン》を茹でて食べた。",
  "grade": 3,
  "radicals": [
   "麥"
  ]
 },
 {
  "id": "kwc1073",
  "ch": "妄",
  "kanji": "妄想",
  "sentence": "彼は変な《モウソウ》をしている。",
  "grade": 3,
  "radicals": [
   "女（おんな）",
   "心（したごころ）"
  ]
 },
 {
  "id": "kwc1074",
  "ch": "盲",
  "kanji": "盲点",
  "sentence": "そこが計画の《モウテン》だった。",
  "grade": 3,
  "radicals": [
   "目",
   "火（ひ）"
  ]
 },
 {
  "id": "kwc1075",
  "ch": "耗",
  "kanji": "消耗",
  "sentence": "長い練習で体力を《ショウモウ》した。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "耒（すきへん）"
  ]
 },
 {
  "id": "kwc1076",
  "ch": "冶",
  "kanji": "鍛冶",
  "sentence": "祖父は《カジ》屋を営んでいた。",
  "grade": 3,
  "radicals": [
   "金（かねへん）",
   "冫（にすい）"
  ]
 },
 {
  "id": "kwc1077",
  "ch": "弥",
  "kanji": "弥生",
  "sentence": "三月は《ヤヨイ》と呼ばれる。",
  "grade": 3,
  "radicals": [
   "弓（ゆみへん）",
   "生"
  ]
 },
 {
  "id": "kwc1078",
  "ch": "闇",
  "kanji": "闇",
  "sentence": "夜道は《ヤミ》に包まれていた。",
  "grade": 3,
  "radicals": [
   "門（もんがまえ）"
  ]
 },
 {
  "id": "kwc1079",
  "ch": "愉",
  "kanji": "愉快",
  "sentence": "友達との時間はとても《ユカイ》だ。",
  "grade": 3,
  "radicals": [
   "心（りっしんべん）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc1080",
  "ch": "癒",
  "kanji": "癒す",
  "sentence": "音楽が心を《イヤ》す。",
  "grade": 3,
  "radicals": [
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc1081",
  "ch": "湧",
  "kanji": "湧く",
  "sentence": "山の中から水が《ワ》いている。",
  "grade": 3,
  "radicals": [
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc1082",
  "ch": "猶",
  "kanji": "猶予",
  "sentence": "提出期限に《ユウヨ》をもらった。",
  "grade": 3,
  "radicals": [
   "犬",
   "亅"
  ]
 },
 {
  "id": "kwc1083",
  "ch": "裕",
  "kanji": "余裕",
  "sentence": "時間に《ヨユウ》を持って行動する。",
  "grade": 3,
  "radicals": [
   "人",
   "衣（ころもへん）"
  ]
 },
 {
  "id": "kwc1084",
  "ch": "妖",
  "kanji": "妖怪",
  "sentence": "昔話には《ヨウカイ》がよく出てくる。",
  "grade": 3,
  "radicals": [
   "女（おんなへん）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc1085",
  "ch": "庸",
  "kanji": "中庸",
  "sentence": "何事も《チュウヨウ》が大切だ。",
  "grade": 3,
  "radicals": [
   "丨",
   "广（まだれ）"
  ]
 },
 {
  "id": "kwc1086",
  "ch": "瘍",
  "kanji": "潰瘍",
  "sentence": "胃に《カイヨウ》ができて入院した。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc1087",
  "ch": "窯",
  "kanji": "窯",
  "sentence": "陶芸家が《カマ》で器を焼く。",
  "grade": 3,
  "radicals": [
   "穴（あなかんむり）"
  ]
 },
 {
  "id": "kwc1088",
  "ch": "沃",
  "kanji": "肥沃",
  "sentence": "この土地は《ヒヨク》で作物がよく育つ。",
  "grade": 3,
  "radicals": [
   "肉（にくづき）",
   "水（さんずい）"
  ]
 },
 {
  "id": "kwc1089",
  "ch": "拉",
  "kanji": "拉致",
  "sentence": "その事件は《ラチ》事件と呼ばれた。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "至"
  ]
 },
 {
  "id": "kwc1090",
  "ch": "酪",
  "kanji": "酪農",
  "sentence": "北海道は《ラクノウ》が盛んだ。",
  "grade": 3,
  "radicals": [
   "酉（とりへん）",
   "辰"
  ]
 },
 {
  "id": "kwc1091",
  "ch": "辣",
  "kanji": "辛辣",
  "sentence": "彼は《シンラツ》な意見を言った。",
  "grade": 3,
  "radicals": [
   "辛",
   "辛"
  ]
 },
 {
  "id": "kwc1092",
  "ch": "藍",
  "kanji": "藍色",
  "sentence": "空が《アイイロ》に染まっている。",
  "grade": 3,
  "radicals": [
   "艸（くさかんむり）",
   "色"
  ]
 },
 {
  "id": "kwc1093",
  "ch": "痢",
  "kanji": "下痢",
  "sentence": "お腹を壊して《ゲリ》になった。",
  "grade": 3,
  "radicals": [
   "一",
   "疒（やまいだれ）"
  ]
 },
 {
  "id": "kwc1094",
  "ch": "履",
  "kanji": "履く",
  "sentence": "新しい靴を《ハ》く。",
  "grade": 3,
  "radicals": [
   "尸（しかばね）"
  ]
 },
 {
  "id": "kwc1095",
  "ch": "璃",
  "kanji": "瑠璃",
  "sentence": "《ルリ》色の美しい石を見つけた。",
  "grade": 3,
  "radicals": [
   "玉",
   "玉"
  ]
 },
 {
  "id": "kwc1096",
  "ch": "慄",
  "kanji": "戦慄",
  "sentence": "恐ろしい話に《センリツ》を覚えた。",
  "grade": 3,
  "radicals": [
   "戈（ほこ）",
   "心（りっしんべん）"
  ]
 },
 {
  "id": "kwc1097",
  "ch": "柳",
  "kanji": "柳",
  "sentence": "川岸に《ヤナギ》の木が立っている。",
  "grade": 3,
  "radicals": [
   "木（きへん）"
  ]
 },
 {
  "id": "kwc1098",
  "ch": "侶",
  "kanji": "伴侶",
  "sentence": "彼は生涯の《ハンリョ》を見つけた。",
  "grade": 3,
  "radicals": [
   "人（にんべん）",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc1099",
  "ch": "虜",
  "kanji": "捕虜",
  "sentence": "兵士が《ホリョ》になった。",
  "grade": 3,
  "radicals": [
   "手（てへん）",
   "虍（とらかんむり）"
  ]
 },
 {
  "id": "kwc1100",
  "ch": "僚",
  "kanji": "同僚",
  "sentence": "職場の《ドウリョウ》と協力する。",
  "grade": 3,
  "radicals": [
   "口",
   "人（にんべん）"
  ]
 },
 {
  "id": "kwc1101",
  "ch": "寮",
  "kanji": "寮",
  "sentence": "兄は大学の《リョウ》で生活している。",
  "grade": 3,
  "radicals": [
   "宀（うかんむり）"
  ]
 },
 {
  "id": "kwc1102",
  "ch": "瞭",
  "kanji": "明瞭",
  "sentence": "彼の説明はとても《メイリョウ》だった。",
  "grade": 3,
  "radicals": [
   "日（ひへん）",
   "目（めへん）"
  ]
 },
 {
  "id": "kwc1103",
  "ch": "瑠",
  "kanji": "浄瑠璃",
  "sentence": "祖母は《ジョウルリ》を習っている。",
  "grade": 3,
  "radicals": [
   "水（さんずい）",
   "玉",
   "玉"
  ]
 },
 {
  "id": "kwc1104",
  "ch": "累",
  "kanji": "累計",
  "sentence": "売り上げの《ルイケイ》を集計する。",
  "grade": 3,
  "radicals": [
   "糸",
   "言（ごんべん）"
  ]
 },
 {
  "id": "kwc1105",
  "ch": "隷",
  "kanji": "隷書",
  "sentence": "書道の授業で《レイショ》という書体を学んだ。",
  "grade": 3,
  "radicals": [
   "隶（れいづくり）",
   "曰"
  ]
 },
 {
  "id": "kwc1106",
  "ch": "賂",
  "kanji": "賄賂",
  "sentence": "役人が《ワイロ》を受け取った。",
  "grade": 3,
  "radicals": [
   "貝（かいへん）",
   "貝（かいへん）"
  ]
 },
 {
  "id": "kwc1107",
  "ch": "弄",
  "kanji": "愚弄",
  "sentence": "人を《グロウ》するのはよくない。",
  "grade": 3,
  "radicals": [
   "心（したごころ）",
   "廾"
  ]
 },
 {
  "id": "kwc1108",
  "ch": "籠",
  "kanji": "籠",
  "sentence": "買い物《カゴ》に品物を入れる。",
  "grade": 3,
  "radicals": [
   "竹（たけかんむり）"
  ]
 },
 {
  "id": "kwc1109",
  "ch": "麓",
  "kanji": "麓",
  "sentence": "山の《フモト》に小さな村がある。",
  "grade": 3,
  "radicals": [
   "鹿"
  ]
 },
 {
  "id": "kwc1110",
  "ch": "賄",
  "kanji": "賄う",
  "sentence": "生活費を家計で《マカナ》う。",
  "grade": 3,
  "radicals": [
   "貝（かいへん）"
  ]
 }
];

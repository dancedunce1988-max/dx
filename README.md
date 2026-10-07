# 知識ドリルDX

中学国語（漢字・語彙・文法・古典・漢文など）の一問一答トレーニングアプリです。
ブラウザだけで動作し、成績はブラウザ内（localStorage）に保存されます。サーバー不要。

## ファイル構成

- `kokugo_app.html` … アプリ本体（これを開く）
- `kokugo_data.js` … 問題データ

## 公開方法（GitHub Pages）

1. このリポジトリをGitHubにプッシュする
2. GitHubのリポジトリ画面で `Settings` → `Pages` を開く
3. `Source` を `Deploy from a branch`、ブランチを `main`、フォルダを `/ (root)` にして保存
4. 数分後、`https://（ユーザー名）.github.io/（リポジトリ名）/kokugo_app.html` でアクセスできるようになる

## 生徒への配布（dist）

生徒には `dist/index.html` と `dist/README.txt` を渡します。
`index.html` は起動役です。`import-config.json` のコミットハッシュに付いた `dist/script.js` を CDN から読み、その世代の本体を起動します。
`dist/script.js` はリポジトリに残します。フォルダごと渡しても、起動役はローカルの `script.js` を使いません。

### 教員側（更新の流れ）

1. 本体を修正して `main` に push する
2. GitHub Actions が `dist/import-config.json` の `commitHash` と、その版の `dist/script.js` の SRI（`integrity`）を更新する
3. 生徒は次回起動時に新しい版を取得する（生徒 PC への再配布は原則不要）

### 注意

- jsDelivr で `@main` は使わない（キャッシュで更新が届かない）。ハッシュは Actions が管理する
- CDN の形: `https://cdn.jsdelivr.net/gh/dancedunce1988-max/dx@<commitHash>/`
- `import-config.json`（`commitHash` と `integrity`）はリポジトリ上にあり、生徒 PC に置かなくてよい
- 起動役は `raw.githubusercontent.com/.../main/dist/import-config.json` から最新ハッシュと SRI を読み、同じハッシュの `dist/script.js` を jsDelivr から読む。中身が `integrity` と違う場合は実行しない
- その `script.js` が `window.__DX_CDN_BASE__` をセットして、同じ世代の本体を読み込む
- ローダーの開発時は `dist/index.html?local=1` で、ローカルの `script.js` を使う

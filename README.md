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

生徒には `dist/` フォルダ一式を渡します（`index.html` + `script.js` + `README.txt`）。
`script.js` は CDN 上の本体を読み込むランチャーです。

### 教員側（更新の流れ）

1. 本体を修正して `main` に push する
2. GitHub Actions が `dist/import-config.json` の `commitHash` を更新する
3. 生徒は次回起動時に新しい版を取得する（生徒 PC への再配布は原則不要）

### 注意

- jsDelivr で `@main` は使わない（キャッシュで更新が届かない）。ハッシュは Actions が管理する
- CDN の形: `https://cdn.jsdelivr.net/gh/happa0827/dx@<commitHash>/`
- `import-config.json`（`commitHash` / `repo`）はリポジトリ上にあり、生徒 PC に置かなくてよい
- ランチャーは `raw.githubusercontent.com/.../main/dist/import-config.json` から最新ハッシュを読み、`window.__DX_CDN_BASE__` をセットして本体を読み込む

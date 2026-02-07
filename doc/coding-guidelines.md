# コーディングガイドライン

このドキュメントは、本プロジェクト（Vite静的サイト開発環境）におけるコーディング規約を定めたものです。

## プロジェクト環境

- **ビルドツール**: Vite 5.0.13
- **パッケージマネージャー**: **yarn のみ使用**（npm禁止）
- **CSS設計**: BEM
- **テンプレートエンジン**: Handlebars
- **JavaScript**: ESモジュール (ES6+)

## HTML

### 基本ルール

- **セマンティックHTML**を使用する（`<header>`, `<nav>`, `<main>`, `<section>`, `<article>` など）
- **インデント**: 2スペース
- サイト内リソースへのパスは**ルート相対パス**（`/`で始まる）を使用
  - NG: `./images/sample.png`
  - OK: `/images/sample.png`
- 文字参照（`&copy;`など）は使用せず、UTF-8文字を直接記述
  - NG: `&copy;`
  - OK: `©`

### BEM命名規則

クラス名はBEM記法に従う：

- **Block**: 独立したコンポーネント（例: `.header`, `.card`, `.form`）
- **Element**: ブロックの構成要素（例: `.header__nav`, `.card__title`）
- **Modifier**: バリエーション（例: `.button--large`, `.card__image--round`）

```html
<!-- 良い例 -->
<header class="header">
  <div class="inner">
    <nav class="header__nav">
      <a href="/" class="header__nav-item">ホーム</a>
    </nav>
  </div>
</header>

<button class="button button--primary">送信</button>

<!-- 悪い例: 省略形 -->
<div class="btn">クリック</div>
<!-- NG: 省略 -->
<div class="button-primary">送信</div>
<!-- NG: BEM記法違反 -->
```

### 画像タグ

```html
<!-- 必須属性: src, alt, width, height -->
<!-- WebPは全ブラウザ対応のため、直接使用可能 -->
<img src="/assets/images/sample.webp" alt="サンプル画像" width="800" height="600" loading="lazy" />

<!-- MVセクション: loading="lazy"不要、fetchpriority="high"推奨 -->
<img src="/assets/images/image_mv_01.webp" width="977" height="1800" alt="" fetchpriority="high" />

<!-- AVIF対応（AVIF非対応ブラウザは元画像にフォールバック） -->
<picture>
  <source srcset="/assets/images/sample.avif" type="image/avif" />
  <img src="/assets/images/sample.png" alt="サンプル" width="800" height="600" loading="lazy" />
</picture>
```

**画像属性のルール**:

- `width`と`height`: 必ず指定（CLS防止）
- `alt`: 装飾画像は空文字`""`、コンテンツ画像は適切な説明
- `loading="lazy"`: MV以外の画像に指定
- `fetchpriority="high"`: LCP画像（最初のMV画像など）に指定

### Handlebarsコンポーネント

共通パーツは`src/components/`に配置し、Handlebarsで読み込む：

```html
<!-- src/index.html -->
{{> header}}

<main>
  <h1>{{page.title}}</h1>
</main>

{{> footer}}
```

コンポーネントファイル名は対応するクラス名と一致させる：

- `src/components/header.html` → `.header`
- `src/components/button.html` → `.button`

### アクセシビリティ

インタラクティブな要素には適切なアクセシビリティ属性を追加：

```html
<!-- ボタン -->
<button type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="drawer-menu">メニュー</button>

<!-- アコーディオン -->
<button type="button" aria-expanded="false" aria-controls="accordion-content" aria-label="事業内容を展開">事業内容</button>
<ul id="accordion-content" aria-hidden="true">
  <!-- コンテンツ -->
</ul>
```

**アクセシビリティ属性**:

- `aria-label`: ボタンの目的を説明
- `aria-expanded`: 開閉状態（`true`/`false`）
- `aria-controls`: 制御する要素のID
- `aria-hidden`: 要素の表示状態（`true`/`false`）

## CSS/SCSS

### ディレクトリ構造

```scss
// src/assets/styles/style.scss
@use "foundation"; // リセット、ベーススタイル
@use "global"; // 変数、関数、mixins
@use "blocks/**"; // 全BEMブロック
```

各ファイルでは`@use "../global" as *;`でグローバル変数とmixinsを読み込む：

```scss
@use "../global" as *;

.header {
  color: var(--color-text);

  @include mq("md") {
    padding: calc(20 * var(--to-rem));
  }
}
```

### 基本ルール

- **ネスト制限**:
  - ✅ 許可: 擬似要素・擬似クラス（`&:hover`, `&::before`, `&::after`, `&:nth-of-type()`など）
  - ✅ 許可: 擬似クラスセレクタ（`&.is-open`, `&:not([open])`など）
  - ✅ 許可: `@include mq()` メディアクエリ
  - ❌ 禁止: 子要素のセレクタ（`.parent span`など）のネスト
  - ❌ 禁止: `&__item` のようなBEM要素のネスト（`.parent__item`は別定義）
  - ❌ 禁止: セレクタのネスト（`.parent .child`など）
- **CSS Custom Properties**を使用
- **論理プロパティ**を優先（`margin-block-start`, `padding-inline`など）
- 単位は`calc(値 * var(--to-rem))`でrem変換
- インラインスタイル禁止

```scss
// ✅ 良い例
.card {
  padding: calc(20 * var(--to-rem)) calc(30 * var(--to-rem));
  margin-block-start: calc(40 * var(--to-rem));
  color: var(--color-text);
  background-color: var(--color-bg);

  // 擬似要素・擬似クラスはネスト可
  &:hover {
    background-color: var(--color-bg-hover);
  }

  &::before {
    content: "";
    display: block;
  }

  &:nth-of-type(1) {
    margin-block-start: 0;
  }

  // メディアクエリもネスト可
  @include mq("md") {
    padding: calc(30 * var(--to-rem)) calc(50 * var(--to-rem));
  }
}

// ✅ 子要素のセレクタは別定義（ネストしない）
.header__hamburger span {
  display: block;

  // 擬似要素・擬似クラスはネスト可
  &:nth-of-type(1) {
    top: -8px;
  }
}

// ✅ 擬似クラスセレクタと子要素の組み合わせも別定義
.header__hamburger.is-open span {
  &:nth-of-type(1) {
    top: 0;
    rotate: 45deg;
  }
}

// ❌ 悪い例
.card {
  padding: 20px; // NG: px直接指定
  margin-bottom: 40px; // NG: 論理プロパティ未使用

  .title {
    // NG: セレクタのネスト
    font-size: 18px;
  }

  &__item {
    // NG: BEM要素のネスト（フラットに書く）
    display: block;
  }
}

// ✅ BEM要素は別々に定義
.card {
  padding: calc(20 * var(--to-rem));
}

.card__item {
  display: block;
}
```

### BEMモディファイア

```scss
// Block
.button {
  padding: calc(14 * var(--to-rem)) calc(60 * var(--to-rem));
  background-color: var(--color-primary);
}

// Modifier
.button.button--large {
  padding: calc(20 * var(--to-rem)) calc(80 * var(--to-rem));
}

.button.button--outline {
  background-color: transparent;
  border: 1px solid var(--color-primary);
}
```

### レスポンシブ対応

ブレークポイントは`@include mq()`で指定（SPファースト）：

```scss
@use "../global" as *;

.section {
  padding-block: calc(40 * var(--to-rem));

  @include mq("md") {
    padding-block: calc(80 * var(--to-rem));
  }
}
```

**利用可能なブレークポイント**:

- `sm`: 600px以上
- `md`: 768px以上（デフォルト）
- `lg`: 1024px以上
- `xl`: 1440px以上

### レイアウト

- **等間隔配置**: `gap`を使用
- **比率管理**: `aspect-ratio`を使用

```scss
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: calc(30 * var(--to-rem));
}

.thumbnail {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

## JavaScript

### 基本ルール

- **ESモジュール**を使用（`import`/`export`）
- 変数宣言は`const`または`let`（**`var`禁止**）
- インデント: 2スペース
- 定数はファイル上部で定義

```javascript
// src/assets/js/script.js
import "./_drawer.js";
import "./_mv-slider.js";
import "./_viewport.js";
import "./_form-validation.js";
```

### アクセシビリティ属性の動的更新

インタラクティブな要素の状態変更時に、アクセシビリティ属性も更新：

```javascript
// ドロワーを開く時
hamburger.setAttribute("aria-expanded", "true");
hamburger.setAttribute("aria-label", "メニューを閉じる");
drawer.setAttribute("aria-hidden", "false");

// ドロワーを閉じる時
hamburger.setAttribute("aria-expanded", "false");
hamburger.setAttribute("aria-label", "メニューを開く");
drawer.setAttribute("aria-hidden", "true");
```

## 画像管理

### 画像配置ルール

#### 1. `/src/public/images/` - 固定URL画像

- **用途**: OGP画像、favicon など
- **特徴**: URLが変わらない（ハッシュなし）

#### 2. `/src/assets/images/` - コンテンツ画像

- **用途**: サイト内コンテンツ画像
- **特徴**: ビルド時にハッシュ付与（キャッシュバスティング）

### ファイル命名規則

**`カテゴリ[_名前][_連番][_状態].拡張子`**

- **使用可能文字**: 英小文字・数字・ハイフン・アンダースコア
- **ページ別フォルダ非推奨**: すべて`images/`直下

## 開発コマンド

### 必須: yarnを使用

```bash
yarn          # 依存関係インストール
yarn dev      # 開発サーバー起動 → http://localhost:5173
yarn build    # ビルド（自動でformat実行）
yarn preview  # プレビュー
yarn format   # フォーマット（lint-fix + prettier-fix）
```

## その他のルール

### コミットメッセージ

```
<type>: <summary>

例:
add: 新規コンポーネント追加
fix: ヘッダーのレイアウト崩れ修正
update: スタイル調整
refactor: コード整理
```

### 禁止事項

- ❌ npm の使用（必ずyarnを使う）
- ❌ インラインスタイル（`style="..."`）
- ❌ SCSSのセレクタネスト（`.parent .child`）
- ❌ SCSSのBEM要素ネスト（`&__element`形式）
- ❌ `var`での変数宣言
- ❌ クラス名の省略（`.ttl` → `.title`）

### 推奨事項

- ✅ セマンティックHTML
- ✅ CSS Custom Properties
- ✅ 論理プロパティ（`margin-block-start`, `padding-inline`など）
- ✅ `loading="lazy"`（MV以外の画像）
- ✅ `fetchpriority="high"`（LCP画像）
- ✅ WebPは全ブラウザ対応のため直接使用可能
- ✅ ESモジュール
- ✅ アクセシビリティ属性（`aria-*`）
- ✅ コミット前の`yarn format`実行

---

> **Note**: 本ガイドラインは静的サイト開発のベストプラクティスをまとめたものです。
> 不明点があれば、チームで議論して随時更新してください。

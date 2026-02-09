# 豊橋メディカルネットワーク・ダッシュボード

## プロジェクト概要
豊橋市内の病院・診療所・訪問看護ステーション間で、病床・外来の空き状況をリアルタイムに共有する地図ベースBIダッシュボード。
詳細な要件定義は `keikaku.md` を参照。

## 技術スタック
- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (CSS-based config, `@theme inline` in globals.css)
- **Leaflet + react-leaflet** (地図タイル: CartoDB Positron, APIキー不要)
- **React Context** (状態管理)

## 起動方法
```bash
npm install
npm run dev
# → http://localhost:3000
```

## ディレクトリ構成
```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト (Noto Sans JP)
│   ├── page.tsx            # メインダッシュボードページ
│   └── globals.css         # Tailwind v4設定 + Leafletスタイル上書き
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # ヘッダー（タイトル + 日時）
│   │   └── Sidebar.tsx     # サイドバー（フィルタ集約）
│   ├── map/
│   │   ├── MapContainer.tsx    # Leaflet地図本体 ("use client")
│   │   ├── MapDynamic.tsx      # SSR回避のdynamic importラッパー
│   │   ├── HospitalMarker.tsx  # 色付きマーカー (L.divIcon) + パルスアニメーション
│   │   └── MapLegend.tsx       # 凡例（施設種別 + 空き状況）
│   ├── dashboard/
│   │   ├── StatsOverview.tsx   # KPIカード4つ
│   │   ├── OccupancyBar.tsx    # 稼働率バー（共通部品）
│   │   ├── BedSummaryTable.tsx # 病床集計テーブル（重症度レベル別）
│   │   ├── FacilityList.tsx    # 施設リスト表示
│   │   ├── ViewToggle.tsx      # 地図/リスト/集計 切替タブ
│   │   └── MainContent.tsx     # メインエリア（3ビュー切替管理）
│   ├── detail/
│   │   └── FacilityDetailPanel.tsx  # 右スライドイン詳細パネル
│   └── filters/
│       ├── FacilityTypeFilter.tsx   # 施設種別フィルタ
│       ├── SeverityFilter.tsx       # 重症度レベルフィルタ
│       └── DepartmentFilter.tsx     # 診療科フィルタ
├── data/
│   ├── hospitals.ts        # モック施設データ（14施設）
│   └── departments.ts      # 診療科マスタ
├── types/
│   └── index.ts            # Facility, BedInfo, FilterState等の型定義
├── lib/
│   ├── constants.ts        # 地図中心座標, ラベル, 色定義
│   └── utils.ts            # 稼働率計算ヘルパー
└── context/
    └── DashboardContext.tsx # 共有状態（選択施設, フィルタ, 絞り込み結果）
```

## 現在の実装状況（モックアップ）

### 実装済み
- [x] 地図ダッシュボード（CartoDB Positronタイル, 豊橋市中心）
- [x] 14施設のモックデータ（急性期4, 回復期3, クリニック4, 訪問看護3）
- [x] 色付きマーカー（稼働率: 緑<70% / 黄70-90% / 赤>90%）
- [x] 施設種別アイコン（H/R/C/VN）
- [x] 施設クリック → 詳細パネル（右スライドイン）
  - 病床状況（重症度レベル別: L1-L5）
  - 稼働率バー
  - 診療科・外来空きコマ
  - 連絡先
  - 「この施設にコンタクト」「紹介状を作成」ボタン（モック）
- [x] KPIカード（施設数, 稼働率, 空き病床数, 退院予定）
- [x] フィルタ（施設種別, 重症度レベル, 診療科）
- [x] 地図/リスト/集計の3タブ切替表示
- [x] レスポンシブ対応のフルスクリーンレイアウト
- [x] 病床集計テーブル（BedSummaryTable）— 全施設横断の重症度レベル別集計
- [x] 凡例（施設種別アイコン + 病床空き状況の色分け説明、折りたたみ可）
- [x] 地図上のマーカーアニメーション（満床: 赤パルス、残りわずか: 黄パルス）
- [x] モバイル対応（ドロワーフィルタ、2列KPI、全幅詳細パネル）

## 今後の開発ロードマップ（keikaku.md Phase 2以降）

### Phase 2: コンタクト機能
- 開業医→病院のメッセージング
- テンプレートベースの紹介状デジタル送信
- 紹介→受入→結果報告のステータストラッキング
- 必要: バックエンド構築, DB設計, 認証

### Phase 3: 外来連携
- 外来空きコマの表示（診療科×日時マトリクス）
- 予約リクエスト機能
- 初診/再診/紹介の区分

### Phase 4: 訪問看護連携
- 対応エリアの地図オーバーレイ
- 退院調整連携（病院→訪問看護）
- 急変時アラート

### Phase 5: BI強化
- 病床稼働率トレンド（日次/週次/月次）
- サンキーダイアグラム（患者フロー）
- 地域別需要ヒートマップ
- 技術候補: Recharts / D3.js

### Phase 6: API連携
- 電子カルテ連携（HL7 FHIR）
- 予約システムAPI連携
- リアルタイム通信（WebSocket）

## MVP化に向けて必要なこと
- バックエンド構築（Next.js API Routes or 別サービス）
- データベース（PostgreSQL + PostGIS）
- 認証（多要素認証, 施設単位アカウント）
- モックデータ → 実データへの移行
- 3省2ガイドライン準拠のセキュリティ設計
- インフラ（AWS/GCP 医療情報ガイドライン準拠リージョン）

## 技術的注意点
- Leaflet SSR問題 → `next/dynamic({ ssr: false })` + `"use client"` で回避
- デフォルトマーカーアイコンの webpack パス問題 → `L.divIcon` のみ使用して回避
- Tailwind v4はCSS-based config（`tailwind.config.ts`は不使用、`globals.css`の`@theme`で設定）

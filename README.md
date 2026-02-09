# 豊橋メディカルネットワーク・ダッシュボード

豊橋市内の医療・介護施設間で、病床や外来の空き状況をリアルタイムに共有するための地図ベースBIダッシュボードです。

> **注意:** 本アプリはモックアップです。表示されている施設名・病床数・診療科などのデータはすべてダミーであり、実在の医療機関の情報とは一切関係ありません。

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![Leaflet](https://img.shields.io/badge/Leaflet-Map-green)

## 主な機能

- **地図ダッシュボード** — 豊橋市を中心としたインタラクティブマップ上に施設をマッピング
- **施設マーカー** — 稼働率に応じた色分け（緑: 余裕あり / 黄: 残りわずか / 赤: ほぼ満床）
- **施設詳細パネル** — クリックで病床状況・診療科・連絡先をスライドイン表示
- **3つのビュー** — 地図 / リスト / 集計（ドーナツチャート・バーグラフ）を切替
- **フィルタ機能** — 施設種別・重症度レベル・診療科で絞り込み
- **20施設のモックデータ** — 急性期病院、回復期病院、クリニック、訪問看護、訪問介護、デイサービス

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| 地図 | Leaflet + react-leaflet (CartoDB Positron) |
| 状態管理 | React Context |

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

## ライセンス

MIT

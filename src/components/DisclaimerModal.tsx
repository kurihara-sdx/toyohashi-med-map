'use client';

import { useState } from 'react';

export default function DisclaimerModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-w-lg rounded-xl bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.499-2.599 4.499H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.004zM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            ご利用にあたっての注意事項
          </h2>
        </div>
        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            本アプリケーションは<strong className="text-slate-800">デモ・モックアップ</strong>であり、表示されている情報はすべて架空のデータです。
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>実在する医療機関の病床状況、診察内容、外来スケジュール等を反映するものではありません。</li>
            <li>施設名・所在地・診療科等の情報は開発用のサンプルデータであり、実際の医療機関とは一切関係ありません。</li>
            <li>本アプリの情報をもとに医療に関する判断を行わないでください。</li>
          </ul>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          理解しました
        </button>
      </div>
    </div>
  );
}

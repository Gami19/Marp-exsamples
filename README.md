このアプリケーションはGeminiを参考に作った、完全オリジナルアプリケーションです。

# パッケージのインストール（今回は1.を使用）
```bash
1.npm install -g @marp-team/marp-cli
```
もしくは
```bash
2.npm install --save @marp-team/marp-core
```
@marp-team/marp-core と Marp CLI (@marp-team/marp-cli) は、どちらも Marp エコシステムの一部ですが、役割が異なります。簡単に言うと、@marp-team/marp-core は変換のコア部分を提供し、Marp CLI はそれを利用したコマンドラインツールです。

もう少し詳しく説明します。

@marp-team/marp-core (Marp Core):

これは、Markdown を HTML スライドに変換するためのコアライブラリです。
Marpit を拡張し、より実用的な構文、追加機能 (LaTeX、Emoji、HTML 埋め込みなど)、公式テーマを提供します。
JavaScript ライブラリとして提供され、他の JavaScript プロジェクトに組み込んで使用できます。例えば、Web アプリケーション内で Markdown をスライドに変換する機能などを実装する場合に使用します。
変換ロジック (Markdown のパース、HTML の生成など) を担当します。
@marp-team/marp-cli (Marp CLI):

これは、Marp Core を利用したコマンドラインインターフェースです。
ターミナルから marp コマンドを使って Markdown ファイルを HTML、PDF、画像などに変換できます。
CLI ツールとして提供され、ファイル変換などのバッチ処理などに適しています。
Marp Core をラップし、コマンドラインからの操作を提供します。

例：
-Web アプリケーションでユーザーが入力した Markdown をリアルタイムにスライドとしてプレビューしたい場合 → @marp-team/marp-core を使用
-複数の Markdown ファイルをまとめて PDF に変換したい場合 → @marp-team/marp-cli を使用

今回の例 (Next.js プロジェクトで Marp を使用) では、Marp CLI を child_process で呼び出しているので、Marp CLI を使用していることになります。しかし、内部的には Marp CLI が Marp Core を使用して変換を行っています。

つまり、Marp Core は変換のエンジンであり、Marp CLI はそのエンジンを操作するためのインターフェースと言えるでしょう。



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

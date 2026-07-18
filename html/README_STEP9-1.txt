IMAJAN STEP9-1：GAS接続基盤

【フロント側】
frontendフォルダ内の4ファイルを、現在のプロジェクトへ上書き・追加してください。
- index.html
- style.css
- script.js
- config.js（新規）

【GAS側】
1. 新しいGoogleスプレッドシートを作成
2. 拡張機能 → Apps Script
3. gasフォルダ内の5ファイルと同名のスクリプトファイルを作成
4. 内容を貼り付け
5. setupSpreadsheet関数を実行し、権限を許可
6. スプレッドシートに7シートが作成されたことを確認
7. デプロイ → 新しいデプロイ → ウェブアプリ
8. 実行ユーザー：自分
9. アクセスできるユーザー：全員
10. 発行された /exec URLをfrontend/config.jsへ設定
11. フロントを再読込して、ホーム画面の「接続を確認」を押す

このSTEPでは、データ保存先はまだlocalStorageです。
接続確認のみを追加しています。

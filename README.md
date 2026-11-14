# my-first-app

シンプルな ToDo リストのウェブアプリです。HTML / CSS / JavaScript だけで動きます（ビルド不要）。

## 機能

- タスクの追加・完了チェック・削除
- ダブルクリックで編集（Enter で確定、Esc で取り消し）
- 「すべて / 未完了 / 完了」の表示切り替え
- 完了したタスクの一括削除
- ブラウザ（localStorage）に自動保存
- ダークモード対応

## 使い方

`index.html` をブラウザで開くだけで使えます。

ローカルサーバーで開く場合:

```bash
python3 -m http.server 8000
```

その後 http://localhost:8000 を開いてください。

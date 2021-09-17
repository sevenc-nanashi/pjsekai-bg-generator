# PJSekai-BG-Generator
PJSekaiのBG画像をジャケット画像とアセットから生成するジェネレータです。Sonolusでの使用を想定していますが、多分他のシミュレータでも使えないこともないと思います。

## 使い方
2通りあります(予定)

### 単に一括変換したい
`index.ts` を実行すると`in`にある画像それぞれに対して生成処理が行われ `out`に出力されます。

### モジュールとして使いたい(まだ動きません)
`index.ts` から `PJSekaiBackgroundGenerator` をインポートして煮込んでください

## 仕様
- 各画像サイズは完全には一致しません(ピクセルパーフェクトではありません)
- 背景中央が若干雑になっています
- 左右のモニターフレームがアクリルのような凸ではなく単にカバーになっています

## 作成者
[Omado(ジェネレータ作成)](https://github.com/Dosugamea)
[Nanashi(アセットフレーム作成)](https://github.com/sevenc-nanashi)
[Burrito(Sonolus)](https://github.com/NonSpicyBurrito)
[pjsek.ai(アセット元)](https://pjsek.ai)
oEmbedブックマークレット
=======

はじめに
--------

oEmbedブックマークレット はメディア共有サイトのコンテンツを簡単に埋め込むことができるように、指定フォーマットに整形して出力するブックマークレットです。コンテンツの紹介記事を投稿したいブロガーに最適なツールです。
このツールは[oEmbed](http://oembed.com)を利用しています。

対応サイト

* [YouTube](http://www.youtube.com/)
* [Vimeo](http://vimeo.com/)
* [Dailymotion](http://www.dailymotion.com/)
* [SlideShare](http://www.slideshare.net/)
* [Instagram](http://instagram.com/)
* [Twitter](https://twitter.com/)

基本的な機能
------------

 1. ブラウザでメディア共有サイトのコンテンツを開いてブックマークレットを実行すると、埋め込み用のHTMLコードが出力できます。
 2. メディア共有サイトのコンテンツ以外を開いてブックマークレットを実行すると、URLが入力できます。メディア共有サイトのコンテンツのURLを入力すると、埋め込み用のHTMLコードが出力できます。
 3. 出力されるHTMLコードをiPhoneやiPadの代表的なエディタに自動挿入することができます。
 4. 出力するテンプレートをカスタマイズすることができます。
 5. 設定内容をローカルストレージに保存できます（同一端末・同一ブラウザに限ります）。

セットアップ
------------

 1. [oEmbed ブックマークレット・メーカー](https://feelingplace.github.io/oEmbed/)に従い必要項目を入力してブックマークレットを生成します。
 2. 生成したブックマークレットをウェブブラウザのブックマークに登録します。

実行
----

 1. ウェブブラウザのブックマークから oEmbed ブックマークレット を選択します。

カスタマイズ
------------

 1. ブックマークレットを生成する段階で書式テンプレートを書き換えることによりカスタマイズすることができます。

書式テンプレートの書き換えは HTML および以下の予約語を用いて記述してください。


### 予約語

名称                     | 予約語
------------------------|-------------------
メディア（動画,画像など）  | ${html}
メディアのサムネイル          | ${thumbnail}

既知の問題
----------
 1. YouTube の HTML は [YouTube 埋め込みプレーヤーとプレーヤーのパラメータ   |   YouTube IFrame API   |   Google Developers](https://developers.google.com/youtube/player_parameters#Manual_IFrame_Embeds) に基づいて生成しています。またサムネイルは [How do I get a YouTube video thumbnail from the YouTube API? - Stack Overflow](http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api) を参考に hqdefault.jpg を生成しています。
 2. 埋め込み可能な動画やスライド、画像は埋め込み許可がされているものに限ります。許可されていないものは HTML が生成されても再生できません。
 3. SlideShare, Instagram, Twitter は埋め込み用HTMLコードのみ生成可能です。
 4. SlideShare は出力サイズの変更ができません。
 5. その他に既知の問題がある場合は Issues に記載しています。

免責事項
--------------------------------
本プロジェクトは、これらのツールを利用して生じたいかなる損害に対しても一切責任を負いません。

LICENSE
-------

This software is released under the MIT License, see LICENSE.

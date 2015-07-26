(function() {

    var step = 1,
        d = document,
        w = window;
    var json = {},
        jsonCtr = 0,
        videoId = "";
    //YoutubeのURLからIDだけ抜き出す正規表現
    var youtubeId = /youtu(.be\/|be.com\/.*v=)([\d\w-]+).*/;
    var u = location.href;
    // 親JSからパラメータを取得
    var script = d.getElementById("bmlt");
    var out = script.out,
        scs = script.scs,
        provider = "",
        //YouTube用データ配列
        data = {"movieWidth":"","movieHtml":"","movieThumbnail":""};
        fmt = decodeURIComponent(script.fmt);

    // bookmarkletの予約語（2個）
    var bmAry = ['html', 'thumbnail'];

    // メイン処理（非同期実行を防ぐ為にTimerを利用）
    var timerId = setInterval(function() {
            try {
                switch (step) {
                    case 1:
                        step = 0;
                        checkURL();
                        break;
                    case 2:
                        step = 0;
                        createEndpoint();
                        break;
                    case 3:
                        step = 0;
                        getData();
                        break;
                    case 4:
                        step = 0;
                        dispData();
                        break;
                    case 5:
                        cleanup();
                        return 0;
                }
            } catch (e) {
                alert("Something may be wrong.\n->" + e);
                cleanup();
            }
        },
        100);

        function cleanup() {
            while (d.getElementById("bmlt"))
                d.getElementById("bmlt").parentNode.removeChild(d.getElementById("bmlt"));
            clearInterval(timerId);
            timerId = null;
        }

    function checkURL() {
        switch (true) {
            case /youtu(.be|be.com)/.test(u):
            case /vimeo/.test(u):
            case /slideshare/.test(u):
            case /dailymotion/.test(u):
            case /insta(gram.com|gr.am)/.test(u):
            case /twitter/.test(u):
            case /flic(kr.com|.kr)/.test(u):
                step = 2;
                break;
            default:
                u = prompt("Input Media URL", "");
                step = 2;
                break;
        }
    }

    function createEndpoint() {
        switch (true) {
            case /youtu(.be|be.com)/.test(u):
                var result = u.match(youtubeId);
                videoId = result[2];
                provider = "YouTube";
                step = 3;
                break;
            case /vimeo/.test(u):
                endpointURL = "http://vimeo.com/api/oembed.json?url=" + u + "&width=" + scs;
                provider = "Vimeo";
                step = 3;
                break;
            case /slideshare/.test(u):
                endpointURL = "http://www.slideshare.net/api/oembed/2?url=" + u + "&format=jsonp&maxwidth=" + scs;
                provider = "SlideShare";
                step = 3;
                break;
            case /dailymotion/.test(u):
                if (u.match("touch")) {
                    u = u.replace("touch", "www");
                }
                endpointURL = "http://www.dailymotion.com/services/oembed?format=json&url=" + u + "&maxwidth=" + scs;
                provider = "Dailymotion";
                step = 3;
                break;
            case /insta(gram.com|gr.am)/.test(u):
                endpointURL = "http://api.instagram.com/oembed?url=" + u + "&maxwidth=" + scs + "&format=json";
                provider = "Instagram";
                step = 3;
                break;
            case /twitter/.test(u):
                endpointURL = "https://api.twitter.com/1/statuses/oembed.json?url=" + u + "&maxwidth=" + scs + "&format=json";
                provider = "Twitter";
                step = 3;
                break;
            default:
                alert("Not Found ...");
                step = 5;
                return;
        }
    }

    //メディア取得
    function getData() {
        //YouTube以外の場合
        if (provider != "YouTube") {
            var s = d.createElement("script");
            var src = endpointURL;
            while (d.getElementById("getData")) {
                d.getElementById("getData").parentNode.removeChild(d.getElementById("getData"));
            }
            s.charset = "utf-8";
            s.src = src + "&callback=result";
            s.id = "getData";
            d.body.appendChild(s);
            w.result = function(data) {
                movieWidth = data.width;
                movieHeight = data.height;
                movieHtml = data.html;
                //InstagramとSlideShareはテンプレートにサムネイルがあっても出力しない。
                if (provider == "Instagram" || provider == "SlideShare" || provider == "Twitter") {
                    movieThumbnail = "";
                } else {
                    movieThumbnail = '<img src="' + data.thumbnail_url + '" width="' + movieWidth + '">';
                }
                jsonCtr = 1;
                for (var i = 0; i < jsonCtr; i++) {
                    json[i] = data[i];
                }
                step = 4;
            }
            //YouTubeの場合
        } else {
            width = scs;
            height = (9 / 16) * width;
            height = Math.round(height);
            thumbnail_url = '<img src="https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg" width="' + width + '">';
            html = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
            movieWidth = width;
            movieHtml = html;
            movieThumbnail = thumbnail_url;
            jsonCtr = 1;
            for (var i = 0; i < jsonCtr; i++) {
                json[i] = data[i];
            }
            step = 4;
        }
    }

    // 結果の整理と出力方法ごとの処理
    function dispData() {
        var x = '',
            chk = '';
        for (var i = 0; i < jsonCtr; i++) {
            var z = json[i],
                pData = fmt;

            // 結果をbookmarklet予約語に変換してfmtを置換
            var bmData = handData(z);
            for (var j = 0; j < bmAry.length; j++) {
                var key = bmAry[j],
                    value = bmData[key],
                    reg = new RegExp('\\${' + key + '}', 'g');
                pData = pData.replace(reg, value);
            }
            x = x + pData + '\n\n';
            chk = chk + pData;
        }

        if (chk != '') {
            // 出力方法ごとの処理（プレビュー表示）
            if (out == "preview") {
                d.body.innerHTML =
                    '<div id="bkmlt_preview">' +
                    "<form><input type='button' value='プレビュー表示を消す' onclick='javascript:" +
                    'var a=document.getElementById("bkmlt_preview");a.parentNode.removeChild(a);' +
                    "'>　<input type='button' value='HTMLを選択する' onclick='javascript:" +
                    'var a=document.getElementById("bkmklt_ret");a.focus();' +
                    "'>　<input type='button' value='HTMLの内容でプレビューを書き直す' onclick='javascript:" +
                    'var a=document.getElementById("bkmklt_ret").value;' +
                    'document.getElementById("bkmklt_rewrite").innerHTML=a;' +
                    "'></form>" + '<textarea style="width:99%;font-size:80%;" rows="10" id="bkmklt_ret"' +
                    'onfocus="javascript:this.select();">' + x + '</textarea><br><br><div id="bkmklt_rewrite">' +
                    x + '</div></div>' + d.body.innerHTML;
            }
            // 出力方法ごとの処理（ポップアップ表示）
            if (out == "popup") {
                prompt("result", x);
            }
            // 出力方法ごとの処理（ポップアップ→Textforce連携）
            if (out == "pop-textforce") {
                prompt("result", x);
                w.location = 'textforce://';
            }
            // 出力方法ごとの処理（Texeforce連携）
            if (out == "textforce") {
                w.location = 'textforce://file?path=/blog.html&method=write&after=quick_look&text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（Texeforce連携しSafariに戻る）
            if (out == "safari-textforce") {
                w.location = 'textforce://file?path=/blog.html&method=write&after=quick_look&text=' + encodeURIComponent(x) + '&callback=' + encodeURIComponent(location.href);
            }
            // 出力方法ごとの処理（DraftPad連携）
            if (out == "draftpad") {
                w.location = 'draftpad:///insert?after=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（するぷろ連携）
            if (out == "slpro") {
                w.location = 'slpro://' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（Moblogger連携）
            if (out == "moblogger") {
                prompt("result", x);
                w.location = 'moblogger://';
            }
            // 出力方法ごとの処理（Mobloggerを起動して追記）
            if (out == "moblogger-app") {
                w.location = 'moblogger://append?text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（Mobloggerを起動してクリップボードにコピー）
            if (out == "moblogger-pb") {
                w.location = 'moblogger://pboard?text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（MyEditor連携）
            if (out == "myeditor") {
                prompt("result", x);
                w.location = 'myeditor://';
            }
            // 出力方法ごとの処理（MyEditorを起動してカーソル位置にコピー）
            if (out == "myeditor-cursor") {
                w.location = 'myeditor://cursor?text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（Rowlineを起動して文末に追加）
            if (out == "rowline") {
                w.location = 'rowline:///set?loc=bottom&view=lines&callback=seeq://&text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（@matubizさん作MyScripts用スクリプト、TextHandlerに送信）
            if (out == "msth") {
                w.location = 'myscripts://run?title=TextHandler&text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（ThumbEditに送る）
            if (out == "thumbedit") {
                w.location = 'thumbedit://?text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（ThumbEditに追記）
            if (out == "thumbedit-insert") {
                w.location = 'thumbedit://?text=' + encodeURIComponent(x) + '&mode=insert';
            }
            // 出力方法ごとの処理（PressSync Proに送る）
            if (out == "presssync") {
                w.location = 'presssync:///message?' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（PressSync Proに送る）
            if (out == "textwell") {
                w.location = 'textwell:///insert?text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（はてなブログで新規作成）
            if (out == "hatenablog") {
                w.location = 'hatenablog:///new?title=new%20post&body=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（Draftsで新規作成）
            if (out == "drafts") {
                w.location = 'drafts://x-callback-url/create?text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（Drafts 4で新規作成）
            if (out == "drafts4") {
                w.location = 'drafts4://x-callback-url/create?text=' + encodeURIComponent(x);
            }
            // 出力方法ごとの処理（AmeEditorに送る）
            if (out == "ameeditor") {
                w.location = 'ameeditor://insert?text=' + encodeURIComponent(x);
            } // 出力方法ごとの処理（SLPRO Xに送る）
            if (out == "slpro-x") {
                w.location = 'slpro-x://?q=' + encodeURIComponent(x);
            }
        }
        step = 5;
    }

    // Bookmarklet予約語へのセット


    function handData(data) {
        var x = new Array(bmAry);
        x.html = movieHtml;
        x.width = movieWidth;
        x.thumbnail = movieThumbnail;
        return x;
    }

    // 親JSからGET形式でパラメータを引継ぐ為の関数

    function getJs(searchKey) {
        var scripts = document.getElementsByTagName("script"),
            urlArg, params = {};
        for (var i = 0; i < scripts.length; i++) {
            var tmp = scripts.item(i);
            if (tmp.src.indexOf(bmBase) != -1) {
                urlArg = tmp.src.slice(bmBase.length + 1);
                break;
            }
        }
        var paramAry, jsonKey, jsonVal, pos;
        if (urlArg) paramAry = urlArg.split("&");
        if (paramAry) {
            for (var i = 0; i < paramAry.length; i++) {
                var pos = paramAry[i].indexOf('=');
                if (pos > 0) {
                    jsonKey = paramAry[i].substring(0, pos);
                    jsonVal = paramAry[i].substring(pos + 1);
                }
                if (jsonKey == searchKey) return jsonVal;
            }
        }
        return null;
    }

    // 前詰めゼロ処理


    function zeroFormat(num, max) {
        var tmp = "" + num;
        while (tmp.length < max) {
            tmp = "0" + tmp;
        }
        return tmp;
    }

    // utimeの数値を+9時間して日付文字に整形


    function strDatetime(num) {
        var dt = new Date(),
            tmp;
        dt.setTime(num + '000');
        dt.setHours(dt.getHours() + 9);
        tmp = zeroFormat(dt.getFullYear(), 4) + '/' + zeroFormat(dt.getMonth(), 2) + '/' + zeroFormat(dt.getDate(), 2) + ' ' + zeroFormat(dt.getHours(), 2) + ':' + zeroFormat(dt.getMinutes(), 2);
        return tmp;
    }
})();

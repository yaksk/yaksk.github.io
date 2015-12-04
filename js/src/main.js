$(function() {
    var ua = navigator.userAgent;
    var ds = milkcocoa.dataStore('fusen');
    var curClr = "one";
    var canvas = $("#canvas");
    var sendButton = $(".p-colorlist__item");
    var removeButton = $(".remove");
    var fusenBuilder = new FusenBuilder(canvas, ds);

    var device = "pc";
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
        device = "mobile";
    }else{
        device = "pc";
    }

    // select color
    $(".p-colorlist__item").click(function(e){
        curClr = $(this).attr("id");
        $(".p-colorlist__item").each(function(){
            $(this).removeClass("is-active");
        });
        $(this).addClass("is-active");
        e.stopPropagation();
    });

    ds.stream().size(20).sort('desc').next(function(err, datas) {
        for(var i=0;i < datas.length;i++) {
            create_memo(datas[i].id, datas[i].value.x, datas[i].value.y, datas[i].value.text, datas[i].value.color, datas[i].value.name);
        }
    });
    ds.on('push', function(pushed) {
        console.log(pushed.value.getX);
        console.log(pushed.value.getY);
        create_memo(pushed.id, pushed.value.getX, pushed.value.getY, pushed.value.text, pushed.value.color,pushed.value.name);
    });
    ds.on('set', function(setted) {
        fusenBuilder.getFusen(setted.id).setPos(setted.value.x, setted.value.y);
    });
    ds.on('remove', function(_removed) {
        var removed = _removed;
        fusenBuilder.getFusen(removed.id).removeSelf();
    });

    function create_memo(id, x, y, _text, color, name) {
        var text = _text || "";
        var fusen = fusenBuilder.createFusen(id, text, color, name);
        fusen.setPos(x, y);
    }

// canvas.click(function(e) {
//         var text = prompt("メモを入力してください。");
//         var name = prompt("名前入力してください。");
//         var _curClr = curClr;
//         if(!text) {
//             return;
//         }
//         ds.push({
//             x : e.pageX,
//             y : e.pageY,
//             text : fusen_util.htmlEscape(text),
//             name : fusen_util.htmlEscape(name),
//             color : _curClr
//         });
//     });

    // var click_flg = true;
    sendButton.click(function(e) {
        // if (click_flg) {
            //ボタンを一旦無効に
            // click_flg = false;
        if($(".textArea").val() && $(".nameArea").val()){
            var text = $(".textArea").val();
            var name = $(".nameArea").val();
            var _curClr = curClr;
            console.log(text);
            console.log(name);
            if (!text) {
                return;
            }
            if (!name) {
                return;
            }
            var pageX = Math.floor(Math.random() * 800) + 1;
            console.log(pageX)
            var pageY = Math.floor(Math.random() * 600) + 1;
            console.log(pageY)
            ds.push({
                getX: pageX,
                getY: pageY,
                text: fusen_util.htmlEscape(text),
                name: fusen_util.htmlEscape(name),
                color: _curClr
            });
            $(".textArea").val("");

        }else {
            alert("ねがいごととおなまえは必須じゃ！");
            console.log("空欄だめ！！");
            click_flg = true;
        }
    });


    window.fusen_util = {
        getDevice : function() {
            return device;
        },
        htmlEscape : function(s) {
            s=s.replace(/&/g,'&amp;');
            s=s.replace(/>/g,'&gt;');
            s=s.replace(/</g,'&lt;');
            return s;
        }
    }
});

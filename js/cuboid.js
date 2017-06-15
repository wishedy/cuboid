/**
 * Created by firefly on 2017/6/15.
 */
$(document).ready(function(){
    var element = {
        origin:$(".cuboid-drag-station"),
        dragItem:$(".cuboid-drag-item"),
        target:$(".cuboid-drop-item"),
        dragActive:null,
        dragBar:$(".cuboid-drag-bar"),
        audio:document.getElementById('audio')

    };
    var parameter = {
        leftDis: [],
        widthGap: 0,
        heightGap:0,
        allowError: 2,
        topDis: [],
        originalLeft:[],
        originalTop:[],
        passNum:4
    };
    var cuboid = {
        init:function(){
            var t = this;
            t.dragStart().fadeInMask().storePosition().calculateWidthGap();
            return t;
        },
        fadeInMask:function(){
          var t = this;
          $(".cuboid-mask-layer").fadeOut(1400);
          $("canvas").fadeOut(1400);
          return t;
        },
        calculateWidthGap:function(){
            var t = this;
            var diffW=element.target.eq(0).width()-element.dragBar.eq(0).width();
            var diffH=element.target.eq(0).height()-element.dragBar.eq(0).height();
            parameter.widthGap =((parseInt(diffW)/2)>0)?(parseInt(diffW)/2):(parseInt(diffW)/2)*(-1);
            parameter.heightGap =((parseInt(diffH)/2)>0)?(parseInt(diffH)/2):(parseInt(diffH)/2)*(-1);
            return t;
        },
        storePosition:function(){
          var t = this;
            element.dragItem.each(function(){
                parameter.leftDis.push(parseInt($(this).offset().left));
                parameter.originalTop.push(parseInt($(this).offset().top));
            });
            parameter.originalLeft = parameter.leftDis;
            element.target.each(function(){
                parameter.topDis.push(parseInt($(this).offset().top))
            });
            return t;
        },
        dropInOnOff:function(){
            var t = this;
            var leftOnOff= false;
            var topOnOff = false;
            var resultLeft=parseInt(element.dragActive.offset().left);
            var resultTop = parseInt(element.dragActive.offset().top);
            var locationLeft = 0;
            var locationTop = 0;
            $.each(parameter.leftDis,function(i,v){
                var actualGap = ((v-resultLeft)>0)?(v-resultLeft):(v-resultLeft)*(-1);
                var errorWidth = actualGap-parameter.widthGap;
                leftOnOff = errorWidth<parameter.allowError;
                if(leftOnOff){
                    locationLeft = v;
                    return false;
                }
            });
            $.each(parameter.topDis,function(i,v){
                var actualGap = ((v-resultTop)>0)?(v-resultTop):(v-resultTop)*(-1);
                var errorHeight = actualGap-parameter.heightGap;
                topOnOff = errorHeight<parameter.allowError;
                if(topOnOff){
                    locationTop = v;
                    return false;
                }
            });
            var resultJson = {"dropOnOff":leftOnOff&&topOnOff,posLeft:locationLeft,posTop:locationTop}
            return resultJson;
        },
        restorePos:function(){
          var t = this;
            var restoreTop = parameter.originalTop[element.dragActive.index()];
            var restoreLeft = parameter.originalLeft[element.dragActive.index()];
            element.dragActive.offset({top:restoreTop,left:restoreLeft}) ;
            element.audio.play();
            return t;
        },
        dragStart:function(){
            var t = this;
            element.dragItem.draggable(
                {
                    containment: ".cuboid-drag-container",
                    scroll: false,
                    start: function() {
                        $(this).attr({"data-drop":"false"});
                        element.dragActive = $(this);
                    },
                    stop:function(){
                        var dropInfo = t.dropInOnOff();
                        if(!dropInfo.dropOnOff){
                            t.restorePos();
                        }
                        var lastResult = $("[data-drop='true']").length;
                        if(lastResult==parameter.passNum){
                            element.dragItem.fadeOut(1000);
                            element.target.addClass("cuboid-drop-unify");
                            //$("#musicbox").attr({"src":decodeURI(arrMusic[m])});
                            element.audio.src="audio/lib_6287_6601.mp3";
                            element.audio.play();
                            //musicbox.play();
                            /*$(".cuboid-mask-layer").append('<audio src="/audio/lib_6287_6601.mp3"></audio>');
                            element.audio.remove();
                            $("audio")[0].play();*/
                        }
                    }
                });
            element.target.droppable({
                drop: function( event, ui ) {
                    var dropInfo = t.dropInOnOff();
                    var dropOnff = dropInfo.dropOnOff;
                    var locationLeft = dropInfo.posLeft;
                    var locationTop = dropInfo.posTop;
                    if(dropOnff){
                        element.dragActive.attr({"data-drop":"true"});
                        element.dragActive.offset({top:locationTop,left:locationLeft}) ;
                        element.audio.src="audio/lib_6287_6601.mp3";
                        element.audio.play();
                    }else{
                        t.restorePos();
                    }
                }
            });
            return t;
        }
    };
    cuboid.init();
});
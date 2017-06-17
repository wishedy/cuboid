/**
 * Created by firefly on 2017/6/15.
 */
$(document).ready(function(){
    var element = {
        firstContainer:$(".cuboid-drag-container"),
        nextContainer:$(".cuboid-drag-second-container"),
        origin:$(".cuboid-drag-station"),
        dragItem:$(".cuboid-drag-container .cuboid-drag-item"),
        target:$(".cuboid-drag-container .cuboid-drop-item"),
        dragItemSecond:$(".cuboid-drag-second-container  .cuboid-drag-item"),
        targetSecond:$(".cuboid-drag-second-container .cuboid-drop-item"),
        successBar:$(".cuboid-drag-container .cuboid-drop-board"),
        successBarSecond:$(".cuboid-drag-second-container .cuboid-drop-board"),
        dragActive:null,
        dragBar:$(".cuboid-drag-bar"),
        audio:document.getElementById('audio'),
        next:$(".cuboid-drag-next")

    };
    var parameter = {
        index:0,
        leftDis: [],
        widthGap: 0,
        heightGap:0,
        allowError: 30,
        topDis: [],
        originalLeft:[],
        originalTop:[],
        passNum:6,
        container:".cuboid-drag-container"
    };
    var cuboid = {
        init:function(){
            var t = this;
            t.dragStart(false).fadeInMask().storePosition(false).calculateWidthGap().next();
            return t;
        },
        fadeInMask:function(){
          var t = this;
          $(".cuboid-mask-layer").fadeOut(1400);
          $("canvas").fadeOut(1400);
            t.playMusic()
          return t;
        },
        playMusic:function(){
           var t = this;
            element.audio.src="audio/lib_boys.mp3";
            element.audio.play();
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
        storePosition:function(onOff){
          var t = this;
            parameter.leftDis = [];
            parameter.topDis = [];
            var dragItem = null;
            var targetItem = null;
            if(onOff){
                dragItem =element.dragItemSecond;
                targetItem= element.targetSecond;
            }else{
                dragItem =element.dragItem;
                targetItem= element.target;
            }
            dragItem.each(function(){
                parameter.originalLeft.push($(this).offset().left);
                parameter.originalTop.push(parseInt($(this).offset().top));
            });
            targetItem.each(function(){
                var jsonItem = {};
                jsonItem.topPx = parseInt($(this).offset().top);
                parameter.leftDis.push(parseInt($(this).offset().left));
                jsonItem.leftPx = parseInt($(this).offset().left);
                jsonItem.child = null;
                parameter.topDis.push(jsonItem)
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
            function judgeTopOnOff(){
                //debugger;
                var item = null;
                var topPx = null;
                item = parameter.topDis[element.dragActive.index()];
                if(parameter.index==0){
                    topPx  = item.topPx
                }else{
                    var oneGap = resultTop-parameter.topDis[0].topPx;
                    var twoGap = resultTop - parameter.topDis[3].topPx;
                    oneGap = (oneGap>0)?oneGap:(oneGap)*(-1);
                    twoGap = (twoGap>0)?twoGap:(twoGap)*(-1);
                    if(oneGap<twoGap){
                        topPx = parameter.topDis[0].topPx;
                    }else{
                        topPx = parameter.topDis[3].topPx;
                    }
                }
                var actualGap = ((topPx-resultTop)>0)?(topPx-resultTop):(topPx-resultTop)*(-1);
                var errorHeight = actualGap-parameter.heightGap;
                topOnOff = errorHeight<parameter.allowError;
                if(topOnOff){
                    if(item.child!=null){
                        topOnOff = false;
                        return false;
                    }else{
                        locationTop = topPx;
                        return false;
                    }
                }
            }
            judgeTopOnOff();
            var resultJson = {"dropOnOff":leftOnOff&&topOnOff,posLeft:locationLeft,posTop:locationTop};
            return resultJson;
        },
        restorePos:function(){
          var t = this;
            var restoreTop = parameter.originalTop[element.dragActive.index()];
            var restoreLeft = parameter.originalLeft[element.dragActive.index()];
            element.dragActive.offset({top:restoreTop,left:restoreLeft}) ;
            element.audio.src="audio/lib_965_5531.mp3";
            element.audio.play();
            return t;
        },
        successFn:function(){
            var t = this;
            var sucessObj = null;
            var dragObj = null;
            if(parameter.index==0){
                sucessObj = element.successBar;
                dragObj = element.dragItem;
            }else{
                sucessObj = element.successBarSecond;
                dragObj = element.dragItemSecond;
            }
            dragObj.fadeOut(1000);
            sucessObj.addClass("cuboid-drop-success");
            element.target.addClass("cuboid-drop-unify");
            element.audio.src="audio/lib_success.mp3";
            element.audio.play();
            return t;
        },
        next:function(){
          var t = this;
          element.next.off("touchend click").on("touchend click",function(){
                element.firstContainer.fadeOut(1000);
              element.nextContainer.fadeIn(400);
              parameter.container = ".cuboid-drag-second-container";
              element.dragItem.each(function(){
                  $(this).attr({"data-drop":"false"});
              });
              t.dragStart(true).fadeInMask().storePosition(true).calculateWidthGap();
              parameter.index++;
          });
          return t;
        },
        dragStart:function(onOff){
            var t = this;
            var dragItem = null;
            var targetItem = null;
            if(onOff){
                 dragItem =element.dragItemSecond;
                 targetItem= element.targetSecond;
            }else{
                dragItem =element.dragItem;
                targetItem= element.target;
            }

            dragItem.draggable(
                {
                    containment: parameter.container,
                    scroll: false,
                    start: function() {
                        $(this).attr({"data-drop":"false"});
                        element.dragActive = $(this);
                        parameter.originalLeft[element.dragActive.index()] = $(this).offset().left;
                        parameter.originalTop[element.dragActive.index()] = $(this).offset().top;
                    },
                    stop:function(){
                        var dropInfo = t.dropInOnOff();
                        if(!dropInfo.dropOnOff){
                            t.restorePos();
                        }
                        if(JSON.parse(element.dragActive.attr("data-drop"))){
                            parameter.topDis[element.dragActive.index()].child=element.dragActive;
                        }
                        var lastResult = $("[data-drop='true']").length;
                        if(lastResult==parameter.passNum){
                            t.successFn();
                        }
                    }
                });
            targetItem.droppable({
                drop: function( event, ui ) {
                    var dropInfo = t.dropInOnOff();
                    var dropOnff = dropInfo.dropOnOff;
                    var locationLeft = dropInfo.posLeft;
                    var locationTop = dropInfo.posTop;
                    if(dropOnff){
                        if($(this).attr("data-child")){
                            t.restorePos();
                        }else{
                            element.dragActive.attr({"data-drop":"true"});
                            if(parameter.index==0){
                                element.dragActive.offset({top:locationTop,left:locationLeft}) ;
                            }else{
                                element.dragActive.offset({top:locationTop-5,left:locationLeft-12}) ;
                            }

                            element.audio.src="audio/lib_6287_6601.mp3";
                            element.audio.play();
                            $(this).attr({"data-child":"'true"});
                        }


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
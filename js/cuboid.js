/**
 * Created by firefly on 2017/6/15.
 */
$(document).ready(function(){
    var element = {
        origin:$(".cuboid-drag-station"),
        dragItem:$(".cuboid-drag-item"),
        target:$(".cuboid-drop-item"),
        dragActive:null

    };
    var cuboid = {
        init:function(){
            var t = this;
            t.dragStart().fadeInMask();
            return t;
        },
        fadeInMask:function(){
          var t = this;
          $(".cuboid-mask-layer").fadeOut(1400);
          $("canvas").fadeOut(1400);
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
                        console.log($("[data-drop='true']").length)
                    }
                });
            element.target.droppable({
                drop: function( event, ui ) {
                    console.log($(this));
                    element.dragActive.attr({"data-drop":"true"});
                    // console.log(2);
                }
            });
            return t;
        }
    };
    cuboid.init();
});
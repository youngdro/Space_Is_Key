cc.Class({
    extends: cc.Component,

    properties: {
         startTime:0,
         endTime:1,
         minScale:0.2,
    },

    onLoad: function () {

    },
    // 小方块溅射时更新其透明度和缩小
    update: function (dt) {
        var minOpacity = 0;
        this.startTime += dt;
        var Ratio = 1 - this.startTime/this.endTime;
        this.node.opacity = minOpacity + Math.floor(Ratio * (255 - minOpacity));
        this.node.scaleX = this.minScale + Ratio * (1 - this.minScale);
        this.node.scaleY = this.node.scaleX;
    },
});
